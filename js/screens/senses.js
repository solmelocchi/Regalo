/* ===========================================================================
   DESAFÍO 1 · LOS SENTIDOS
   Tres pistas sensoriales encadenadas dentro de una misma pantalla.
   =========================================================================== */
(function (BX) {
  'use strict';

  var dom = BX.dom, html = dom.html, raw = dom.raw;
  var LETRAS = ['A', 'B', 'C', 'D', 'E'];

  var ICONOS = {
    0: '<path d="M7 20c0-3 3-4 3-7s-2-3-2-5 1.5-3 1.5-3M12 20c0-3.5 3.5-4.5 3.5-8s-2.5-3.5-2.5-6 2-3 2-3M17.5 20c0-2.5 2.5-3.5 2.5-6"/>',
    1: '<path d="M12 3s6 6.5 6 10.5A6 6 0 0 1 6 13.5C6 9.5 12 3 12 3z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 5 0"/>',
    2: '<path d="M3 8c2.2-2 4.3-2 6.5 0s4.3 2 6.5 0 4.3-2 5-1.3M3 13c2.2-2 4.3-2 6.5 0s4.3 2 6.5 0 4.3-2 5-1.3M3 18c2.2-2 4.3-2 6.5 0s4.3 2 6.5 0 4.3-2 5-1.3"/>'
  };

  function cfg() { return window.EXPERIENCIA_CONFIG.sentidos; }

  function icono(i) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.1" ' +
           'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
           (ICONOS[i] || ICONOS[0]) + '</svg>';
  }

  function pips(indice, total) {
    var out = '';
    for (var i = 0; i < total; i++) {
      out += '<span data-on="' + (i < indice) + '" data-current="' + (i === indice) + '"></span>';
    }
    return out;
  }

  BX.router.registrar({
    id: 'sentidos',
    clase: 'challenge',

    render: function () {
      var c = cfg();
      return html`
        <div class="chapter anim d1">
          <p class="chapter__n">Capítulo I</p>
          <h2 class="chapter__title acc-text">${c.titulo}</h2>
          <hr class="rule rule--diamond">
          <p class="chapter__intro">${c.intro}</p>
        </div>

        <div class="pips anim anim--fade d2" id="sentidos-pips"></div>
        <div class="screen__body" id="clue-slot"></div>
      `;
    },

    montar: function (root) {
      var c = cfg();
      var total = c.pistas.length;
      var indice = dom.clamp(BX.state.data.sentidos, 0, total - 1);
      var slot = dom.qs('#clue-slot', root);

      function avanceHud() {
        BX.router.progreso(10 + (indice / total) * 24);
      }

      function pintarPips() {
        dom.qs('#sentidos-pips', root).innerHTML = pips(indice, total);
      }

      function pintarPista(animar) {
        var pista = c.pistas[indice];
        var orden = dom.shuffle(pista.opciones.map(function (texto, i) {
          return { texto: texto, original: i };
        }));

        var opciones = orden.map(function (o, pos) {
          return html`
            <button class="option" type="button"
                    data-ok="${o.original === pista.correcta ? '1' : '0'}">
              <span class="option__mark">${LETRAS[pos]}</span>
              <span class="option__body">
                <span class="option__title">${o.texto}</span>
              </span>
            </button>`;
        }).join('');

        slot.innerHTML = html`
          <div class="clue ${raw(animar ? 'anim anim--soft' : '')}">
            <div class="clue__sense">
              <span class="clue__icon">${raw(icono(indice))}</span>
              <p class="label">${pista.etiqueta}</p>
            </div>
            <p class="clue__text">${pista.texto}</p>
            <p class="clue__q">${pista.pregunta}</p>
            <div class="options" id="clue-options">${raw(opciones)}</div>
            <div class="feedback" id="clue-feedback"></div>
          </div>
        `;

        pintarPips();
        avanceHud();
        cablear(pista);
      }

      function cablear(pista) {
        var cont = dom.qs('#clue-options', slot);
        var fb = dom.qs('#clue-feedback', slot);
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
            fb.setAttribute('data-tone', 'ok');
            fb.innerHTML = html`<p class="feedback__text">${pista.acierto}</p>`;
            BX.fx.asegurarVisible(fb);

            indice++;
            BX.state.set({ sentidos: indice });

            setTimeout(function () {
              if (indice >= total) {
                BX.router.ir('puente');
              } else {
                var clue = dom.qs('.clue', slot);
                if (clue) clue.classList.add('is-leaving');
                setTimeout(function () { pintarPista(true); }, 300);
              }
            }, 1500);

          } else {
            if (btn.getAttribute('data-state') === 'wrong') return;
            fallos++;
            btn.setAttribute('data-state', 'wrong');
            BX.audio.sfx('mal');
            BX.fx.vibrar(40);

            fb.setAttribute('data-tone', fallos === 1 ? 'no' : 'hint');
            fb.innerHTML = html`
              <p class="feedback__text">${fallos === 1 ? 'No es esa. Probá de nuevo.' : pista.pista}</p>
            `;
            BX.fx.asegurarVisible(fb);
            if (fallos >= 2) BX.audio.sfx('pista');
          }
        });
      }

      pintarPista(true);
    }
  });

  /* ------------------------------------------------- puente entre capítulos */
  BX.router.registrar({
    id: 'puente',
    clase: 'bridge',

    render: function () {
      var cierre = cfg().cierre;
      var trio = [];
      cfg().pistas.forEach(function (p, i) {
        if (i > 0) trio.push('<i aria-hidden="true"></i>');
        trio.push('<span>' + dom.esc(p.opciones[p.correcta]) + '</span>');
      });

      return html`
        <div class="screen__head anim d1">
          <p class="label">Capítulo I · Completo</p>
          <h2 class="chapter__title acc-text">${cierre.titulo}</h2>
          <hr class="rule rule--diamond">
        </div>

        <div class="bridge__trio anim anim--soft d3">${raw(trio.join(''))}</div>

        <p class="lead dim anim d4" style="max-width:30ch">${cierre.texto}</p>

        <button class="btn btn--primary anim anim--scale d5" id="bridge-next" type="button">
          ${cierre.boton}
        </button>
      `;
    },

    montar: function (root) {
      BX.audio.sfx('paso');
      dom.qs('#bridge-next', root).addEventListener('click', function () {
        BX.router.ir('enigma');
      });
    }
  });
})(window.BX);
