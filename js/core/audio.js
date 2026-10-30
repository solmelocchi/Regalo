/* ===========================================================================
   AUDIO · música ambiental y efectos, generados con Web Audio.
   No hay archivos de sonido: todo se sintetiza en el navegador.
   Peso cero, sin dependencias, sin esperas de descarga.
   =========================================================================== */
(function (BX) {
  'use strict';

  var ctx = null;
  var master = null, musicBus = null, sfxBus = null, reverb = null, reverbSend = null;
  var musicNodes = [];
  var plucker = null;
  var musicOn = false;
  var arranco = false;

  function ajustes() {
    return (window.EXPERIENCIA_CONFIG && window.EXPERIENCIA_CONFIG.ajustes) || {};
  }

  /* ----------------------------------------------------------- infraestructura */
  function ensure() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;

    try { ctx = new AC(); } catch (e) { return null; }

    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);

    // Reverb por convolución con un impulso generado al vuelo.
    reverb = ctx.createConvolver();
    reverb.buffer = impulso(2.8, 2.6);
    var reverbOut = ctx.createGain();
    reverbOut.gain.value = 0.5;
    reverb.connect(reverbOut);
    reverbOut.connect(master);

    reverbSend = ctx.createGain();
    reverbSend.gain.value = 1;
    reverbSend.connect(reverb);

    musicBus = ctx.createGain();
    musicBus.gain.value = 0;
    musicBus.connect(master);

    sfxBus = ctx.createGain();
    sfxBus.gain.value = typeof ajustes().volumenEfectos === 'number' ? ajustes().volumenEfectos : 0.5;
    sfxBus.connect(master);

    return ctx;
  }

  function impulso(segundos, decaimiento) {
    var rate = ctx.sampleRate;
    var largo = Math.floor(rate * segundos);
    var buf = ctx.createBuffer(2, largo, rate);
    for (var c = 0; c < 2; c++) {
      var ch = buf.getChannelData(c);
      for (var i = 0; i < largo; i++) {
        ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / largo, decaimiento);
      }
    }
    return buf;
  }

  function ruido(segundos) {
    var largo = Math.floor(ctx.sampleRate * segundos);
    var buf = ctx.createBuffer(1, largo, ctx.sampleRate);
    var ch = buf.getChannelData(0);
    for (var i = 0; i < largo; i++) ch[i] = Math.random() * 2 - 1;
    return buf;
  }

  function resume() {
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }

  /* ------------------------------------------------------------------ música */
  /* Drone grave + pad menor + plucks esporádicos con reverb larga. */
  function startMusic() {
    if (!ensure() || musicOn) return;
    musicOn = true;
    resume();

    var t = ctx.currentTime;
    var vol = typeof ajustes().volumenMusica === 'number' ? ajustes().volumenMusica : 0.22;

    // --- drone: dos sierras muy filtradas, una levemente desafinada
    var droneFilter = ctx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.value = 300;
    droneFilter.Q.value = 2;
    droneFilter.connect(musicBus);

    [55, 55.4, 82.41].forEach(function (f, i) {
      var osc = ctx.createOscillator();
      var g = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = f;
      g.gain.value = i === 2 ? 0.1 : 0.16;
      osc.connect(g); g.connect(droneFilter);
      osc.start(t);
      musicNodes.push(osc, g);
    });

    // --- pad: acorde menor en triangulares, con el filtro respirando
    var padFilter = ctx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.value = 900;
    padFilter.Q.value = 1.2;
    padFilter.connect(musicBus);

    var padSend = ctx.createGain();
    padSend.gain.value = 0.3;
    padSend.connect(reverbSend);
    padFilter.connect(padSend);

    [110, 130.81, 164.81, 220].forEach(function (f, i) {
      var osc = ctx.createOscillator();
      var g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = f;
      osc.detune.value = (i % 2 ? 6 : -6);
      g.gain.value = 0.055 / (1 + i * 0.35);
      osc.connect(g); g.connect(padFilter);
      osc.start(t);
      musicNodes.push(osc, g);
    });

    // --- LFO lento sobre el filtro del pad: el acorde "respira"
    var lfo = ctx.createOscillator();
    var lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.value = 0.055;
    lfoGain.gain.value = 420;
    lfo.connect(lfoGain);
    lfoGain.connect(padFilter.frequency);
    lfo.start(t);
    musicNodes.push(lfo, lfoGain);

    // --- plucks: notas sueltas de una pentatónica, bien separadas
    var escala = [440, 523.25, 659.25, 783.99, 880, 1046.5];
    function pluck() {
      if (!musicOn) return;
      var f = escala[Math.floor(Math.random() * escala.length)];
      var now = ctx.currentTime;
      var osc = ctx.createOscillator();
      var g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.085, now + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 2.6);
      osc.connect(g);
      g.connect(musicBus);
      g.connect(reverbSend);
      osc.start(now);
      osc.stop(now + 2.7);
      plucker = setTimeout(pluck, 3200 + Math.random() * 4200);
    }
    plucker = setTimeout(pluck, 2200);

    // --- fade in largo
    musicBus.gain.cancelScheduledValues(t);
    musicBus.gain.setValueAtTime(musicBus.gain.value, t);
    musicBus.gain.linearRampToValueAtTime(vol, t + 3.2);
  }

  function stopMusic() {
    if (!ctx || !musicOn) return;
    musicOn = false;
    if (plucker) { clearTimeout(plucker); plucker = null; }

    var t = ctx.currentTime;
    musicBus.gain.cancelScheduledValues(t);
    musicBus.gain.setValueAtTime(musicBus.gain.value, t);
    musicBus.gain.linearRampToValueAtTime(0.0001, t + 1.1);

    var aMatar = musicNodes.slice();
    musicNodes = [];
    setTimeout(function () {
      aMatar.forEach(function (n) {
        try { if (n.stop) n.stop(); n.disconnect(); } catch (e) { /* ya cerrado */ }
      });
    }, 1300);
  }

  /* ------------------------------------------------------------------ voces */
  function voz(opts) {
    if (!ctx) return;
    var now = ctx.currentTime + (opts.delay || 0);
    var osc = ctx.createOscillator();
    var g = ctx.createGain();
    var dur = opts.dur || 0.2;
    var pico = opts.gain === undefined ? 0.3 : opts.gain;

    osc.type = opts.type || 'sine';
    osc.frequency.setValueAtTime(opts.freq, now);
    if (opts.to) osc.frequency.exponentialRampToValueAtTime(opts.to, now + dur);

    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(pico, now + (opts.attack || 0.008));
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    var destino = g;
    if (opts.filtro) {
      var f = ctx.createBiquadFilter();
      f.type = opts.filtro;
      f.frequency.value = opts.filtroFreq || 1200;
      f.Q.value = opts.q || 1;
      osc.connect(f); f.connect(g);
    } else {
      osc.connect(g);
    }

    destino.connect(sfxBus);
    if (opts.rev) {
      var send = ctx.createGain();
      send.gain.value = opts.rev;
      destino.connect(send);
      send.connect(reverbSend);
    }

    osc.start(now);
    osc.stop(now + dur + 0.05);
  }

  function golpe(opts) {
    if (!ctx) return;
    var now = ctx.currentTime + (opts.delay || 0);
    var dur = opts.dur || 0.18;
    var src = ctx.createBufferSource();
    src.buffer = ruido(dur + 0.05);

    var f = ctx.createBiquadFilter();
    f.type = opts.filtro || 'bandpass';
    f.frequency.setValueAtTime(opts.freq || 1800, now);
    if (opts.to) f.frequency.exponentialRampToValueAtTime(opts.to, now + dur);
    f.Q.value = opts.q || 6;

    var g = ctx.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(opts.gain === undefined ? 0.22 : opts.gain, now + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    src.connect(f); f.connect(g); g.connect(sfxBus);
    if (opts.rev) {
      var send = ctx.createGain();
      send.gain.value = opts.rev;
      g.connect(send);
      send.connect(reverbSend);
    }
    src.start(now);
    src.stop(now + dur + 0.06);
  }

  /* ----------------------------------------------------------------- efectos */
  var EFECTOS = {
    tap: function () {
      voz({ type: 'triangle', freq: 1180, to: 1560, dur: 0.07, gain: 0.1 });
    },
    paso: function () {
      voz({ type: 'sine', freq: 520, to: 780, dur: 0.22, gain: 0.14, rev: 0.3 });
    },
    bien: function () {
      voz({ type: 'sine', freq: 659.25, dur: 0.55, gain: 0.2, rev: 0.45 });
      voz({ type: 'sine', freq: 987.77, dur: 0.75, gain: 0.15, rev: 0.5, delay: 0.09 });
    },
    mal: function () {
      voz({ type: 'sawtooth', freq: 170, to: 92, dur: 0.3, gain: 0.16, filtro: 'lowpass', filtroFreq: 700 });
    },
    pista: function () {
      voz({ type: 'sine', freq: 880, dur: 0.18, gain: 0.12, rev: 0.4 });
      voz({ type: 'sine', freq: 1318.5, dur: 0.3, gain: 0.09, rev: 0.4, delay: 0.1 });
    },
    transicion: function () {
      golpe({ freq: 320, to: 4200, dur: 0.5, q: 1.1, gain: 0.1, filtro: 'bandpass', rev: 0.3 });
    },
    revelacion: function () {
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
        voz({
          type: 'sine', freq: f, dur: 3.4, gain: 0.13 - i * 0.015,
          attack: 1.1, rev: 0.7, delay: i * 0.14
        });
      });
      golpe({ freq: 180, to: 2600, dur: 1.5, q: 0.9, gain: 0.07, rev: 0.6 });
    },
    descorche: function () {
      voz({ type: 'sine', freq: 420, to: 1500, dur: 0.1, gain: 0.26 });
      golpe({ freq: 2400, to: 700, dur: 0.14, q: 3, gain: 0.18, rev: 0.3 });
    },
    denegado: function () {
      voz({ type: 'square', freq: 118, dur: 0.38, gain: 0.14, filtro: 'lowpass', filtroFreq: 900 });
      voz({ type: 'square', freq: 111, dur: 0.38, gain: 0.12, filtro: 'lowpass', filtroFreq: 900, delay: 0.015 });
      golpe({ freq: 3200, to: 900, dur: 0.22, q: 9, gain: 0.16, delay: 0.02 });
    },
    candado: function () {
      golpe({ freq: 2800, to: 420, dur: 0.3, q: 11, gain: 0.2, rev: 0.35 });
      voz({ type: 'sine', freq: 90, to: 55, dur: 0.4, gain: 0.2, delay: 0.03 });
    },
    brillo: function () {
      [1046.5, 1318.5, 1567.98, 2093].forEach(function (f, i) {
        voz({ type: 'sine', freq: f, dur: 0.9, gain: 0.08, rev: 0.6, delay: i * 0.07 });
      });
    }
  };

  function sfx(nombre) {
    if (!arranco || !ctx) return;
    var fn = EFECTOS[nombre];
    if (!fn) return;
    resume();
    try { fn(); } catch (e) { /* un efecto que falla no debe cortar la experiencia */ }
  }

  /* --------------------------------------------------------------- fachada */
  /* Hay que llamarlo desde un gesto del usuario: los navegadores
     no permiten crear audio antes de que alguien toque la pantalla. */
  function unlock(conMusica) {
    if (!ensure()) return false;
    arranco = true;
    resume();
    if (conMusica) startMusic();
    return true;
  }

  function setMusica(encendida) {
    if (encendida) {
      if (!arranco) { unlock(true); return musicOn; }
      startMusic();
    } else {
      stopMusic();
    }
    return musicOn;
  }

  BX.audio = {
    unlock: unlock,
    sfx: sfx,
    setMusica: setMusica,
    get musicaActiva() { return musicOn; },
    get disponible() { return !!(window.AudioContext || window.webkitAudioContext); }
  };
})(window.BX);
