/* ===========================================================================
   THE BIRTHDAY EXPERIENCE  ·  ARCHIVO DE CONTENIDO
   ---------------------------------------------------------------------------
   Este es el UNICO archivo que hace falta tocar para personalizar todo:
   nombres, textos, fechas, horarios, imagenes y respuestas de los desafios.

   Lo que dejes como "" (texto vacio) se muestra en la invitacion como
   "A confirmar", con el mismo estilo elegante. Nada se rompe.
   =========================================================================== */

window.EXPERIENCIA_CONFIG = {

  /* --- A QUIEN VA DIRIGIDA ------------------------------------------------ */
  invitado: {
    nombre: "",            // ej: "Pampa". Si lo dejas vacio, no se nombra a nadie.
    saludo: ""             // ej: "Feliz cumple". Opcional, aparece al final.
  },

  /* --- PANTALLA INICIAL --------------------------------------------------- */
  intro: {
    kicker: "Una experiencia en dos partes",
    lineas: [
      "Este año decidí regalarte algo diferente.",
      "Dos experiencias. Dos sorpresas. Una sola oportunidad para descubrirlas.",
      "Pero no todo se revela tan fácilmente…"
    ],
    boton: "Comenzar experiencia",
    pie: "Se recomienda con sonido"
  },

  /* --- DESAFIO 1 · LOS SENTIDOS ------------------------------------------
     Tres pistas sensoriales. En cada una, "correcta" es el indice (empezando
     en 0) de la opcion verdadera dentro de la lista "opciones".
     ----------------------------------------------------------------------- */
  sentidos: {
    titulo: "Los sentidos",
    intro: "Tres pistas. Tres personalidades. Prestá atención a lo que cada una te dice.",
    pistas: [
      {
        etiqueta: "Aromas",
        texto: "Violeta, ciruela negra, un pliegue de vainilla que llega del final de la barrica.",
        pregunta: "¿Qué estás oliendo?",
        opciones: ["Malbec", "Torrontés", "Sauvignon Blanc", "Chardonnay"],
        correcta: 0,
        acierto: "Malbec. Fruta oscura, flores, el alma de esta tierra.",
        pista: "Es tinto, es de acá, y es la uva que puso a Mendoza en el mapa."
      },
      {
        etiqueta: "Sabores",
        texto: "Pimienta negra, hierbas frescas, un filo especiado que despierta la lengua.",
        pregunta: "¿Qué estás probando?",
        opciones: ["Moscatel", "Pinot Grigio", "Cabernet Franc", "Semillón"],
        correcta: 2,
        acierto: "Cabernet Franc. El que aporta nervio y carácter.",
        pista: "Lleva apellido. Y pariente directo de un Cabernet más famoso."
      },
      {
        etiqueta: "Texturas",
        texto: "Taninos firmes, columna vertebral, una estructura que sostiene todo lo demás.",
        pregunta: "¿Qué estás sintiendo?",
        opciones: ["Rosé", "Cabernet Sauvignon", "Espumante", "Riesling"],
        correcta: 1,
        acierto: "Cabernet Sauvignon. Puro esqueleto y columna.",
        pista: "Si la textura es firme y estructurada, no busques en los blancos."
      }
    ],
    cierre: {
      titulo: "Tres personalidades distintas",
      texto: "Malbec. Cabernet Franc. Cabernet Sauvignon. Ninguna está completa sola.",
      boton: "Seguir"
    }
  },

  /* --- DESAFIO 2 · EL ENIGMA --------------------------------------------- */
  enigma: {
    titulo: "El enigma",
    frase: "No todos los vinos nacen iguales. Algunos se crean combinando diferentes personalidades hasta encontrar el equilibrio perfecto.",
    pregunta: "¿Qué actividad se está describiendo?",
    opciones: [
      { titulo: "Una cata a ciegas",  detalle: "Probar sin saber qué hay en la copa." },
      { titulo: "Una vendimia",       detalle: "Cosechar la uva en el momento justo." },
      { titulo: "Un ensamblaje",      detalle: "Mezclar varietales hasta lograr el equilibrio." },
      { titulo: "Un maridaje",        detalle: "Encontrar el plato que acompaña al vino." }
    ],
    correcta: 2,
    acierto: "Un ensamblaje. Dicho de otro modo: crear un vino que todavía no existe.",
    pistas: [
      "No se trata de probar ni de cosechar. Se trata de crear algo nuevo.",
      "La palabra clave de la frase es «combinando». ¿Qué hacés cuando combinás varietales?"
    ],
    boton: "Seguir"
  },

  /* --- DESAFIO 3 · LA PALABRA SECRETA -----------------------------------
     La palabra se arma tocando letras. Se mezclan automaticamente.
     ----------------------------------------------------------------------- */
  palabra: {
    titulo: "La palabra secreta",
    intro: "Ocho letras desordenadas. Una sola forma de leerlas.",
    respuesta: "BLENDING",
    pistas: [
      "Está en inglés y significa, justamente, mezclar.",
      "Empieza con B y termina con G.",
      "B L E N D _ N _"
    ],
    acierto: "Blending.",
    boton: "Revelar el primer regalo"
  },

  /* --- REVELACION DEL PRIMER REGALO -------------------------------------- */
  revelacion: {
    kicker: "Primer regalo desbloqueado",
    lineas: [
      "Esta vez no vas a elegir un vino de una carta. Vas a crear el tuyo.",
      "Nos vamos a convertir en enólogos por un día."
    ],
    boton: "Ver la invitación"
  },

  /* --- LA INVITACION ·  ACA VAN LOS DATOS REALES ------------------------
     Completa lo que tengas. Lo que quede en "" aparece como "A confirmar".
     ----------------------------------------------------------------------- */
  invitacion: {
    titulo: "Blending Game",
    bajada: "Una experiencia para descubrir, experimentar, mezclar y crear nuestro propio vino.",

    bodega:    "Finca Sophenia",
    fecha:     "Viernes 20",
    hora:      "15:30 h",
    ubicacion: "Ruta 89, Km 12.5 · Gualtallary, Tupungato, Mendoza",

    // Foto de la bodega. Guardala en assets/ y escribí el nombre acá.
    // ej: "assets/bodega.jpg". Si no hay foto, se dibuja una ilustración.
    foto: "assets/bodega.webp",

    // Qué parte de la foto se ve, si no entra entera en el marco.
    // El primer valor es horizontal y el segundo vertical: 50% es el centro,
    // más chico sube el recorte y más grande lo baja.
    fotoPosicion: "center 50%",

    fotoCredito: "",

    nota: "Guardá esta invitación. La vas a necesitar.",
    boton: "Continuar"
  },

  /* --- NIVEL 2 · LA CAJA QUE NO SE ABRE ---------------------------------- */
  boveda: {
    kicker: "Segundo regalo",
    lineas: [
      "¿Pensaste que eso era todo?",
      "Hay algo más…",
      "Pero esta segunda sorpresa tiene una particularidad: todavía no estás autorizado a conocerla."
    ],
    instruccion: "Intentá abrirla, si querés.",
    denegado: "Acceso denegado",
    denegadoTexto: "Algunas sorpresas se disfrutan más cuando no sabés absolutamente nada.",
    reglas: [
      "No intentes adivinar.",
      "No hagas demasiadas preguntas.",
      "Simplemente confiá en mí."
    ],

    cierre: "Tu próxima aventura está más cerca de lo que pensás.",
    boton: "Dejame adivinar igual"
  },

  /* --- LOS TRES INTENTOS -------------------------------------------------
     Tres juegos distintos donde tiene que adivinar qué vamos a hacer.
     En cada uno, "correcta" es el índice (empezando en 0) de la opción que
     el juego va a dar por buena.
     ----------------------------------------------------------------------- */
  adivinanza: {
    titulo: "Dale, adiviná",
    intro: "Tres intentos. Después no preguntás más.",

    juegos: [
      {
        tipo: "opciones",
        etiqueta: "Primer intento",
        pregunta: "¿Cuánto creés que vamos a estar?",
        opciones: [
          "Una tarde",
          "Dos días",
          "Una semana",
          "Un mes entero"
        ],
        correcta: 1,
        acierto: "Dos días. Ni uno más.",
        error: "No. Son dos días."
      },
      {
        tipo: "cartas",
        etiqueta: "Segundo intento",
        pregunta: "¿Qué vas a tener que llevar?",
        cartas: [
          "Ganas de tomar sol",
          "Botas y abrigo",
          "Algo elegante",
          "Un libro y nada más"
        ],
        correcta: 0,
        acierto: "Ganas de tomar sol. Nada más que eso.",
        error: "Frío. Era esta."
      },
      {
        tipo: "verdadero_falso",
        etiqueta: "Tercer intento",
        pregunta: "Última. Verdadero o falso.",
        afirmaciones: [
          { texto: "Está lejos",      respuesta: false },
          { texto: "Vamos en auto",   respuesta: true },
          { texto: "Hay pileta",      respuesta: true }
        ],
        acierto: "Tres de tres.",
        cierre: "Ya sabés casi todo.",
        instruccion: "Respondé las tres."
      }
    ],

    boton: "Terminar"
  },

  /* --- EL SEGUNDO REGALO -------------------------------------------------
     Lo que ve al tocar "Ver segundo regalo".
     ----------------------------------------------------------------------- */
  segundo: {
    kicker: "Segundo regalo desbloqueado",
    titulo: "Dos días al sol",
    bajada: "Eso es todo lo que te voy a decir.",

    filas: [
      { clave: "Cuánto",    valor: "Dos días" },
      { clave: "Dónde",     valor: "A una hora de Mendoza" },
      { clave: "Te busco",  valor: "Sábado, 13:00 h" },
      { clave: "Llevá",     valor: "Ganas de tomar sol" }
    ],

    // Aparece abajo de todo, como un pendiente más del plan.
    nota: "El jueves a la tarde hacemos las compras. Dejate la tarde libre.",

    cierre: "El resto lo vas a ver cuando lleguemos.",
    boton: "Dale"
  },

  /* --- PANTALLA FINAL ---------------------------------------------------- */
  final: {
    kicker: "Fin de la experiencia",
    titulo: "Feliz cumpleaños",
    texto: "Ya sabés los dos. Ahora solo falta que lleguen.",
    botonInvitacion: "Ver la invitación",
    botonSegundo: "Ver el segundo regalo",
    botonReiniciar: "Vivirla de nuevo",
    firma: "",       // ej: "Con amor, Sol"

    // Nota suelta al final. El plan del jueves ya está en la tarjeta del
    // segundo regalo, así que acá podés poner lo que quieras, o nada.
    pd: ""
  },

  /* --- AJUSTES ----------------------------------------------------------- */
  ajustes: {
    musicaPorDefecto: true,   // arranca con música al tocar «Comenzar»
    volumenMusica: 0.22,      // 0 a 1
    volumenEfectos: 0.5,      // 0 a 1
    particulas: true,         // partículas doradas de fondo
    guardarProgreso: true     // recuerda dónde quedó si recarga la página
  }
};
