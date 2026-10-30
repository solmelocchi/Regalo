/* ===========================================================================
   ARRANQUE
   =========================================================================== */
(function (BX) {
  'use strict';

  var dom = BX.dom;

  var PANTALLAS_VALIDAS = [
    'intro', 'sentidos', 'puente', 'enigma', 'palabra',
    'revelacion', 'invitacion', 'boveda', 'final'
  ];

  /* ------------------------------------------------------- botón de sonido */
  function sincronizarBotonSonido() {
    var btn = dom.qs('#sound-toggle');
    if (!btn) return;
    var activa = BX.audio.musicaActiva;
    btn.setAttribute('aria-pressed', activa ? 'true' : 'false');
    btn.setAttribute('aria-label', activa ? 'Silenciar música' : 'Activar música');
  }
  BX.sincronizarBotonSonido = sincronizarBotonSonido;

  function cablearSonido() {
    var btn = dom.qs('#sound-toggle');
    if (!btn) return;

    if (!BX.audio.disponible) { btn.hidden = true; return; }

    btn.addEventListener('click', function () {
      var quiere = !BX.audio.musicaActiva;
      BX.audio.setMusica(quiere);
      BX.state.set({ sonido: quiere });
      BX.audio.sfx('tap');
      sincronizarBotonSonido();
      BX.fx.toast(quiere ? 'Música activada' : 'Música en silencio', 1800);
    });
  }

  /* ----------------------------------- primer gesto: habilita el audio */
  function esperarPrimerGesto() {
    function arrancar() {
      document.removeEventListener('pointerdown', arrancar);
      document.removeEventListener('keydown', arrancar);
      if (BX.state.data.sonido) {
        BX.audio.unlock(true);
        sincronizarBotonSonido();
      }
    }
    document.addEventListener('pointerdown', arrancar, { once: true });
    document.addEventListener('keydown', arrancar, { once: true });
  }

  /* ------------------------------------------ micro feedback al tocar */
  function cablearTacto() {
    document.addEventListener('pointerdown', function (ev) {
      var interactivo = ev.target.closest('button, .option, .tile, .slot');
      if (!interactivo) return;
      BX.fx.anillo(ev.clientX, ev.clientY);
    });
  }

  /* --------------------------------------------------------------- inicio */
  function inicio() {
    var st = BX.state.load();

    BX.fx.init();
    cablearSonido();
    cablearTacto();

    var destino = 'intro';
    if (BX.state.hayProgreso() && PANTALLAS_VALIDAS.indexOf(st.pantalla) >= 0) {
      destino = st.pantalla;
    } else if (st.terminado) {
      destino = 'final';
    }

    BX.router.montar(destino);
    sincronizarBotonSonido();

    if (destino !== 'intro') {
      esperarPrimerGesto();
      setTimeout(function () {
        BX.fx.toast('Retomando donde lo dejaste', 3000);
      }, 900);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicio);
  } else {
    inicio();
  }
})(window.BX);
