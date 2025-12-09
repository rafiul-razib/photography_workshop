"use client"
import { XCircle, RefreshCw, Headset } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const PaymentFailed = () => {

   const handleWhatsApp = () => {
    const phone = "8801717224746"; // your number without +
    const message = "Hello! I need help regarding CPSCM registration payment failure."; 
    const encoded = encodeURIComponent(message);

    window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Error Icon */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
          <div className="relative flex items-center justify-center w-full h-full">
            <XCircle className="w-24 h-24 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" strokeWidth={1.5} />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Payment Failed
          </h1>
          <p className="text-slate-400 text-lg">
            We couldn't process your payment. Please try again or contact our support team.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href={`/paymentConfirmation`}>
            <Button 
            size="lg"
            className="bg-linear-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold px-8 py-6 text-lg shadow-lg shadow-red-500/25 transition-all duration-300 hover:shadow-red-500/40 hover:scale-105"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </Button>
          </Link>
          
          <Button 
            variant="outline"
            onClick = {handleWhatsApp}
            size="lg"
            className="border-slate-600 bg-slate-800/50 text-slate-200 hover:bg-slate-700 hover:text-white hover:border-slate-500 px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
          >
            <Headset className="w-5 h-5 mr-2" />
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
