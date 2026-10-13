const { GoogleGenerativeAI } = require('@google/generative-ai');
const Anthropic = require('@anthropic-ai/sdk');

const PROMPT = `You are a receipt/invoice parser. Extract the data from this invoice image and return ONLY valid JSON — no markdown, no explanation, just the JSON object.

Return this exact structure:
{
  "merchantName": "store or brand name shown on the invoice",
  "items": [
    {
      "itemName": "product name (concise, under 60 chars)",
      "quantity": 1,
      "unitPrice": 0.00,
      "amount": 0.00,
      "category": "one of: Groceries, Food & Dining, Transport, Shopping, Healthcare, Utilities, Education, Entertainment, Personal Care, Housing, Other"
    }
  ]
}

Rules:
- merchantName: the primary store or brand (e.g. "AJIO", "Big Bazaar", "Swiggy"). Use the most prominent name.
- category per item: pick the best matching category for EACH item individually based on what that specific product is.
- items: only actual purchased products — no shipping, tax, or discount rows.
- amount: the final line total for each item (after any discount applied).
- unitPrice: price per single unit.
- quantity: number of units purchased.
- All prices as plain numbers (no currency symbols).
- If a value cannot be determined, use 0.`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const extractJSON = (raw) => {
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  return JSON.parse(cleaned);
};

const normalizeItems = (items) =>
  items.map((item, i) => ({
    id: i + 1,
    itemName: String(item.itemName || '').substring(0, 60),
    quantity: parseFloat(item.quantity) || 1,
    unitPrice: parseFloat(item.unitPrice) || 0,
    amount: parseFloat(item.amount) || 0,
    category: String(item.category || 'Other'),
  }));

const parseWithGemini = async (imageBase64, mimeType, apiKey) => {
  const genAI = new GoogleGenerativeAI(apiKey, { apiVersion: 'v1' });
  const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });
  const result = await model.generateContent([
    PROMPT,
    { inlineData: { data: imageBase64, mimeType } },
  ]);
  return extractJSON(result.response.text());
};

const parseWithAnthropic = async (imageBase64, mimeType, apiKey) => {
  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: mimeType, data: imageBase64 } },
        { type: 'text', text: PROMPT },
      ],
    }],
  });
  return extractJSON(response.content[0].text);
};

const parseBill = async (req, res) => {
  const { imageBase64, mimeType = 'image/jpeg' } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: 'imageBase64 is required' });
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!geminiKey && !anthropicKey) {
    return res.status(500).json({ error: 'No AI API key configured on server' });
  }

  // Try Gemini — on 429 skip retries and fall through to Anthropic immediately
  if (geminiKey) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[parse-bill] gemini attempt ${attempt}`);
        const parsed = await parseWithGemini(imageBase64, mimeType, geminiKey);
        if (!parsed.merchantName || !Array.isArray(parsed.items)) throw new Error('Bad response shape');
        parsed.items = normalizeItems(parsed.items);
        console.log('[parse-bill] gemini success');
        return res.json(parsed);
      } catch (err) {
        const msg = err.message || '';
        console.warn(`[parse-bill] gemini attempt ${attempt} failed: ${msg.substring(0, 150)}`);
        if (msg.includes('429')) break; // quota — don't retry, go straight to fallback
        if (attempt < 2 && (msg.includes('503') || msg.includes('overloaded'))) await sleep(3000);
        else if (!msg.includes('503') && !msg.includes('overloaded')) break;
      }
    }
  }

  // Fallback: Anthropic Claude (vision-capable, separate quota)
  if (anthropicKey) {
    try {
      console.log('[parse-bill] falling back to anthropic');
      const parsed = await parseWithAnthropic(imageBase64, mimeType, anthropicKey);
      if (!parsed.merchantName || !Array.isArray(parsed.items)) throw new Error('Bad response shape');
      parsed.items = normalizeItems(parsed.items);
      console.log('[parse-bill] anthropic success');
      return res.json(parsed);
    } catch (err) {
      console.warn(`[parse-bill] anthropic failed: ${err.message?.substring(0, 150)}`);
    }
  }

  res.status(503).json({ error: 'AI service unavailable. Please try again.' });
};

module.exports = { parseBill };
