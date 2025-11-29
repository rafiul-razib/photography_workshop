"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { Plus, Minus, Sparkles } from "lucide-react";

export default function Registration() {
  const form = useForm();
  const router = useRouter();

  const [guests, setGuests] = useState(0);
  const [preview, setPreview] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [loading, setLoading] = useState(false)

  const increaseGuests = () => setGuests((p) => p + 1);
  const decreaseGuests = () => setGuests((p) => (p > 0 ? p - 1 : 0));

  // -----------------------
  // CLOUDINARY UPLOAD
  // -----------------------
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true)

    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "lt4vyrjl");
    formData.append("cloud_name", "datldhldb");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/datldhldb/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      setLoading(false);
      setUploadedImageUrl(data.secure_url); // <— final image URL
      form.setValue("photo", data.secure_url);
      console.log("uploadedImageUrl", data.secure_url);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  // -----------------------
  // SUBMIT HANDLER
  // -----------------------
  const onSubmit = (data) => {
    data.guests = guests;
    data.photo = uploadedImageUrl; // attach actual Cloudinary URL

    // Save data temporarily
    localStorage.setItem("formData", JSON.stringify(data));

    router.push("/paymentConfirmation");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-12 px-4 overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 animate-gradient-shift"
          style={{ backgroundSize: "200% 200%" }}
        />

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-block mb-4 animate-scale-in">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium">
                <Sparkles className="h-4 w-4 text-primary" />
                Registration Open
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in-up">
              CPSCM Reunion &amp;<br />
              <span className="text-gradient">Silver Jubilee 2025</span>
            </h1>
          </div>
        </div>
      </section>

      {/* FORM SECTION */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <Card className="glass p-8 md:p-12 border-border/50 animate-fade-in-up">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* ---------------- PERSONAL INFO ---------------- */}
                <h2 className="text-2xl font-semibold text-gradient">
                  Personal Information
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter your name" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} placeholder="example@gmail.com" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Phone + Size */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="01XXXXXXXXX" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tshirt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>T-Shirt Size *</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                              {["S", "M", "L", "XL", "XXL", "3XL"].map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Present Address *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Your address" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* ---------------- ACADEMIC ---------------- */}
                <h2 className="text-2xl font-semibold text-gradient pt-6 border-t">
                  Academic Information
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="completion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Completed from CPSCM?</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="group"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class Group *</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose group" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="science">Science</SelectItem>
                            <SelectItem value="commerce">Commerce</SelectItem>
                            <SelectItem value="arts">Arts</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                {/* ---------------- EVENT DETAILS ---------------- */}
                <h2 className="text-2xl font-semibold text-gradient pt-6 border-t">
                  Event Details
                </h2>

                <div>
                  <FormLabel>Number of Guests</FormLabel>
                  <div className="flex items-center gap-4 mt-2">
                    <Button type="button" onClick={decreaseGuests} variant="outline" size="icon">
                      <Minus />
                    </Button>

                    <span className="text-4xl font-bold text-gradient flex-1 text-center">
                      {guests}
                    </span>

                    <Button type="button" onClick={increaseGuests} variant="outline" size="icon">
                      <Plus />
                    </Button>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="favoriteTeacher"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Favorite Teacher</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Type here..." />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Message</FormLabel>
                      <FormControl>
                        <Textarea rows={4} {...field} placeholder="Write here..." />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* ---------------- UPLOAD + PAYMENT ---------------- */}
                <h2 className="text-2xl font-semibold text-gradient pt-6 border-t">
                  Upload & Payment
                </h2>

                {/* SINGLE CLEAN UPLOAD FIELD */}
                <FormField
                  control={form.control}
                  name="photo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Photo *</FormLabel>
                      <FormControl>
                        <div>
                          <input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              handleImageChange(e);
                              field.onChange(e.target.files?.[0]);
                            }}
                          />

                          <label
                            htmlFor="photo-upload"
                            className="flex flex-col items-center justify-center gap-3 w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/30"
                          >
                            {
                              loading ? (
                                "Uploading"
                              ) : uploadedImageUrl ? (
                                <img
                                  src={uploadedImageUrl}
                                  className="h-40 w-40 object-cover rounded-md"
                                />
                              ) : (
                                <span className="text-muted-foreground">
                                  Click to upload photo
                                </span>
                              )
                            }

                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name="payment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method *</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bkash">bKash</SelectItem>
                          <SelectItem value="nagad">Nagad</SelectItem>
                          <SelectItem value="bank">Bank Payment</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                /> */}

                

                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-lg py-6 bg-primary text-primary-foreground"
                  disabled={!form.watch("photo")}
                >
                  Proceed Checkout <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </Form>
          </Card>
        </div>
      </section>
    </div>
  );
}
