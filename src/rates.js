export function lookupByZip(zip) {
  if (!zip) return null;

  // Georgia
  if (zip.startsWith("30") || zip.startsWith("31") || zip.startsWith("32")) {
    return {
      stateCode: "GA",
      stateName: "Georgia",
      taxLabel: "TAVT",
      taxRate: 0.068,
      titleFee: 18,
      registrationFee: 20,
      dealerFeeEstimate: 899
    };
  }

  // Texas
  if (zip.startsWith("75") || zip.startsWith("76") || zip.startsWith("77")) {
    return {
      stateCode: "TX",
      stateName: "Texas",
      taxLabel: "Sales Tax",
      taxRate: 0.0625,
      titleFee: 33,
      registrationFee: 90,
      dealerFeeEstimate: 199
    };
  }

  return null;
}
