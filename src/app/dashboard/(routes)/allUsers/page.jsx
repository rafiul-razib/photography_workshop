"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaUserCheck, FaUsers } from "react-icons/fa";
import { MdOutlinePayments } from "react-icons/md";
import { RiPrinterLine, RiRefreshLine } from "react-icons/ri";
import { Camera, Mail, Phone, AlertCircle } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/* ── palette ── */
const C = {
  navy: "#0B1628",
  navy2: "#0E1D35",
  navy3: "#071020",
  orange: "#F07A10",
  orangeD: "#C8600A",
  white: "#FFFFFF",
  gray: "#7A8A9A",
  ash: "#1A2A40",
  mist: "#4A6080",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  .au-root { font-family:'DM Sans',sans-serif; }

  /* ── PAGE HEADER ── */
  .au-header {
    position:relative; overflow:hidden;
    border:1px solid rgba(240,122,16,0.18);
    border-radius:2px;
    background:${C.navy};
    padding:1.75rem 2rem;
    margin-bottom:1.5rem;
  }
  .au-header::before, .au-header::after {
    content:''; position:absolute;
    width:22px; height:22px;
    border-color:${C.orange}; border-style:solid; opacity:0.45;
  }
  .au-header::before { top:14px; left:14px; border-width:1px 0 0 1px; }
  .au-header::after  { bottom:14px; right:14px; border-width:0 1px 1px 0; }

  .au-header-glow-a {
    position:absolute; top:-40px; right:-40px;
    width:180px; height:180px; border-radius:50%;
    background:radial-gradient(circle,rgba(240,100,0,0.2) 0%,transparent 70%);
    pointer-events:none;
  }
  .au-header-glow-b {
    position:absolute; bottom:-30px; left:60px;
    width:140px; height:140px; border-radius:50%;
    background:radial-gradient(circle,rgba(20,70,180,0.2) 0%,transparent 70%);
    pointer-events:none;
  }

  .au-eyebrow {
    display:inline-flex; align-items:center; gap:0.4rem;
    font-size:0.6rem; letter-spacing:0.22em; text-transform:uppercase;
    color:${C.orange}; border:1px solid rgba(240,122,16,0.3);
    border-radius:2px; padding:0.3rem 0.75rem;
    background:rgba(240,122,16,0.07); margin-bottom:0.75rem;
  }
  .au-eyebrow-dot {
    width:5px; height:5px; border-radius:50%; background:${C.orange};
    animation:aublink 1.5s ease-in-out infinite;
  }
  @keyframes aublink{0%,100%{opacity:1}50%{opacity:0.15}}

  .au-title {
    font-family:'Playfair Display',serif;
    font-size:clamp(1.6rem,3vw,2.2rem); font-weight:900;
    letter-spacing:-0.02em; color:${C.white}; margin-bottom:0.4rem;
  }
  .au-title em { font-style:italic; color:${C.orange}; }
  .au-print-title { display:none; }
  .au-subtitle {
    font-size:0.75rem; color:${C.gray}; line-height:1.6; max-width:560px;
  }

  .au-refresh-btn {
    display:inline-flex; align-items:center; gap:0.45rem;
    padding:0.6rem 1.2rem;
    background:rgba(240,122,16,0.08);
    border:1px solid rgba(240,122,16,0.3); border-radius:2px;
    font-family:'DM Sans',sans-serif; font-size:0.7rem;
    letter-spacing:0.14em; text-transform:uppercase;
    color:${C.orange}; font-weight:500; cursor:pointer;
    transition:background 0.18s, border-color 0.18s;
    white-space:nowrap;
  }
  .au-refresh-btn:hover { background:rgba(240,122,16,0.15); border-color:rgba(240,122,16,0.5); }
  .au-refresh-btn:disabled { opacity:0.4; cursor:not-allowed; }
  .au-spin { animation:auspin 0.9s linear infinite; }
  @keyframes auspin { to{transform:rotate(360deg)} }

  /* ── STAT CARDS ── */
  .au-stats { display:grid; gap:0.75rem; margin-bottom:1.5rem; }
  @media(min-width:480px){ .au-stats { grid-template-columns:1fr 1fr; } }
  @media(min-width:900px){ .au-stats { grid-template-columns:repeat(4,1fr); } }

  .au-stat {
    position:relative;
    background:${C.navy}; border:1px solid rgba(240,122,16,0.15);
    border-radius:2px; padding:1.2rem 1.25rem; overflow:hidden;
  }
  .au-stat::before, .au-stat::after {
    content:''; position:absolute;
    width:14px; height:14px;
    border-color:${C.orange}; border-style:solid; opacity:0.3;
  }
  .au-stat::before { top:8px; left:8px; border-width:1px 0 0 1px; }
  .au-stat::after  { bottom:8px; right:8px; border-width:0 1px 1px 0; }

  .au-stat-label {
    font-size:0.58rem; letter-spacing:0.2em; text-transform:uppercase;
    color:${C.gray}; margin-bottom:0.75rem;
    display:flex; align-items:center; justify-content:space-between;
  }
  .au-stat-icon {
    width:28px; height:28px; border-radius:4px;
    border:1px solid rgba(240,122,16,0.25);
    background:rgba(240,122,16,0.08);
    display:flex; align-items:center; justify-content:center;
  }
  .au-stat-value {
    font-family:'Playfair Display',serif;
    font-size:2.4rem; font-weight:900;
    color:${C.white}; line-height:1; letter-spacing:-0.02em;
  }
  .au-stat-helper {
    font-size:0.65rem; color:${C.mist};
    letter-spacing:0.06em; margin-top:0.3rem;
  }
  /* accent colour variants */
  .au-stat.paid   .au-stat-icon { border-color:rgba(74,222,128,0.3); background:rgba(74,222,128,0.08); }
  .au-stat.paid   .au-stat-value { color:#4ADE80; }
  .au-stat.pending .au-stat-icon { border-color:rgba(251,191,36,0.3); background:rgba(251,191,36,0.08); }
  .au-stat.pending .au-stat-value { color:#FBBF24; }
  .au-stat.photo   .au-stat-icon { border-color:rgba(147,112,219,0.3); background:rgba(147,112,219,0.08); }

  /* ── TABLE CARD ── */
  .au-table-card {
    background:${C.navy};
    border:1px solid rgba(240,122,16,0.15);
    border-radius:2px; overflow:hidden;
  }

  .au-table-head {
    display:flex; flex-direction:column; gap:0.6rem;
    padding:1.1rem 1.25rem 1rem;
    border-bottom:1px solid rgba(240,122,16,0.1);
  }
  @media(min-width:560px){
    .au-table-head { flex-direction:row; align-items:center; justify-content:space-between; }
  }

  .au-table-title {
    font-family:'Playfair Display',serif;
    font-size:1.05rem; font-weight:700; color:${C.white};
  }
  .au-table-title em { font-style:italic; color:${C.orange}; }
  .au-table-sub {
    font-size:0.65rem; color:${C.gray}; margin-top:1px;
    letter-spacing:0.04em;
  }

  .au-count-badge {
    display:inline-flex; align-items:center; gap:0.35rem;
    font-size:0.6rem; letter-spacing:0.18em; text-transform:uppercase;
    color:${C.orange}; border:1px solid rgba(240,122,16,0.3);
    border-radius:2px; padding:0.28rem 0.7rem;
    background:rgba(240,122,16,0.07); white-space:nowrap; flex-shrink:0;
  }

  /* ── TABLE ── */
  .au-table-wrap { overflow-x:auto; }
  table.au-table { width:100%; border-collapse:collapse; }

  .au-table thead tr {
    background:rgba(7,16,32,0.8);
    border-bottom:1px solid rgba(240,122,16,0.12);
  }
  .au-table th {
    padding:0.75rem 1rem;
    font-size:0.58rem; letter-spacing:0.18em; text-transform:uppercase;
    color:${C.gray}; font-weight:500; white-space:nowrap; text-align:left;
  }
  .au-table th:first-child { padding-left:1.25rem; }
  .au-table th:last-child  { padding-right:1.25rem; }

  .au-table tbody tr {
    border-bottom:1px solid rgba(255,255,255,0.04);
    transition:background 0.15s;
  }
  .au-table tbody tr:last-child { border-bottom:none; }
  .au-table tbody tr:hover { background:rgba(240,122,16,0.04); }

  .au-table td {
    padding:0.75rem 1rem; font-size:0.8rem;
    color:rgba(200,215,230,0.85); white-space:nowrap; vertical-align:middle;
  }
  .au-table td:first-child { padding-left:1.25rem; }
  .au-table td:last-child  { padding-right:1.25rem; }

  /* avatar */
  .au-avatar {
    width:34px; height:34px; border-radius:50%;
    border:1.5px solid rgba(240,122,16,0.45);
    overflow:hidden; background:${C.ash};
    display:flex; align-items:center; justify-content:center;
    flex-shrink:0; font-size:0.75rem; font-weight:700; color:${C.orange};
  }
  .au-avatar img { width:100%; height:100%; object-fit:cover; display:block; }

  .au-name-cell { display:flex; align-items:center; gap:0.65rem; }
  .au-name-text {
    font-weight:500; color:${C.white};
    overflow:hidden; text-overflow:ellipsis; max-width:160px;
  }

  /* badges */
  .au-badge-paid {
    display:inline-flex; align-items:center; gap:0.3rem;
    font-size:0.62rem; letter-spacing:0.12em; text-transform:uppercase;
    font-weight:600; color:#4ADE80;
    border:1px solid rgba(74,222,128,0.28); border-radius:2px;
    padding:0.18rem 0.6rem; background:rgba(74,222,128,0.07);
  }
  .au-badge-pending {
    display:inline-flex; align-items:center; gap:0.3rem;
    font-size:0.62rem; letter-spacing:0.12em; text-transform:uppercase;
    font-weight:600; color:#FBBF24;
    border:1px solid rgba(251,191,36,0.28); border-radius:2px;
    padding:0.18rem 0.6rem; background:rgba(251,191,36,0.07);
  }
  .au-badge-interest {
    font-size:0.6rem; letter-spacing:0.12em; text-transform:uppercase;
    color:${C.orange}; border:1px solid rgba(240,122,16,0.3);
    border-radius:2px; padding:0.18rem 0.55rem;
    background:rgba(240,122,16,0.07);
  }

  /* states */
  .au-state-box {
    padding:3.5rem 1rem; text-align:center;
    display:flex; flex-direction:column; align-items:center; gap:0.85rem;
  }
  .au-state-label {
    font-size:0.68rem; letter-spacing:0.18em; text-transform:uppercase; color:${C.gray};
  }
  .au-error-box {
    margin:1.25rem; padding:1rem 1.25rem;
    border:1px solid rgba(248,113,113,0.3); border-radius:2px;
    background:rgba(248,113,113,0.06);
    display:flex; align-items:center; gap:0.75rem;
    font-size:0.75rem; color:#F87171;
  }

  /* aperture spinner */
  .au-spinner {
    position:relative; width:44px; height:44px; flex-shrink:0;
  }
  .au-spinner-ring {
    position:absolute; inset:0; border-radius:50%;
    border:1.5px solid ${C.orange}; border-top-color:transparent;
    animation:auspin 1.8s linear infinite;
  }
  .au-spinner-ring2 {
    position:absolute; inset:8px; border-radius:50%;
    border:1px solid rgba(240,122,16,0.4); border-top-color:transparent;
    animation:auspin 1.1s linear infinite reverse;
  }

  /* row index number */
  .au-row-num {
    font-size:0.6rem; color:${C.mist};
    letter-spacing:0.06em; min-width:18px; text-align:right;
  }

  @media print {
    @page { margin: 14mm; }

    body {
      background: #fff !important;
      color: #000 !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .au-root {
      max-width: none !important;
      margin: 0 !important;
      color: #000 !important;
      background: #fff !important;
      font-family: Arial, sans-serif !important;
    }

    .au-header,
    .au-table-card {
      border: 0 !important;
      background: #fff !important;
      color: #000 !important;
      box-shadow: none !important;
    }

    .au-header {
      padding: 0 0 12px !important;
      margin-bottom: 12px !important;
      border-bottom: 2px solid #000 !important;
    }

    .au-header::before,
    .au-header::after,
    .au-header-glow-a,
    .au-header-glow-b,
    .au-eyebrow,
    .au-refresh-btn,
    .au-print-btn,
    .au-table-head,
    .au-avatar,
    .au-badge-interest {
      display: none !important;
    }

    .au-stats {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 10px 18px !important;
      margin: 0 0 12px !important;
      padding-bottom: 10px !important;
      border-bottom: 1px solid #000 !important;
      background: #fff !important;
      color: #000 !important;
    }

    .au-stat {
      display: inline-flex !important;
      align-items: baseline !important;
      gap: 5px !important;
      border: 0 !important;
      background: transparent !important;
      padding: 0 !important;
      color: #000 !important;
    }

    .au-stat::before,
    .au-stat::after,
    .au-stat-icon,
    .au-stat-helper {
      display: none !important;
    }

    .au-stat-label,
    .au-stat-value {
      display: inline !important;
      color: #000 !important;
      font-family: Arial, sans-serif !important;
      font-size: 11px !important;
      font-weight: 700 !important;
      letter-spacing: 0 !important;
      text-transform: none !important;
      margin: 0 !important;
      line-height: 1.3 !important;
    }

    .au-stat-label::after {
      content: ":";
    }

    .au-title,
    .au-title em,
    .au-subtitle,
    .au-table td,
    .au-table th,
    .au-name-text,
    .au-row-num {
      color: #000 !important;
    }

    .au-title {
      display: none !important;
    }

    .au-print-title {
      display: block !important;
      color: #000 !important;
      font-family: Arial, sans-serif !important;
      font-size: 22px !important;
      font-weight: 700 !important;
      margin: 0 0 4px !important;
    }

    .au-subtitle {
      font-size: 11px !important;
      max-width: none !important;
    }

    .au-table-wrap {
      overflow: visible !important;
    }

    table.au-table {
      width: 100% !important;
      border-collapse: collapse !important;
      font-size: 10px !important;
    }

    .au-table thead tr {
      background: #fff !important;
      border-bottom: 1px solid #000 !important;
    }

    .au-table tbody tr {
      border-bottom: 1px solid #999 !important;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .au-table th,
    .au-table td {
      padding: 6px 8px !important;
      border: 1px solid #999 !important;
      white-space: normal !important;
      vertical-align: top !important;
    }

    .au-name-cell {
      display: block !important;
    }

    .au-name-text {
      max-width: none !important;
      overflow: visible !important;
      text-overflow: initial !important;
    }

    .au-badge-paid,
    .au-badge-pending {
      border: 0 !important;
      background: transparent !important;
      color: #000 !important;
      padding: 0 !important;
      letter-spacing: 0 !important;
      text-transform: none !important;
    }
  }
`;

/* ─── STAT CARD ─── */
function StatCard({
  label,
  value,
  helper,
  icon: Icon,
  iconColor,
  variant,
  delay,
}) {
  return (
    <motion.div
      className={`au-stat ${variant || ""}`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.32 }}
    >
      <div className="au-stat-label">
        {label}
        <span className="au-stat-icon">
          <Icon size={13} color={iconColor || C.orange} />
        </span>
      </div>
      <div className="au-stat-value">{value}</div>
      <div className="au-stat-helper">{helper}</div>
    </motion.div>
  );
}

export default function AllParticipants() {
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await axios.get(`${API_BASE_URL}/allRegisteredMembers`);
      setAllUsers(res.data);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to load participants. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePrint = () => {
    const currentTitle = document.title;

    document.title = "Workshop 2026";
    window.print();
    document.title = currentTitle;
  };

  const paidUsers = allUsers.filter((u) => u.paymentStatus).length;
  const pendingUsers = allUsers.length - paidUsers;
  const withPhoto = allUsers.filter((u) => u.photo).length;

  return (
    <section className="au-root" style={{ maxWidth: 1200, margin: "0 auto" }}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* ── PAGE HEADER ── */}
      <div className="au-header">
        <div className="au-header-glow-a" />
        <div className="au-header-glow-b" />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <div>
              <div className="au-eyebrow">
                <span className="au-eyebrow-dot" />
                <FaUsers size={9} />
                Participant Management
              </div>
              <h1 className="au-title">
                All <em>Participants</em>
              </h1>
              <h1 className="au-print-title">Workshop 2026</h1>
              <p className="au-subtitle">
                Review registrations, monitor payment status, and keep the
                workshop participant list ready for on-site verification.
              </p>
            </div>
            <button
              className="au-refresh-btn"
              onClick={fetchData}
              disabled={isLoading}
            >
              <RiRefreshLine size={13} className={isLoading ? "au-spin" : ""} />
              Refresh
            </button>
            <button
              className="au-refresh-btn au-print-btn"
              onClick={handlePrint}
              disabled={isLoading || allUsers.length === 0}
            >
              <RiPrinterLine size={13} />
              Print List
            </button>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="au-stats">
        <StatCard
          label="Total"
          value={allUsers.length}
          helper="Registered participants"
          icon={FaUsers}
          iconColor={C.orange}
          delay={0}
        />
        <StatCard
          label="Paid"
          value={paidUsers}
          helper="Verified payments"
          icon={FaUserCheck}
          iconColor="#4ADE80"
          variant="paid"
          delay={0.06}
        />
        <StatCard
          label="Pending"
          value={pendingUsers}
          helper="Awaiting payment"
          icon={MdOutlinePayments}
          iconColor="#FBBF24"
          variant="pending"
          delay={0.12}
        />
        <StatCard
          label="Photos"
          value={withPhoto}
          helper="With profile photo"
          icon={Camera}
          iconColor="#9370DB"
          variant="photo"
          delay={0.18}
        />
      </div>

      {/* ── TABLE CARD ── */}
      <div className="au-table-card">
        {/* table header */}
        <div className="au-table-head">
          <div>
            <h2 className="au-table-title">
              Registered <em>Members</em>
            </h2>
            <p className="au-table-sub">
              Live records from the registration database
            </p>
          </div>
          <span className="au-count-badge">
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: isLoading ? C.gray : C.orange,
                display: "inline-block",
                animation: isLoading ? "aublink 1s ease infinite" : "none",
              }}
            />
            {isLoading ? "Syncing…" : `${allUsers.length} Records`}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {/* Loading */}
          {isLoading && (
            <div className="au-state-box">
              <div className="au-spinner">
                <div className="au-spinner-ring" />
                <div className="au-spinner-ring2" />
              </div>
              <span className="au-state-label">Developing the roster…</span>
            </div>
          )}

          {/* Error */}
          {!isLoading && error && (
            <div className="au-error-box">
              <AlertCircle
                size={16}
                color="#F87171"
                style={{ flexShrink: 0 }}
              />
              {error}
            </div>
          )}

          {/* Empty */}
          {!isLoading && !error && allUsers.length === 0 && (
            <div className="au-state-box">
              <Camera size={28} color={C.mist} />
              <span className="au-state-label">No participants found</span>
            </div>
          )}

          {/* Table */}
          {!isLoading && !error && allUsers.length > 0 && (
            <motion.div
              className="au-table-wrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <table className="au-table">
                <thead>
                  <tr>
                    <th style={{ width: 32 }}>#</th>
                    <th>Participant</th>
                    <th>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Mail size={10} />
                        Email
                      </span>
                    </th>
                    <th>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Phone size={10} />
                        Mobile
                      </span>
                    </th>
                    <th>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Camera size={10} />
                        Interest
                      </span>
                    </th>
                    <th>Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((user, idx) => (
                    <motion.tr
                      key={user._id || user.email}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: Math.min(idx * 0.03, 0.6),
                        duration: 0.25,
                      }}
                    >
                      {/* row number */}
                      <td>
                        <span className="au-row-num">{idx + 1}</span>
                      </td>

                      {/* name + avatar */}
                      <td>
                        <div className="au-name-cell">
                          <div className="au-avatar">
                            {user.photo ? (
                              <img
                                src={user.photo}
                                alt={user.fullName}
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            ) : (
                              user.fullName?.charAt(0) || "?"
                            )}
                          </div>
                          <span className="au-name-text">
                            {user.fullName || "—"}
                          </span>
                        </div>
                      </td>

                      {/* email */}
                      <td style={{ color: C.gray, maxWidth: 200 }}>
                        <span
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "block",
                          }}
                        >
                          {user.email || "—"}
                        </span>
                      </td>

                      {/* phone */}
                      <td style={{ color: C.gray }}>{user.phone || "—"}</td>

                      {/* interest */}
                      <td>
                        {user.interest ? (
                          <span className="au-badge-interest">
                            {user.interest}
                          </span>
                        ) : (
                          <span style={{ color: C.mist }}>—</span>
                        )}
                      </td>

                      {/* payment */}
                      <td>
                        {user.paymentStatus ? (
                          <span className="au-badge-paid">✓ Paid</span>
                        ) : (
                          <span className="au-badge-pending">Pending</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
