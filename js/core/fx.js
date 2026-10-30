/* ===========================================================================
   FX · partículas de luz, destellos, cortinas y micro-feedback táctil.
   =========================================================================== */
(function (BX) {
  'use strict';

  var dom = BX.dom;

  /* ------------------------------------------------------------- partículas */
  var canvas = null, cg = null, particulas = [], raf = null, w = 0, h = 0, dpr = 1;

  function dimensionar() {
    if (!canvas) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    cg.setTransform(dpr, 0, 0, dpr, 0, 0);
    poblar();
  }

  function poblar() {
    var objetivo = dom.clamp(Math.round((w * h) / 26000), 14, 42);
    particulas = [];
    for (var i = 0; i < objetivo; i++) particulas.push(nacer(true));
  }

  function nacer(inicial) {
    return {
      x: Math.random() * w,
      y: inicial ? Math.random() * h : h + 12,
      r: 0.5 + Math.random() * 1.5,
      vy: 0.08 + Math.random() * 0.3,
      sway: 0.3 + Math.random() * 0.9,
      fase: Math.random() * Math.PI * 2,
      vida: 0,
      max: 500 + Math.random() * 900,
      brillo: 0.18 + Math.random() * 0.42
    };
  }

  function pintar() {
    cg.clearRect(0, 0, w, h);

    for (var i = 0; i < particulas.length; i++) {
      var p = particulas[i];
      p.vida++;
      p.y -= p.vy;
      p.fase += 0.008;
      var x = p.x + Math.sin(p.fase) * p.sway * 9;

      // aparece y se apaga suave en los extremos de su vida
      var entrada = Math.min(p.vida / 90, 1);
      var salida = Math.min((p.max - p.vida) / 120, 1);
      var alpha = p.brillo * entrada * Math.max(salida, 0);

      if (p.vida > p.max || p.y < -14) {
        particulas[i] = nacer(false);
        continue;
      }

      var g = cg.createRadialGradient(x, p.y, 0, x, p.y, p.r * 5);
      g.addColorStop(0, 'rgba(232,240,248,' + alpha.toFixed(3) + ')');
      g.addColorStop(0.45, 'rgba(212,220,229,' + (alpha * 0.4).toFixed(3) + ')');
      g.addColorStop(1, 'rgba(212,220,229,0)');
      cg.fillStyle = g;
      cg.beginPath();
      cg.arc(x, p.y, p.r * 5, 0, Math.PI * 2);
      cg.fill();
    }

    raf = window.requestAnimationFrame(pintar);
  }

  function arrancarParticulas() {
    var cfg = (window.EXPERIENCIA_CONFIG && window.EXPERIENCIA_CONFIG.ajustes) || {};
    canvas = dom.qs('#fx-particles');
    if (!canvas || cfg.particulas === false || dom.reducedMotion) {
      if (canvas) canvas.style.display = 'none';
      return;
    }
    cg = canvas.getContext('2d');
    dimensionar();

    var t = null;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(dimensionar, 220);
    });

    // En segundo plano no gastamos batería.
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (raf) { window.cancelAnimationFrame(raf); raf = null; }
      } else if (!raf) {
        raf = window.requestAnimationFrame(pintar);
      }
    });

    raf = window.requestAnimationFrame(pintar);
  }

  /* ------------------------------------------------------------------ anillo */
  function anillo(x, y) {
    if (dom.reducedMotion) return;
    var el = document.createElement('span');
    el.className = 'ring';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 700);
  }

  /* ------------------------------------------------------------------- flash */
  function flash() {
    var el = dom.qs('#flash');
    if (!el || dom.reducedMotion) return;
    el.removeAttribute('data-burst');
    void el.offsetWidth;                 // reinicia la animación
    el.setAttribute('data-burst', 'true');
  }

  /* ------------------------------------------------------------------- toast */
  var toastTimer = null;
  function toast(texto, ms) {
    var el = dom.qs('#toast');
    if (!el) return;
    el.textContent = texto;
    el.setAttribute('data-visible', 'true');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.removeAttribute('data-visible');
    }, ms || 3200);
  }

  /* ----------------------------------------------------------------- vibrar */
  function vibrar(ms) {
    if (navigator.vibrate) {
      try { navigator.vibrate(ms || 12); } catch (e) { /* sin vibración */ }
    }
  }

  /* ---------------------------------------------------------------- cortina */
  function cortina(fase) {
    var el = dom.qs('#curtain');
    if (!el) return Promise.resolve();
    if (dom.reducedMotion) {
      el.removeAttribute('data-active');
      el.removeAttribute('data-phase');
      return Promise.resolve();
    }

    return new Promise(function (resolve) {
      el.setAttribute('data-active', 'true');
      el.removeAttribute('data-phase');
      void el.offsetWidth;
      el.setAttribute('data-phase', fase);

      var listo = false;
      function fin() {
        if (listo) return;
        listo = true;
        if (fase === 'open') {
          el.removeAttribute('data-active');
          el.removeAttribute('data-phase');
        }
        resolve();
      }
      // escuchamos la animación, con red de seguridad por si no dispara
      var panel = dom.qs('.curtain__panel--top', el);
      if (panel) panel.addEventListener('animationend', fin, { once: true });
      setTimeout(fin, fase === 'open' ? 1250 : 700);
    });
  }

  /* ------------------------------------------------- destellos de la copa */
  function sembrarDestellos(cont, cantidad) {
    if (!cont) return;
    var n = cantidad || 7;
    var out = '';
    for (var i = 0; i < n; i++) {
      var left = 18 + Math.random() * 64;
      var delay = (Math.random() * 2.6).toFixed(2);
      var dx = (Math.random() * 30 - 15).toFixed(0);
      out += '<i style="left:' + left.toFixed(1) + '%;animation-delay:' + delay +
             's;--dx:' + dx + 'px"></i>';
    }
    cont.innerHTML = out;
  }

  /* Si el elemento quedó abajo del pliegue, lo traemos a la vista. */
  function asegurarVisible(el) {
    if (!el) return;
    setTimeout(function () {
      var r = el.getBoundingClientRect();
      if (r.bottom > window.innerHeight - 12 || r.top < 70) {
        el.scrollIntoView({
          behavior: dom.reducedMotion ? 'auto' : 'smooth',
          block: 'end'
        });
      }
    }, 60);
  }

  BX.fx = {
    init: arrancarParticulas,
    asegurarVisible: asegurarVisible,
    anillo: anillo,
    flash: flash,
    toast: toast,
    vibrar: vibrar,
    cortina: cortina,
    sembrarDestellos: sembrarDestellos
  };
})(window.BX);
