// Valid USPS ZIP ranges for states (not guesses)
function getStateFromZip(zip) {
  const z = Number(zip);

  // Georgia ZIP ranges
  if (
    (z >= 30001 && z <= 31999) ||
    (z >= 39801 && z <= 39901)
  ) {
    return "GA";
  }

  // Texas ZIP ranges
  if (
    (z >= 73301 && z <= 73399) ||
    (z >= 75001 && z <= 79999) ||
    (z >= 88501 && z <= 88595)
  ) {
    return "TX";
  }

  return null;
}

export function lookupByZip(zip) {
  const cleaned = String(zip || "").replace(/\D/g, "").slice(0, 5);
  if (cleaned.length !== 5) return null;

  const state = getStateFromZip(cleaned);
  if (!state) return null;

  if (state === "GA") {
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

  if (state === "TX") {
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
