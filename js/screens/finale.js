/* ===========================================================================
   PANTALLA FINAL
   =========================================================================== */
(function (BX) {
  'use strict';

  var dom = BX.dom, html = dom.html, raw = dom.raw;

  function cfg() { return window.EXPERIENCIA_CONFIG.final; }
  function invitado() { return window.EXPERIENCIA_CONFIG.invitado || {}; }

  BX.router.registrar({
    id: 'final',
    clase: 'final',

    render: function () {
      var c = cfg();
      var nombre = (invitado().nombre || '').trim();

      return html`
        <div class="screen__head">
          <p class="label anim anim--fade d1">${c.kicker}</p>
          <h2 class="final__title display anim d2">
            <span class="acc-text">${c.titulo}</span>
            ${raw(nombre ? '<span class="final__name">' + dom.esc(nombre) + '</span>' : '')}
          </h2>
          <hr class="rule rule--diamond anim anim--rule d4">
        </div>

        <p class="final__text anim d5">${c.texto}</p>

        <div class="btn-row anim anim--scale d6">
          <button class="btn btn--primary" id="final-invite" type="button">${c.botonInvitacion}</button>
          <button class="btn btn--ghost" id="final-restart" type="button">${c.botonReiniciar}</button>
        </div>

        ${raw(c.firma ? '<p class="final__firma anim anim--fade d7">' + dom.esc(c.firma) + '</p>' : '')}
        ${raw(c.pd ? '<p class="final__pd anim anim--fade d8">' + dom.esc(c.pd) + '</p>' : '')}
      `;
    },

    montar: function (root) {
      BX.state.set({ terminado: true, boveda: true });
      BX.audio.sfx('brillo');
      BX.fx.flash();

      dom.qs('#final-invite', root).addEventListener('click', function () {
        BX.router.ir('invitacion');
      });

      var reiniciar = dom.qs('#final-restart', root);
      var confirmando = false;

      reiniciar.addEventListener('click', function () {
        if (!confirmando) {
          confirmando = true;
          reiniciar.textContent = '¿Seguro? Toca de nuevo';
          BX.audio.sfx('tap');
          setTimeout(function () {
            if (!confirmando) return;
            confirmando = false;
            reiniciar.textContent = cfg().botonReiniciar;
          }, 4000);
          return;
        }

        confirmando = false;
        BX.state.reset();
        BX.router.ir('intro');
      });
    }
  });
})(window.BX);
