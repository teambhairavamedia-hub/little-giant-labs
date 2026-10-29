// The service pillars, in the same order as dict.servicesPage.items. The homepage shows the first four
// (dict.home.whatWeDo.items); Technology & Product Marketing appears only on the Services page.
// Images are Unsplash photos (Unsplash License) stored locally as placeholders for brand-owned imagery;
// the technology pillar uses a local SVG illustration as its placeholder.
export const servicePillars = [
  { slug: "brand-strategy", image: "/media/home/brand-strategy.jpg" },
  { slug: "creative-content", image: "/media/home/creative-studio.jpg" },
  { slug: "digital-growth", image: "/media/home/digital-growth.jpg" },
  { slug: "employer-brand", image: "/media/home/employer-brand.jpg" },
  { slug: "technology-product", image: "/media/home/technology-product.svg" },
] as const;
