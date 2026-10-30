/* ===========================================================================
   DOM · helpers mínimos. Sin dependencias.
   =========================================================================== */
window.BX = window.BX || {};

(function (BX) {
  'use strict';

  var ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  function esc(value) {
    if (value === null || value === undefined) return '';
    return String(value).replace(/[&<>"']/g, function (c) { return ESCAPES[c]; });
  }

  /* Marca un string como HTML ya seguro, para que html`` no lo escape. */
  function raw(value) {
    return { __raw: true, value: String(value) };
  }

  function render(value) {
    if (value === null || value === undefined || value === false) return '';
    if (Array.isArray(value)) return value.map(render).join('');
    if (value.__raw) return value.value;
    return esc(value);
  }

  /* Template tag: escapa todo lo interpolado salvo lo envuelto en raw(). */
  function html(strings) {
    var out = strings[0];
    for (var i = 1; i < arguments.length; i++) {
      out += render(arguments[i]) + strings[i];
    }
    return out;
  }

  function qs(selector, scope) { return (scope || document).querySelector(selector); }
  function qsa(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function wait(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  function clamp(n, min, max) { return n < min ? min : n > max ? max : n; }

  function shuffle(list) {
    var out = list.slice();
    for (var i = out.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = out[i]; out[i] = out[j]; out[j] = tmp;
    }
    return out;
  }

  /* Mezcla asegurando que el resultado no quede igual al original. */
  function shuffleDistinct(list) {
    if (list.length < 2) return list.slice();
    var out = shuffle(list), guard = 0;
    while (out.join('') === list.join('') && guard++ < 12) out = shuffle(list);
    return out;
  }

  var reduced = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false };

  BX.dom = {
    esc: esc, raw: raw, html: html, qs: qs, qsa: qsa,
    wait: wait, clamp: clamp, shuffle: shuffle, shuffleDistinct: shuffleDistinct,
    get reducedMotion() { return !!reduced.matches; }
  };
})(window.BX);
