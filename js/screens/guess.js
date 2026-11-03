/* ===========================================================================
   LOS TRES INTENTOS  +  EL VUELTO
   Tres juegos distintos encadenados. Lo que respondió queda guardado para
   devolvérselo al final.
   =========================================================================== */
(function (BX) {
  'use strict';

  var dom = BX.dom, html = dom.html, raw = dom.raw;
  var LETRAS = ['A', 'B', 'C', 'D', 'E'];

  function cfg() { return window.EXPERIENCIA_CONFIG.adivinanza; }
  function cfgVerdad() { return window.EXPERIENCIA_CONFIG.verdad; }

  function pips(indice, total) {
    var out = '';
    for (var i = 0; i < total; i++) {
      out += '<span data-on="' + (i < indice) + '" data-current="' + (i === indice) + '"></span>';
    }
    return out;
  }

  BX.router.registrar({
    id: 'adivinanza',
    clase: 'challenge',

    render: function () {
      var c = cfg();
      return html`
        <div class="chapter anim d1">
          <p class="chapter__n">Segundo regalo</p>
          <h2 class="chapter__title acc-text">${c.titulo}</h2>
          <hr class="rule rule--diamond">
          <p class="chapter__intro">${c.intro}</p>
        </div>

        <div class="pips anim anim--fade d2" id="guess-pips"></div>
        <div class="screen__body" id="guess-slot"></div>
      `;
    },

    montar: function (root) {
      var c = cfg();
      var juegos = c.juegos || [];
      var total = juegos.length;
      var indice = 0;
      var slot = dom.qs('#guess-slot', root);

      function pintarPips() {
        dom.qs('#guess-pips', root).innerHTML = pips(indice, total);
        BX.router.progreso(92 + (indice / Math.max(total, 1)) * 5);
      }

      function siguiente() {
        indice++;
        if (indice >= total) {
          if (c.cierre) {
            setTimeout(function () {
              slot.innerHTML = html`
                <p class="guess__cierre anim">${c.cierre}</p>
                <button class="btn btn--primary anim anim--scale d3"
                        id="guess-revelar" type="button">${c.botonRevelar || 'Ver segundo regalo'}</button>
              `;
              BX.audio.sfx('paso');
              BX.fx.asegurarVisible(dom.qs('#guess-revelar', slot));

              dom.qs('#guess-revelar', slot).addEventListener('click', function () {
                BX.audio.sfx('descorche');
                BX.fx.flash();
                BX.fx.vibrar(20);
                BX.router.ir('segundo');
              });
            }, 1000);
          } else {
            setTimeout(function () { BX.router.ir('segundo'); }, 1200);
          }
        } else {
          var actual = dom.qs('.guess', slot);
          if (actual) actual.classList.add('is-leaving');
          setTimeout(pintar, 300);
        }
      }

      /* ------------------------------------------------ juego 1 · opciones */
      function juegoOpciones(j) {
        var orden = dom.shuffle(j.opciones.map(function (texto, i) {
          return { texto: texto, original: i };
        }));

        slot.innerHTML = html`
          <div class="guess anim anim--soft">
            <p class="label">${j.etiqueta}</p>
            <p class="clue__text">${j.pregunta}</p>
            <div class="options" id="guess-options">
              ${raw(orden.map(function (o, pos) {
                return html`
                  <button class="option" type="button"
                          data-ok="${o.original === j.correcta ? '1' : '0'}"
                          data-texto="${o.texto}">
                    <span class="option__mark">${LETRAS[pos]}</span>
                    <span class="option__body">
                      <span class="option__title">${o.texto}</span>
                    </span>
                  </button>`;
              }).join(''))}
            </div>
            <div class="feedback" id="guess-feedback"></div>
          </div>
        `;

        var cont = dom.qs('#guess-options', slot);
        var fb = dom.qs('#guess-feedback', slot);

        cont.addEventListener('click', function (ev) {
          var btn = ev.target.closest('.option');
          if (!btn || cont.getAttribute('data-settled') === 'true') return;
          cont.setAttribute('data-settled', 'true');

          var acerto = btn.getAttribute('data-ok') === '1';

          dom.qsa('.option', cont).forEach(function (o) {
            if (o === btn) {
              o.setAttribute('data-state', acerto ? 'correct' : 'wrong');
            } else if (!acerto && o.getAttribute('data-ok') === '1') {
              o.setAttribute('data-state', 'correct');
            } else {
              o.setAttribute('data-state', 'muted');
            }
          });

          BX.audio.sfx(acerto ? 'bien' : 'mal');
          BX.fx.vibrar(20);
          fb.setAttribute('data-tone', acerto ? 'ok' : 'no');
          fb.innerHTML = html`<p class="feedback__text">${acerto ? j.acierto : j.error}</p>`;
          BX.fx.asegurarVisible(fb);

          setTimeout(siguiente, 1600);
        });
      }

      /* -------------------------------------------------- juego 2 · cartas */
      function juegoCartas(j) {
        var orden = dom.shuffle(j.cartas.map(function (texto, i) {
          return { texto: texto, original: i };
        }));

        slot.innerHTML = html`
          <div class="guess anim anim--soft">
            <p class="label">${j.etiqueta}</p>
            <p class="clue__text">${j.pregunta}</p>
            <div class="cards" id="guess-cards">
              ${raw(orden.map(function (o, pos) {
                return html`
                  <button class="card" type="button"
                          data-ok="${o.original === j.correcta ? '1' : '0'}"
                          data-texto="${o.texto}"
                          aria-label="Carta ${String(pos + 1)}, tocá para darla vuelta">
                    <span class="card__face card__face--back" aria-hidden="true">
                      <span class="card__mark">?</span>
                    </span>
                    <span class="card__face card__face--front">${o.texto}</span>
                  </button>`;
              }).join(''))}
            </div>
            <div class="feedback" id="guess-feedback"></div>
          </div>
        `;

        var cont = dom.qs('#guess-cards', slot);
        var fb = dom.qs('#guess-feedback', slot);

        cont.addEventListener('click', function (ev) {
          var carta = ev.target.closest('.card');
          if (!carta || cont.getAttribute('data-settled') === 'true') return;
          cont.setAttribute('data-settled', 'true');

          var acerto = carta.getAttribute('data-ok') === '1';

          BX.audio.sfx('tap');
          BX.fx.vibrar(14);

          // Se dan vuelta todas, la elegida primero.
          carta.setAttribute('data-flipped', 'true');
          carta.setAttribute('data-elegida', 'true');
          dom.qsa('.card', cont).forEach(function (c, i) {
            if (c === carta) return;
            setTimeout(function () { c.setAttribute('data-flipped', 'true'); }, 220 + i * 130);
          });

          setTimeout(function () {
            dom.qsa('.card', cont).forEach(function (c) {
              if (c.getAttribute('data-ok') === '1') c.setAttribute('data-state', 'correct');
              else if (c !== carta) c.setAttribute('data-state', 'muted');
            });
            if (!acerto) carta.setAttribute('data-state', 'wrong');

            BX.audio.sfx(acerto ? 'bien' : 'mal');
            fb.setAttribute('data-tone', acerto ? 'ok' : 'no');
            fb.innerHTML = html`<p class="feedback__text">${acerto ? j.acierto : j.error}</p>`;
            BX.fx.asegurarVisible(fb);

            setTimeout(siguiente, 1700);
          }, 900);
        });
      }

      /* ------------------------------------------ juego 3 · verdadero/falso */
      function juegoVerdaderoFalso(j) {
        var afirmaciones = j.afirmaciones || [];
        var respondidas = 0;

        slot.innerHTML = html`
          <div class="guess anim anim--soft">
            <p class="label">${j.etiqueta}</p>
            <p class="clue__text">${j.pregunta}</p>
            <div class="vf" id="guess-vf">
              ${raw(afirmaciones.map(function (a, i) {
                return html`
                  <div class="vf__row" data-i="${String(i)}" data-esperada="${a.respuesta ? 'v' : 'f'}">
                    <span class="vf__texto">${a.texto}</span>
                    <span class="vf__botones">
                      <button class="vf__btn" type="button" data-r="v"
                              aria-label="${a.texto}: verdadero">V</button>
                      <button class="vf__btn" type="button" data-r="f"
                              aria-label="${a.texto}: falso">F</button>
                    </span>
                  </div>`;
              }).join(''))}
            </div>
            <p class="vf__pendiente" id="guess-pendiente">${j.instruccion || 'Respondé las tres.'}</p>
            <div class="feedback" id="guess-feedback"></div>
          </div>
        `;

        var cont = dom.qs('#guess-vf', slot);
        var pendiente = dom.qs('#guess-pendiente', slot);
        var fb = dom.qs('#guess-feedback', slot);

        cont.addEventListener('click', function (ev) {
          var btn = ev.target.closest('.vf__btn');
          if (!btn) return;
          var fila = btn.closest('.vf__row');
          if (!fila || fila.getAttribute('data-settled') === 'true') return;
          fila.setAttribute('data-settled', 'true');

          var eligio = btn.getAttribute('data-r');
          var acerto = eligio === fila.getAttribute('data-esperada');

          dom.qsa('.vf__btn', fila).forEach(function (b) {
            if (b === btn) b.setAttribute('data-state', acerto ? 'correct' : 'wrong');
            else b.setAttribute('data-state', 'muted');
          });

          BX.audio.sfx(acerto ? 'bien' : 'mal');
          BX.fx.vibrar(12);

          respondidas++;

          var faltan = afirmaciones.length - respondidas;
          var EN_LETRAS = ['', 'una', 'dos', 'tres', 'cuatro', 'cinco'];
          if (faltan === 1) pendiente.textContent = 'Te falta una.';
          else if (faltan > 1) pendiente.textContent = 'Te faltan ' + (EN_LETRAS[faltan] || faltan) + '.';
          else pendiente.hidden = true;

          if (respondidas >= afirmaciones.length) {
            fb.setAttribute('data-tone', 'ok');
            fb.innerHTML = html`
              <p class="feedback__text">${j.acierto}</p>
              ${raw(j.cierre ? '<p class="feedback__text dim">' + dom.esc(j.cierre) + '</p>' : '')}
            `;
            BX.fx.asegurarVisible(fb);
            setTimeout(siguiente, 1900);
          }
        });
      }

      var MOTORES = {
        opciones: juegoOpciones,
        cartas: juegoCartas,
        verdadero_falso: juegoVerdaderoFalso
      };

      function pintar() {
        var j = juegos[indice];
        if (!j) return;
        pintarPips();
        (MOTORES[j.tipo] || juegoOpciones)(j);
      }

      pintar();
    }
  });

  /* ------------------------------------------------- el segundo regalo --- */
  /* Misma tarjeta que la invitación del primer regalo, para que se sientan
     un par. Lo que dice es otra cosa. */
  BX.router.registrar({
    id: 'segundo',
    clase: 'invite',

    render: function () {
      var c = window.EXPERIENCIA_CONFIG.segundo;

      var filas = (c.filas || []).map(function (f) {
        return html`
          <div class="invite__row">
            <span class="invite__key">${f.clave}</span>
            <span class="invite__val">${f.valor}</span>
          </div>`;
      }).join('');

      return html`
        <div class="screen__head anim d1">
          <p class="reveal__kicker">${c.kicker}</p>
          <hr class="rule rule--diamond">
        </div>

        <article class="invite anim anim--scale d3">
          <div class="invite__inner">
            <span class="invite__seal" aria-hidden="true"><span>II</span></span>
            <h2 class="invite__title acc-text">${c.titulo}</h2>
            <p class="invite__bajada">${c.bajada}</p>

            <div class="invite__data">${raw(filas)}</div>

            ${raw(c.nota ? '<p class="invite__nota">' + dom.esc(c.nota) + '</p>' : '')}
          </div>
        </article>

        ${raw(c.cierre
          ? '<p class="invite-screen__note anim anim--fade d5">' + dom.esc(c.cierre) + '</p>'
          : '')}

        <button class="btn ${raw(BX.state.data.terminado ? 'btn--ghost' : 'btn--primary')} anim anim--scale d6"
                id="segundo-next" type="button">
          ${BX.state.data.terminado ? 'Volver' : c.boton}
        </button>
      `;
    },

    montar: function (root) {
      BX.audio.sfx('brillo');
      BX.fx.flash();

      dom.qs('#segundo-next', root).addEventListener('click', function () {
        BX.state.set({ boveda: true });
        BX.router.ir('final');
      });
    }
  });
})(window.BX);
