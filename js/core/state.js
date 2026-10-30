/* ===========================================================================
   ESTADO · progreso de la experiencia, persistido en localStorage.
   =========================================================================== */
(function (BX) {
  'use strict';

  var KEY = 'tbe.progreso.v1';

  function defaults() {
    return {
      v: 1,
      pantalla: 'intro',
      sentidos: 0,        // cuántas pistas sensoriales resolvió (0..3)
      enigma: false,
      palabra: false,
      invitacion: false,
      boveda: false,
      dijo: [],           // lo que respondió en los tres intentos
      terminado: false,
      sonido: null        // null = todavía no eligió; toma el valor del config
    };
  }

  var data = defaults();

  function cfg() {
    return (window.EXPERIENCIA_CONFIG && window.EXPERIENCIA_CONFIG.ajustes) || {};
  }

  function persiste() { return cfg().guardarProgreso !== false; }

  function load() {
    if (!persiste()) return data;
    try {
      var saved = JSON.parse(window.localStorage.getItem(KEY) || 'null');
      if (saved && saved.v === 1) {
        Object.keys(data).forEach(function (k) {
          if (saved[k] !== undefined) data[k] = saved[k];
        });
      }
    } catch (e) { /* modo privado o storage bloqueado: seguimos en memoria */ }
    return data;
  }

  function save() {
    if (!persiste()) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) { /* sin storage: el progreso vive sólo en esta sesión */ }
  }

  function set(patch) {
    Object.keys(patch).forEach(function (k) { data[k] = patch[k]; });
    save();
    return data;
  }

  function reset() {
    var sonido = data.sonido;
    data = defaults();
    data.sonido = sonido;            // la preferencia de audio se respeta
    save();
    return data;
  }

  /* ¿Tiene algo empezado como para retomar? */
  function hayProgreso() {
    return data.pantalla !== 'intro' && !data.terminado;
  }

  BX.state = {
    get data() { return data; },
    load: load, save: save, set: set, reset: reset, hayProgreso: hayProgreso
  };
})(window.BX);
