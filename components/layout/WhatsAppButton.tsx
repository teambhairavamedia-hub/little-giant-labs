import Image from "next/image";
import { siteConfig } from "@/lib/site";

/* Floating click-to-chat button on every public page: the WhatsApp logo opens a chat with the business number,
   with a short greeting already typed. English only for now. */
export function WhatsAppButton() {
  const { number, display, message } = siteConfig.whatsapp;
  return (
    <a
      className="wa-chat"
      href={`https://wa.me/${number}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with us on WhatsApp (${display})`}
      title={`Chat with us on WhatsApp: ${display}`}
    >
      <Image src="/media/whatsapp-logo.png" alt="" width={192} height={192} sizes="60px" className="h-full w-full" />
    </a>
  );
}
