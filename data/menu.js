const option = (label, priceCents) => ({ label, priceCents });
const product = (category, name, options, extra = {}) => ({
  id: `${category}-${name}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  category, name, options, available: true, ...extra
});
const one = (category, name, priceCents, extra) => product(category, name, [option(null, priceCents)], extra);
const sizes = (category, name, values, extra) => product(category, name, values.map(([label, cents]) => option(label, cents)), extra);

export const menuItems = [
  one("Para Picar", "PICADITA", 1200, { description: "Patacones, yuca frita y aros de cebolla" }),
  one("Para Picar", "CONCHAS ASADAS", 1450), one("Para Picar", "TENAZAS DE CANGREJO APANADAS", 1700),
  one("Para Picar", "CANGREJO AL GRATÍN", 1800), one("Para Picar", "CAMARÓN APANADO", 1400),
  one("Para Picar", "CALAMAR APANADO", 1450), one("Para Picar", "CHICHARÓN CORVINA", 1300),
  sizes("Para Picar", "PIQUEO MIX", [["3 personas",1900],["4 personas",2300]], { description: "Camarón, calamar, corvina, cangrejo" }),
  sizes("Para Picar", "PIQUEO TRIPLE", [["4 personas",2800],["6 personas",3200]], { description: "Camarón, calamar, corvina, cangrejo" }),

  one("Para Niños", "PAPILLA DE POLLO", 400), one("Para Niños", "PORCIÓN DE PAPAS", 350),
  one("Para Niños", "SALCHIPAPAS", 450), one("Para Niños", "PAPIPOLLO", 500),
  one("Para Niños", "HAMBURGUESA SENCILLA", 600), one("Para Niños", "HAMBURGUESA TABLA", 800), one("Para Niños", "ALITAS BBQ", 800),

  sizes("Ceviches", "CEVICHE DE CAMARÓN EN SALSA", [["Junior",750],["Normal",1100],["Especial",1800]]),
  sizes("Ceviches", "CEVICHE DE CAMARÓN COSTEÑO", [["Junior",750],["Normal",1100],["Especial",1800]]),
  sizes("Ceviches", "CEVICHE DE CONCHA CRUDA", [["Junior",785],["Normal",1150],["Especial",1800]]),
  sizes("Ceviches", "CEVICHE DE CALAMAR", [["Normal",1050],["Especial",1800]]),
  sizes("Ceviches", "CEVICHE DE CANGREJO", [["Normal",1100],["Especial",1800]]),
  sizes("Ceviches", "CEVICHE DE CORVINA CRUDA", [["Normal",1050],["Especial",1800]]),
  sizes("Ceviches", "CEVICHE DE PESCADO", [["Normal",900],["Especial",1800]]),
  sizes("Ceviches", "CEVICHE DE PULPO", [["Normal",1150],["Especial",1800]]),
  sizes("Ceviches", "CEVICHE MIXTO", [["Junior",875],["Normal",1300],["Especial",1900]]),
  sizes("Ceviches", "CEVICHE TRIPLE", [["Normal",1300],["Especial",1900]]),
  one("Ceviches", "CEVICHE MARINERO", 1900), one("Ceviches", "CEVICHE VIAGRA", 2100),
  one("Ceviches", "CEVICHE PERUANO", 1900), one("Ceviches", "TRILOGÍA DE CEVICHE", 1650),

  one("Sopas", "CALDO DE BAGRE", 575), one("Sopas", "ENCEBOLLADO", 575), one("Sopas", "ENCEBOLLADO MIXTO", 875),
  one("Sopas", "ENCEBOLLADO MARINERO", 1125), sizes("Sopas", "SOPA MARINERA", [["Junior",1100],["Normal",1650]]),
  sizes("Sopas", "CAZUELA", [["Junior",1225],["Normal",1750]]), one("Sopas", "CALDO DE CANGREJO", 1250),
  one("Sopas", "PARIHUELA", 1800), one("Sopas", "PLATO REFORZADO CON CANGREJO PATA GORDA", 300, { description: "Adicional" }),

  sizes("Camarón", "ARROZ CON CAMARÓN", [["Junior",925],["Normal",1325]]),
  sizes("Camarón", "CAMARÓN APANADO", [["Junior",975],["Normal",1400]]),
  one("Camarón", "CAMARÓN REVENTADO", 1500), one("Camarón", "CAMARÓN AL AJILLO", 1500),
  one("Camarón", "TORTILLA DE CAMARÓN", 1600), one("Camarón", "CAMARÓN A LA PLANCHA", 1600),
  one("Camarón", "CAMARÓN EN SALSA DE MOSTAZA", 1700), one("Camarón", "CAMARÓN A LA TABLA", 1700),
  one("Camarón", "CAMARÓN A LA CASA DEL MARISCO", 2600),

  sizes("Platos Especiales", "ARROZ MARINERO", [["Junior",1150],["Normal",1650]]),
  one("Platos Especiales", "CHOP SUEY DE CANGREJO", 1650), one("Platos Especiales", "BANDEJA DE MARISCO (2 PERSONAS)", 3500),
  product("Platos Especiales", "PAMPAMESA DE MARISCOS (MÍNIMO 4 PERSONAS, EN 6 TIEMPOS)", [], { available: false, pendingReview: "El PDF no muestra un precio asociado." }),
  one("Calamar", "ARROZ CON CALAMAR", 1250), one("Calamar", "CALAMAR APANADO", 1400),
  one("Conchas", "ARROZ CON CONCHA", 1600), one("Conchas", "CONCHA AL AJILLO", 1750),
  one("Conchas", "CONCHAS ASADAS", 1500), one("Conchas", "CONCHAS AL VINO EN SALSA DE ALBAHACA", 1750),
  one("Melosos", "CONCHA", 1600), one("Melosos", "CANGREJO", 1850),

  one("Corvina", "PESCADO FRITO", 1500), one("Corvina", "CORVINA A LA PLANCHA", 1700),
  sizes("Corvina", "CORVINA APANADA", [["Junior",1025],["Normal",1500]]), one("Corvina", "CORVINA AL VAPOR", 1600),
  one("Corvina", "CORVINA AL AJO", 1700), one("Corvina", "CORVINA EN SALSA DE MARISCOS", 1750),
  sizes("Corvina", "CHICHARRÓN DE CORVINA", [["Junior",840],["Normal",1200]]),
  one("Corvina", "CORVINA RELLENA DE CANGREJO", 1700), one("Corvina", "TILAPIA AL GRILL", 1300),
  one("Trucha", "TRUCHA FRITA", 1400), one("Trucha", "TRUCHA A LA PLANCHA", 1400), one("Trucha", "TRUCHA AL VAPOR", 1400), one("Trucha", "TRUCHA EN SALSA DE MARISCOS", 1750),
  one("Salmón", "SALMÓN AL GRILL", 1900), one("Salmón", "SAMÓN AL AJILLO", 1900, { note: "Nombre conservado exactamente como aparece en el PDF." }),

  one("Cangrejo", "CANGREJO CRIOLLO", 650), one("Cangrejo", "PROMOCIÓN DE CANGREJOS (3 CANGREJOS)", 1750),
  one("Cangrejo", "PROMOCIÓN DE CANGREJOS FAMILIAR (8 CANGREJOS)", 4200), one("Cangrejo", "PROMOCIÓN DE CANGREJOS FAMILIAR (12 CANGREJOS)", 5500),
  one("Cangrejo", "PROMOCIÓN DE CANGREJOS FAMILIAR (20 CANGREJOS)", 9000),
  sizes("Cangrejo", "CANGREJO AL VINO SALSA ALBAHACA", [["1 persona",1900],["2 personas",3500]]),
  sizes("Cangrejo", "CANGREJO AL AJILLO", [["1 persona",1900],["2 personas",3500]]),
  sizes("Cangrejo", "CANGREJO ENCOCADO", [["1 persona",1900],["2 personas",3500]]),
  one("Cangrejo", "ARROZ CON CANGREJO", 1400), one("Cangrejo", "TENAZAS DE CANGREJO EN SU CALDO", 1700),
  one("Cangrejo", "TENAZAS DE CANGREJO ENCOCADO", 1700), one("Cangrejo", "TENAZAS DE CANGREJO AL AJILLO", 1700),
  one("Cangrejo", "TENAZAS DE CANGREJO APANADO", 1700), one("Cangrejo", "CANGREJO A LA CASA DEL MARISCO", 2500),

  one("Gratinados", "GRATINADO DE CAMARONES", 1600), one("Gratinados", "GRATINADO DE CORVINA", 1500),
  one("Gratinados", "GRATINADO MIXTO", 1700), one("Gratinados", "CANGREJO GRATÍN", 1800),
  one("Ensaladas", "ENSALADA DE LEGUMBRES", 600), one("Ensaladas", "ENSALADA DE CANGREJO", 1400), one("Ensaladas", "ENSALADA DE MARISCOS", 1300),
  one("Encocado", "ENCOCADO DE CAMARÓN", 1450), one("Encocado", "ENCOCADO DE CORVINA", 1450), one("Encocado", "ENCOCADO MIXTO", 1600),
  one("Tallarín", "TALLARÍN CON CAMARÓN SALTEADO CON VERDURAS", 1500), one("Tallarín", "TALLARÍN CON MARISCOS SALTEADOS CON VERDURAS", 1400), one("Tallarín", "TALLARÍN SALTEADOS CON VERDURAS", 900),
  one("Sudados", "SUDADO DE CONCHA", 1700), one("Sudados", "SUDADO DE PESCADO", 1600), one("Sudados", "SUDADO DE CAMARÓN", 1600), one("Sudados", "SUDADO DE MARISCOS", 1750),

  one("Langostinos", "LANGOSTINOS A LA PLANCHA", 2600), one("Langostinos", "LANGOSTINOS AL AJILLO", 2600),
  one("Langostinos", "LANGOSTINO ENCOCADO", 2600), one("Langostinos", "LANGOSTINO EN SALSA DE CANGREJO", 2700), one("Langostinos", "LANGOSTINOS GRATINADO", 2600),
  sizes("Langosta", "LANGOSTA A LA PLANCHA", [["12 onz.",2500],["1 1/2 libra",3500],["2 libras",4000],["2 1/2 libras",4500]]),
  sizes("Langosta", "LANGOSTA AL AJILLO", [["12 onz.",2500],["1 1/2 libra",3500],["2 libras",4000],["2 1/2 libras",4500]]),
  sizes("Langosta", "LANGOSTA ENCOCADA", [["12 onz.",2500],["1 1/2 libra",3500],["2 libras",4000],["2 1/2 libras",4500]]),
  sizes("Langosta", "LANGOSTA GRATINADA", [["12 onz.",2500],["1 1/2 libra",3500],["2 libras",4000],["2 1/2 libras",4500]]),
  sizes("Langosta", "LANGOSTA EN SALSA DE MARISCOS", [["12 onz.",2800],["1 1/2 libra",3800],["2 libras",4500],["2 1/2 libras",5000]]),
  sizes("Langosta", "PLATO ESPECIAL DE LANGOSTA Y LANGOSTINOS AL AJILLO", [["12 onz.",3000],["1 1/2 libra",4200],["2 libras",5200],["2 1/2 libras",6000]]),
  one("Parrillada", "PARRILLADAS DE CAMARONES", 2750), one("Parrillada", "PARRILLADAS DE MARISCOS", 3000),
  one("Parrillada", "PARRILLADA ESPECIAL", 4500, { description: "Langosta y langostino" }), one("Parrillada", "MAR Y TIERRA", 2750),

  one("Tablita", "POLLO PIERNA (1/4)", 900), one("Tablita", "FILETE DE PECHUGA", 900), one("Tablita", "LOMO DE RES", 1000),
  one("Tablita", "CHULETA DE CERDO", 1000), one("Tablita", "COSTILLA DE CERDO", 1300), one("Tablita", "COSTILLA B.B.Q", 1450),
  one("Extras", "PORCIÓN DE ARROZ", 250), one("Extras", "PORCIÓN DE PAPAS", 350), one("Extras", "PORCIÓN DE PATACONES", 450),
  one("Extras", "PORCIÓN DE YUQUITAS FRITAS", 450), one("Extras", "PORCIÓN DE AROS DE CEBOLLA", 450), one("Extras", "NACHOS CON QUESO", 300),
  one("Extras", "PORCIÓN DE CHIFLES", 150), one("Extras", "PORCIÓN DE MADURO FRITO O COCINADO", 300), one("Extras", "PORCIÓN DE MADURO CON QUESO GRATINADO", 450),

  one("Carnes", "AGUADO DE POLLO", 750), one("Carnes", "POLLO FRITO", 950), one("Carnes", "LOMO A LA PLANCHA", 1000), one("Carnes", "LOMO APANADO", 1000),
  sizes("Carnes", "CHAULAFÁN", [["Junior",650],["Normal",900]]), one("Carnes", "CHURRASCO", 1200), one("Carnes", "POLLO A LA PLANCHA", 1000),
  one("Postres", "DURAZNO CON CREMA", 350), one("Postres", "BANANA SPLIT", 450), one("Postres", "COPA DE HELADO", 300), one("Postres", "BROWNIE CON HELADO", 450),
  sizes("Bebidas", "JUGO DE NARANJA, GUANABANA O MIXTO", [["Vaso",350],["1/2 jarra",750],["Jarra",1000]]),
  sizes("Bebidas", "JUGOS NATURALES", [["Vaso",300],["1/2 jarra",700],["Jarra",900]]), sizes("Bebidas", "LIMONADA", [["Vaso",250],["1/2 jarra",600],["Jarra",800]]),
  one("Bebidas", "LIMONADA IMPERIAL", 350), one("Bebidas", "BATIDO DE FRUTAS", 400), one("Bebidas", "COLA", 180), one("Bebidas", "COLA LIGHT", 250),
  one("Bebidas", "MINERAL", 175), one("Bebidas", "AGUA", 125), sizes("Bebidas", "CERVEZA PILSENER", [["Pequeña",250],["Grande",400]]),
  sizes("Bebidas", "CERVEZA CLUB", [["Pequeña",250],["Grande",400]]), one("Bebidas", "CERVEZA EXTRANJERA (CORONA, STELLA, HEINEKEN, BUDWEISER)", 400),
  product("Bebidas", "MICHELADAS (DEPENDE DEL TIPO DE CERVEZA)", [], { available: false, pendingReview: "El PDF no muestra un precio fijo." }),
  one("Bebidas", "TINTO", 225), one("Bebidas", "AGUA AROMÁTICA", 225)
];

export const categories = [...new Set(menuItems.map(item => item.category))];
export const pendingReviewItems = menuItems.filter(item => item.pendingReview);
