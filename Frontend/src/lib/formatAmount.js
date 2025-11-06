export function formatAmount(amount, currency = 'INR', locale = 'en-IN', fractionDigits = 0) {
  const numeric = parseFloat(String(amount).replace(/[^0-9.-]+/g, '')) || 0;

  return numeric.toLocaleString(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: fractionDigits,
  });
}