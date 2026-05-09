"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { ArrowRight, Camera } from "lucide-react";

/* ── design tokens & styles ── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --ink:      #0A0807;
    --paper:    #F5EDD6;
    --amber:    #C8881A;
    --amber-lt: #E8A030;
    --smoke:    #1A1714;
    --ash:      #2C2824;
    --dust:     #4A4440;
    --mist:     #8C8078;
  }

  .pc-root {
    min-height: 100vh;
    background: var(--ink);
    font-family: 'DM Sans', sans-serif;
    color: var(--paper);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    position: relative;
    overflow: hidden;
  }

  /* grain */
  .pc-root::before {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    opacity: 0.035; pointer-events: none; z-index: 0;
  }

  /* large ambient ring */
  .pc-ring-bg {
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 600px; height: 600px;
    border-radius: 50%;
    border: 1px solid var(--amber);
    opacity: 0.04;
    pointer-events: none;
    z-index: 0;
  }
  .pc-ring-bg::before {
    content: '';
    position: absolute; inset: 40px;
    border-radius: 50%;
    border: 1px solid var(--amber-lt);
  }

  /* card */
  .pc-card {
    position: relative; z-index: 1;
    width: 100%; max-width: 520px;
    background: var(--smoke);
    border: 1px solid var(--ash);
    border-radius: 2px;
    padding: 2.5rem;
  }

  /* corner accents */
  .pc-card::before, .pc-card::after {
    content: '';
    position: absolute;
    width: 20px; height: 20px;
    border-color: var(--amber);
    border-style: solid;
    opacity: 0.55;
  }
  .pc-card::before { top: 14px; left: 14px; border-width: 1px 0 0 1px; }
  .pc-card::after  { bottom: 14px; right: 14px; border-width: 0 1px 1px 0; }

  /* header */
  .pc-eyebrow {
    font-size: 0.6rem;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--amber);
    display: flex; align-items: center; gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
  .pc-eyebrow-dot {
    width: 4px; height: 4px; border-radius: 50%;
    background: var(--amber-lt);
    animation: blink 1.6s ease-in-out infinite;
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.15} }

  .pc-title {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 900;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: var(--paper);
    margin-bottom: 0.4rem;
  }
  .pc-title em { font-style: italic; color: var(--amber-lt); }

  .pc-rule {
    height: 1px;
    background: linear-gradient(90deg, var(--amber) 0%, transparent 100%);
    opacity: 0.3;
    margin: 1.5rem 0;
  }

  /* proof-sheet photo */
  .pc-photo-wrap {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1.75rem;
  }
  .pc-photo-frame {
    position: relative;
    width: 116px; height: 116px;
    border: 1px solid var(--ash);
    border-radius: 2px;
    overflow: hidden;
    background: var(--ash);
  }
  /* film-strip holes */
  .pc-strip {
    position: absolute; top: 0; bottom: 0;
    width: 14px;
    background: var(--ink);
    display: flex; flex-direction: column;
    justify-content: space-evenly; align-items: center;
  }
  .pc-strip.left  { left: -14px; }
  .pc-strip.right { right: -14px; }
  .pc-strip-hole {
    width: 6px; height: 6px; border-radius: 1px;
    background: var(--smoke);
    border: 1px solid #3A3530;
  }
  .pc-photo-frame img {
    width: 100%; height: 100%;
    object-fit: cover; display: block;
  }
  .pc-photo-label {
    font-size: 0.6rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--dust);
    margin-top: 0.6rem;
  }

  /* info rows */
  .pc-info-list { display: flex; flex-direction: column; gap: 0; }
  .pc-info-row {
    display: flex; justify-content: space-between; align-items: baseline;
    padding: 0.65rem 0;
    border-bottom: 1px solid var(--ash);
    gap: 1rem;
  }
  .pc-info-row:last-child { border-bottom: none; }
  .pc-info-label {
    font-size: 0.62rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--mist);
    white-space: nowrap;
    flex-shrink: 0;
  }
  .pc-info-value {
    font-size: 0.9rem;
    color: var(--paper);
    text-align: right;
  }
  .pc-info-value.interest-badge {
    font-size: 0.65rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--amber-lt);
    border: 1px solid var(--amber);
    padding: 0.2rem 0.6rem;
    border-radius: 2px;
    background: rgba(200,136,26,0.08);
  }

  /* payable row — highlighted */
  .pc-payable-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 1rem 1rem;
    background: var(--ash);
    border: 1px solid #3A3530;
    border-radius: 2px;
    margin-top: 1.25rem;
  }
  .pc-payable-label {
    font-size: 0.62rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--amber);
  }
  .pc-payable-amount {
    font-family: 'Playfair Display', serif;
    font-size: 1.75rem;
    font-weight: 900;
    color: var(--amber-lt);
    letter-spacing: -0.02em;
    display: flex; align-items: baseline; gap: 0.3rem;
  }
  .pc-payable-currency {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.7rem;
    font-weight: 400;
    letter-spacing: 0.1em;
    color: var(--mist);
  }

  /* agreement */
  .pc-agreement {
    display: flex; gap: 0.75rem; align-items: flex-start;
    margin-top: 1.5rem;
    padding: 1rem;
    border: 1px solid var(--ash);
    border-radius: 2px;
    background: rgba(200,136,26,0.04);
    cursor: pointer;
  }
  .pc-agreement input[type="checkbox"] {
    appearance: none;
    width: 16px; height: 16px;
    border: 1px solid var(--amber);
    border-radius: 1px;
    background: transparent;
    cursor: pointer;
    flex-shrink: 0;
    margin-top: 2px;
    position: relative;
    transition: background 0.15s;
  }
  .pc-agreement input[type="checkbox"]:checked {
    background: var(--amber);
  }
  .pc-agreement input[type="checkbox"]:checked::after {
    content: '';
    position: absolute;
    top: 2px; left: 5px;
    width: 4px; height: 7px;
    border: 1.5px solid var(--ink);
    border-top: none; border-left: none;
    transform: rotate(40deg);
  }
  .pc-agreement-text {
    font-size: 0.72rem;
    line-height: 1.55;
    color: var(--mist);
    letter-spacing: 0.01em;
  }
  .pc-agreement-text strong { color: var(--paper); font-weight: 500; }

  /* submit */
  .pc-submit {
    width: 100%;
    display: flex; align-items: center; justify-content: center; gap: 0.6rem;
    margin-top: 1.25rem;
    padding: 0.9rem;
    background: var(--amber);
    border: none; border-radius: 2px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--ink);
    cursor: pointer;
    transition: opacity 0.2s, transform 0.1s;
  }
  .pc-submit:hover:not(:disabled) { opacity: 0.88; }
  .pc-submit:active:not(:disabled) { transform: scale(0.99); }
  .pc-submit:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    background: var(--dust);
    color: var(--ash);
  }

  /* loading */
  .pc-loading {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 1.25rem;
    min-height: 60vh; z-index: 1; position: relative;
  }
  .pc-loading-ring {
    width: 56px; height: 56px; border-radius: 50%;
    border: 1px solid var(--amber);
    animation: spin 2.2s linear infinite;
    position: relative;
  }
  .pc-loading-ring::before {
    content: ''; position: absolute; inset: 8px;
    border-radius: 50%; border: 1px solid var(--amber-lt);
    animation: spin 1.4s linear infinite reverse;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .pc-loading-text {
    font-size: 0.65rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--mist);
  }

  /* stagger fade-in */
  .pc-fade { opacity: 0; animation: fadeUp 0.45s ease forwards; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
`;

/* Stagger delays */
const DELAYS = [
  "0.05s",
  "0.1s",
  "0.15s",
  "0.2s",
  "0.25s",
  "0.3s",
  "0.35s",
  "0.4s",
];

function InfoRow({ label, value, isBadge, delay }) {
  return (
    <div className="pc-info-row pc-fade" style={{ animationDelay: delay }}>
      <span className="pc-info-label">{label}</span>
      <span className={`pc-info-value${isBadge ? " interest-badge" : ""}`}>
        {value ?? "—"}
      </span>
    </div>
  );
}

export default function PaymentConfirmation() {
  const [data, setData] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("formData");
    if (stored) setData(JSON.parse(stored));
  }, []);

  if (!data) {
    return (
      <div className="pc-root">
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        <div className="pc-ring-bg" />
        <div className="pc-loading">
          <div className="pc-loading-ring" />
          <span className="pc-loading-text">Developing your proof sheet…</span>
        </div>
      </div>
    );
  }

  const BASE_FEE = 1250;
  const guestFee = (data.guests ?? 0) * 1000;
  const totalAmount = BASE_FEE + guestFee;

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const res = await axios.post(
        "https://reunion-cpscm-server.vercel.app/register",
        { ...data },
      );
      if (res.data?.url) {
        window.location.href = res.data.url;
        return;
      }
      alert("Registration failed. Please try again.");
    } catch (err) {
      console.error("Error saving applicant:", err);
      alert("Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pc-root">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="pc-ring-bg" />

      <div className="pc-card">
        {/* ── Header ── */}
        <div className="pc-eyebrow pc-fade" style={{ animationDelay: "0s" }}>
          <span className="pc-eyebrow-dot" />
          Step 2 of 2
        </div>
        <h1 className="pc-title pc-fade" style={{ animationDelay: "0.05s" }}>
          Review &amp; <em>Confirm</em>
        </h1>
        <div className="pc-rule pc-fade" style={{ animationDelay: "0.1s" }} />

        {/* ── Proof-sheet photo ── */}
        {data.photo && (
          <div
            className="pc-photo-wrap pc-fade"
            style={{ animationDelay: "0.12s" }}
          >
            <div style={{ position: "relative" }}>
              {/* film strips */}
              <div className="pc-strip left">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="pc-strip-hole" />
                ))}
              </div>
              <div className="pc-photo-frame">
                <img src={data.photo} alt="Participant" />
              </div>
              <div className="pc-strip right">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="pc-strip-hole" />
                ))}
              </div>
            </div>
            <span className="pc-photo-label">Participant Photo</span>
          </div>
        )}

        {/* ── Info rows ── */}
        <div className="pc-info-list">
          <InfoRow label="Full Name" value={data.fullName} delay={DELAYS[0]} />
          <InfoRow label="Email" value={data.email} delay={DELAYS[1]} />
          <InfoRow label="Mobile" value={data.phone} delay={DELAYS[2]} />
          <InfoRow
            label="Interest"
            value={data.interest}
            isBadge
            delay={DELAYS[3]}
          />
          {data.guests > 0 && (
            <InfoRow label="Guests" value={data.guests} delay={DELAYS[4]} />
          )}
        </div>

        {/* ── Payable amount ── */}
        <div
          className="pc-payable-row pc-fade"
          style={{ animationDelay: "0.38s" }}
        >
          <span className="pc-payable-label">Total Payable</span>
          <span className="pc-payable-amount">
            <span className="pc-payable-currency">BDT</span>
            {totalAmount.toLocaleString()}
          </span>
        </div>

        {/* ── Agreement ── */}
        <label
          className="pc-agreement pc-fade"
          style={{ animationDelay: "0.42s" }}
        >
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          <span className="pc-agreement-text">
            I confirm that all information provided is{" "}
            <strong>accurate and truthful</strong>. I accept responsibility for
            any discrepancy and agree to comply with decisions made by the
            workshop organising committee.
          </span>
        </label>

        {/* ── Submit ── */}
        <button
          className="pc-submit pc-fade"
          style={{ animationDelay: "0.46s" }}
          onClick={handleConfirm}
          disabled={!isChecked || submitting}
        >
          {submitting ? "Processing…" : "Confirm & Pay"}
          {!submitting && <ArrowRight size={13} />}
        </button>
      </div>

      {/* bottom wordmark */}
      <p
        style={{
          position: "relative",
          zIndex: 1,
          marginTop: "1.75rem",
          fontSize: "0.6rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--dust)",
        }}
      >
        Photography Workshop · 2026
      </p>
    </div>
  );
}
