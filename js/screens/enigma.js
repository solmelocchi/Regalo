/* ===========================================================================
   DESAFÍO 2 · EL ENIGMA
   =========================================================================== */
(function (BX) {
  'use strict';

  var dom = BX.dom, html = dom.html, raw = dom.raw;
  var LETRAS = ['A', 'B', 'C', 'D', 'E'];

  function cfg() { return window.EXPERIENCIA_CONFIG.enigma; }

  BX.router.registrar({
    id: 'enigma',
    clase: 'challenge',

    render: function () {
      var c = cfg();

      var orden = dom.shuffle(c.opciones.map(function (o, i) {
        return { o: o, original: i };
      }));

      var opciones = orden.map(function (item, pos) {
        return html`
          <button class="option" type="button"
                  data-ok="${item.original === c.correcta ? '1' : '0'}">
            <span class="option__mark">${LETRAS[pos]}</span>
            <span class="option__body">
              <span class="option__title">${item.o.titulo}</span>
              <span class="option__detail">${item.o.detalle}</span>
            </span>
          </button>`;
      }).join('');

      return html`
        <div class="chapter anim d1">
          <p class="chapter__n">Capítulo II</p>
          <h2 class="chapter__title acc-text">${c.titulo}</h2>
          <hr class="rule rule--diamond">
        </div>

        <div class="panel anim anim--soft d3">
          <p class="quote">${c.frase}</p>
        </div>

        <p class="clue__q anim anim--fade d4">${c.pregunta}</p>

        <div class="options anim anim--soft d5" id="enigma-options">${raw(opciones)}</div>

        <div class="feedback" id="enigma-feedback"></div>
      `;
    },

    montar: function (root) {
      var c = cfg();
      var cont = dom.qs('#enigma-options', root);
      var fb = dom.qs('#enigma-feedback', root);
      var fallos = 0;

      cont.addEventListener('click', function (ev) {
        var btn = ev.target.closest('.option');
        if (!btn || cont.getAttribute('data-settled') === 'true') return;

        if (btn.getAttribute('data-ok') === '1') {
          cont.setAttribute('data-settled', 'true');
          btn.setAttribute('data-state', 'correct');
          dom.qsa('.option', cont).forEach(function (o) {
            if (o !== btn) o.setAttribute('data-state', 'muted');
          });

          BX.audio.sfx('bien');
          BX.fx.vibrar(22);
          BX.state.set({ enigma: true });
          BX.router.progreso(62);

          fb.setAttribute('data-tone', 'ok');
          fb.innerHTML = html`
            <p class="feedback__text">${c.acierto}</p>
            <button class="btn btn--primary" id="enigma-next" type="button"
                    style="margin-top:.9rem">${c.boton}</button>
          `;

          dom.qs('#enigma-next', fb).addEventListener('click', function () {
            BX.router.ir('palabra');
          });
          BX.fx.asegurarVisible(fb);

        } else {
          if (btn.getAttribute('data-state') === 'wrong') return;
          btn.setAttribute('data-state', 'wrong');
          BX.audio.sfx('mal');
          BX.fx.vibrar(40);

          var pista = c.pistas[Math.min(fallos, c.pistas.length - 1)];
          fallos++;
          fb.setAttribute('data-tone', 'hint');
          fb.innerHTML = html`<p class="feedback__text">${pista}</p>`;
          BX.fx.asegurarVisible(fb);
          BX.audio.sfx('pista');
        }
      });
    }
  });
})(window.BX);
