"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import "animate.css";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Camera, Upload } from "lucide-react";

/* ─── inline styles injected once ─── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --ink:      #0A0807;
    --paper:    #F5EDD6;
    --amber:    #C8881A;
    --amber-lt: #E8A030;
    --smoke:    #1A1714;
    --ash:      #2C2824;
    --dust:     #4A4440;
    --mist:     #8C8078;
  }

  .pw-root {
    min-height: 100vh;
    background-color: var(--ink);
    font-family: 'DM Sans', sans-serif;
    color: var(--paper);
    position: relative;
    overflow-x: hidden;
  }

  /* grain overlay */
  .pw-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
    opacity: 0.035;
    pointer-events: none;
    z-index: 0;
  }

  /* hero */
  .pw-hero {
    position: relative;
    z-index: 1;
    padding: 2.5rem 1rem 3rem;
    text-align: center;
  }
  .pw-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    border: 1px solid var(--amber);
    color: var(--amber-lt);
    font-size: 0.7rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    padding: 0.4rem 1.1rem;
    border-radius: 2px;
    margin-bottom: 2rem;
  }
  .pw-dot {
    width: 5px; height: 5px;
    background: var(--amber-lt);
    border-radius: 50%;
    animation: blink 1.4s ease-in-out infinite;
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }

  .pw-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.4rem, 6vw, 5rem);
    font-weight: 900;
    line-height: 1.05;
    letter-spacing: -0.02em;
    margin-bottom: 0.6rem;
  }
  .pw-title em {
    font-style: italic;
    color: var(--amber-lt);
  }
  .pw-subtitle {
    font-size: 0.85rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--mist);
    margin-top: 1rem;
  }

  /* horizontal rule */
  .pw-rule {
    width: 60px; height: 1px;
    background: linear-gradient(90deg, transparent, var(--amber), transparent);
    margin: 1.5rem auto;
  }

  /* card */
  .pw-card {
    background: var(--smoke) !important;
    border: 1px solid var(--ash) !important;
    border-radius: 4px !important;
    padding: 2.5rem !important;
    position: relative;
    z-index: 1;
  }
  @media(min-width:768px){ .pw-card { padding: 3.5rem !important; } }

  /* corner accents */
  .pw-card::before, .pw-card::after {
    content: '';
    position: absolute;
    width: 24px; height: 24px;
    border-color: var(--amber);
    border-style: solid;
    opacity: 0.6;
  }
  .pw-card::before { top: 16px; left: 16px; border-width: 1px 0 0 1px; }
  .pw-card::after  { bottom: 16px; right: 16px; border-width: 0 1px 1px 0; }

  /* section label */
  .pw-section-label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.75rem;
  }
  .pw-section-label span {
    font-family: 'Playfair Display', serif;
    font-size: 1.15rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    color: var(--paper);
  }
  .pw-section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--ash);
  }
  .pw-section-num {
    font-size: 0.65rem;
    letter-spacing: 0.15em;
    color: var(--amber);
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
  }

  /* form label */
  .pw-label {
    font-size: 0.7rem !important;
    letter-spacing: 0.16em !important;
    text-transform: uppercase !important;
    color: var(--mist) !important;
    margin-bottom: 0.5rem !important;
    display: block !important;
  }

  /* inputs */
  .pw-input {
    background: var(--ash) !important;
    border: 1px solid #3A3530 !important;
    border-radius: 2px !important;
    color: var(--paper) !important;
    font-family: 'DM Sans', sans-serif !important;
    font-size: 0.95rem !important;
    padding: 0.65rem 0.85rem !important;
    transition: border-color 0.2s !important;
    width: 100% !important;
  }
  .pw-input::placeholder { color: var(--dust) !important; }
  .pw-input:focus {
    outline: none !important;
    border-color: var(--amber) !important;
    box-shadow: 0 0 0 3px rgba(200,136,26,0.08) !important;
  }

  /* select trigger override */
  .pw-select [data-slot="select-trigger"],
  .pw-select button[role="combobox"] {
    background: var(--ash) !important;
    border: 1px solid #3A3530 !important;
    border-radius: 2px !important;
    color: var(--paper) !important;
    font-family: 'DM Sans', sans-serif !important;
  }

  /* interest toggle */
  .pw-interest-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }
  .pw-interest-btn {
    position: relative;
    padding: 1.1rem 0.5rem;
    border: 1px solid var(--ash);
    border-radius: 2px;
    background: var(--ash);
    color: var(--mist);
    cursor: pointer;
    text-align: center;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
  }
  .pw-interest-btn:hover { border-color: var(--amber); color: var(--paper); }
  .pw-interest-btn.selected {
    border-color: var(--amber-lt);
    background: rgba(200,136,26,0.1);
    color: var(--amber-lt);
  }
  .pw-interest-btn.selected::after {
    content: '';
    position: absolute;
    top: 6px; right: 6px;
    width: 6px; height: 6px;
    background: var(--amber-lt);
    border-radius: 50%;
  }
  .pw-interest-icon { font-size: 1.4rem; }

  /* photo upload */
  .pw-upload-zone {
    border: 1px dashed var(--ash);
    border-radius: 2px;
    background: var(--ash);
    width: 100%;
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    cursor: pointer;
    transition: border-color 0.2s;
    position: relative;
    overflow: hidden;
  }
  .pw-upload-zone:hover { border-color: var(--amber); }
  .pw-upload-zone .pw-upload-text {
    font-size: 0.72rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--mist);
  }
  .pw-upload-zone .pw-upload-hint {
    font-size: 0.65rem;
    color: var(--dust);
  }
  .pw-upload-preview {
    position: absolute; inset: 0;
    object-fit: cover;
    width: 100%; height: 100%;
  }
  .pw-upload-overlay {
    position: absolute; inset: 0;
    background: rgba(10,8,7,0.45);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* aperture ring decoration */
  .pw-aperture {
    width: 60px; height: 60px;
    border-radius: 50%;
    border: 2px solid var(--amber);
    display: flex; align-items: center; justify-content: center;
    opacity: 0.6;
    position: relative;
  }
  .pw-aperture::before {
    content: '';
    position: absolute;
    width: 38px; height: 38px;
    border-radius: 50%;
    border: 1px solid var(--amber-lt);
    opacity: 0.5;
  }

  /* payment card */
  .pw-payment-card {
    background: linear-gradient(135deg, #1e1560 0%, #3b0f60 50%, #6b1a3a 100%);
    border-radius: 12px;
    padding: 1.5rem;
    position: relative;
    overflow: hidden;
    max-width: 320px;
    margin: 0 auto;
  }
  .pw-payment-card::before {
    content: '';
    position: absolute;
    bottom: 0; left: 0;
    width: 64px; height: 64px;
    border-radius: 50%;
    background: rgba(236,72,153,0.2);
    filter: blur(16px);
    transform: translate(-50%,50%);
  }

  /* counter */
  .pw-counter {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 0.5rem;
  }
  .pw-counter-btn {
    width: 36px; height: 36px;
    border: 1px solid var(--ash);
    border-radius: 2px;
    background: var(--ash);
    color: var(--paper);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: border-color 0.2s;
  }
  .pw-counter-btn:hover { border-color: var(--amber); }
  .pw-counter-val {
    flex: 1;
    text-align: center;
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 700;
    border: 1px solid var(--ash);
    border-radius: 2px;
    padding: 0.25rem 0;
  }

  /* select dropdown dark */
  .pw-select-content {
    background: var(--smoke) !important;
    border: 1px solid var(--ash) !important;
    border-radius: 2px !important;
  }
  .pw-select-item {
    color: var(--paper) !important;
    font-family: 'DM Sans', sans-serif !important;
  }
  .pw-select-item:hover, .pw-select-item:focus {
    background: var(--ash) !important;
    color: var(--amber-lt) !important;
  }

  /* submit button */
  .pw-submit {
    width: 100%;
    background: var(--amber) !important;
    border: none !important;
    border-radius: 2px !important;
    color: var(--ink) !important;
    font-family: 'DM Sans', sans-serif !important;
    font-size: 0.75rem !important;
    letter-spacing: 0.2em !important;
    text-transform: uppercase !important;
    font-weight: 500 !important;
    padding: 1rem !important;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.1s !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 0.6rem !important;
  }
  .pw-submit:hover:not(:disabled) { opacity: 0.88; }
  .pw-submit:active:not(:disabled) { transform: scale(0.99); }
  .pw-submit:disabled { opacity: 0.4 !important; cursor: not-allowed !important; }

  .space-y-6 > * + * { margin-top: 1.5rem; }

  /* grid helpers */
  .pw-grid-2 { display: grid; gap: 1.25rem; }
  @media(min-width:640px){ .pw-grid-2 { grid-template-columns: 1fr 1fr; } }

  /* error */
  .pw-error { color: #f87171; font-size: 0.72rem; margin-top: 0.3rem; }
`;

export default function Registration() {
  const form = useForm();

  const router = useRouter();
  const [preview, setPreview] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [interest, setInterest] = useState("");

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPhotoError("Image is required!");
      return;
    }
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setPhotoError("Only JPEG or PNG images are allowed.");
      e.target.value = "";
      return;
    }
    if (file.size > 500 * 1024) {
      setPhotoError("Image must be less than 500 KB.");
      e.target.value = "";
      return;
    }
    setPhotoError("");
    setLoading(true);
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
        },
      );
      const data = await res.json();
      setLoading(false);
      if (data.secure_url) {
        setUploadedImageUrl(data.secure_url);
        form.setValue("photo", data.secure_url);
      } else {
        setPhotoError("Failed to upload image.");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setPhotoError("Upload failed! Please try again.");
      setLoading(false);
    }
  };

  const onSubmit = (data) => {
    data.guests = 0;
    data.photo = uploadedImageUrl;
    data.interest = interest;
    console.log("Checkout form data:", data);
    localStorage.setItem("formData", JSON.stringify(data));
    router.push("/paymentConfirmation");
  };

  return (
    <div className="pw-root">
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* ── HERO ── */}
      <section className="pw-hero animate__animated animate__fadeIn">
        <div className="pw-tag">
          <span className="pw-dot" />
          Registration Open
        </div>

        <h1 className="pw-title">
          Frame Your
          <br />
          <em>Vision</em>
        </h1>

        <div className="pw-rule" />

        <p className="pw-subtitle">
          Photography &amp; Cinematography Workshop 2026
        </p>
      </section>

      {/* ── FORM ── */}
      <section
        style={{
          paddingBottom: "5rem",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <Card className="pw-card animate__animated animate__fadeInUp animate__delay-1s">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* ── 01 PERSONAL INFO ── */}
                <div className="pw-section-label">
                  <span className="pw-section-num">01</span>
                  <span>Participant Details</span>
                </div>

                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="fullName"
                  rules={{ required: "Full name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="pw-label">Full Name *</FormLabel>
                      <FormControl>
                        <Input
                          className="pw-input"
                          {...field}
                          placeholder="Your full name"
                        />
                      </FormControl>
                      <FormMessage className="pw-error" />
                    </FormItem>
                  )}
                />

                <div className="pw-grid-2">
                  {/* Mobile */}
                  <FormField
                    control={form.control}
                    name="phone"
                    rules={{ required: "Mobile number is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="pw-label">Mobile *</FormLabel>
                        <FormControl>
                          <Input
                            className="pw-input"
                            {...field}
                            placeholder="01XXXXXXXXX"
                          />
                        </FormControl>
                        <FormMessage className="pw-error" />
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    rules={{ required: "Email is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="pw-label">Email *</FormLabel>
                        <FormControl>
                          <Input
                            className="pw-input"
                            type="email"
                            {...field}
                            placeholder="you@example.com"
                          />
                        </FormControl>
                        <FormMessage className="pw-error" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* ── 02 INTEREST ── */}
                <div style={{ marginTop: "2rem" }}>
                  <div className="pw-section-label">
                    <span className="pw-section-num">02</span>
                    <span>Area of Interest</span>
                  </div>

                  <p className="pw-label" style={{ marginBottom: "0.75rem" }}>
                    I want to focus on *
                  </p>

                  <div className="pw-interest-group">
                    <button
                      type="button"
                      className={`pw-interest-btn ${interest === "Photography" ? "selected" : ""}`}
                      onClick={() => {
                        setInterest("Photography");
                        form.setValue("interest", "Photography");
                      }}
                    >
                      <span className="pw-interest-icon">📷</span>
                      Photography
                    </button>
                    <button
                      type="button"
                      className={`pw-interest-btn ${interest === "Cinematography" ? "selected" : ""}`}
                      onClick={() => {
                        setInterest("Cinematography");
                        form.setValue("interest", "Cinematography");
                      }}
                    >
                      <span className="pw-interest-icon">🎬</span>
                      Cinematography
                    </button>
                  </div>
                  {form.formState.isSubmitted && !interest && (
                    <p className="pw-error" style={{ marginTop: "0.4rem" }}>
                      Please select your area of interest
                    </p>
                  )}
                </div>

                {/* ── 03 PHOTO ── */}
                <div style={{ marginTop: "2rem" }}>
                  <div className="pw-section-label">
                    <span className="pw-section-num">03</span>
                    <span>Profile Photo</span>
                  </div>

                  <FormField
                    control={form.control}
                    name="photo"
                    rules={{ required: "Photo is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="pw-label">
                          Upload Photo * &nbsp;(JPEG / PNG · max 500 KB)
                        </FormLabel>
                        <FormControl>
                          <div>
                            <input
                              id="photo-upload"
                              type="file"
                              accept="image/jpeg,image/png"
                              style={{ display: "none" }}
                              onChange={(e) => {
                                handleImageChange(e);
                                field.onChange(e.target.files?.[0]);
                              }}
                            />
                            <label
                              htmlFor="photo-upload"
                              className="pw-upload-zone"
                            >
                              {loading ? (
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: "0.6rem",
                                  }}
                                >
                                  <div
                                    className="pw-aperture"
                                    style={{
                                      animation: "spin 2s linear infinite",
                                    }}
                                  />
                                  <span className="pw-upload-text">
                                    Developing…
                                  </span>
                                </div>
                              ) : uploadedImageUrl ? (
                                <>
                                  <img
                                    src={uploadedImageUrl}
                                    className="pw-upload-preview"
                                    alt="Preview"
                                  />
                                  <div className="pw-upload-overlay">
                                    <span
                                      style={{
                                        fontSize: "0.72rem",
                                        letterSpacing: "0.14em",
                                        textTransform: "uppercase",
                                        color: "var(--paper)",
                                      }}
                                    >
                                      Click to change
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="pw-aperture">
                                    <Camera size={18} color="var(--amber)" />
                                  </div>
                                  <span className="pw-upload-text">
                                    Click to upload
                                  </span>
                                  <span className="pw-upload-hint">
                                    JPEG or PNG · under 500 KB
                                  </span>
                                </>
                              )}
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage className="pw-error" />
                      </FormItem>
                    )}
                  />
                  {photoError && (
                    <p className="pw-error" style={{ marginTop: "0.4rem" }}>
                      {photoError}
                    </p>
                  )}
                </div>

                {/* ── 04 PAYMENT (KEPT AS-IS, re-styled wrapper only) ── */}
                <div style={{ marginTop: "2rem" }}>
                  <div className="pw-section-label">
                    <span className="pw-section-num">04</span>
                    <span>Payment</span>
                  </div>

                  {/* original payment card — structure unchanged */}
                  {/* ── Payment Fee Card ── */}
                  <div
                    style={{
                      position: "relative",
                      maxWidth: "360px",
                      margin: "0 auto",
                      borderRadius: "2px",
                      border: "1px solid #3A3530",
                      background: "var(--ash)",
                      padding: "2rem 2rem 1.75rem",
                      overflow: "hidden",
                    }}
                  >
                    {/* corner bracket — top left */}
                    <span
                      style={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        width: 18,
                        height: 18,
                        borderTop: "1px solid var(--amber)",
                        borderLeft: "1px solid var(--amber)",
                        opacity: 0.7,
                      }}
                    />
                    {/* corner bracket — bottom right */}
                    <span
                      style={{
                        position: "absolute",
                        bottom: 10,
                        right: 10,
                        width: 18,
                        height: 18,
                        borderBottom: "1px solid var(--amber)",
                        borderRight: "1px solid var(--amber)",
                        opacity: 0.7,
                      }}
                    />

                    {/* aperture ring — decorative */}
                    <div
                      style={{
                        position: "absolute",
                        top: -28,
                        right: -28,
                        width: 90,
                        height: 90,
                        borderRadius: "50%",
                        border: "1px solid var(--amber)",
                        opacity: 0.08,
                        pointerEvents: "none",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 10,
                          borderRadius: "50%",
                          border: "1px solid var(--amber-lt)",
                        }}
                      />
                    </div>

                    {/* label */}
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.6rem",
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: "var(--amber)",
                        marginBottom: "0.75rem",
                      }}
                    >
                      Workshop Registration Fee
                    </p>

                    {/* amber divider */}
                    <div
                      style={{
                        height: 1,
                        background:
                          "linear-gradient(90deg, var(--amber) 0%, transparent 100%)",
                        marginBottom: "1.25rem",
                        opacity: 0.35,
                      }}
                    />

                    {/* price */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "0.5rem",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "0.75rem",
                          letterSpacing: "0.1em",
                          color: "var(--mist)",
                        }}
                      >
                        BDT
                      </span>
                      <span
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "3.5rem",
                          fontWeight: 900,
                          color: "var(--amber-lt)",
                          lineHeight: 1,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        1250
                      </span>
                    </div>

                    {/* sub-note */}
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.65rem",
                        letterSpacing: "0.12em",
                        color: "var(--dust)",
                        textTransform: "uppercase",
                        marginTop: "0.6rem",
                      }}
                    >
                      Per participant · One-time
                    </p>
                  </div>
                </div>

                {/* ── SUBMIT ── */}
                <Button
                  type="submit"
                  className="pw-submit"
                  disabled={loading || !uploadedImageUrl || !interest}
                >
                  Proceed to Checkout
                  <ArrowRight size={14} />
                </Button>
              </form>
            </Form>
          </Card>
        </div>
      </section>

      {/* bottom wordmark */}
      <div
        style={{
          textAlign: "center",
          paddingBottom: "2rem",
          position: "relative",
          zIndex: 1,
          fontSize: "0.65rem",
          letterSpacing: "0.2em",
          color: "var(--dust)",
          textTransform: "uppercase",
        }}
      >
        Photography Workshop · 2025
      </div>
    </div>
  );
}
