/** "November 26, 2026" */
export const formatDate = (value, locale = "en-US") =>
  new Date(value).toLocaleString(locale, { year: "numeric", month: "long", day: "numeric" });

/** "$1,299.90" */
export const formatCurrency = (value, currency = "USD", locale = "en-US") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(Number(value));
