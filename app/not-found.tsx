import Link from "next/link";
import { Container } from "@/components/layout/Container";

export default function NotFound() {
  return (
    <main className="flex min-h-[75vh] items-center bg-lgl-bg py-24 text-lgl-fg">
      <Container className="w-full">
        <div className="mx-auto max-w-3xl border-l border-[#C5A059] py-4 pl-7 sm:pl-12">
          <p className="text-[11px] font-semibold uppercase tracking-[.28em] text-lgl-gold">
            404 / Error
          </p>
          <h1 className="mt-7 font-display text-5xl leading-[1.02] tracking-[-.055em] sm:text-7xl">
            Page not <span className="text-lgl-sage">found</span>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-lgl-soft">
            The requested page does not exist or has been moved. Check the URL or return to the main website.
          </p>
          <Link
            href="/"
            className="mt-10 inline-flex min-h-12 items-center border border-lgl-line px-6 text-xs font-semibold uppercase tracking-[.16em] text-lgl-fg transition-colors hover:border-[#C5A059] hover:text-lgl-gold cursor-pointer"
          >
            Return to the main website <span aria-hidden="true" className="ml-4">↗</span>
          </Link>
        </div>
      </Container>
    </main>
  );
}
