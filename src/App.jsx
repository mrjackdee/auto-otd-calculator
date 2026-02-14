import React, { useMemo, useState } from "react";
import { lookupByZip } from "./rates";
import { calcOTD, formatCurrency, formatInputCurrency, toNumber } from "./utils";


function cleanZip(raw) {
  return (raw || "").replace(/\D/g, "").slice(0, 5);
}

function cleanMoney(raw) {
  return (raw || "").replace(/[^0-9.]/g, "");
}

const Row = ({ label, helper, value }) => (
  <div style={styles.tr}>
    <div style={styles.leftBlock}>
      <div style={styles.tdLeft}>{label}</div>
      {helper ? <div style={styles.helper}>{helper}</div> : null}
    </div>
    <div style={styles.tdRight}>{value}</div>
  </div>
);

export default function App() {
  const [priceRaw, setPriceRaw] = useState("");
  const [zipRaw, setZipRaw] = useState("30309");

  const zip = useMemo(() => cleanZip(zipRaw), [zipRaw]);
  const rate = useMemo(() => lookupByZip(zip), [zip]);

  const sellingPrice = Number(priceRaw) || 0;

  const result =
    rate && sellingPrice > 0
      ? calcOTD(sellingPrice, rate.taxRate, rate.titleFee, rate.registrationFee, rate.dealerFeeEstimate)
      : null;

  const ready = Boolean(result);

  let taxHelper = "";
  if (rate?.stateCode === "GA") {
    taxHelper = "TAVT (Title Ad Valorem Tax, Georgia)";
  } else if (rate?.stateCode === "TX") {
    taxHelper = "Motor vehicle sales tax in Texas";
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.title}>MrJackDee™ | Out the Door Price Estimator</div>

        <div style={styles.inputs}>
          <label style={styles.label}>
            <div style={styles.labelText}>Selling Price</div>
            <input
              style={styles.input}
              value={priceRaw}
              placeholder="Example: 21312"
              onChange={(e) => setPriceRaw(formatInputCurrency(e.target.value))}
            />
          </label>

          <label style={styles.label}>
            <div style={styles.labelText}>ZIP Code</div>
            <input
              style={styles.input}
              value={zipRaw}
              placeholder="Example: 30309"
              onChange={(e) => setZipRaw(e.target.value)}
            />
          </label>
        </div>

        <div style={styles.tableWrap}>
          <div style={styles.tableHeader}>
            <div>Purchase Details</div>
            <div>Amount</div>
          </div>

          <Row label="Selling Price" value={ready ? formatCurrency(result.sellingPrice) : "—"} />

          <Row
            label={rate?.taxLabel || "Tax"}
            helper={taxHelper}
            value={ready ? `${formatCurrency(result.salesTax)} (${(result.taxRate * 100).toFixed(2)}%)` : "—"}
          />

          <Row
            label="Title Fee"
            helper={rate ? `Title fee in ${rate.stateName}` : ""}
            value={ready ? formatCurrency(result.titleFee) : "—"}
          />

          <Row
            label="Registration Fee"
            helper={rate ? `Registration fee in ${rate.stateName}` : ""}
            value={ready ? formatCurrency(result.licenseFee) : "—"}
          />

          <Row
            label="Estimated Dealer Fees"
            helper={rate ? `Typical dealer processing fees in ${rate.stateName}` : ""}
            value={ready ? formatCurrency(result.dealerFee) : "—"}
          />

          <div style={styles.divider} />

          <div style={styles.totalRow}>
            <div style={styles.totalLeft}>Total Out The Door</div>
            <div style={styles.totalRight}>{ready ? formatCurrency(result.total) : "—"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: 24, fontFamily: "Arial" },
  card: { maxWidth: 900, margin: "0 auto" },
  title: { fontSize: 26, fontWeight: 800, marginBottom: 16 },

  inputs: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 },
  label: {},
  labelText: { fontSize: 12, marginBottom: 4 },
  input: { padding: 10, border: "1px solid #ccc", borderRadius: 6 },

  tableWrap: { borderTop: "1px solid #ddd" },
  tableHeader: { display: "flex", justifyContent: "space-between", fontWeight: 800, padding: "12px 0" },

  tr: { display: "flex", justifyContent: "space-between", padding: "14px 0", borderTop: "1px solid #eee" },
  leftBlock: { display: "flex", flexDirection: "column" },
  tdLeft: { fontWeight: 600 },
  helper: { fontSize: 12, color: "#2563eb" },
  tdRight: { fontWeight: 700 },

  divider: { borderTop: "2px solid #ddd", marginTop: 10 },

  totalRow: { display: "flex", justifyContent: "space-between", padding: "16px 0" },
  totalLeft: { fontSize: 18, fontWeight: 900 },
  totalRight: { fontSize: 18, fontWeight: 900 }
};
