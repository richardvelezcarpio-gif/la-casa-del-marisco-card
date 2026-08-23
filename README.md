# La Casa del Marisco — Tarjeta Digital

Mini web app estática, mobile-first y sin dependencias. Se puede abrir mediante cualquier servidor estático local.

## Menú original

Colocar el PDF original sin modificar en:

`public/menu/menu-la-casa-del-marisco.pdf`

## Datos pendientes

- Productos y precios verificados contra el PDF.
- URL pública para compartir y generar el QR real.
- Dirección confirmada.
- Enlaces de reservas, ubicación, reseñas, sitio web y redes sociales.

No se inventaron datos ni URLs. La configuración central está en `data/restaurant.js` y el catálogo en `data/menu.js`.

## Orden por WhatsApp

La experiencia de pedido está disponible en `ordenar/`. El catálogo usa precios enteros en centavos, carrito persistente en `localStorage` y genera el mensaje final sin procesar pagos.

Los productos sin precio inequívoco en el PDF permanecen deshabilitados y marcados con `pendingReview` en `data/menu.js`.
