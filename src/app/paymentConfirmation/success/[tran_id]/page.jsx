"use client";

import { useEffect, useState, useRef, forwardRef } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import domtoimage from "dom-to-image-more";
import QRCode from "qrcode";

import {
  Mail,
  Phone,
  Users,
  Shirt,
  UserPlus,
  CreditCard,
  Calendar,
  Car,
  FileDown,
} from "lucide-react";

import { useParams } from "next/navigation";

// Reusable Info Box
function InfoBox({ icon: Icon, label, value }) {
  return (
    <div className="bg-[#1D232F] info-box rounded-lg p-2 text-center">
      <Icon className="w-4 h-4 mx-auto text-[#1DEDF4] icon mb-1" />
      <p className="text-[10px] text-gray-400 uppercase label tracking-wide">{label}</p>
      <p className="text-sm font-semibold text-white value truncate capitalize">{value}</p>
    </div>
  );
}

// ID Card Component
const IDCard = forwardRef(function IDCard({ user, qrImage }, ref) {
  const batch = user.sscCompletion === "yes" ? user["ssc-batch"] : user["hsc-batch"];
  const group = user.sscCompletion === "yes" ? user["ssc-group"] : user["hsc-group"];

  return (
    <div
      ref={ref}
      className="w-[4in] h-[6in] bg-[#0F1319] rounded-xl overflow-hidden border-2 border-linear-to-r from-[#1DEDF4] to-[#9763EE] relative"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {/* Header gradient bar */}
      <div className="h-16 bg-linear-to-r from-[#1DEDF4] to-[#9763EE] relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-black font-bold text-lg tracking-wider uppercase">
            Event Pass
          </span>
        </div>
        <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-primary-foreground/50" />
        <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-primary-foreground/50" />
      </div>

      {/* Main content */}
      <div className="p-4 flex flex-col h-[calc(6in-4rem)]">
        {/* Photo and Name Section */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-linear-to-r from-[#1DEDF4] to-[#9763EE]">
              {user.photo ? (
                <img
                  src={user.photo + "?nocache=" + Date.now()}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                  onError={(e) => { e.target.src = "/fallback.jpg"; }}
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-3xl font-bold text-black">
                    {user.fullName?.charAt(0) || "?"}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold bg-linear-to-r from-[#1DEDF4] to-[#9763EE] bg-clip-text text-transparent truncate gradient-text">
              {user.fullName}
            </h2>
            <div className="flex items-center gap-1 mt-1 text-muted-foreground text-xs">
              <Mail className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5 text-muted-foreground text-xs">
              <Phone className="w-3 h-3 flex-shrink-0" />
              <span>{user.phone}</span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <InfoBox icon={Calendar} label="Batch" value={batch || "N/A"} />
          <InfoBox icon={Users} label="Group" value={group || "N/A"} />
          <InfoBox icon={Shirt} label="T-Shirt" value={user.tshirt} />
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <InfoBox icon={UserPlus} label="Guests" value={user.guests} />
          <InfoBox icon={Car} label="Parking" value={user.parking} />
        </div>

        {/* Payment Section */}
        <div className="bg-gray-600 rounded-lg px-3 py-1 mb-2 payment">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-4 h-4 text-[#1DEDF4]" />
            <span className="font-semibold text-sm">Payment</span>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  user.paymentStatus ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                }`}
              >
                {user.paymentStatus ? "✓ Paid" : "✗ Not Paid"}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400">Total</span>
              <p className="font-bold text-lg bg-linear-to-r from-[#1DEDF4] to-[#9763EE] bg-clip-text text-transparent gradient-text">
                BDT {user.totalAmount}
              </p>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="mt-auto flex items-center justify-between p-1 border-t border-border">
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-white gradient-text">Scan to verify</p>
            <p>Present at entry</p>
          </div>
          <div className="w-20 h-20 rounded-lg p-1">
            <img
              src={qrImage}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              alt="QR Code"
              className="w-full h-full rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Bottom decorative bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 id-card-gradient" />
    </div>
  );
});

export default function ProfileCardPage() {
  const [user, setUser] = useState(null);
  const [qrImage, setQrImage] = useState("");
  const pdfRef = useRef(null);
  const { tran_id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`https://reunion-cpscm-server.vercel.app/verifyUser/${tran_id}`);
        setUser(res.data);
        const qr = await QRCode.toDataURL(`https://reunion-cpscm.vercel.app/verifyUser/${tran_id}`);
        setQrImage(qr);
      } catch (err) {
        console.error("Error:", err);
      }
    };
    if (tran_id) fetchData();
  }, [tran_id]);

  const handleDownloadPDF = async () => {
    const element = pdfRef.current;
    if (!element || !user) return;

 // Backup styles and remove borders/outlines/shadows
const backup = [];
Array.from(element.querySelectorAll("*")).forEach((el) => {
  backup.push({
    el,
    border: el.style.border,
    outline: el.style.outline,
    boxShadow: el.style.boxShadow,
    background: el.style.background,
    color: el.style.color,
  });

  el.style.border = "none";
  el.style.outline = "none";
  el.style.boxShadow = "none";
});

// Set InfoBox background light gray and text black
Array.from(element.querySelectorAll(".info-box")).forEach((el) => {
  el.style.border = "1px solid black";
  el.style.background = "none"; // light gray
  el.style.color = "black";
});
    
// Select all icons, labels, and value elements inside InfoBox
Array.from(element.querySelectorAll(".info-box svg, .info-box p")).forEach((el) => {
  el.style.color = "black";
});
    
Array.from(element.querySelectorAll(".payment")).forEach((el) => {
  el.style.border = "1px solid black";
  el.style.background = "none"; // light gray
  el.style.color = "black";
});
    
Array.from(element.querySelectorAll(".gradient-text")).forEach((el) => {
  el.style.color = "black";
});



    try {
      const dataUrl = await domtoimage.toPng(element, { quality: 1, bgcolor: "transparent" });
      const pdf = new jsPDF({ orientation: "portrait", unit: "in", format: [4, 6] });
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => (img.onload = resolve));
      pdf.addImage(dataUrl, "PNG", 0, 0, 4, 6);
      pdf.save(`${user.fullName}-event-pass.pdf`);
    } catch (err) {
      console.error("PDF error:", err);
    } finally {
      // Restore original styles
      backup.forEach(({ el, border, outline, boxShadow }) => {
        el.style.border = border;
        el.style.outline = outline;
        el.style.boxShadow = boxShadow;
      });
    }
  };

  if (!user) return <p className="text-center mt-8 text-foreground">Loading...</p>;

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 flex flex-col items-center bg-[#0F1319]">
      <button
        onClick={handleDownloadPDF}
        className="mb-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-3 rounded-lg transition flex items-center gap-2 shadow-lg"
      >
        <FileDown className="w-5 h-5" /> Download PDF
      </button>

      <IDCard ref={pdfRef} user={user} qrImage={qrImage} />
    </div>
  );
}
