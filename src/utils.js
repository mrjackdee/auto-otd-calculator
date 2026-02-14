export function toNumber(value) {
  if (!value) return 0;
  return Number(String(value).replace(/[^0-9.]/g, "")) || 0;
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(value) || 0);
}

export function formatInputCurrency(value) {
  const num = toNumber(value);
  if (!num) return "";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0
  }).format(num);
}

export function calcOTD(price, taxRate, titleFee, registrationFee, dealerFee) {
  const sellingPrice = toNumber(price);
  const salesTax = sellingPrice * taxRate;

  const total =
    sellingPrice +
    salesTax +
    titleFee +
    registrationFee +
    dealerFee;

  return {
    sellingPrice,
    salesTax,
    taxRate,
    titleFee,
    licenseFee: registrationFee,
    dealerFee,
    total
  };
}
