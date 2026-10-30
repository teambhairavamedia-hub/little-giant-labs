// The service pillars, in the same order as dict.servicesPage.items. The homepage shows all five
// (dict.home.whatWeDo.items).
// Both places crop to 4:3; `focus` is the object-position that keeps each photo's subject in view.
export const servicePillars = [
  { slug: "brand-strategy", image: "/media/home/brand-strategy.png", width: 1600, height: 1111, focus: "center" },
  // Keeps the "Ideas" bubble and the tablet in frame
  { slug: "creative-content", image: "/media/home/creative-content.png", width: 1600, height: 1446, focus: "center top" },
  // Keeps the sales charts and the pointing hand in frame
  { slug: "digital-growth", image: "/media/home/digital-growth-sales.png", width: 1600, height: 1066, focus: "20% center" },
  { slug: "employer-brand", image: "/media/home/employer-brand-team.png", width: 1600, height: 1066, focus: "center" },
  // Keeps the pointing hand and the "Product" heading in frame
  { slug: "technology-product", image: "/media/home/technology-product.png", width: 1600, height: 986, focus: "45% center" },
] as const;
