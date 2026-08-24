import { restaurant } from "./data/restaurant.js";
import { menuItems } from "./data/menu.js";
import { createRestaurantVCard, contactCardFilename } from "./contact-utils.js";
import { createCardShareData, shareOrCopy } from "./share-utils.js";
import { translations as copy, dayLabels, getLanguage, setStoredLanguage, t } from "./data/i18n.js";

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

let language = getLanguage();
let cart = JSON.parse(localStorage.getItem("lcm-cart") || "[]");
let currentPdfPage = 1;
const totalPdfPages = 16;

function setLanguage(lang) {
  language = lang; setStoredLanguage(lang); document.documentElement.lang = lang;
  $$('[data-lang]').forEach(button => { const active = button.dataset.lang === lang; button.classList.toggle("active", active); button.setAttribute("aria-pressed", active); });
  $$('[data-i18n]').forEach(node => { const value = copy[lang][node.dataset.i18n]; if (value) node.textContent = value; });
  $$('[data-i18n-aria]').forEach(node => node.setAttribute("aria-label", t(lang, node.dataset.i18nAria)));
  $$('[data-i18n-alt]').forEach(node => node.alt = t(lang, node.dataset.i18nAlt));
  document.querySelector('meta[name="description"]').content = t(lang, "homeDescription");
  document.title = "La Casa del Marisco";
  renderHours(); updateOpenStatus(); updateLanguageLinks();
  if ($("#page-status")) $("#page-status").textContent = `${lang === "es" ? "Página" : "Page"} ${currentPdfPage} / ${totalPdfPages}`;
  renderCart();
}

function showToast(message, duration = 2800) { const toast = $("#toast"); toast.textContent = message; toast.classList.add("show"); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("show"), duration); }
function toggleDrawer(open) { $("#drawer").classList.toggle("open", open); $("#drawer").setAttribute("aria-hidden", !open); $("#drawer-backdrop").classList.toggle("open", open); $("#menu-toggle").setAttribute("aria-expanded", open); document.body.classList.toggle("drawer-open", open); }

function whatsappUrl(message = "") {
  return "https://wa.me/" + restaurant.whatsappNumber + (message ? "?text=" + encodeURIComponent(message) : "");
}

async function copyLink(url) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
  } else {
    const field = document.createElement("textarea");
    field.value = url; field.setAttribute("readonly", ""); field.style.position = "fixed"; field.style.opacity = "0";
    document.body.appendChild(field); field.select(); document.execCommand("copy"); field.remove();
  }
  showToast(t(language, "copied"), 1800);
}

async function shareCard() {
  const shareData = createCardShareData(restaurant, window.location.href, t(language, "shareText"));
  try {
    await shareOrCopy({ shareData, nativeShare: navigator.share?.bind(navigator), copy: copyLink });
  } catch { showToast(t(language, "copyFailed")); }
}

