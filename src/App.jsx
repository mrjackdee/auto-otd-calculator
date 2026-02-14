import React, { useState } from "react";
import { lookupByZip } from "./rates";
import { calcOTD, formatUSD } from "./utils";

export default function App() {
  const [price, setPrice] = useState("");
  const [zip, setZip] = useState("");
  const [dealer, setDealer] = useState("");

  const rate = lookupByZip(zip);
  const dealerFee = dealer || rate?.defaultDealer || 0;

  const result =
    rate && price
      ? calcOTD(Number(price), rate.taxRate, rate.title, rate.license, Number(dealerFee))
      : null;

  return (
    <div style={{ fontFamily: "Arial", padding: 30 }}>
      <h2>Out The Door Price Estimator</h2>

      <div>
        <input placeholder="Vehicle price" value={price} onChange={e => setPrice(e.target.value)} />
      </div>

      <div>
        <input placeholder="ZIP code" value={zip} onChange={e => setZip(e.target.value)} />
      </div>

      <div>
        <input placeholder="Dealer fees" value={dealer} onChange={e => setDealer(e.target.value)} />
      </div>

      {result && (
        <div style={{ marginTop: 20 }}>
          <div>Estimated Tax: {formatUSD(result.tax)}</div>
          <div>Total OTD: {formatUSD(result.total)}</div>
        </div>
      )}
    </div>
  );
}
