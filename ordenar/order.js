import { menuItems, categories } from "../data/menu.js";
import { restaurant } from "../data/restaurant.js";
import { formatMoney as money, calculateTotalCents, createWhatsAppMessage, createWhatsAppUrl } from "./order-utils.js";
import { getLanguage, setStoredLanguage, t, categoryLabel, optionLabel, productName, productDescription, productNamesEn } from "../data/i18n.js";
import { createCardShareData, shareOrCopy } from "../share-utils.js";

const $ = (selector, root = document) => root.querySelector(selector);
const normalize = value => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const storageKey = "lcm-order-v2";

function safeReadCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(item => typeof item.productId === "string" && Number.isInteger(item.priceCents) && Number.isInteger(item.quantity) && item.quantity > 0);
  } catch { return []; }
}
function safeWriteCart() { try { localStorage.setItem(storageKey, JSON.stringify(cart)); } catch {} }

let cart = safeReadCart();
let search = "";
let pendingWhatsAppUrl = "";
let language = getLanguage();
const selections = new Map();
const quantities = new Map();
const productIndexes = new Map(menuItems.map((item,index) => [item.id,index]));

function productById(id) { return menuItems.find(item => item.id === id); }
function itemName(item) { return productName(item, language, productIndexes.get(item.id)); }
function itemOption(item, optionIndex) { return optionLabel(item.options[optionIndex]?.label, language); }
function totalCents() { return calculateTotalCents(cart); }
function itemCount() { return cart.reduce((sum, item) => sum + item.quantity, 0); }
function showToast(message) { const toast=$("#toast"); toast.textContent=message; toast.classList.add("show"); clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>toast.classList.remove("show"),2200); }
async function copyOrderLink(url){if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(url);else{const field=document.createElement("textarea");field.value=url;field.style.position="fixed";field.style.opacity="0";document.body.appendChild(field);field.select();document.execCommand("copy");field.remove();}showToast(t(language,"copied"));}
async function shareOrderPage(){const homeUrl=restaurant.publicCardUrl||new URL("../",window.location.href).href;const data=createCardShareData(restaurant,homeUrl,t(language,"shareText"));try{await shareOrCopy({shareData:data,nativeShare:navigator.share?.bind(navigator),copy:copyOrderLink});}catch{showToast(t(language,"copyFailed"));}}

function setLanguage(lang) {
  language = lang; setStoredLanguage(lang); document.documentElement.lang = lang; document.title = t(lang,"orderPageTitle");
  document.querySelectorAll("[data-lang]").forEach(button=>{const active=button.dataset.lang===lang;button.classList.toggle("active",active);button.setAttribute("aria-pressed",active);});
  document.querySelectorAll("[data-i18n]").forEach(node=>node.textContent=t(lang,node.dataset.i18n));
  document.querySelectorAll("[data-i18n-placeholder]").forEach(node=>node.placeholder=t(lang,node.dataset.i18nPlaceholder));
  document.querySelectorAll("[data-i18n-aria]").forEach(node=>node.setAttribute("aria-label",t(lang,node.dataset.i18nAria)));
  document.querySelector('meta[name="description"]').content=t(lang,"orderDescription");
  renderCategoryNav(); renderProducts(); renderCart();
}

function renderCategoryNav() {
  $("#category-nav").innerHTML = categories.map((category,index) => `<button type="button" data-category="${category}" class="${index===0?"active":""}">${categoryLabel(category,language)}</button>`).join("");
}

function productMarkup(item) {
  const selected = selections.get(item.id) ?? 0;
  const quantity = quantities.get(item.id) ?? 1;
  const selectedOption = item.options[selected];
  const name = itemName(item), description = productDescription(item,language);
  const fromPrice = item.options.length > 1 ? `<p class="from-price">${t(language,"from")} <strong>${money(Math.min(...item.options.map(option => option.priceCents)))}</strong></p>` : "";
  const options = item.options.length ? `<div class="option-list" role="radiogroup" aria-label="${name}">${item.options.map((opt,index)=>`<label class="option-chip"><input type="radio" name="option-${item.id}" value="${index}" ${index===selected?"checked":""} ${item.available?"":"disabled"}><span>${opt.label?`${optionLabel(opt.label,language)}<strong>${money(opt.priceCents)}</strong>`:`<strong>${money(opt.priceCents)}</strong>`}</span></label>`).join("")}</div>` : `<p class="unavailable">${t(language,"pricePending")}</p>`;
  const buttonText = item.available ? `${t(language,"add")} · ${money(selectedOption.priceCents * quantity)}` : t(language,"unavailable");
  return `<article class="product-card ${item.available?"":"is-unavailable"}" data-product="${item.id}"><div class="product-copy"><h3>${name}</h3>${description?`<p class="description">${description}</p>`:""}${fromPrice}</div>${options}<div class="product-actions"><div class="quantity-picker"><button type="button" data-qty="minus" aria-label="${t(language,"decrease")} ${name}">−</button><output aria-live="polite">${quantity}</output><button type="button" data-qty="plus" aria-label="${t(language,"increase")} ${name}">+</button></div><button type="button" class="add-button" data-add ${item.available?"":"disabled"}>${buttonText}</button></div><div class="added-feedback" role="status">${t(language,"added")}</div></article>`;
}

