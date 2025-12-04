"use client"
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import domtoimage from "dom-to-image-more";
import QRCode from "qrcode";
import { useParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Users, Shirt, UserPlus, CreditCard, Calendar } from "lucide-react";

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-4 p-4 border rounded-lg bg-muted">
    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-muted-foreground/20">
      <Icon className="w-5 h-5 text-foreground" />
    </div>
    <div className="flex-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-semibold break-words">{value}</p>
    </div>
  </div>
);

export default function ProfileCardPage() {
  const [user, setUser] = useState(null);
  const [qrImage, setQrImage] = useState("");
  const pdfRef = useRef(null);
  const { tran_id } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`https://reunion-cpscm-server.vercel.app/verifyUser/${tran_id}`);
        setUser(res.data);

        const verifyURL = `https://reunion-cpscm.vercel.app/verifyUser/${tran_id}`;
        const qr = await QRCode.toDataURL(verifyURL);
        setQrImage(qr);
      } catch (err) {
        console.error("Fetch user error:", err);
      }
    };
    if (tran_id) {
      fetchUser();
    }
  }, [tran_id]);

 const handleDownloadPDF = async () => {
  const element = pdfRef.current;
  if (!element || !user) return;

  try {
    // Remove all backgrounds, borders, and shadows
      Array.from(element.querySelectorAll("*")).forEach((el) => {
        el.style.background = "#F3F4F6";
        el.style.padding = "10px";
        el.style.borderRadius = "10px"; // ✅ corrected
        el.style.border = "none";
        el.style.boxShadow = "none";
        el.style.outline = "none";
        el.style.color = "black";
      });
    
    Array.from(element.querySelectorAll(".badge")).forEach((el) => {
      el.style.backgroundColor = "black";
      el.style.color = "white";
    });



    // Convert DOM to image
    const dataUrl = await domtoimage.toPng(element, {
      quality: 1,
      bgcolor: "#ffffff", // PDF background
      style: {
        transform: "scale(1)",
        transformOrigin: "top left",
        border: "none",
        boxShadow: "none",
        background: "transparent",
      },
    });

    const img = new Image();
    img.src = dataUrl;
    await new Promise((resolve) => (img.onload = resolve));

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const maxWidth = pageWidth - margin * 2;
    const maxHeight = pageHeight - margin * 2;

    const imgRatio = img.width / img.height;
    const pageRatio = maxWidth / maxHeight;

    let finalWidth, finalHeight;
    if (imgRatio > pageRatio) {
      finalWidth = maxWidth;
      finalHeight = maxWidth / imgRatio;
    } else {
      finalHeight = maxHeight;
      finalWidth = maxHeight * imgRatio;
    }

    const x = (pageWidth - finalWidth) / 2;
    const y = (pageHeight - finalHeight) / 2; // Center vertically

    pdf.addImage(dataUrl, "PNG", x, y, finalWidth, finalHeight);
    pdf.save(`${user.fullName}-registration.pdf`);
  } catch (err) {
    console.error("PDF generation error:", err);
  }
};


  if (!user) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="p-4 sm:p-6 md:p-8 flex flex-col items-center bg-[#0F1319]">
      <button
        onClick={handleDownloadPDF}
        className="mb-4 bg-[#1DEDF4] hover:bg-[#1DEDF4]/90 text-gray-800 font-bold px-4 py-2 rounded transition"
      >
        Download PDF
      </button>

      <div className="w-full max-w-4xl space-y-6">
        <Card ref={pdfRef} className="pdf-safe border border-gray-600 shadow-none bg-[#13171E] glass">
          <CardHeader className="text-center pb-0">
            {user.photo && (
                <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full overflow-hidden border-4 border-purple-600 shadow-md">
                  <img
                    src={user.photo + "?nocache=" + Date.now()}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.target.src = "/fallback.jpg";
                    }}
                  />
                </div>
              )}

            <CardTitle className="text-2xl bg-linear-to-r from-[#1DEDF4] to-[#9763EE] bg-clip-text text-transparent md:text-4xl font-medium">{user.fullName}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem icon={Mail} label="Email" value={user.email} />
              <InfoItem icon={Phone} label="Phone" value={user.phone} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InfoItem
                icon={Calendar}
                label="Batch"
                value={user.sscCompletion === "yes" ? user["ssc-batch"] : user["hsc-batch"]}
              />
              <InfoItem
                icon={Users}
                label="Group"
                value={user.sscCompletion === "yes" ? user["ssc-group"] : user["hsc-group"]}
              />
              <InfoItem icon={Shirt} label="T-Shirt Size" value={user.tshirt} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <InfoItem icon={UserPlus} label="Guests" value={user.guests} />
              <InfoItem icon={UserPlus} label="Parking" value={user.parking} />
              <div className="text-center">
                <img
                  src={qrImage}
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                  alt="QR Code"
                  className="w-24 md:w-32 mx-auto"
                />
                <p className="text-xs text-white mt-1">Scan to verify</p>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-gray-200">
              <h3 className="text-lg md:text-xl font-bold flex items-center gap-2 mb-3">
                <CreditCard className="w-5 h-5" /> Payment Details
              </h3>
              <div className="flex justify-between mb-2">
                <span>Status</span>
                <Badge className={`${user.paymentStatus ? "bg-green-600" : "bg-destructive"} text-white px-2 py-1 rounded badge`}>
                  {user.paymentStatus ? "✓ Paid" : "✗ Not Paid"}
                </Badge>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="whitespace-nowrap">Total Amount</span>
                <span className="text-lg md:text-xl font-bold whitespace-nowrap">BDT {user.totalAmount}</span>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>
        {/* PDF-only styles: remove backgrounds, borders, shadows, force wrapping and fixed width for stable capture */}
      <style jsx>{`
        .pdf-safe {
          /* fixed capture width to make dom-to-image consistent */
          width: 800px !important;
          padding: 16px !important;
        }

        /* remove backgrounds, borders and shadows inside the pdf snapshot only */
        .pdf-safe, .pdf-safe * {
          background: transparent !important;
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
          outline: none !important;
          -webkit-box-shadow: none !important;
        }

        /* ensure text wraps and does not overflow */
        .pdf-safe * {
          color: #000 !important;
          max-width: 100% !important;
          overflow-wrap: break-word !important;
          word-wrap: break-word !important;
          hyphens: auto !important;
          white-space: normal !important;
        }

        /* specific fix for elements that used borders or background in markup */
        .pdf-safe .border,
        .pdf-safe [class*="border-"] {
          border: none !important;
        }
        .pdf-safe [class*="bg-"] {
          background: transparent !important;
        }

        /* remove rounded clipping if you want pure rectangle in PDF - optional */
        .pdf-safe .rounded-full,
        .pdf-safe .rounded-lg,
        .pdf-safe .rounded {
          border-radius: 0 !important;
        }
      `}</style>


    </div>
  );
}