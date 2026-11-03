"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { captureLeadSource } from "@/lib/lead-source";
import { gaMeasurementId, metaPixelId, trackEvent } from "@/lib/analytics";

/* Public pages only. Records where the visitor came from (for the enquiry form), loads Google Analytics and the
   Meta Pixel when their IDs are configured, and reports contact clicks and Calendly bookings as conversions. */
export function Analytics() {
  const pathname = usePathname();
  const gaId = gaMeasurementId();
  const pixelId = metaPixelId();
  const firstPage = useRef(true);

  useEffect(() => {
    captureLeadSource();
  }, []);

  // The pixel's snippet counts the first page; later client-side navigations are counted here
  useEffect(() => {
    if (firstPage.current) { firstPage.current = false; return; }
    window.fbq?.("track", "PageView");
  }, [pathname]);

  // One listener for every contact link, so the buttons themselves need no tracking code
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href]");
      const href = link?.getAttribute("href") ?? "";
      if (href.startsWith("https://wa.me/")) trackEvent("whatsapp_click");
      else if (href.startsWith("mailto:")) trackEvent("email_click");
      else if (href.startsWith("tel:")) trackEvent("phone_click");
      else if (href.includes("calendly.com/")) trackEvent("book_call_click");
    };
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== "https://calendly.com") return;
      if ((event.data as { event?: string } | null)?.event === "calendly.event_scheduled") trackEvent("book_meeting");
    };
    document.addEventListener("click", onClick, { capture: true });
    window.addEventListener("message", onMessage);
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("message", onMessage);
    };
  }, []);

  return (
    <>
      {gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag("js",new Date());gtag("config","${gaId}");`}
          </Script>
        </>
      )}
      {pixelId && (
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");fbq("init","${pixelId}");fbq("track","PageView");`}
        </Script>
      )}
    </>
  );
}