function renderProducts() {
  const query = normalize(search.trim());
  const filtered = menuItems.filter((item,index) => !query || normalize(item.name).includes(query) || normalize(productNamesEn[index]).includes(query));
  $("#results-status").textContent = query ? `${filtered.length} ${filtered.length===1?t(language,"product"):t(language,"products")} — ${t(language,"resultsFor")} “${search.trim()}”` : `${menuItems.length} ${t(language,"originalMenuProducts")}`;
  $("#menu-sections").innerHTML = categories.map(category => {
    const items = filtered.filter(item => item.category === category);
    if (!items.length) return "";
    const slug = normalize(category).replace(/[^a-z0-9]+/g,"-");
    return `<section class="menu-category" id="cat-${slug}"><div class="category-heading"><h2>${categoryLabel(category,language)}</h2><span>${items.length} ${items.length===1?t(language,"product"):t(language,"products")}</span></div><div class="product-grid">${items.map(productMarkup).join("")}</div></section>`;
  }).join("") || `<div class="empty-state"><span>⌕</span><h2>${t(language,"noDish")}</h2><p>${t(language,"noDishHelp")}</p></div>`;
}

function addToCart(id) {
  const product = productById(id); if (!product?.available || !product.options.length) return;
  const optionIndex = selections.get(id) ?? 0; const option = product.options[optionIndex]; const quantity = quantities.get(id) ?? 1;
  const key = `${id}::${optionIndex}`; const existing = cart.find(item => item.key === key);
  if (existing) existing.quantity += quantity; else cart.push({ key, productId:id, name:product.name, optionLabel:option.label, optionIndex, priceCents:option.priceCents, quantity });
  quantities.set(id,1); safeWriteCart(); renderCart();
  const card = document.querySelector(`[data-product="${id}"]`); if (card) { card.querySelector("output").textContent="1"; card.querySelector("[data-add]").textContent=`${t(language,"add")} · ${money(option.priceCents)}`; card.classList.add("just-added"); setTimeout(()=>card.classList.remove("just-added"),1600); }
}

function renderCart() {
  $("#cart-items").innerHTML = cart.length ? cart.map((item,index)=>{const product=productById(item.productId);const name=product?itemName(product):item.name;const option=product?itemOption(product,item.optionIndex):optionLabel(item.optionLabel,language);return `<article class="cart-item"><div><h3>${name}</h3>${option?`<small>${option}</small>`:""}<span class="unit">${item.quantity} × ${money(item.priceCents)}</span><strong class="line-total">${money(item.priceCents*item.quantity)}</strong><button type="button" class="remove-link" data-cart="remove" data-index="${index}">${t(language,"remove")}</button></div><div class="cart-controls"><button type="button" data-cart="minus" data-index="${index}" aria-label="${t(language,"decreaseCart")} ${name}">−</button><b>${item.quantity}</b><button type="button" data-cart="plus" data-index="${index}" aria-label="${t(language,"increaseCart")} ${name}">+</button></div></article>`;}).join("") : `<div class="empty-state cart-empty"><span>🛒</span><h3>${t(language,"emptyOrder")}</h3><p>${t(language,"emptyOrderHelp")}</p></div>`;
  $("#cart-subtotal").textContent = money(totalCents()); $("#cart-total").textContent = money(totalCents());
  $("#sticky-summary").textContent = `${itemCount()} ${itemCount()===1?t(language,"product"):t(language,"products")} · ${money(totalCents())}`;
  $("#header-count").textContent = itemCount(); $("#open-cart").classList.toggle("has-items",cart.length>0);
  $("#clear-cart").disabled = !cart.length;
}

function openCart(open=true) { $("#cart-drawer").classList.toggle("open",open); $("#cart-drawer").setAttribute("aria-hidden",!open); $("#cart-backdrop").classList.toggle("open",open); document.body.classList.toggle("cart-open",open); if(open) $("#close-cart").focus(); }

export function buildWhatsAppMessage({ name, phone, type, address="", notes="" }) {
  const localizedCart=cart.map(item=>{const product=productById(item.productId);return {...item,name:product?itemName(product):item.name,optionLabel:product?itemOption(product,item.optionIndex):optionLabel(item.optionLabel,language)};});
  return createWhatsAppMessage(localizedCart, { name, phone, type, address, notes }, language);
}

function validateCheckout() {
  const name=$("#customer-name").value.trim(); const phone=$("#customer-phone").value.trim(); const type=$("input[name=orderType]:checked")?.value; const address=$("#delivery-address").value.trim(); const notes=$("#order-notes").value.trim();
  if(!cart.length) return { error:t(language,"addAtLeastOne") }; if(!name) return { error:t(language,"enterName") }; if(!phone) return { error:t(language,"enterPhone") }; if(!type) return { error:t(language,"selectOrderType") }; if(type==="Delivery"&&!address) return { error:t(language,"enterAddress") };
  return { name,phone,type,address,notes };
}

