"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function PaymentConfirmation() {
  const [data, setData] = useState(null);
  // const [preview, setPreview] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("formData");
    // const previewUrl = localStorage.getItem("preview");

    if (stored) {
      setData(JSON.parse(stored));
    }

    // console.log(data);

    // setPreview(previewUrl);
  }, []);

  if (!data) return <p className="p-10 text-center">Loading...</p>;

const handleConfirm = async () => {
  try {
    const payload = { ...data };

    const res = await axios.post(
      "https://reunion-cpscm-server.vercel.app/register",
      payload
    );
    
    // console.log(res);

    if (res.data?.url) {
      window.location.href = res.data?.url

      // OPTIONAL: clear form data from localStorage
      // localStorage.removeItem("formData");

      // OPTIONAL: redirect to payment page
      // window.location.href = "/payment-gateway";
      return;
    }

    // If server didn't return insertedId
    alert("Registration failed. Please try again.");
    
  } catch (error) {
    console.error("Error saving applicant:", error);
    alert("Something went wrong!");
  }
};


  return (
    <div className="min-h-screen bg-[#0F1319] p-6 flex justify-center">
      <Card className="max-w-lg w-full p-6 glass border-border/50 shadow-lg bg-[#13171E] text-white">
        <h1 className="text-2xl font-bold text-center mb-4 bg-linear-to-r from-[#1DEDF4] to-[#9763EE] bg-clip-text text-transparent">
          Payment Confirmation
        </h1>

        {/* IMAGE */}
        {data?.photo && (
          <div className="w-full flex justify-center mb-4">
            <img
              src={data?.photo}
              alt="Preview"
              className="h-40 w-40 object-cover rounded-lg border"
            />
          </div>
        )}

        {/* INFO */}
        <div className="space-y-3">
          <Info label="Full Name" value={data.fullName} />
          <Info label="Email" value={data.email} />
          <Info label="Phone" value={data.phone} />
          <Info label="Address" value={data.address} />
          <Info label="T-Shirt Size" value={data.tshirt} />
          <Info label="Guests" value={data.guests} />
          <Info label="Payable Amount" value={1700+data.guests*1000} />
        </div>

        <div>
          <h1 className="text-red-600 text-center">
         I hereby confirm that all information provided during my registration is accurate and truthful. I acknowledge that I am fully responsible for any discrepancy or issue arising from this information, and I agree to comply with any decision made by CPSCM and the organizing committee.
          </h1>
        </div>

        {/* BUTTON */}
        <Button
          onClick={handleConfirm}
          className="w-full mt-6 bg-[#1DEDF4] text-primary-foreground py-4 text-lg"
        >
          Confirm & Pay
        </Button>
      </Card>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between border-b border-border/30 pb-2">
      <span className="font-semibold">{label}</span>
      <span>{value || "---"}</span>
    </div>
  );
}
