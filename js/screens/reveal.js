/* ===========================================================================
   REVELACIÓN DEL PRIMER REGALO + INVITACIÓN
   =========================================================================== */
(function (BX) {
  'use strict';

  var dom = BX.dom, html = dom.html, raw = dom.raw;

  function cRev() { return window.EXPERIENCIA_CONFIG.revelacion; }
  function cInv() { return window.EXPERIENCIA_CONFIG.invitacion; }

  /* Copa de vino que se llena. Trazo fino, dorado, sin relleno chillón. */
  var COPA = [
    '<svg viewBox="0 0 100 160" aria-hidden="true">',
    '<defs>',
      '<clipPath id="copa-bowl">',
        '<path d="M24 14 C24 52 35 72 50 75 C65 72 76 52 76 14 Z"/>',
      '</clipPath>',
      '<linearGradient id="copa-vino" x1="0" y1="0" x2="0" y2="1">',
        '<stop offset="0%" stop-color="#8C1B36"/>',
        '<stop offset="55%" stop-color="#5A0F24"/>',
        '<stop offset="100%" stop-color="#2A0711"/>',
      '</linearGradient>',
      '<linearGradient id="copa-cristal" gradientUnits="userSpaceOnUse" x1="18" y1="8" x2="82" y2="140">',
        '<stop offset="0%" stop-color="#D4DCE5" stop-opacity=".85"/>',
        '<stop offset="55%" stop-color="#D4DCE5" stop-opacity=".35"/>',
        '<stop offset="100%" stop-color="#9AA6B2" stop-opacity=".7"/>',
      '</linearGradient>',
    '</defs>',

    // vino
    '<g clip-path="url(#copa-bowl)">',
      '<g class="glass__liquid-group">',
        '<rect x="18" y="40" width="64" height="44" fill="url(#copa-vino)"/>',
        '<ellipse class="glass__surface" cx="50" cy="40" rx="24" ry="2.9" fill="#A3203F" opacity=".92"/>',
      '</g>',
    '</g>',

    // cristal
    '<g fill="none" stroke="url(#copa-cristal)" stroke-width="1.3" stroke-linecap="round">',
      '<path d="M24 14 C24 52 35 72 50 75 C65 72 76 52 76 14"/>',
      '<path d="M24 14 L76 14"/>',
      '<path d="M50 75 L50 128"/>',
      '<path d="M30 132 C30 128.5 38 127 50 127 C62 127 70 128.5 70 132 C70 135.5 62 137 50 137 C38 137 30 135.5 30 132 Z"/>',
    '</g>',
    '<path d="M31 20 C31 48 38 64 46 69" fill="none" stroke="#F7FAFC" stroke-opacity=".3" stroke-width="1"/>',
    '</svg>'
  ].join('');

  /* Ilustración de viñedo: se usa si todavía no hay foto de la bodega. */
  var VINEDO = [
    '<svg viewBox="0 0 320 200" aria-hidden="true" style="width:100%;height:100%">',
    '<defs><linearGradient id="vi-sky" x1="0" y1="0" x2="0" y2="1">',
    '<stop offset="0%" stop-color="#2A0711"/><stop offset="100%" stop-color="#0B080F"/>',
    '</linearGradient></defs>',
    '<rect width="320" height="200" fill="url(#vi-sky)"/>',
    '<circle cx="246" cy="58" r="17" fill="#D4DCE5" opacity=".16"/>',
    '<circle cx="246" cy="58" r="8" fill="#D4DCE5" opacity=".28"/>',
    '<g fill="none" stroke="#D4DCE5" stroke-opacity=".3" stroke-width="1">',
    '<path d="M-10 118 C60 100 120 104 180 96 C240 88 290 92 330 84"/>',
    '<path d="M-10 136 C60 120 130 124 190 114 C250 104 300 108 330 100"/>',
    '<path d="M-10 156 C60 142 130 146 196 134 C260 122 304 126 330 118"/>',
    '<path d="M-10 178 C60 166 130 170 200 156 C266 144 306 148 330 140"/>',
    '</g>',
    '<g stroke="#D4DCE5" stroke-opacity=".5" stroke-width="1" stroke-linecap="round">',
    '<path d="M44 150 L44 128 M38 134 L44 139 M50 132 L44 138"/>',
    '<path d="M104 142 L104 120 M98 126 L104 131 M110 124 L104 130"/>',
    '<path d="M164 134 L164 112 M158 118 L164 123 M170 116 L164 122"/>',
    '<path d="M224 126 L224 104 M218 110 L224 115 M230 108 L224 114"/>',
    '</g>',
    '<path d="M0 182 C80 172 150 176 230 166 C280 160 310 162 320 158 L320 200 L0 200 Z" fill="#07050A" opacity=".85"/>',
    '</svg>'
  ].join('');

  /* ---------------------------------------------------------------- pantalla */
  BX.router.registrar({
    id: 'revelacion',
    clase: 'reveal',

    render: function () {
      var c = cRev();
      var lineas = (c.lineas || []).map(function (t, i) {
        return html`<p class="anim ${raw('d' + (i + 6))}">${t}</p>`;
      }).join('');

      return html`
        <div class="glass anim anim--fade d1">
          <span class="glass__halo" aria-hidden="true"></span>
          ${raw(COPA)}
          <span class="glass__sparkles" id="glass-sparkles" aria-hidden="true"></span>
        </div>

        <div class="screen__head">
          <p class="reveal__kicker anim anim--fade d4">${c.kicker}</p>
          <hr class="rule rule--diamond anim anim--rule d5">
        </div>

        <div class="reveal__lines">${raw(lineas)}</div>

        <button class="btn btn--primary anim anim--scale d8" id="reveal-next" type="button">
          ${c.boton}
        </button>
      `;
    },

    montar: function (root) {
      BX.fx.sembrarDestellos(dom.qs('#glass-sparkles', root), 8);
      BX.audio.sfx('revelacion');

      setTimeout(function () { BX.fx.flash(); }, 2300);

      dom.qs('#reveal-next', root).addEventListener('click', function () {
        BX.audio.sfx('descorche');
        BX.router.ir('invitacion');
      });
    }
  });

  /* -------------------------------------------------------------- invitación */
  function fila(clave, valor) {
    var vacio = !valor || !String(valor).trim();
    return html`
      <div class="invite__row">
        <span class="invite__key">${clave}</span>
        <span class="invite__val" data-empty="${vacio ? 'true' : 'false'}">${vacio ? 'A confirmar' : valor}</span>
      </div>`;
  }

  function tarjeta(animada) {
    var c = cInv();
    var tieneFoto = !!(c.foto && String(c.foto).trim());

    var foto = tieneFoto
      ? html`<div class="invite__photo">
               <img src="${c.foto}" alt="${c.bodega ? 'Foto de ' + c.bodega : 'La bodega'}"
                    id="invite-img" loading="lazy"
                    style="${c.fotoPosicion ? 'object-position:' + c.fotoPosicion : ''}">
             </div>`
      : html`<div class="invite__photo invite__photo--empty">${raw(VINEDO)}</div>`;

    return html`
      <article class="invite ${raw(animada ? 'anim anim--scale d2' : '')}">
        <div class="invite__inner">
          <span class="invite__seal" aria-hidden="true"><span>B</span></span>
          <h2 class="invite__title acc-text">${c.titulo}</h2>
          <p class="invite__bajada">${c.bajada}</p>
          ${raw(foto)}
          ${raw(c.fotoCredito ? '<p class="invite__photo-hint">' + dom.esc(c.fotoCredito) + '</p>' : '')}
          <div class="invite__data">
            ${raw(fila('Bodega', c.bodega))}
            ${raw(fila('Fecha', c.fecha))}
            ${raw(fila('Hora', c.hora))}
            ${raw(fila('Ubicación', c.ubicacion))}
          </div>
          ${raw(c.nota ? '<p class="invite__nota">' + dom.esc(c.nota) + '</p>' : '')}
        </div>
      </article>`;
  }

  BX.router.registrar({
    id: 'invitacion',
    clase: 'invite',

    render: function () {
      var c = cInv();
      var volviendo = BX.state.data.terminado;

      return html`
        <div class="screen__head anim d1">
          <p class="label">Tu invitación</p>
        </div>

        ${raw(tarjeta(true))}

        <button class="btn ${raw(volviendo ? 'btn--ghost' : 'btn--primary')} anim anim--scale d4"
                id="invite-next" type="button">
          ${volviendo ? 'Volver' : c.boton}
        </button>
      `;
    },

    montar: function (root) {
      BX.audio.sfx('brillo');
      BX.state.set({ invitacion: true });

      // Si la foto no existe o falla, caemos en la ilustración sin romper nada.
      var img = dom.qs('#invite-img', root);
      if (img) {
        img.addEventListener('error', function () {
          var cont = img.parentNode;
          cont.classList.add('invite__photo--empty');
          cont.innerHTML = VINEDO;
        });
      }

      dom.qs('#invite-next', root).addEventListener('click', function () {
        BX.router.ir(BX.state.data.terminado ? 'final' : 'boveda');
      });
    }
  });

  /* La tarjeta se reusa en la pantalla final. */
  BX.tarjetaInvitacion = tarjeta;
})(window.BX);
