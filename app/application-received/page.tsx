import Link from "next/link";
import { Container } from "@/components/layout/Container";

export default function ApplicationReceivedPage() {
  return <main className="flex min-h-[75vh] items-center bg-[#0B1B2B] py-24 text-[#F8F6F0]">
    <Container className="w-full">
      <div className="mx-auto max-w-3xl border-l border-[#C5A059] py-4 pl-7 sm:pl-12">
        <p className="text-[10px] font-semibold uppercase tracking-[.28em] text-[#C5A059]">Application received</p>
        <h1 className="mt-7 font-display text-5xl leading-[1.02] tracking-[-.055em] sm:text-7xl">The next move<br/><span className="text-[#8BA898]">is ours.</span></h1>
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-[#E2E8F0]">Your application has been submitted successfully. Our team will review your organization&apos;s growth objectives, financial context, and strategic requirements.</p>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#E2E8F0]">If there is a strong alignment with our engagement model, we&apos;ll be in touch regarding the next steps.</p>
        <p className="mt-12 text-[10px] font-semibold uppercase tracking-[.24em] text-[#C5A059]">Little Giant Labs — Intellect. Media. Capital.</p>
        <Link href="/" className="mt-10 inline-flex min-h-12 items-center border border-[#F0F4F8] px-6 text-xs font-semibold uppercase tracking-[.16em] text-[#F8F6F0] transition-colors hover:border-[#C5A059] hover:text-[#C5A059]">Return to the main website <span aria-hidden="true" className="ml-4">↗</span></Link>
      </div>
    </Container>
  </main>;
}
