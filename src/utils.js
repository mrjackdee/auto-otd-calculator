export function formatUSD(n) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);
}

export function calcOTD(price, taxRate, title, license, dealerFee) {
  const tax = price * taxRate;
  return {
    tax,
    total: price + tax + title + license + dealerFee
  };
}