$("#category-nav").addEventListener("click",event=>{const button=event.target.closest("[data-category]");if(!button)return;document.querySelectorAll("#category-nav button").forEach(item=>item.classList.toggle("active",item===button));const slug=normalize(button.dataset.category).replace(/[^a-z0-9]+/g,"-");document.getElementById(`cat-${slug}`)?.scrollIntoView({behavior:"smooth"});});
$("#dish-search").addEventListener("input",event=>{search=event.target.value;$("#clear-search").hidden=!search;renderProducts();});
$("#clear-search").addEventListener("click",()=>{search="";$("#dish-search").value="";$("#clear-search").hidden=true;renderProducts();$("#dish-search").focus();});
$("#menu-sections").addEventListener("change",event=>{const radio=event.target.closest('input[type="radio"]');if(!radio)return;const card=radio.closest("[data-product]");const id=card.dataset.product;selections.set(id,Number(radio.value));const product=productById(id),quantity=quantities.get(id)??1;card.querySelector("[data-add]").textContent=`${t(language,"add")} · ${money(product.options[Number(radio.value)].priceCents*quantity)}`;});
$("#menu-sections").addEventListener("click",event=>{const card=event.target.closest("[data-product]");if(!card)return;const id=card.dataset.product;if(event.target.closest("[data-qty]")){const direction=event.target.closest("[data-qty]").dataset.qty;const current=quantities.get(id)??1;quantities.set(id,direction==="plus"?Math.min(99,current+1):Math.max(1,current-1));const quantity=quantities.get(id);card.querySelector("output").textContent=quantity;const product=productById(id),option=product.options[selections.get(id)??0];if(option)card.querySelector("[data-add]").textContent=`${t(language,"add")} · ${money(option.priceCents*quantity)}`;}if(event.target.closest("[data-add]"))addToCart(id);});
$("#cart-items").addEventListener("click",event=>{const button=event.target.closest("[data-cart]");if(!button)return;const index=Number(button.dataset.index);if(button.dataset.cart==="plus")cart[index].quantity=Math.min(99,cart[index].quantity+1);if(button.dataset.cart==="minus")cart[index].quantity=Math.max(1,cart[index].quantity-1);if(button.dataset.cart==="remove")cart.splice(index,1);safeWriteCart();renderCart();});
$("#open-cart").addEventListener("click",()=>openCart()); $("#header-cart").addEventListener("click",()=>openCart()); $("#close-cart").addEventListener("click",()=>openCart(false)); $("#cart-backdrop").addEventListener("click",()=>openCart(false));
$("#order-location").href=restaurant.googleMapsUrl;$("#order-share").addEventListener("click",shareOrderPage);
$("#clear-cart").addEventListener("click",()=>{if(confirm(t(language,"clearOrderConfirm"))){cart=[];safeWriteCart();renderCart();}});
document.addEventListener("keydown",event=>{if(event.key==="Escape"&&$("#cart-drawer").classList.contains("open"))openCart(false);});
document.querySelectorAll('input[name="orderType"]').forEach(input=>input.addEventListener("change",()=>{$("#delivery-field").hidden=input.value!=="Delivery";$("#delivery-address").required=input.value==="Delivery";}));
function openConfirmation(data){const message=buildWhatsAppMessage(data);pendingWhatsAppUrl=createWhatsAppUrl(restaurant.whatsappNumber,message);$("#confirm-summary").textContent=`${itemCount()} ${itemCount()===1?t(language,"product"):t(language,"products")}`;$("#confirm-total").textContent=`${t(language,"total")} ${money(totalCents())}`;$("#confirm-type").textContent=t(language,data.type==="Delivery"?"delivery":"pickup");$("#confirm-sheet").classList.add("open");$("#confirm-sheet").setAttribute("aria-hidden","false");$("#confirm-backdrop").classList.add("open");$("#confirm-send").focus();}
function closeConfirmation(){$("#confirm-sheet").classList.remove("open");$("#confirm-sheet").setAttribute("aria-hidden","true");$("#confirm-backdrop").classList.remove("open");pendingWhatsAppUrl="";}
$("#checkout-form").addEventListener("submit",event=>{event.preventDefault();const data=validateCheckout();if(data.error){$("#form-error").textContent=data.error;return;}$("#form-error").textContent="";openConfirmation(data);});
$("#continue-editing").addEventListener("click",closeConfirmation);$("#confirm-backdrop").addEventListener("click",closeConfirmation);$("#confirm-send").addEventListener("click",()=>{if(pendingWhatsAppUrl)window.open(pendingWhatsAppUrl,"_blank","noopener,noreferrer");});
document.querySelectorAll("[data-lang]").forEach(button=>button.addEventListener("click",()=>setLanguage(button.dataset.lang)));

$("#information-call").href=`tel:${restaurant.informationPhoneInternational}`;

setLanguage(language);
