"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import tshirtSize from "../../../PDF/tshirt_size_list.png"
import 'animate.css';

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

import { Plus, Minus, Sparkles, FileSymlink } from "lucide-react";
import Image from "next/image";


export default function Registration() {
  const form = useForm({
    defaultValues: {
      sscCompletion: "yes",
      hscCompletion: "yes",
      parking: "no"  // <-- This is the key
  },
  });

  const sscDone = form.watch("sscCompletion");
  const hscDone = form.watch("hscCompletion");

  const router = useRouter();

  const [guests, setGuests] = useState(0);
  const [preview, setPreview] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [photoError, SetPhotoError] = useState("");


  // console.log(uploadedImageUrl);

  

  const increaseGuests = () => setGuests((p) => p + 1);
  const decreaseGuests = () => setGuests((p) => (p > 0 ? p - 1 : 0));

  // -----------------------
  // CLOUDINARY UPLOAD
  // -----------------------
  const handleImageChange = async (e) => {
  const file = e.target.files?.[0];

  if (!file) {
    SetPhotoError("Image is required!");
    return;
  }

  // Allowed formats
  const allowedTypes = ["image/jpeg", "image/png"];

  // Validate type
  if (!allowedTypes.includes(file.type)) {
    SetPhotoError("Only JPEG or PNG images are allowed.");
    e.target.value = "";
    return;
  }

  // Validate size (500 KB = 500 * 1024 bytes)
  if (file.size > 500 * 1024) {
    SetPhotoError("Image must be less than 500 KB.");
    e.target.value = "";
    return;
  }

  // Clear previous error
  SetPhotoError("");

  setLoading(true);

  // local preview
  setPreview(URL.createObjectURL(file));

  // Upload to Cloudinary
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

    if (data.secure_url) {
      setUploadedImageUrl(data.secure_url);
      form.setValue("photo", data.secure_url);
    } else {
      SetPhotoError("Failed to upload image.");
    }
  } catch (err) {
    console.error("Upload failed:", err);
    SetPhotoError("Upload failed! Please try again.");
    setLoading(false);
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
    <div className="min-h-screen bg-[#0F1319]">
      {/* HERO SECTION */}
      <section className="relative pt-8 pb-4 md:pb-12 px-4 overflow-hidden">
        <div
          className="absolute bg-linear-to-br from-[#101F25] via-background to-[#151521] animate-gradient-shift"
          style={{ backgroundSize: "200% 200%" }}
        />

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-2">
            <div className="inline-block mb-4 animate-scale-in">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-white">
                <FileSymlink className="text-[#1DEDF4]" />
                Registration Open
              </span>
            </div>

            <h1 className="text-2xl text-white md:text-6xl font-bold mb-4 animate-fade-in-up">
              CPSCM Reunion &amp;<br />
              <span className="animate__animated animate__flipInX animate__duration-2s bg-linear-90 from-[#1DEDF4] to-[#9763EE] bg-clip-text text-transparent">Silver Jubilee 2025</span>
            </h1>
          </div>
        </div>
      </section>

      {/* FORM SECTION */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <Card className="p-8 md:p-12 border border-gray-800 animate-fade-in-up bg-[#13171E]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* ---------------- PERSONAL INFO ---------------- */}
                <h2 className="text-2xl font-semibold bg-linear-to-r from-[#1DEDF4] to-[#9763EE] bg-clip-text text-transparent">
                  Personal Information
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    rules={{ required: "Full Name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Full Name (As per School/College Record) *</FormLabel>
                        <FormControl>
                          <Input className="bg-white" {...field} placeholder="Enter your name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    rules={{ required: "Email address is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Email *</FormLabel>
                        <FormControl>
                          <Input className="bg-white" type="email" {...field} placeholder="example@gmail.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Phone + Size */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    rules={{ required: "Contact Number is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Contact No *</FormLabel>
                        <FormControl>
                          <Input className="bg-white" {...field} placeholder="01XXXXXXXXX" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />


                  <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Present Address *</FormLabel>
                      <FormControl>
                        <Input className="bg-white" {...field} placeholder="Your address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>

                <div className="">
                  

                  <div className="w-full md:w-[50%] my-4 mx-auto">
                    <Image
                      width={600}
                      height={400}
                      src= {tshirtSize}
                      alt="Preview"
                      className="w-full object-cover rounded-lg border"
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="tshirt"
                    rules={{ required: "T-shirt size is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white w-full">Your T-Shirt Size *</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange}>
                            <SelectTrigger className="text-white w-full">
                              <SelectValue className="text-white" placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#13171E]">
                              {["S", "M", "L", "XL", "XXL", "3XL"].map((s) => (
                                <SelectItem className="bg-purple-400 my-0.5" key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                

                {/* ---------------- ACADEMIC ---------------- */}
                <h2 className="text-2xl font-semibold bg-linear-to-r from-[#1DEDF4] to-[#9763EE] bg-clip-text text-transparent">
                  Academic Information
                </h2>

                <div className="grid md:grid-cols-1 gap-6">
                  <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                    control={form.control}
                    name="sscCompletion"
                    rules={{ required: "This information is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Completed SSC from CPSCM?</FormLabel>
                        <FormControl>
                          <Select  value={field.value} className="bg-white" onValueChange={field.onChange}>
                          <SelectTrigger className="text-white w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent  className="bg-[#13171E]">
                            <SelectItem className="bg-purple-400 my-0.5" value="yes">Yes</SelectItem>
                            <SelectItem className="bg-purple-400 my-0.5" value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                    />
                    
                    <FormField
                    control={form.control}
                    name="hscCompletion"
                    rules={{ required: "This information is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Completed HSC from CPSCM?</FormLabel>
                        <FormControl>
                          <Select  value={field.value} className="bg-white" onValueChange={field.onChange}>
                          <SelectTrigger className="text-white w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent  className="bg-[#13171E]">
                            <SelectItem className="bg-purple-400 my-0.5" value="yes">Yes</SelectItem>
                            <SelectItem className="bg-purple-400 my-0.5" value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                    />
                    
                  </div>

                  {sscDone === "yes" && (
                    <div className="ssc grid md:grid-cols-3 gap-6">
                    <FormField
                    control={form.control}
                      name="ssc-batch"
                      rules={sscDone === "yes" ? { required: "SSC batch is required" }: {}}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">SSC Batch *</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange}>
                          <SelectTrigger className="text-white">
                            <SelectValue placeholder="Choose group" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#13171E]">
                              {[
                                  "SSC 1997", "SSC 1998", "SSC 1999", "SSC 2000",
                                  "SSC 2001", "SSC 2002", "SSC 2003", "SSC 2004",
                                  "SSC 2005", "SSC 2006", "SSC 2007", "SSC 2008",
                                  "SSC 2009", "SSC 2010", "SSC 2011", "SSC 2012",
                                  "SSC 2013", "SSC 2014", "SSC 2015", "SSC 2016",
                                  "SSC 2017", "SSC 2018", "SSC 2019", "SSC 2020",
                                  "SSC 2021", "SSC 2022", "SSC 2023", "SSC 2024",
                                  "SSC 2025", "Not from CPSCM"
                                ].map((s) => (
                                <SelectItem className="bg-purple-400 my-0.5" key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                        </Select>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                      name="ssc-group"
                      rules={sscDone === "yes"? { required: "SSC group is required" }: {}}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">SSC Group *</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange}>
                          <SelectTrigger className="text-white">
                            <SelectValue placeholder="Choose group" />
                          </SelectTrigger>
                          <SelectContent  className="bg-[#13171E]">
                            <SelectItem className="bg-purple-400 my-0.5" value="science">Science</SelectItem>
                            <SelectItem className="bg-purple-400 my-0.5" value="commerce">Commerce</SelectItem>
                            <SelectItem className="bg-purple-400 my-0.5" value="arts">Arts</SelectItem>
                          </SelectContent>
                        </Select>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                    />

                    <FormField
                        control={form.control}
                      name="ssc-roll"
                      rules={sscDone === "yes"?{ required: "SSC roll number is required" }:{}}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">SSC Roll Number *</FormLabel>
                            <FormControl>
                              <Input className="bg-white" {...field} placeholder="Your SSC Roll Number" />
                            </FormControl>
                            <FormMessage/>
                          </FormItem>
                        )}
                      />
                    
                  </div>
                  )}

                  {hscDone === "yes" && (
                    <div className="hsc grid md:grid-cols-3 gap-6">
                    <FormField
                    control={form.control}
                      name="hsc-batch"
                      rules={hscDone === "yes"?{ required: "HSC batch is required" }:{}}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">HSC Batch *</FormLabel>
                        <FormControl>
                            <Select onValueChange={field.onChange}>
                          <SelectTrigger className="text-white">
                            <SelectValue placeholder="Choose group" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#13171E]">
                              {[
                                  "HSC 1997", "HSC 1998", "HSC 1999", "HSC 2000",
                                  "HSC 2001", "HSC 2002", "HSC 2003", "HSC 2004",
                                  "HSC 2005", "HSC 2006", "HSC 2007", "HSC 2008",
                                  "HSC 2009", "HSC 2010", "HSC 2011", "HSC 2012",
                                  "HSC 2013", "HSC 2014", "HSC 2015", "HSC 2016",
                                  "HSC 2017", "HSC 2018", "HSC 2019", "HSC 2020",
                                  "HSC 2021", "HSC 2022", "HSC 2023", "HSC 2024",
                                  "HSC 2025", "Not from CPSCM"
                                ].map((s) => (
                                <SelectItem className="bg-purple-400 my-0.5" key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                        </Select>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />

                  
                  
                  <FormField
                    control={form.control}
                      name="hsc-group"
                      rules={hscDone === "yes" ?{ required: "HSC group is required" }:{}}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">HSC Group *</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange}>
                          <SelectTrigger className="text-white">
                            <SelectValue placeholder="Choose group" />
                          </SelectTrigger>
                          <SelectContent  className="bg-[#13171E]">
                            <SelectItem className="bg-purple-400 my-0.5" value="science">Science</SelectItem>
                            <SelectItem className="bg-purple-400 my-0.5" value="commerce">Commerce</SelectItem>
                            <SelectItem className="bg-purple-400 my-0.5" value="arts">Arts</SelectItem>
                          </SelectContent>
                        </Select>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />

                  <FormField
                        control={form.control}
                      name="hsc-roll"
                      rules={hscDone === "yes"? { required: "HSC roll number is required" }:{}}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">HSC Roll Number *</FormLabel>
                            <FormControl>
                              <Input className="bg-white" {...field} placeholder="Your HSC Roll Number" />
                            </FormControl>
                            <FormMessage/>
                          </FormItem>
                        )}
                      />

                   </div>
                  )}
                </div>

                {/* ---------------- EVENT DETAILS ---------------- */}
                <h2 className="text-2xl font-semibold bg-linear-to-r from-[#1DEDF4] to-[#9763EE] bg-clip-text text-transparent">
                  Event Details
                </h2>

                <div className="">
                   {/* <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4"> */}
                    <div className=" p-5 mx-auto m-4 rounded-2xl bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 shadow-xl overflow-hidden max-w-xs w-full">
                      {/* Decorative background elements */}
                      {/* <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div> */}
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-pink-400/20 rounded-full blur-lg translate-y-1/2 -translate-x-1/2"></div>
                      
                      {/* Main Price */}
                      <div className="relative text-center mb-4">
                        <span className="text-xs uppercase tracking-widest text-white/80 font-medium">Reunion Registration Fee</span>
                        <p className="text-3xl font-black text-white drop-shadow-lg mt-1">
                          BDT <span className="bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">1700</span>
                        </p>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-gradient-to-r from-transparent via-white/40 to-transparent my-4"></div>

                      {/* Additional Guests Section */}
                      <div className="relative">
                        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                          <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs">👥</span>
                          Additional Guests
                        </h3>
                        
                        <ul className="space-y-2 text-white text-sm">
                          <li className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-2">
                            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                            <span>Adult guest : <strong className="text-yellow-300">+ BDT 1000</strong> each</span>
                          </li>
                          <li className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-2">
                            <span className="w-1.5 h-1.5 bg-pink-400 rounded-full"></span>
                            <span>Guests allowed : <strong className="text-pink-200">Spouse or children only</strong></span>
                          </li>
                          <li className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-2">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                            <span>Children under 5 : <span className="inline-block bg-green-400 text-green-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1">FREE</span></span>
                          </li>
                        </ul>
                      </div>

                      {/* Sparkle decorations */}
                      <div className="absolute top-3 left-3 text-lg animate-pulse">🎉</div>
                      <div className="absolute bottom-3 right-3 text-base animate-pulse">🎉</div>
                    </div>
                  {/* </div> */}

                <div>
                  <FormLabel className="text-white">Number of Guests</FormLabel>
                  <div className="flex items-center gap-4 mt-2">
                    <Button type="button" onClick={decreaseGuests} variant="outline" size="icon">
                      <Minus />
                    </Button>

                    <span className="text-4xl font-bold text-gradient flex-1 text-center text-white border rounded-2xl">
                      {guests}
                    </span>

                    <Button type="button" onClick={increaseGuests} variant="outline" size="icon">
                      <Plus />
                    </Button>
                  </div>
                </div>
               </div>
                
                <FormField
                    control={form.control}
                  name="parking"
                  rules={{ required: "This information is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Do you need Car Parking Facility?</FormLabel>
                        <FormControl>
                          <Select  value={field.value} className="bg-white" onValueChange={field.onChange}>
                          <SelectTrigger className="text-white w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent  className="bg-[#13171E]">
                            <SelectItem className="bg-purple-400 my-0.5" value="yes">Yes</SelectItem>
                            <SelectItem className="bg-purple-400 my-0.5" value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                />
                

                <h2 className="text-2xl font-semibold bg-linear-to-r from-[#1DEDF4] to-[#9763EE] bg-clip-text text-transparent">
                  Additional Info
                </h2>
                

                <FormField
                  control={form.control}
                  name="favoriteTeacher"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Your Favorite Teacher</FormLabel>
                      <FormControl>
                        <Input className="bg-white" {...field} placeholder="Type here..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Special Message</FormLabel>
                      <FormControl>
                        <Textarea className="bg-white" rows={4} {...field} placeholder="Write here..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ---------------- UPLOAD + PAYMENT ---------------- */}
                <h2 className="text-2xl font-semibold bg-linear-to-r from-[#1DEDF4] to-[#9763EE] bg-clip-text text-transparent">
                  Upload Photo
                </h2>

                {/* SINGLE CLEAN UPLOAD FIELD */}
                <FormField
                  control={form.control}
                  name="photo"
                  rules={{ required: "Image is required!" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Upload Photo *</FormLabel>
                      <FormControl>
                        <div>
                          <input
                            
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            className="hidden bg-white"
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
                                <span className="loading loading-bars loading-xs"></span>
                              ) : uploadedImageUrl ? (
                                <img
                                  src={uploadedImageUrl}
                                  className="h-40 w-40 object-cover rounded-md"
                                />
                              ) : (
                                <span className="text-muted-foreground text-white">
                                  Click to upload photo
                                </span>
                              )
                            }

                          </label>
                        </div>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />

                 {photoError && (
                    <p className="text-red-500 text-sm mt-2 text-center">**{photoError}</p>
                  )}
                    

               <Button
                type="submit"
                size="lg"
                className="bg-[#1DEDF4] md:glass w-full text-lg py-6  text-white hover:bg-[#1DEDF4]"
                disabled={loading || !uploadedImageUrl || sscDone === "no" && hscDone ==="no"}
              >
                Proceed Checkout <FileSymlink className="text-white" />
              </Button>
              </form>
            </Form>
          </Card>
        </div>
      </section>
    </div>
  );
}
