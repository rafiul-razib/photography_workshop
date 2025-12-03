"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import QRCode from "qrcode";
import { useParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Users, Shirt, UserPlus, CreditCard, Calendar } from "lucide-react";

export default function ProfileCardPage() {
  const [user, setUser] = useState(null);
  const [qrImage, setQrImage] = useState("");
  const pdfRef = useRef();
  const { tran_id } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/verifyUser/${tran_id}`);
        setUser(res.data);

        const verifyURL = `http://localhost:3000/verifyUser/${tran_id}`;
        const qr = await QRCode.toDataURL(verifyURL);
        setQrImage(qr);
      } catch (err) {
        console.error("Fetch user error:", err);
      }
    };
    fetchUser();
  }, [tran_id]);

  const handleDownloadPDF = () => {
  const element = pdfRef.current;

  const options = {
  margin: 0.5,
  filename: `${user.name}-registration.pdf`,
  image: { type: "jpeg", quality: 1 },
  html2canvas: {
    scale: 2,
    useCORS: true,
    allowTaint: true,
  },
  jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
};


  html2pdf().set(options).from(element).save();
  };
  

  
  if (!user) return <p className="text-center mt-8">Loading...</p>;

  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-4 p-4 border rounded-lg bg-gray-100">
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200">
        <Icon className="w-5 h-5 text-gray-800" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold break-words">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 flex flex-col items-center">
      <button
        onClick={handleDownloadPDF}
        className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
      >
        Download PDF
      </button>

      {/* Screen Preview */}
      <div className="w-full max-w-4xl space-y-6">
        <Card ref={pdfRef} className="border shadow-lg">
          <CardHeader className="text-center pb-6">
            {user.photo && (
              <img
                src={user.photo}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                alt={user.name}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover mx-auto border-4 border-green-500 shadow-md"
              />
            )}
            <CardTitle className="text-2xl md:text-4xl font-bold mt-2">{user.name}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem icon={Mail} label="Email" value={user.email} />
              <InfoItem icon={Phone} label="Phone" value={user.phone} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InfoItem icon={Calendar} label="Batch" value={user.sscCompletion === "yes" ? user["ssc-batch"] : user["hsc-batch"]} />
              <InfoItem icon={Users} label="Group" value={user.sscCompletion === "yes" ? user["ssc-group"] : user["hsc-group"]} />
              <InfoItem icon={Shirt} label="T-Shirt Size" value={user.tshirt} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <InfoItem icon={UserPlus} label="Guests" value={user.guests} />
              <InfoItem icon={UserPlus} label="Parking" value={user.parking} />
              <div className="text-center">
                <img src={qrImage} crossOrigin="anonymous" referrerPolicy="no-referrer" alt="QR Code" className="w-24 md:w-32 mx-auto" />
                <p className="text-xs text-gray-500 mt-1">Scan to verify</p>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-gray-50">
              <h3 className="text-lg md:text-xl font-bold flex items-center gap-2 mb-3">
                <CreditCard className="w-5 h-5" /> Payment Details
              </h3>
              <div className="flex justify-between mb-2">
                <span>Status</span>
                <Badge className={`${user.paymentStatus ? "bg-green-600" : "bg-red-600"} text-white px-2 py-1 rounded`}>
                  {user.paymentStatus ? "✓ Paid" : "✗ Not Paid"}
                </Badge>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span>Total Amount</span>
                <span className="text-lg md:text-2xl font-bold">BDT {user.totalAmount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

     
    </div>
  );
}
