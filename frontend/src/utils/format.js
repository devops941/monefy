// Safe date/currency helpers — Hermes (Android) has limited Intl support,
// so we avoid toLocaleDateString/toLocaleString with locale options entirely.

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTHS_LONG  = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS_LONG    = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

// "12 Oct"
export const formatShortDate = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
};

// "Wednesday, October 12"
export const formatLongDate = (date) =>
  `${DAYS_LONG[date.getDay()]}, ${MONTHS_LONG[date.getMonth()]} ${date.getDate()}`;

// "October 2026"
export const formatMonthYear = (date) =>
  `${MONTHS_LONG[date.getMonth()]} ${date.getFullYear()}`;

// "Mon, 6 Oct"  (for weekly range labels)
export const formatDayDate = (date) =>
  `${DAYS_LONG[date.getDay()].slice(0, 3)}, ${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`;

// Indian number format: 1,00,000 style
const indianInt = (n) => {
  const s = String(Math.round(Math.abs(n)));
  if (s.length <= 3) return s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  return rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
};

// "₹1,23,456.78"
export const formatINR = (amount) => {
  const n = amount || 0;
  const abs = Math.abs(n);
  const int = Math.floor(abs);
  const dec = Math.round((abs - int) * 100);
  return `₹${indianInt(int)}.${String(dec).padStart(2, '0')}`;
};

// "₹1,23,456"  (no decimals — for budgets/totals)
export const formatINRShort = (amount) => `₹${indianInt(amount || 0)}`;
