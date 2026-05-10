"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaSquareWhatsapp, FaFacebookF, FaYoutube } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import Link from "next/link";

/* ── design tokens matching the Registration form ── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .pw-footer {
    --ink:      #0A0807;
    --paper:    #F5EDD6;
    --amber:    #C8881A;
    --amber-lt: #E8A030;
    --smoke:    #1A1714;
    --ash:      #2C2824;
    --dust:     #4A4440;
    --mist:     #8C8078;

    background: var(--ink);
    font-family: 'DM Sans', sans-serif;
    color: var(--mist);
    position: relative;
    overflow: hidden;
  }

  /* grain overlay */
  .pw-footer::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    opacity: 0.03;
    pointer-events: none;
  }

  /* top amber rule */
  .pw-footer-rule {
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--amber) 30%, var(--amber-lt) 50%, var(--amber) 70%, transparent 100%);
    opacity: 0.5;
  }

  .pw-footer-inner {
    position: relative;
    z-index: 1;
    max-width: 860px;
    margin: 0 auto;
    padding: 3rem 1.5rem 2rem;
  }

  /* brand block */
  .pw-footer-brand-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    font-size: 0.62rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--amber);
    margin-bottom: 0.6rem;
  }
  .pw-footer-brand-dot {
    width: 4px; height: 4px;
    border-radius: 50%;
    background: var(--amber-lt);
    animation: pw-blink 1.6s ease-in-out infinite;
  }
  @keyframes pw-blink { 0%,100%{opacity:1} 50%{opacity:0.15} }

  .pw-footer-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--paper);
    letter-spacing: -0.01em;
    line-height: 1.2;
  }
  .pw-footer-title em {
    font-style: italic;
    color: var(--amber-lt);
  }
  .pw-footer-tagline {
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--dust);
    margin-top: 0.45rem;
  }

  /* divider between brand and socials on desktop */
  .pw-footer-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    text-align: center;
  }
  @media(min-width: 640px) {
    .pw-footer-body {
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;
      text-align: left;
    }
  }

  /* vertical separator line */
  .pw-footer-sep {
    display: none;
  }
  @media(min-width: 640px) {
    .pw-footer-sep {
      display: block;
      width: 1px;
      align-self: stretch;
      background: linear-gradient(to bottom, transparent, var(--ash), transparent);
      flex-shrink: 0;
    }
  }

  /* admin logo link */
  .pw-footer-admin-slot {
    display: flex;
    width: 100%;
    justify-content: center;
  }
  @media(min-width: 640px) {
    .pw-footer-admin-slot {
      width: auto;
      align-self: stretch;
      align-items: center;
      justify-content: flex-end;
    }
  }
  .pw-footer-admin-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border: 1px solid var(--ash);
    border-radius: 50%;
    background: var(--smoke);
    text-decoration: none;
    transition: border-color 0.2s, transform 0.15s;
    position: relative;
    overflow: hidden;
  }
  .pw-footer-admin-link::before {
    content: '';
    position: absolute;
    inset: 7px;
    border: 1px solid rgba(232,160,48,0.35);
    border-radius: 50%;
  }
  .pw-footer-admin-link:hover {
    border-color: var(--amber);
    transform: translateY(-2px);
  }
  .pw-footer-admin-logo {
    width: 30px;
    height: 30px;
    object-fit: contain;
    position: relative;
    z-index: 1;
  }

  /* social icons */
  .pw-footer-socials {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }
  @media(min-width: 640px){ .pw-footer-socials { align-items: flex-end; } }

  .pw-footer-socials-label {
    font-size: 0.62rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--amber);
    margin-bottom: 0.2rem;
  }
  .pw-footer-icons {
    display: flex;
    gap: 0.6rem;
    align-items: center;
  }
  .pw-footer-icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px; height: 36px;
    border: 1px solid var(--ash);
    border-radius: 2px;
    background: var(--smoke);
    color: var(--mist);
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s, transform 0.15s;
    font-size: 1rem;
  }
  .pw-footer-icon-btn:hover {
    transform: translateY(-2px);
  }
  .pw-footer-icon-btn.wa:hover  { border-color: #22c55e; color: #22c55e; }
  .pw-footer-icon-btn.yt:hover  { border-color: #ef4444; color: #ef4444; }
  .pw-footer-icon-btn.fb:hover  { border-color: #60a5fa; color: #60a5fa; }

  /* bottom bar */
  .pw-footer-bottom {
    position: relative;
    z-index: 1;
    border-top: 1px solid var(--ash);
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    font-size: 0.65rem;
    letter-spacing: 0.12em;
    color: var(--dust);
    text-align: center;
    flex-wrap: wrap;
  }
  .pw-footer-heart { color: #f87171; }

  /* aperture decoration */
  .pw-aperture-deco {
    position: absolute;
    right: -40px; bottom: -40px;
    width: 140px; height: 140px;
    border-radius: 50%;
    border: 1px solid var(--amber);
    opacity: 0.06;
    pointer-events: none;
  }
  .pw-aperture-deco::before {
    content: '';
    position: absolute;
    inset: 14px;
    border-radius: 50%;
    border: 1px solid var(--amber-lt);
  }
`;

const Footer = () => {
  const handleWhatsApp = () => {
    const phone = "8801717224746";
    const message = "Hello! I need help regarding registration or payment.";
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  return (
    <footer className="pw-footer">
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* amber gradient top rule */}
      <div className="pw-footer-rule" />

      {/* main body */}
      <motion.div
        className="pw-footer-inner"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        {/* aperture circle decoration */}
        <div className="pw-aperture-deco" />

        <div className="pw-footer-body">
          {/* ── Brand ── */}
          <div>
            <div className="pw-footer-brand-tag">
              <span className="pw-footer-brand-dot" />
              Photography Workshop 2026
            </div>
            <p className="pw-footer-title">
              Frame Your <em>Vision</em>
            </p>
            <p className="pw-footer-tagline">
              Photography &amp; Cinematography · Bangladesh
            </p>
          </div>

          <div className="pw-footer-sep" />

          {/* ── Admin Login Logo ── */}
          <div className="pw-footer-admin-slot">
            <Link
              href="/admin"
              className="pw-footer-admin-link"
              aria-label="Go to admin login"
              title="Admin Login"
            >
              <img
                src="/favicon.ico"
                alt=""
                aria-hidden="true"
                className="pw-footer-admin-logo"
              />
            </Link>
          </div>

          <div className="pw-footer-sep" />

          {/* ── Socials ── */}
          <div className="pw-footer-socials">
            <p className="pw-footer-socials-label">Connect</p>
            <div className="pw-footer-icons">
              <button
                onClick={handleWhatsApp}
                className="pw-footer-icon-btn wa"
                aria-label="WhatsApp support"
              >
                <FaSquareWhatsapp />
              </button>
              <span
                className="pw-footer-icon-btn yt"
                role="button"
                tabIndex={0}
              >
                <FaYoutube />
              </span>
              <span
                className="pw-footer-icon-btn fb"
                role="button"
                tabIndex={0}
              >
                <FaFacebookF />
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Bottom bar ── */}
      <div className="pw-footer-bottom">
        <span>
          ©&nbsp;{new Date().getFullYear()}&nbsp;Photography Workshop Organizer
          Committee.
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          Made with <FaHeart className="pw-footer-heart" /> by the team.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
