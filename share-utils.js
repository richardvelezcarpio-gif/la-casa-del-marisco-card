export function createCardShareData(restaurant, locationHref, text = "Conoce nuestro menú, horarios y ordena directamente por WhatsApp.") {
  return {
    title: restaurant.restaurantName,
    text,
    url: restaurant.publicCardUrl || locationHref
  };
}

export async function shareOrCopy({ shareData, nativeShare, copy }) {
  if (nativeShare) {
    try {
      await nativeShare(shareData);
      return "shared";
    } catch (error) {
      if (error?.name === "AbortError") return "cancelled";
    }
  }
  await copy(shareData.url);
  return "copied";
}
