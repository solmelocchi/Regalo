/* ===========================================================================
   NIVEL 2 · LA CAJA QUE NO SE ABRE
   No existe ninguna combinación, código ni camino que la desbloquee.
   Tampoco hay contenido oculto en el DOM: lo único que hay acá es la negativa.
   =========================================================================== */
(function (BX) {
  'use strict';

  var dom = BX.dom, html = dom.html, raw = dom.raw;

  function cfg() { return window.EXPERIENCIA_CONFIG.boveda; }

  var CANDADO = [
    '<svg viewBox="0 0 64 80" aria-hidden="true" style="width:100%;height:auto">',
    '<defs><linearGradient id="lock-g" x1="0" y1="0" x2="1" y2="1">',
    '<stop offset="0%" stop-color="#F7FAFC"/>',
    '<stop offset="45%" stop-color="#D4DCE5"/>',
    '<stop offset="100%" stop-color="#6E7A87"/>',
    '</linearGradient></defs>',
    '<path d="M18 34 V22 a14 14 0 0 1 28 0 v12" fill="none" stroke="url(#lock-g)" stroke-width="4.5" stroke-linecap="round"/>',
    '<rect x="8" y="33" width="48" height="39" rx="7" fill="url(#lock-g)"/>',
    '<rect x="11.5" y="36.5" width="41" height="32" rx="5" fill="none" stroke="#2A0711" stroke-opacity=".35" stroke-width="1"/>',
    '<circle cx="32" cy="48" r="4.6" fill="#2A0711" fill-opacity=".75"/>',
    '<path d="M32 52 L32 61" stroke="#2A0711" stroke-opacity=".75" stroke-width="3.4" stroke-linecap="round"/>',
    '</svg>'
  ].join('');

  /* Respuestas al intento. Ninguna aporta información. */
  function negativas() {
    var c = cfg();
    return [
      c.denegadoTexto,
      'Seguís insistiendo. El candado, no.',
      'Podés intentarlo las veces que quieras. El resultado va a ser el mismo.',
      'Esto no se abre desde acá. Y sabés que no.'
    ];
  }

  BX.router.registrar({
    id: 'boveda',
    clase: 'vault',

    render: function () {
      var c = cfg();
      var lineas = (c.lineas || []).map(function (t, i) {
        return html`<p class="anim ${raw('d' + (i + 2))}">${t}</p>`;
      }).join('');

      return html`
        <div class="screen__head anim d1">
          <p class="label">${c.kicker}</p>
          <hr class="rule rule--diamond">
        </div>

        <div class="vault__lines">${raw(lineas)}</div>

        <div class="vault anim anim--scale d5">
          <button class="vault__box" id="vault-box" type="button"
                  aria-label="Intentar abrir la caja">
            <span class="vault__ribbon" aria-hidden="true"><span></span><span></span></span>
            <span class="vault__lock" id="vault-lock">${raw(CANDADO)}</span>
          </button>
        </div>

        <p class="vault__instruccion anim anim--fade d6" id="vault-hint">${c.instruccion}</p>

        <div class="vault__denied" id="vault-denied" aria-live="polite"></div>

        <div class="screen__body" id="vault-after" hidden>
          <hr class="rule">
          <div class="rules" id="vault-rules"></div>

          <p class="vault__cierre acc-text" id="vault-cierre"></p>
          <button class="btn btn--primary" id="vault-next" type="button">${c.boton}</button>
        </div>
      `;
    },

    montar: function (root) {
      var c = cfg();
      var caja = dom.qs('#vault-box', root);
      var candado = dom.qs('#vault-lock', root);
      var denied = dom.qs('#vault-denied', root);
      var hint = dom.qs('#vault-hint', root);
      var after = dom.qs('#vault-after', root);
      var intentos = 0;
      var abierto = false;

      function revelarCierre() {
        if (abierto) return;
        abierto = true;

        dom.qs('#vault-rules', root).innerHTML = (c.reglas || []).map(function (t, i) {
          return html`
            <div class="rule-item anim anim--soft ${raw('d' + (i + 2))}">
              <span class="rule-item__n">0${raw(String(i + 1))}</span>
              <span class="rule-item__t">${t}</span>
            </div>`;
        }).join('');

        dom.qs('#vault-cierre', root).textContent = c.cierre || '';
        after.hidden = false;
        after.classList.add('anim', 'anim--fade', 'd5');

        BX.fx.asegurarVisible(dom.qs('#vault-rules', root));

        dom.qs('#vault-next', root).addEventListener('click', function () {
          BX.router.ir('adivinanza');
        });
      }

      caja.addEventListener('click', function () {
        intentos++;
        var textos = negativas();
        var texto = textos[Math.min(intentos - 1, textos.length - 1)];

        caja.setAttribute('data-denied', 'true');
        candado.classList.remove('vault__lock--shutting');
        void candado.offsetWidth;
        candado.classList.add('vault__lock--shutting');

        BX.audio.sfx('denegado');
        setTimeout(function () { BX.audio.sfx('candado'); }, 220);
        BX.fx.vibrar([30, 50, 30]);

        denied.innerHTML = html`
          <p class="vault__denied-title">${c.denegado}</p>
          <p class="vault__denied-text">${texto}</p>
        `;

        if (hint) hint.hidden = true;

        setTimeout(function () { caja.removeAttribute('data-denied'); }, 900);
        setTimeout(revelarCierre, 1400);
      });

      // Por si decide no tocar la caja: igual puede seguir.
      setTimeout(function () {
        if (!abierto && hint) {
          hint.innerHTML = html`${c.instruccion} <button class="hint-btn" id="vault-skip" type="button">O seguí sin intentar</button>`;
          var skip = dom.qs('#vault-skip', root);
          if (skip) skip.addEventListener('click', revelarCierre);
        }
      }, 15000);
    }
  });
})(window.BX);
