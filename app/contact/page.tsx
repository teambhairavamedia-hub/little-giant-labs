import { Container } from "@/components/layout/Container";
import { ContactForm } from "@/components/contact/ContactForm";

export default function ContactPage() {
  return <main className="min-h-screen bg-[#0B1B2B] text-[#F8F6F0]">
    <section className="relative overflow-hidden border-b border-[#F0F4F8]/20 bg-[#0B1B2B] px-6 pb-16 pt-24 md:px-8 md:pb-20 md:pt-32">
      <Container className="relative">
        <p className="mb-6 text-[10px] font-semibold uppercase tracking-[.28em] text-[#C5A059]">Little Giant Labs <span className="px-2 text-[#E2E8F0]">/</span> Partnership application</p>
        <h1 className="max-w-4xl font-display text-5xl leading-[.98] tracking-[-.055em] text-[#F8F6F0] sm:text-6xl md:text-7xl">Growth built for<br/><span className="text-[#8BA898]">the next order.</span></h1>
        <p className="mt-8 max-w-xl text-sm leading-relaxed text-[#E2E8F0] md:text-base">A considered conversation begins with context. Share where your enterprise is today, what is holding growth back, and where you intend to go.</p>
      </Container>
    </section>
    <section className="bg-[#0B1B2B] px-6 py-14 md:px-8 md:py-20">
      <Container>
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-16">
          <aside className="lg:sticky lg:top-12 lg:self-start">
            <p className="text-[10px] font-semibold uppercase tracking-[.24em] text-[#C5A059]">A deliberate process</p>
            <h2 className="mt-5 max-w-sm font-display text-3xl leading-tight tracking-[-.04em] text-[#F8F6F0]">The right growth partnership starts with the right questions.</h2>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#E2E8F0]">This application gives our team the context to review your objectives, operating environment, and expectations.</p>
            <div className="mt-10 border-t border-[#F0F4F8]/30 pt-5 text-[10px] font-semibold uppercase tracking-[.22em] text-[#E2E8F0]">Intellect. Media. Capital.</div>
          </aside>
          <ContactForm />
        </div>
      </Container>
    </section>
  </main>;
}
