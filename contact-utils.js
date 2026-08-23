function escapeVCard(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

export function createRestaurantVCard(restaurant) {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCard(restaurant.restaurantName)}`,
    `ORG:${escapeVCard(restaurant.restaurantName)}`,
    `TEL;TYPE=CELL:${escapeVCard(restaurant.phoneVCardDisplay)}`,
    `TEL;TYPE=VOICE:${escapeVCard(restaurant.secondaryPhoneDisplay)}`,
    `EMAIL;TYPE=INTERNET:${escapeVCard(restaurant.email)}`,
    `ADR;TYPE=WORK:;;${escapeVCard(restaurant.address)};;;;`
  ];
  if (restaurant.publicCardUrl) lines.push(`URL:${escapeVCard(restaurant.publicCardUrl)}`);
  lines.push("END:VCARD");
  return `${lines.join("\r\n")}\r\n`;
}

export const contactCardFilename = "la-casa-del-marisco.vcf";
