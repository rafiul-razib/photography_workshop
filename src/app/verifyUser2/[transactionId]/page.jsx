"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { CheckCircle2, User, Mail, Phone, Users, Shirt, UserPlus, CreditCard, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const VerifyUser = () => {
  const { transactionId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`https://reunion-cpscm-server.vercel.app/verifyUser/${transactionId}`);
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [transactionId]);

  console.log(user);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from- via-accent/20 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl border-2">
          <CardHeader className="space-y-4">
            <Skeleton className="h-32 w-32 rounded-full mx-auto" />
            <Skeleton className="h-8 w-64 mx-auto" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-linear-to-br from-background via-accent/20 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-2 border-destructive">
          <CardContent className="pt-6 text-center">
            <p className="text-lg text-destructive font-semibold">User not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const InfoItem = ({ icon: Icon, label, value, className = "" }) => (
    <div className={`flex items-start gap-4 p-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors ${className}`}>
      <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
        <p className="text-base font-semibold text-foreground wrap-break-words">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0b182b] via-[#042e6d] to-[#5d8dd3] py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Verified Badge */}
        <div className="flex justify-center animate-in fade-in slide-in-from-top-4 duration-700">
          <Badge className="px-6 py-3 text-lg bg-green-500 hover:bg-verified/90 text-verified-foreground flex items-center gap-2 shadow-lg">
            <CheckCircle2 className="w-6 h-6" />
            Verified User
          </Badge>
        </div>

        {/* Main Card */}
        <Card className="border-2 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <CardHeader className="text-center space-y-6 pb-8">
            {user.photo && (
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-verified/20 rounded-full blur-2xl animate-pulse" />
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="relative w-40 h-40 rounded-full object-cover border-4 border-verified shadow-xl ring-4 ring-verified/20"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-verified text-verified-foreground rounded-full p-2 shadow-lg">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </div>
              </div>
            )}
            <CardTitle className="text-4xl font-bold bg-linear-to-r from-primary to-verified bg-clip-text text-transparent">
              {user.name}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <InfoItem icon={Mail} label="Email Address" value={user.email} />
              <InfoItem icon={Phone} label="Mobile Number" value={user.phone} />
            </div>

            {/* Event Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <InfoItem icon={Calendar} label="Batch" value={user.sscCompletion === "yes"?user["ssc-batch"]:user["hsc-batch"]} />
              <InfoItem icon={Users} label="Group" value={user.sscCompletion === "yes"?user["ssc-group"]:user["hsc-group"]} />
            </div>

            {/* Additional Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <InfoItem icon={Shirt} label="T-Shirt Size" value={user.tshirt} />
              <InfoItem icon={UserPlus} label="Guest Count" value={user.guests} />
              <InfoItem icon={UserPlus} label="Parking Requirement" value={user.parking} />
            </div>

            {/* Payment Information */}
            <div className="mt-6 p-6 rounded-xl bg-linear-to-br from-card to-accent/30 border-2 space-y-4">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-primary" />
                Payment Details
              </h3>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Status</span>
                <Badge 
                  className={`px-4 py-1 text-sm font-bold ${
                    user.paymentStatus 
                      ? 'bg-success hover:bg-success/90 text-success-foreground' 
                      : 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
                  }`}
                >
                  {user.paymentStatus ? "✓ Paid" : "✗ Not Paid"}
                </Badge>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-muted-foreground font-medium">Total Amount</span>
                <span className="text-2xl font-bold text-primary">BDT {user.totalAmount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyUser;
