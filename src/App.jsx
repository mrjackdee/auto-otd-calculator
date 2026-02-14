import React, { useMemo, useState } from "react";
import { lookupByZip } from "./rates";
import { calcOTD, formatUSD } from "./utils";

function cleanZip(raw) {
  return (raw || "").replace(/\D/g, "").slice(0, 5);
}

function cleanMoney(raw) {
  return (raw || "").replace(/[^0-9.]/g, "");
}

const Row = ({ label, helper, value }) => {
  return (
    <div style={styles.tr}>
      <div style={styles.leftBlock}>
        <div style={styles.tdLeft}>{label}</div>
        {helper ? <div style={styles.helper}>{helper}</div> : null}
      </div>
      <div style={styles.tdRight}>{value}</div>
    </div>
  );
};

export default function App() {
  const [priceRaw, setPriceRaw] = useState("");
  const [zipRaw, setZipRaw] = useState("");

  const zip = useMemo(() => cleanZip(zipRaw), [zipRaw]);
  const rate = useMemo(() => lookupByZip(zip), [zip]);

  const sellingPrice = Number(priceRaw) || 0;

  const result =
    rate && sellingPrice > 0
      ? calcOTD(sellingPrice, rate.taxRate, rate.titleFee, rate.registrationFee, rate.dealerFeeEstimate)
      : null;

  const ready = Boolean(result);

  const taxLabel = rate?.taxLabel || "Sales Tax";
  const stateName = rate?.stateName || "your state";

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.top}>
          <div style={styles.title}>Out The Door Price Estimator</div>
          <div style={styles.subTitle}>
            Enter the selling price and ZIP code. This calculator estimates tax, title, and registration for Georgia and Texas.
          </div>

          <div style={styles.inputs}>
            <label style={styles.label}>
              <div style={styles.labelText}>Selling Price</div>
              <input
                style={styles.input}
                placeholder="Example: 21312"
                value={priceRaw}
                inputMode="decimal"
                onChange={(e) => setPriceRaw(cleanMoney(e.target.value))}
              />
            </label>

            <label style={styles.label}>
              <div style={styles.labelText}>ZIP Code</div>
              <input
                style={styles.input}
                placeholder="Example: 30034"
                value={zipRaw}
                inputMode="numeric"
                onChange={(e) => setZipRaw(e.target.value)}
              />
            </label>
          </div>

          {!rate && zip.length === 5 ? (
            <div style={styles.notice}>This MVP supports Georgia and Texas only. Try 30034 (GA) or 75201 (TX).</div>
          ) : null}
        </div>

        <div style={styles.tableWrap}>
          <div style={styles.tableHeader}>
            <div style={styles.thLeft}>Purchase Details</div>
            <div style={styles.thRight}>Amount</div>
          </div>

          <Row label="Selling Price" value={ready ? formatUSD(result.sellingPrice) : "—"} />

          <Row
            label={taxLabel}
            helper={`Average combined ${taxLabel.toLowerCase()} in ${stateName}`}
            value={
              ready
                ? `${formatUSD(result.salesTax)} (${(result.taxRate * 100).toFixed(2)}%)`
                : "—"
            }
          />

          <Row
            label="Title Fee"
            helper={`More info on title fee in ${stateName}`}
            value={ready ? formatUSD(result.titleFee) : "—"}
          />

          <Row
            label="Registration Fee"
            value={ready ? formatUSD(result.licenseFee) : "—"}
          />

          <Row
            label="Estimated Dealer Fees"
            helper={`Typical documentation and processing fees in ${stateName}`}
            value={ready ? formatUSD(result.dealerFee) : "—"}
          />

          <div style={styles.divider} />

          <div style={styles.totalRow}>
            <div style={styles.totalLeft}>Total Out The Door</div>
            <div style={styles.totalRight}>{ready ? formatUSD(result.total) : "—"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#ffffff",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
    padding: 24
  },
  card: {
    maxWidth: 900,
    margin: "0 auto",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 20
  },
  top: { paddingBottom: 10 },
  title: { fontSize: 28, fontWeight: 800, color: "#111827" },
  subTitle: { marginTop: 6, fontSize: 13, color: "#6b7280", lineHeight: 1.35 },

  inputs: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 },
  label: { display: "block" },
  labelText: { fontSize: 12, color: "#374151", marginBottom: 6, fontWeight: 700 },
  input: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    background: "#fff",
    color: "#111827",
    fontSize: 14,
    outline: "none"
  },

  notice: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    border: "1px solid #fde68a",
    background: "#fffbeb",
    color: "#92400e",
    fontSize: 12
  },

  tableWrap: { marginTop: 12, borderTop: "1px solid #e5e7eb" },
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    padding: "16px 0",
    fontSize: 22,
    fontWeight: 800,
    color: "#374151"
  },

  tr: {
    display: "flex",
    justifyContent: "space-between",
    padding: "18px 0",
    borderTop: "1px solid #eef2f7"
  },
  leftBlock: { display: "flex", flexDirection: "column", gap: 6, maxWidth: "70%" },
  tdLeft: { fontSize: 16, color: "#374151", fontWeight: 700 },
  helper: { fontSize: 14, color: "#2563eb" },
  tdRight: { fontSize: 16, color: "#111827", fontWeight: 800, fontVariantNumeric: "tabular-nums" },

  divider: { height: 1, background: "#e5e7eb", marginTop: 6 },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "18px 0",
    borderTop: "1px solid #eef2f7"
  },
  totalLeft: { fontSize: 18, color: "#111827", fontWeight: 900 },
  totalRight: { fontSize: 18, color: "#111827", fontWeight: 900, fontVariantNumeric: "tabular-nums" }
};
