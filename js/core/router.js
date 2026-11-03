/* ===========================================================================
   ROUTER · pantallas y transiciones cinematográficas.
   Cada pantalla se registra con { id, clase, capitulo, render, montar }.
   =========================================================================== */
(function (BX) {
  'use strict';

  var dom = BX.dom;
  var pantallas = {};
  var actual = null;
  var enTransicion = false;

  /* Etiqueta y avance del HUD por pantalla. */
  var CAPITULOS = {
    intro:      { label: '',                              progreso: 0,   hud: false },
    sentidos:   { label: 'Capítulo I · Los sentidos',      progreso: 10,  hud: true },
    puente:     { label: 'Capítulo I · Los sentidos',      progreso: 34,  hud: true },
    enigma:     { label: 'Capítulo II · El enigma',        progreso: 48,  hud: true },
    palabra:    { label: 'Capítulo III · La palabra',      progreso: 64,  hud: true },
    revelacion: { label: 'Primer regalo',                  progreso: 80,  hud: true },
    invitacion: { label: 'La invitación',                  progreso: 88,  hud: true },
    boveda:     { label: 'Segundo regalo',                 progreso: 90,  hud: true },
    adivinanza: { label: 'Tres intentos',                  progreso: 93,  hud: true },
    segundo:    { label: 'Segundo regalo',                 progreso: 98,  hud: true },
    final:      { label: 'Fin de la experiencia',          progreso: 100, hud: true }
  };

  function registrar(def) { pantallas[def.id] = def; }

  /* ------------------------------------------------------------------- HUD */
  function pintarHud(id) {
    var cap = CAPITULOS[id] || { label: '', progreso: 0, hud: true };
    var hud = dom.qs('#hud');
    var chapter = dom.qs('#hud-chapter');
    var fill = dom.qs('#hud-fill');
    var bar = dom.qs('#hud-bar');

    if (hud) hud.setAttribute('data-visible', cap.hud ? 'true' : 'false');
    if (chapter) chapter.textContent = cap.label;
    if (fill) fill.style.width = cap.progreso + '%';
    if (bar) bar.setAttribute('aria-valuenow', String(cap.progreso));
  }

  /* Avance fino dentro de un capítulo (ej: pista 2 de 3). */
  function progreso(valor) {
    var fill = dom.qs('#hud-fill');
    var bar = dom.qs('#hud-bar');
    var v = dom.clamp(valor, 0, 100);
    if (fill) fill.style.width = v + '%';
    if (bar) bar.setAttribute('aria-valuenow', String(Math.round(v)));
  }

  /* ---------------------------------------------------------------- montaje */
  function montar(id) {
    var def = pantallas[id];
    if (!def) { console.warn('[TBE] pantalla desconocida:', id); return; }

    var stage = dom.qs('#stage');
    stage.innerHTML = '';

    var nodo = document.createElement('section');
    nodo.className = 'screen screen--' + (def.clase || def.id);
    nodo.innerHTML = def.render();
    stage.appendChild(nodo);

    actual = id;
    BX.state.set({ pantalla: id });
    pintarHud(id);
    window.scrollTo(0, 0);

    if (def.montar) def.montar(nodo);
    return nodo;
  }

  /* ------------------------------------------------------------- navegación */
  function ir(id, opciones) {
    var opts = opciones || {};
    if (enTransicion) return Promise.resolve();

    if (opts.inmediato) {
      montar(id);
      return Promise.resolve();
    }

    enTransicion = true;
    BX.audio.sfx('transicion');

    var vieja = dom.qs('.screen');
    if (vieja) vieja.classList.add('is-leaving');

    return BX.fx.cortina('close')
      .then(function () {
        montar(id);
        return BX.fx.cortina('open');
      })
      .then(function () {
        enTransicion = false;
      });
  }

  BX.router = {
    registrar: registrar,
    ir: ir,
    montar: montar,
    progreso: progreso,
    pintarHud: pintarHud,
    get actual() { return actual; },
    get capitulos() { return CAPITULOS; }
  };
})(window.BX);
