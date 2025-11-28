export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://softninetynine.com",
    "name": "سوفت تسعة وتسعين",
    "alternateName": "Soft Ninety Nine",
    "description": "متجر متخصص في بيع الدراجات النارية وقطع الغيار الأصلية وزيوت الصيانة والإكسسوارات في جيزان",
    "url": "https://softninetynine.com",
    "image": "https://softninetynine.com/Logo.png",
    "logo": "https://softninetynine.com/Logo.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "بجوار مستشفى العميس",
      "addressLocality": "جيزان",
      "addressRegion": "منطقة جيزان",
      "addressCountry": "SA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "16.9064",
      "longitude": "42.5525"
    },
    "openingHours": "Mo-Su 17:30-03:00",
    "telephone": "+966568663381",
    "priceRange": "$$",
    "acceptsReservations": false,
    "currenciesAccepted": "SAR",
    "paymentAccepted": "Cash, Credit Card",
    "areaServed": {
      "@type": "Place",
      "name": "جيزان، المملكة العربية السعودية"
    },
    "category": "Motorcycle Parts Store",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "قطع غيار وزيوت الدراجات النارية",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "زيوت موتول للدراجات النارية",
            "category": "Motorcycle Oil"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Product",
            "name": "فلاتر الزيت والهواء",
            "category": "Motorcycle Filters"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product", 
            "name": "بطاريات الدراجات النارية",
            "category": "Motorcycle Batteries"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "إكسسوارات وقطع غيار",
            "category": "Motorcycle Accessories"
          }
        }
      ]
    },
    "sameAs": [
      "https://www.snapchat.com/add/h5jk6"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}