/* ===========================================================================
   DESAFÍO 3 · LA PALABRA SECRETA
   Letras desordenadas que se tocan para armar la palabra.
   Pensado para dedo: nada de arrastrar.
   =========================================================================== */
(function (BX) {
  'use strict';

  var dom = BX.dom, html = dom.html, raw = dom.raw;

  function cfg() { return window.EXPERIENCIA_CONFIG.palabra; }

  BX.router.registrar({
    id: 'palabra',
    clase: 'challenge',

    render: function () {
      var c = cfg();
      return html`
        <div class="chapter anim d1">
          <p class="chapter__n">Capítulo III</p>
          <h2 class="chapter__title acc-text">${c.titulo}</h2>
          <hr class="rule rule--diamond">
          <p class="chapter__intro">${c.intro}</p>
        </div>

        <div class="word anim anim--soft d3">
          <div class="word__slots" id="word-slots" role="group" aria-label="Palabra en construcción"></div>
          <div class="word__pool" id="word-pool" role="group" aria-label="Letras disponibles"></div>
        </div>

        <div class="feedback" id="word-feedback">
          <button class="hint-btn" id="word-hint" type="button">¿Necesitás una pista?</button>
        </div>
      `;
    },

    montar: function (root) {
      var c = cfg();
      var respuesta = String(c.respuesta || '').toUpperCase().replace(/\s+/g, '');
      var letras = respuesta.split('');

      var slotsEl = dom.qs('#word-slots', root);
      var poolEl = dom.qs('#word-pool', root);
      var fb = dom.qs('#word-feedback', root);

      slotsEl.style.setProperty('--n', String(letras.length));
      poolEl.style.setProperty('--n', String(letras.length));

      var pool = dom.shuffleDistinct(letras).map(function (letra, i) {
        return { id: i, letra: letra, usada: false };
      });

      var slots = letras.map(function () {
        return { letra: null, tileId: null, fija: false };
      });

      var pistasUsadas = 0;
      var resuelto = false;

      /* --------------------------------------------------------------- pintar */
      function pintar(estado) {
        slotsEl.innerHTML = slots.map(function (s, i) {
          return html`
            <button class="slot" type="button" data-slot="${String(i)}"
                    data-filled="${s.letra ? 'true' : 'false'}"
                    data-revealed="${s.fija ? 'true' : 'false'}"
                    aria-label="${s.letra ? 'Letra ' + s.letra + ', tocá para quitarla' : 'Espacio vacío'}"
            >${s.letra || ''}</button>`;
        }).join('');

        poolEl.innerHTML = pool.map(function (t) {
          return html`
            <button class="tile" type="button" data-tile="${String(t.id)}"
                    data-used="${t.usada ? 'true' : 'false'}"
                    aria-label="Letra ${t.letra}">${t.letra}</button>`;
        }).join('');

        if (estado) slotsEl.setAttribute('data-state', estado);
        else slotsEl.removeAttribute('data-state');
      }

      function tilePorId(id) {
        for (var i = 0; i < pool.length; i++) if (pool[i].id === id) return pool[i];
        return null;
      }

      function primerLibre() {
        for (var i = 0; i < slots.length; i++) {
          if (!slots[i].fija && slots[i].letra === null) return i;
        }
        return -1;
      }

      function completo() {
        for (var i = 0; i < slots.length; i++) if (slots[i].letra === null) return false;
        return true;
      }

      function armada() {
        return slots.map(function (s) { return s.letra || ''; }).join('');
      }

      /* -------------------------------------------------------------- acciones */
      function colocar(id) {
        var t = tilePorId(id);
        if (!t || t.usada) return;
        var idx = primerLibre();
        if (idx < 0) return;

        slots[idx].letra = t.letra;
        slots[idx].tileId = t.id;
        t.usada = true;

        BX.audio.sfx('tap');
        BX.fx.vibrar(8);
        pintar();
        if (completo()) setTimeout(verificar, 260);
      }

      function quitar(idx) {
        var s = slots[idx];
        if (!s || s.fija || s.letra === null) return;
        var t = tilePorId(s.tileId);
        if (t) t.usada = false;
        s.letra = null;
        s.tileId = null;

        BX.audio.sfx('tap');
        pintar();
      }

      function limpiarNoFijos() {
        slots.forEach(function (s) {
          if (!s.fija && s.tileId !== null) {
            var t = tilePorId(s.tileId);
            if (t) t.usada = false;
            s.letra = null;
            s.tileId = null;
          }
        });
      }

      function revelarLetra() {
        var idx = -1;
        for (var i = 0; i < slots.length; i++) { if (!slots[i].fija) { idx = i; break; } }
        if (idx < 0) return false;

        limpiarNoFijos();

        var letra = respuesta[idx];
        var elegido = null;
        for (var j = 0; j < pool.length; j++) {
          if (!pool[j].usada && pool[j].letra === letra) { elegido = pool[j]; break; }
        }
        if (!elegido) return false;

        elegido.usada = true;
        slots[idx] = { letra: letra, tileId: elegido.id, fija: true };

        BX.audio.sfx('pista');
        pintar();
        if (completo()) setTimeout(verificar, 320);
        return true;
      }

      /* ---------------------------------------------------------- verificación */
      function verificar() {
        if (resuelto) return;

        if (armada() === respuesta) {
          resuelto = true;
          pintar('correct');
          BX.audio.sfx('bien');
          BX.audio.sfx('brillo');
          BX.fx.vibrar([18, 60, 26]);
          BX.state.set({ palabra: true });
          BX.router.progreso(74);

          fb.setAttribute('data-tone', 'ok');
          fb.innerHTML = html`
            <p class="feedback__text">${c.acierto}</p>
            <button class="btn btn--primary" id="word-next" type="button"
                    style="margin-top:.9rem">${c.boton}</button>
          `;
          dom.qs('#word-next', fb).addEventListener('click', function () {
            BX.router.ir('revelacion');
          });
          BX.fx.asegurarVisible(fb);

        } else {
          pintar('wrong');
          BX.audio.sfx('mal');
          BX.fx.vibrar(45);

          fb.setAttribute('data-tone', 'no');
          fb.innerHTML = html`
            <p class="feedback__text">Esa no es. Probá otra combinación.</p>
            <button class="hint-btn" id="word-hint" type="button">Dame una pista</button>
          `;
          cablearPista();

          setTimeout(function () {
            limpiarNoFijos();
            pintar();
          }, 850);
        }
      }

      /* ---------------------------------------------------------------- pistas */
      function cablearPista() {
        var btn = dom.qs('#word-hint', fb);
        if (!btn) return;
        btn.addEventListener('click', function () {
          var textos = c.pistas || [];

          if (pistasUsadas < textos.length) {
            fb.setAttribute('data-tone', 'hint');
            fb.innerHTML = html`
              <p class="feedback__text">${textos[pistasUsadas]}</p>
              <button class="hint-btn" id="word-hint" type="button">Otra pista</button>
            `;
            pistasUsadas++;
            BX.audio.sfx('pista');
            cablearPista();
          } else {
            var pudo = revelarLetra();
            fb.setAttribute('data-tone', 'hint');
            fb.innerHTML = html`
              <p class="feedback__text">${pudo
                ? 'Te dejo una letra en su lugar.'
                : 'Ya no quedan pistas: la palabra está casi armada.'}</p>
              <button class="hint-btn" id="word-hint" type="button">Revelar otra letra</button>
            `;
            cablearPista();
          }
        });
      }

      /* ----------------------------------------------------------- escuchadores */
      poolEl.addEventListener('click', function (ev) {
        var t = ev.target.closest('.tile');
        if (!t || resuelto) return;
        colocar(parseInt(t.getAttribute('data-tile'), 10));
      });

      slotsEl.addEventListener('click', function (ev) {
        var s = ev.target.closest('.slot');
        if (!s || resuelto) return;
        quitar(parseInt(s.getAttribute('data-slot'), 10));
      });

      pintar();
      cablearPista();
    }
  });
})(window.BX);
