export function digitsOnly(raw) {
  return String(raw || "").replace(/\D/g, "");
}

export function parseDollars(raw) {
  const d = digitsOnly(raw);
  return d ? Number(d) : 0;
}

export function formatInputDollars(raw) {
  const n = parseDollars(raw);
  if (!n) return "";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);
}

export function formatCurrency(value) {
  const n = Number(value) || 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(n);
}

export function calcOTD(sellingPriceNumber, taxRate, titleFee, registrationFee, dealerFee) {
  const sellingPrice = Number(sellingPriceNumber) || 0;
  const rate = Number(taxRate) || 0;

  const title = Number(titleFee) || 0;
  const reg = Number(registrationFee) || 0;
  const dealer = Number(dealerFee) || 0;

  const salesTax = sellingPrice * rate;
  const total = sellingPrice + salesTax + title + reg + dealer;

  return {
    sellingPrice,
    taxRate: rate,
    salesTax,
    titleFee: title,
    licenseFee: reg,
    dealerFee: dealer,
    total
  };
}
