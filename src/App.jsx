import React, { useMemo, useState } from "react";
import { lookupByZip } from "./rates";
import { calcOTD, formatCurrency, formatInputDollars, parseDollars } from "./utils";
import logo from "./logo.png";

const Row = ({ label, helper, value }) => (
  <div style={styles.row}>
    <div style={styles.rowLeft}>
      <div style={styles.rowLabel}>{label}</div>
      {helper ? <div style={styles.rowHelper}>{helper}</div> : null}
    </div>
    <div style={styles.rowValue}>{value}</div>
  </div>
);

export default function App() {
  const [priceRaw, setPriceRaw] = useState("");
  const [zipRaw, setZipRaw] = useState(""); // default Texas example from mockup

  const zip = useMemo(() => String(zipRaw || "").replace(/\D/g, "").slice(0, 5), [zipRaw]);
  const rate = useMemo(() => lookupByZip(zip), [zip]);

  const invalidZip = zip.length === 5 && !rate;

  const sellingPrice = parseDollars(priceRaw);

  const result =
    !invalidZip && rate && sellingPrice > 0
      ? calcOTD(
          sellingPrice,
          rate.taxRate,
          rate.titleFee,
          rate.registrationFee,
          rate.dealerFeeEstimate
        )
      : null;

  const ready = Boolean(result);

    const taxPercentLabel = rate ? (rate.taxRate * 100).toFixed(2) : null;
    const taxLineLabel =
    rate?.stateCode === "GA"
        ? `TAVT (${taxPercentLabel}%)`
        : rate
        ? `Sales Tax (${taxPercentLabel}%)`
        : "Sales Tax";

  const taxHelper =
    rate?.stateCode === "GA"
      ? "TAVT (Title Ad Valorem Tax, Georgia)"
      : rate?.stateCode === "TX"
      ? "Motor vehicle sales tax in Texas"
      : "";

  const reset = () => {
    setPriceRaw("");
    setZipRaw("");
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.brand}>MrJackDee™</div>
        <div style={styles.subtitle}>OUT THE DOOR PRICE ESTIMATOR</div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTopRow}>
          <div style={styles.spacer} />
          <button type="button" style={styles.resetBtn} onClick={reset}>
            <span style={styles.resetIcon}>↻</span>
            Reset
          </button>
        </div>

        <div style={styles.inputsGrid}>
          <div>
            <div style={styles.inputLabel}>SELLING PRICE</div>
            <div style={styles.moneyWrap}>
              <span style={styles.moneyPrefix}>$</span>
              <input
                style={styles.moneyInput}
                value={priceRaw}
                placeholder="30,000"
                inputMode="numeric"
                onChange={(e) => setPriceRaw(formatInputDollars(e.target.value))}
              />
            </div>
          </div>

          <div>
            <div style={styles.inputLabel}>ZIP CODE</div>
            <input
              style={styles.zipInput}
              value={zipRaw}
              placeholder="75201"
              inputMode="numeric"
              onChange={(e) => setZipRaw(e.target.value)}
            />
          </div>
        </div>

        {invalidZip ? (
          <div style={styles.error}>
            This estimator is only valid for ZIP codes located in Texas or Georgia.
          </div>
        ) : null}

        <div style={styles.sectionTitle}>PURCHASE DETAILS</div>
        <div style={styles.divider} />

        <div style={styles.rows}>
          <Row
            label="Selling Price"
            helper="Base vehicle price before taxes and fees"
            value={ready ? formatCurrency(result.sellingPrice) : "—"}
          />

          <Row
            label={taxLineLabel}
            helper={taxHelper}
            value={ready ? formatCurrency(result.salesTax) : "—"}
          />

          <Row
            label="Title Fee"
            helper="Standard state title application fee"
            value={ready ? formatCurrency(result.titleFee) : "—"}
          />

          <Row
            label="Registration Fee"
            helper={rate?.stateCode === "TX" ? "Annual vehicle registration based on weight" : "Annual vehicle registration fee"}
            value={ready ? formatCurrency(result.licenseFee) : "—"}
          />

          <Row
            label="Estimated Dealer Fees"
            helper="Average documentation and processing fees"
            value={ready ? formatCurrency(result.dealerFee) : "—"}
          />
        </div>

        <div style={styles.totalDivider} />

        <div style={styles.totalRow}>
          <div style={styles.totalLabel}>TOTAL OUT THE DOOR</div>
          <div style={styles.totalValue}>{ready ? formatCurrency(result.total) : "—"}</div>
        </div>
      </div>
    <img src={logo} alt="MrJackDee logo" style={styles.cornerLogo} />

      <div style={styles.footer}>
        <strong>© 2026 MrJackDee™. All estimates are subject to local dealership verification and state law changes.</strong>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#001F3F",
    color: "#FFFFFF",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
    padding: "44px 20px 24px"
  },

  cornerLogo: {
    position: "fixed",
    right: 18,
    bottom: 18,
    width: 70,
    height: "auto",
    opacity: 0.35,
    pointerEvents: "none",
    zIndex: 50
  },

  header: {
    textAlign: "center",
    marginBottom: 26
  },
  brand: {
    fontSize: 64,
    fontWeight: 900,
    letterSpacing: 0.5,
    lineHeight: 1.05,
    textShadow: "0 2px 0 rgba(0,0,0,0.25)"
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    letterSpacing: 4,
    opacity: 0.85
  },

  card: {
    maxWidth: 760,
    margin: "0 auto",
    background: "#002B55",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: 14,
    padding: 26,
    boxShadow: "0 18px 50px rgba(0,0,0,0.25)"
  },

  cardTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14
  },
  spacer: { height: 1 },

  resetBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    borderRadius: 10,
    padding: "10px 14px",
    background: "transparent",
    color: "#FFFFFF",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    cursor: "pointer",
    fontWeight: 700
  },
  resetIcon: {
    display: "inline-block",
    opacity: 0.9
  },

  inputsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 18,
    marginTop: 6,
    marginBottom: 18
  },

  inputLabel: {
    fontSize: 13,
    letterSpacing: 1.5,
    fontWeight: 800,
    opacity: 0.9,
    marginBottom: 10
  },

  moneyWrap: {
    display: "flex",
    alignItems: "center",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
    padding: "0 14px",
    height: 56,
    background: "rgba(0,0,0,0.08)"
  },
  moneyPrefix: {
    fontSize: 16,
    fontWeight: 900,
    color: "#FFFFFF",
    marginRight: 10,
    opacity: 0.95
  },
  moneyInput: {
    border: "none",
    outline: "none",
    fontSize: 22,
    fontWeight: 900,
    width: "100%",
    color: "#FFFFFF",
    background: "transparent",
    letterSpacing: 0.2
  },

  zipInput: {
    width: "100%",
    height: 56,
    borderRadius: 10,
    border: "2px solid rgba(255, 255, 255, 0.2)",
    background: "rgba(0,0,0,0.08)",
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: 900,
    padding: "0 14px",
    outline: "none",
    letterSpacing: 0.6
  },

  error: {
    marginTop: 6,
    marginBottom: 14,
    padding: 12,
    borderRadius: 10,
    background: "rgba(185, 28, 28, 0.18)",
    border: "1px solid rgba(185, 28, 28, 0.55)",
    color: "#FFFFFF",
    fontWeight: 800
  },

  sectionTitle: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: 900,
    letterSpacing: 2,
    opacity: 0.95
  },
  divider: {
    marginTop: 12,
    height: 1,
    background: "rgba(255, 255, 255, 0.2)"
  },

  rows: {
    marginTop: 10
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    gap: 18,
    padding: "18px 0"
  },
  rowLeft: {
    maxWidth: "70%"
  },
  rowLabel: {
    fontSize: 18,
    fontWeight: 900
  },
  rowHelper: {
    marginTop: 8,
    fontSize: 14,
    color: "#4A90E2",
    fontWeight: 700
  },
  rowValue: {
    fontSize: 18,
    fontWeight: 900,
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap"
  },

  totalDivider: {
    marginTop: 10,
    height: 2,
    background: "rgba(255, 255, 255, 0.2)"
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingTop: 18,
    paddingBottom: 6
  },
  totalLabel: {
    fontSize: 13,
    letterSpacing: 4,
    fontWeight: 900,
    opacity: 0.9
  },
  totalValue: {
    fontSize: 56,
    fontWeight: 1000,
    lineHeight: 1,
    fontVariantNumeric: "tabular-nums"
  },

  footer: {
    textAlign: "center",
    marginTop: 22,
    opacity: 0.8,
    fontSize: 12
  }
};
