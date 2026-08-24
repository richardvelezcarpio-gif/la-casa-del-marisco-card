const whatsapp = "593967850030";
const address = "Paucarbamba 5-09 y Luis Moreno Mora (Esq.)";
const officialUrl = "https://www.lacasadelmarisco.online";
const reservationMessage = `Hola, quisiera reservar una mesa en La Casa del Marisco.\n\nNombre:\nFecha:\nHora:\nNúmero de personas:`;

export const restaurant = {
  restaurantName: "La Casa del Marisco",
  name: "La Casa del Marisco",
  tagline: "Sabor • Frescura • Tradición",
  phoneDisplay: "096 785 0030",
  phoneInternational: "+593967850030",
  phoneVCardDisplay: "+593 96 785 0030",
  secondaryPhoneDisplay: "072 883 677",
  secondaryPhoneHref: "tel:072883677",
  whatsapp: whatsapp,
  whatsappNumber: whatsapp,
  email: "lacasadelmariscocuenca@gmail.com",
  address,
  timezone: "America/Guayaquil",
  googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`La Casa del Marisco, ${address}`)}`,
  googleRating: 4.1,
  googleReviewCount: 518,
  googleReviewsUrl: "https://www.google.com/search?q=google+la+casa+del+marisco+cuenca&oq=google+la+casa+del+marisco+cuenca&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQRRhA0gEJMTI4MzVqMGo0qAIAsAIB&sourceid=chrome&source=chrome.ob&ie=UTF-8#lrd=0x91cd1868525f6f0f:0x46dd16c111afd654,3,,,,",
  reservationUrl: `https://wa.me/${whatsapp}?text=${encodeURIComponent(reservationMessage)}`,
  websiteUrl: officialUrl,
  instagramUrl: "https://www.instagram.com/la_casa_del_marisco/",
  facebookUrl: "https://www.facebook.com/lacasadelmariscocuenca",
  tiktokUrl: "https://www.tiktok.com/@lacasadelmarisco_cuenca?is_from_webapp=1&sender_device=pc",
  youtubeUrl: null,
  publicCardUrl: officialUrl,
  publicUrl: officialUrl,
  menuPdfUrl: "public/menu/menu-la-casa-del-marisco.pdf",
  menuPdf: "public/menu/menu-la-casa-del-marisco.pdf",
  menuPdfByLanguage: { es: "public/menu/menu-la-casa-del-marisco.pdf", en: null },
  hours: [
    ["Sábado", "09:00 – 21:00"], ["Domingo", "09:00 – 18:00"],
    ["Lunes", "10:00 – 20:00"], ["Martes", "10:00 – 20:00"],
    ["Miércoles", "10:00 – 20:00"], ["Jueves", "09:00 – 18:00"],
    ["Viernes", "09:00 – 21:00"]
  ],
  socials: {
    instagram: { handle: "@la_casa_del_marisco", url: "https://www.instagram.com/la_casa_del_marisco/" },
    tiktok: { handle: "@lacasadelmarisco_cuenca", url: "https://www.tiktok.com/@lacasadelmarisco_cuenca?is_from_webapp=1&sender_device=pc" },
    facebook: { handle: "La Casa del Marisco Cuenca", url: "https://www.facebook.com/lacasadelmariscocuenca" },
    youtube: { handle: null, url: null }
  },
  links: {
    reservations: `https://wa.me/${whatsapp}?text=${encodeURIComponent(reservationMessage)}`,
    directions: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`La Casa del Marisco, ${address}`)}`,
    reviews: null,
    website: officialUrl
  }
};
