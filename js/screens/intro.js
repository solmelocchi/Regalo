/* ===========================================================================
   PANTALLA · COMIENZA EL JUEGO
   =========================================================================== */
(function (BX) {
  'use strict';

  var dom = BX.dom, html = dom.html, raw = dom.raw;

  function cfg() { return window.EXPERIENCIA_CONFIG.intro; }

  BX.router.registrar({
    id: 'intro',
    clase: 'intro',

    render: function () {
      var c = cfg();
      var lineas = (c.lineas || []).map(function (texto, i) {
        return html`<p class="anim ${raw('d' + (i + 4))}">${texto}</p>`;
      });

      return html`
        <div class="intro__mark">
          <h1 class="intro__title anim d1">
            <span class="acc-text">The Birthday</span>
            <em>Experience</em>
          </h1>
          <hr class="rule rule--diamond anim anim--rule d2">
          <p class="label anim anim--fade d3">${c.kicker}</p>
        </div>

        <div class="intro__lines">${raw(lineas.join(''))}</div>

        <div class="intro__cta anim anim--scale d7">
          <button class="btn btn--primary btn--hero" id="intro-start" type="button">
            ${c.boton}
            <span class="btn__halo" aria-hidden="true"></span>
          </button>
        </div>

        <div class="intro__foot anim anim--fade d8">
          <hr class="rule" style="width:70px">
          <p>${c.pie}</p>
        </div>
      `;
    },

    montar: function (root) {
      var btn = dom.qs('#intro-start', root);

      btn.addEventListener('click', function () {
        var st = BX.state.data;
        var preferencia = st.sonido === null
          ? window.EXPERIENCIA_CONFIG.ajustes.musicaPorDefecto !== false
          : st.sonido;

        // Primer gesto del usuario: acá recién se puede abrir el audio.
        BX.audio.unlock(preferencia);
        BX.state.set({ sonido: preferencia });
        BX.sincronizarBotonSonido();

        BX.fx.vibrar(18);
        BX.audio.sfx('descorche');
        BX.fx.flash();

        BX.router.ir('sentidos');
      });
    }
  });
})(window.BX);
