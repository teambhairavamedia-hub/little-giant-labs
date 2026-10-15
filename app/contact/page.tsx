import { Container } from "@/components/layout/Container";
import { ContactForm } from "@/components/contact/ContactForm";

export default function ContactPage() {
  return <main className="min-h-screen bg-lgl-bg text-lgl-fg">
    <section className="relative overflow-hidden border-b border-lgl-line/20 bg-lgl-bg px-6 pb-16 pt-24 md:px-8 md:pb-20 md:pt-32">
      <Container className="relative">
        <p className="mb-6 text-[10px] font-semibold uppercase tracking-[.28em] text-lgl-gold">Little Giant Labs <span className="px-2 text-lgl-soft">/</span> Partnership application</p>
        <h1 className="max-w-4xl font-display text-5xl leading-[.98] tracking-[-.055em] text-lgl-fg sm:text-6xl md:text-7xl">Growth built for<br/><span className="text-lgl-sage">the next order.</span></h1>
        <p className="mt-8 max-w-xl text-sm leading-relaxed text-lgl-soft md:text-base">A considered conversation begins with context. Share where your enterprise is today, what is holding growth back, and where you intend to go.</p>
      </Container>
    </section>
    <section className="bg-lgl-bg px-6 py-14 md:px-8 md:py-20">
      <Container>
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-16">
          <aside className="lg:sticky lg:top-12 lg:self-start">
            <p className="text-[10px] font-semibold uppercase tracking-[.24em] text-lgl-gold">A deliberate process</p>
            <h2 className="mt-5 max-w-sm font-display text-3xl leading-[1.35] tracking-[-.04em] text-lgl-fg [word-spacing:0.17em]">The right growth partnership starts with the right questions.</h2>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-lgl-soft">This application gives our team the context to review your objectives, operating environment, and expectations.</p>
            <div className="mt-10 border-t border-lgl-line/30 pt-5 text-[10px] font-semibold uppercase tracking-[.22em] text-lgl-soft">Intellect. Media. Capital.</div>
          </aside>
          <ContactForm />
        </div>
      </Container>
    </section>
  </main>;
}