function saveContactCard() {
  const blob = new Blob([createRestaurantVCard(restaurant)], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; link.download = contactCardFilename; link.hidden = true;
  document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast(t(language, "contactReady"), 1800);
}

function reservationUrl() { return `https://wa.me/${restaurant.whatsappNumber}?text=${encodeURIComponent(t(language, "reservationMessage"))}`; }
function renderHours() { $("#hours-list").innerHTML = restaurant.hours.map(([day,time]) => `<div><span>${dayLabels[language][day]}</span><strong>${time}</strong></div>`).join(""); }
function updateLanguageLinks() {
  $("#reservation-link").href = reservationUrl();
  $("#general-whatsapp").href = whatsappUrl(t(language, "generalWhatsappMessage"));
}

function updateOpenStatus() {
  const formatter = new Intl.DateTimeFormat("en-US", { timeZone: restaurant.timezone, weekday: "long", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  const parts = Object.fromEntries(formatter.formatToParts(new Date()).map(part => [part.type, part.value]));
  const dayMap = { Sunday:"Domingo", Monday:"Lunes", Tuesday:"Martes", Wednesday:"Miércoles", Thursday:"Jueves", Friday:"Viernes", Saturday:"Sábado" };
  const today = dayMap[parts.weekday];
  const entry = restaurant.hours.find(([day]) => day === today);
  const currentMinutes = Number(parts.hour) * 60 + Number(parts.minute);
  let isOpen = false;
  if (entry) {
    const [start,end] = entry[1].split(/\s*[–-]\s*/).map(value => { const [hour,minute] = value.split(":").map(Number); return hour * 60 + minute; });
    isOpen = currentMinutes >= start && currentMinutes < end;
  }
  const status = $("#open-status");
  status.textContent = isOpen ? t(language, "openNow") : t(language, "closed");
  status.classList.toggle("is-open", isOpen); status.classList.toggle("is-closed", !isOpen);
}

function connectOptionalSocial(selector, url) {
  const link = $(selector);
  if (url) link.href = url;
  else link.addEventListener("click", event => { event.preventDefault(); showToast(t(language, "linkPending")); });
}

function renderProducts() {
  const list = $("#product-list");
  if (!list) return;
  if (!menuItems.length) { list.innerHTML = `<div class="empty-state"><span>✦</span><h3>${language === "es" ? "Precios reales, siempre" : "Real prices, always"}</h3><p>${language === "es" ? "No mostraremos productos hasta verificar el menú original. Así evitamos inventar nombres o precios." : "Products stay hidden until the original menu is verified, so no names or prices are invented."}</p></div>`; return; }
  list.innerHTML = menuItems.filter(item => item.available).sort((a,b) => a.order-b.order).map(item => `<article class="product"><p class="eyebrow">${item.category}</p><h3>${item.name}</h3>${item.options.map((option,index) => `<label><input type="radio" name="${item.id}" value="${index}" ${index===0?"checked":""}> ${option.label} <strong>${money.format(option.price)}</strong></label>`).join("")}<button data-add="${item.id}">${language === "es" ? "Agregar" : "Add"}</button></article>`).join("");
}

function renderCart() {
  const items = $("#cart-items"); const count = cart.reduce((sum,item) => sum + item.quantity, 0); const total = cart.reduce((sum,item) => sum + item.price * item.quantity, 0);
  if (!items) return;
  $("#cart-count").textContent = count; $("#subtotal").textContent = money.format(total); $("#send-whatsapp").disabled = !cart.length;
  items.innerHTML = cart.length ? cart.map((item,index) => `<div class="cart-item"><div><strong>${item.name}</strong><small>${item.option}</small><span>${item.quantity} × ${money.format(item.price)}</span></div><div class="quantity"><button data-cart="minus" data-index="${index}" aria-label="Restar">−</button><b>${item.quantity}</b><button data-cart="plus" data-index="${index}" aria-label="Sumar">+</button><button data-cart="remove" data-index="${index}" aria-label="Eliminar">×</button></div></div>`).join("") : `<p class="empty-cart">${language === "es" ? "Tu orden está vacía." : "Your order is empty."}</p>`;
  localStorage.setItem("lcm-cart", JSON.stringify(cart));
}

function sendWhatsApp() {
  if (!cart.length) return;
  const lines = cart.map(item => `${item.quantity} × ${item.name}${item.option ? ` — ${item.option}` : ""} — ${money.format(item.price * item.quantity)}`);
  const total = cart.reduce((sum,item) => sum + item.price * item.quantity, 0); const notes = $("#order-notes").value.trim() || "—";
  const message = `Hola, quiero realizar la siguiente orden en ${restaurant.name}:\n\n${lines.join("\n")}\n\nTotal: ${money.format(total)}\n\nNotas:\n${notes}\n\nNombre:\nPickup / Delivery:`;
  window.open(`https://wa.me/${restaurant.whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
}

function updatePdfPage(page) {
  currentPdfPage = Math.min(totalPdfPages, Math.max(1, page));
  $("#pdf-frame").src = `${restaurant.menuPdf}#page=${currentPdfPage}&view=FitH`;
  $("#page-status").textContent = `${language === "es" ? "Página" : "Page"} ${currentPdfPage} / ${totalPdfPages}`;
  $("#prev-page").disabled = currentPdfPage === 1;
  $("#next-page").disabled = currentPdfPage === totalPdfPages;
}

function initializePdf() {
  fetch(restaurant.menuPdf, { method: "HEAD" }).then(response => {
    if (!response.ok || !(response.headers.get("content-type") || "").includes("pdf")) return;
    $("#pdf-missing").hidden = true;
    $("#pdf-frame").classList.add("visible");
    updatePdfPage(1);
  }).catch(() => {});
}

$("#directions-link").href = restaurant.googleMapsUrl;
$("#bottom-location").href = restaurant.googleMapsUrl;
$("#contact-address").href = restaurant.googleMapsUrl;
$("#contact-whatsapp").href = whatsappUrl();
$("#reviews-link").addEventListener("click", () => restaurant.googleReviewsUrl ? window.open(restaurant.googleReviewsUrl, "_blank", "noopener,noreferrer") : showToast(t(language, "reviewPending")));
$("#google-rating").textContent = restaurant.googleRating.toFixed(1);
$("#google-review-count").textContent = restaurant.googleReviewCount.toLocaleString("es-EC");
if (restaurant.googleReviewsUrl) $("#google-review-button").href = restaurant.googleReviewsUrl;
connectOptionalSocial("#instagram-link", restaurant.instagramUrl);
connectOptionalSocial("#facebook-link", restaurant.facebookUrl);
connectOptionalSocial("#tiktok-link", restaurant.tiktokUrl);
setInterval(updateOpenStatus, 60000);
if (restaurant.publicCardUrl) { $("#qr-placeholder").dataset.url = restaurant.publicCardUrl; }
$("#menu-toggle").addEventListener("click", () => toggleDrawer(true)); $("#drawer-close").addEventListener("click", () => toggleDrawer(false)); $("#drawer-backdrop").addEventListener("click", () => toggleDrawer(false)); $$("#drawer a").forEach(link => link.addEventListener("click", () => toggleDrawer(false)));
$$('[data-lang]').forEach(button => button.addEventListener("click", () => { setLanguage(button.dataset.lang); renderProducts(); }));
$$('[data-placeholder]').forEach(button => button.addEventListener("click", () => showToast(t(language, "linkPending"))));
$("#share-button").addEventListener("click", shareCard);
$("#share-card").addEventListener("click", shareCard);
$("#save-contact").addEventListener("click", saveContactCard);
const contactToggle = $("#contact-toggle");
const contactList = $("#contact-list");
function setContactExpanded(expanded) {
  contactToggle.setAttribute("aria-expanded", String(expanded));
  contactList.hidden = !expanded;
  $("#contacto").classList.toggle("contact-open", expanded);
}
contactToggle.addEventListener("click", () => {
  setContactExpanded(contactToggle.getAttribute("aria-expanded") !== "true");
});
setContactExpanded(false);
$("#cart-items")?.addEventListener("click", event => { const button = event.target.closest("[data-cart]"); if (!button) return; const index = Number(button.dataset.index); if (button.dataset.cart === "plus") cart[index].quantity++; if (button.dataset.cart === "minus") cart[index].quantity = Math.max(1, cart[index].quantity-1); if (button.dataset.cart === "remove") cart.splice(index,1); renderCart(); });
$("#send-whatsapp")?.addEventListener("click", sendWhatsApp);
$("#prev-page")?.addEventListener("click", () => updatePdfPage(currentPdfPage - 1));
$("#next-page")?.addEventListener("click", () => updatePdfPage(currentPdfPage + 1));
setLanguage(language); renderProducts();
