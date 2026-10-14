"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

const serviceOptions = [
  "Brand Strategy & Design",
  "Cinematic Content Production",
  "Performance & Digital Marketing",
  "AI & Automation Solutions",
  "Full-Stack Growth Partnership",
  "Other",
];

const budgetRanges = [
  "₹50K – ₹1.5L / month",
  "₹1.5L – ₹4L / month",
  "₹4L – ₹8L / month",
  "₹8L+ / month",
  "Let's discuss",
];

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="rounded-2xl border border-[#0a0a0a]/8 bg-[#fafafa] p-10 text-center">
        <span className="text-4xl mb-4 block">✦</span>
        <h3
          className="text-xl font-bold text-[#0a0a0a] tracking-tight"
          style={{ fontFamily: "var(--font-syne), sans-serif" }}
        >
          Message received!
        </h3>
        <p className="mt-3 text-sm text-[#0a0a0a]/55 font-light leading-relaxed max-w-sm mx-auto">
          Thank you for reaching out. We&apos;ll review your inquiry and get back to you within one business day.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      {/* Name + Email Row */}
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="text-[10px] uppercase tracking-widest text-[#0a0a0a]/38 font-semibold mb-2 block">
            Your Name *
          </span>
          <input
            type="text"
            required
            placeholder="John Doe"
            className="w-full rounded-xl border border-[#0a0a0a]/8 bg-white px-4 py-3 text-sm text-[#0a0a0a] placeholder:text-[#0a0a0a]/25 focus:outline-none focus:border-[#800000]/40 focus:ring-1 focus:ring-[#800000]/20 transition-all duration-200"
            style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
          />
        </label>
        <label className="block">
          <span className="text-[10px] uppercase tracking-widest text-[#0a0a0a]/38 font-semibold mb-2 block">
            Work Email *
          </span>
          <input
            type="email"
            required
            placeholder="you@company.com"
            className="w-full rounded-xl border border-[#0a0a0a]/8 bg-white px-4 py-3 text-sm text-[#0a0a0a] placeholder:text-[#0a0a0a]/25 focus:outline-none focus:border-[#800000]/40 focus:ring-1 focus:ring-[#800000]/20 transition-all duration-200"
            style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
          />
        </label>
      </div>

      {/* Company + Website Row */}
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="text-[10px] uppercase tracking-widest text-[#0a0a0a]/38 font-semibold mb-2 block">
            Company Name
          </span>
          <input
            type="text"
            placeholder="Your brand or company"
            className="w-full rounded-xl border border-[#0a0a0a]/8 bg-white px-4 py-3 text-sm text-[#0a0a0a] placeholder:text-[#0a0a0a]/25 focus:outline-none focus:border-[#800000]/40 focus:ring-1 focus:ring-[#800000]/20 transition-all duration-200"
            style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
          />
        </label>
        <label className="block">
          <span className="text-[10px] uppercase tracking-widest text-[#0a0a0a]/38 font-semibold mb-2 block">
            Website URL
          </span>
          <input
            type="url"
            placeholder="https://yoursite.com"
            className="w-full rounded-xl border border-[#0a0a0a]/8 bg-white px-4 py-3 text-sm text-[#0a0a0a] placeholder:text-[#0a0a0a]/25 focus:outline-none focus:border-[#800000]/40 focus:ring-1 focus:ring-[#800000]/20 transition-all duration-200"
            style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
          />
        </label>
      </div>

      {/* Service Interest */}
      <label className="block">
        <span className="text-[10px] uppercase tracking-widest text-[#0a0a0a]/38 font-semibold mb-2 block">
          What are you looking for? *
        </span>
        <div className="relative">
          <select
            required
            className="w-full rounded-xl border border-[#0a0a0a]/8 bg-white px-4 py-3 pr-10 text-sm text-[#0a0a0a] focus:outline-none focus:border-[#800000]/40 focus:ring-1 focus:ring-[#800000]/20 transition-all duration-200 appearance-none cursor-pointer"
            style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
            defaultValue=""
          >
            <option value="" disabled>
              Select a service
            </option>
            {serviceOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black/40">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </label>

      {/* Monthly Budget */}
      <label className="block">
        <span className="text-[10px] uppercase tracking-widest text-[#0a0a0a]/38 font-semibold mb-2 block">
          Monthly Budget Range
        </span>
        <div className="relative">
          <select
            className="w-full rounded-xl border border-[#0a0a0a]/8 bg-white px-4 py-3 pr-10 text-sm text-[#0a0a0a] focus:outline-none focus:border-[#800000]/40 focus:ring-1 focus:ring-[#800000]/20 transition-all duration-200 appearance-none cursor-pointer"
            style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
            defaultValue=""
          >
            <option value="" disabled>
              Select budget range
            </option>
            {budgetRanges.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black/40">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </label>

      {/* Project Details */}
      <label className="block">
        <span className="text-[10px] uppercase tracking-widest text-[#0a0a0a]/38 font-semibold mb-2 block">
          Tell us about your project *
        </span>
        <textarea
          rows={5}
          required
          placeholder="What are your goals? What challenges are you facing? What does success look like for you?"
          className="w-full rounded-xl border border-[#0a0a0a]/8 bg-white px-4 py-3 text-sm text-[#0a0a0a] placeholder:text-[#0a0a0a]/25 focus:outline-none focus:border-[#800000]/40 focus:ring-1 focus:ring-[#800000]/20 transition-all duration-200 resize-none"
          style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
        />
      </label>

      {/* Submit */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <Button type="submit">Send Inquiry →</Button>
        <span className="text-[10px] text-[#0a0a0a]/30 font-light hidden md:inline">
          We typically respond within 24 hours
        </span>
      </div>
    </form>
  );
}
