export function lookupByZip(zip) {
  if (!zip) return null;

  if (zip.startsWith("30") || zip.startsWith("31") || zip.startsWith("32")) {
    return { state: "GA", taxRate: 0.068, title: 18, license: 20, defaultDealer: 899 };
  }

  if (zip.startsWith("75") || zip.startsWith("76") || zip.startsWith("77")) {
    return { state: "TX", taxRate: 0.0625, title: 33, license: 90, defaultDealer: 199 };
  }

  return null;
}
