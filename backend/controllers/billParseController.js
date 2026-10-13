const { GoogleGenerativeAI } = require('@google/generative-ai');

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

const MODEL = 'gemini-3.8-flash';
const MAX_RETRIES = 3;
const RETRY_DELAYS = [2000, 4000, 8000];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const parseBill = async (req, res) => {
  const { imageBase64, mimeType = 'image/jpeg' } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: 'imageBase64 is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured on server' });
  }

  const genAI = new GoogleGenerativeAI(apiKey, { apiVersion: 'v1' });
  const model = genAI.getGenerativeModel({ model: MODEL });

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[parse-bill] attempt ${attempt}/${MAX_RETRIES}`);

      const result = await model.generateContent([
        PROMPT,
        { inlineData: { data: imageBase64, mimeType } },
      ]);

      const rawText = result.response.text().trim();
      const jsonText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
      const parsed = JSON.parse(jsonText);

      if (!parsed.merchantName || !Array.isArray(parsed.items)) {
        throw new Error('Unexpected response shape from AI');
      }

      parsed.items = parsed.items.map((item, i) => ({
        id: i + 1,
        itemName: String(item.itemName || '').substring(0, 60),
        quantity: parseFloat(item.quantity) || 1,
        unitPrice: parseFloat(item.unitPrice) || 0,
        amount: parseFloat(item.amount) || 0,
        category: String(item.category || 'Other'),
      }));

      console.log(`[parse-bill] success on attempt ${attempt}`);
      return res.json(parsed);

    } catch (err) {
      const msg = err.message || '';
      const isRetryable = msg.includes('503') || msg.includes('429') || msg.includes('overloaded');
      console.warn(`[parse-bill] attempt ${attempt} failed: ${msg.substring(0, 200)}`);
      if (!isRetryable || attempt === MAX_RETRIES) break;
      await sleep(RETRY_DELAYS[attempt - 1]);
    }
  }

  res.status(503).json({ error: 'AI service unavailable. Please try again.' });
};

module.exports = { parseBill };
