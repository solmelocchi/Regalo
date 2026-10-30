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

    bodega:    "",   // ej: "Bodega Ruca Malen"
    fecha:     "",   // ej: "Sábado 15 de noviembre"
    hora:      "",   // ej: "11:00 h"
    ubicacion: "",   // ej: "Luján de Cuyo, Mendoza"

    // Foto de la bodega. Guardala en experiencia/assets/ y escribí el nombre acá.
    // ej: "assets/bodega.jpg". Si no hay foto, se muestra un marco elegante.
    foto: "",
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
        pregunta: "¿Con qué arranca?",
        opciones: [
          "Una cena en un restaurante",
          "Una noche tranquila en casa",
          "Un recital",
          "Un asado con amigos"
        ],
        correcta: 0,
        acierto: "Correcto.",
        error: "No. Era esta otra."
      },
      {
        tipo: "cartas",
        etiqueta: "Segundo intento",
        pregunta: "¿Y dónde dormimos?",
        cartas: [
          "En Potrerillos",
          "Acá nomás",
          "Un hotel en el centro",
          "Una cabaña en la montaña"
        ],
        correcta: 0,
        acierto: "Correcto otra vez. Me estás asustando.",
        error: "Frío. Era esta."
      },
      {
        tipo: "verdadero_falso",
        etiqueta: "Tercer intento",
        pregunta: "Última. Verdadero o falso.",
        afirmaciones: [
          { texto: "Vamos en auto",            respuesta: true },
          { texto: "Hay que madrugar",         respuesta: false },
          { texto: "Con llevar poca ropa alcanza", respuesta: true }
        ],
        acierto: "Tres de tres.",
        cierre: "Impresionante."
      }
    ],

    boton: "Terminar"
  },

  /* --- EL VUELTO ---------------------------------------------------------
     Lo que ve después de los tres juegos.
     ----------------------------------------------------------------------- */
  verdad: {
    kicker: "Una última cosa",
    lineas: [
      "Nada de lo que acabás de adivinar es verdad.",
      "Ni una sola.",
      "No adivinaste absolutamente nada."
    ],
    listaTitulo: "Lo que dijiste",
    cierre: "El 26 te enterás.",
    boton: "Me rindo"
  },

  /* --- PANTALLA FINAL ---------------------------------------------------- */
  final: {
    kicker: "Fin de la experiencia",
    titulo: "Feliz cumpleaños",
    texto: "Un regalo ya lo sabés. El otro va a tener que esperar.",
    botonInvitacion: "Volver a ver la invitación",
    botonReiniciar: "Vivirla de nuevo",
    firma: "",       // ej: "Con amor, Sol"

    /* --- NOTA AL PIE ------------------------------------------------------
       Un recordatorio suelto al final de todo.
       Otras versiones que podés usar en vez de esta:
         "El jueves te paso a buscar a las 17:00. Tengo que retirar algo que
          encargué y sola no lo puedo cargar. Dejate la tarde libre."
         "El jueves te paso a buscar a las 17:00. Tengo un trámite que cierra
          temprano y quiero que vengas conmigo. Después te invito a comer."
         "El jueves te paso a buscar a las 17:00. Necesito tu ayuda con algo
          que ya te voy a explicar. Confiá."
       Dejalo en "" si preferís decírselo en persona.
       --------------------------------------------------------------------- */
    pd: "P.D. El jueves te paso a buscar a las 17:00. Necesito que me acompañes a hacer algo y no me da el tiempo sola. Dejate la tarde libre."
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
