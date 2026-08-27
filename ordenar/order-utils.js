export const formatMoney = cents => `$${(cents / 100).toFixed(2)}`;
export const calculateTotalCents = cart => cart.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);

import { t } from "../data/i18n.js";

export function createWhatsAppMessage(cart, { name, phone, type, address = "", notes = "" }, language = "es") {
  const lines = cart.map(item => `${item.quantity} × ${item.name}${item.optionLabel ? ` — ${item.optionLabel}` : ""}\n${formatMoney(item.priceCents)} ${t(language,"each")}\n${t(language,"subtotal")}: ${formatMoney(item.priceCents * item.quantity)}`);
  const localizedType = t(language, type === "Delivery" ? "delivery" : "pickup");
  return `${t(language,"waGreeting")}\n\n${t(language,"waName")}:\n${name}\n\n${t(language,"waPhone")}:\n${phone}\n\n${t(language,"waType")}:\n${localizedType}${type === "Delivery" ? `\n\n${t(language,"waAddress")}:\n${address}` : ""}\n\n${t(language,"waOrder")}:\n\n${lines.join("\n\n")}\n\n${t(language,"waTotal")}:\n${formatMoney(calculateTotalCents(cart))}\n\n${t(language,"waNotes")}:\n${notes || t(language,"noNotes")}\n\n${t(language,"waThanks")}`;
}

export function createWhatsAppUrl(number, message) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
