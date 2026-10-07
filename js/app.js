// Hero carousel of car parts, part search and reveal on scroll.
// Progressive: the page is complete without this file.
(function () {
  'use strict';

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Hero: three recognisable parts on a slow turntable, with a caption that follows the front one. */
  function heroCanvas() {
    var canvas = document.querySelector('[data-hero3d]');
    if (!canvas || reduced || !window.THREE) { return; }

    var THREE = window.THREE;
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    } catch (err) {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 1.5, 6.4);
    camera.lookAt(0, -0.15, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.72));
    var key = new THREE.DirectionalLight(0xffffff, 0.85);
    key.position.set(3, 5, 4);
    scene.add(key);
    var fill = new THREE.DirectionalLight(0xffd9bb, 0.35);
    fill.position.set(-4, 1, 2);
    scene.add(fill);

    var steel = new THREE.MeshStandardMaterial({ color: 0x9fa5ab, metalness: 0.72, roughness: 0.34 });
    var darkSteel = new THREE.MeshStandardMaterial({ color: 0x55595e, metalness: 0.65, roughness: 0.45 });
    var orange = new THREE.MeshStandardMaterial({ color: 0xc45200, metalness: 0.35, roughness: 0.45 });
    var ceramic = new THREE.MeshStandardMaterial({ color: 0xf1ece4, metalness: 0.05, roughness: 0.75 });
    var copper = new THREE.MeshStandardMaterial({ color: 0xb06a3a, metalness: 0.7, roughness: 0.4 });

    function brakeDisc() {
      var g = new THREE.Group();

      var face = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.16, 54), steel);
      g.add(face);

      var innerRing = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.92, 0.2, 40), darkSteel);
      g.add(innerRing);

      var hat = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.68, 0.46, 36), darkSteel);
      hat.position.y = 0.3;
      g.add(hat);

      var bore = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.56, 24), steel);
      bore.position.y = 0.34;
      g.add(bore);

      var i;
      for (i = 0; i < 5; i += 1) {
        var boltAngle = (i / 5) * Math.PI * 2;
        var bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.52, 14), steel);
        bolt.position.set(Math.cos(boltAngle) * 0.42, 0.34, Math.sin(boltAngle) * 0.42);
        g.add(bolt);
      }

      for (i = 0; i < 14; i += 1) {
        var holeAngle = (i / 14) * Math.PI * 2;
        var hole = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.22, 12), darkSteel);
        hole.position.set(Math.cos(holeAngle) * 1.18, 0, Math.sin(holeAngle) * 1.18);
        g.add(hole);
      }

      for (i = 0; i < 24; i += 1) {
        var ventAngle = (i / 24) * Math.PI * 2;
        var vent = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.07, 0.11), darkSteel);
        vent.position.set(Math.cos(ventAngle) * 1.22, -0.1, Math.sin(ventAngle) * 1.22);
        vent.rotation.y = -ventAngle;
        g.add(vent);
      }

      g.rotation.x = 0.44;
      g.scale.setScalar(0.92);
      return g;
    }

    function oilFilter() {
      var g = new THREE.Group();

      var body = new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.66, 1.55, 36), orange);
      g.add(body);

      var top = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.66, 0.12, 36), darkSteel);
      top.position.y = 0.82;
      g.add(top);

      var seal = new THREE.Mesh(new THREE.TorusGeometry(0.54, 0.075, 10, 36), darkSteel);
      seal.rotation.x = Math.PI / 2;
      seal.position.y = 0.9;
      g.add(seal);

      var thread = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.18, 24), steel);
      thread.position.y = 0.95;
      g.add(thread);

      var dome = new THREE.Mesh(new THREE.SphereGeometry(0.66, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), orange);
      dome.rotation.x = Math.PI;
      dome.position.y = -0.77;
      g.add(dome);

      var i;
      for (i = 0; i < 3; i += 1) {
        var rib = new THREE.Mesh(new THREE.TorusGeometry(0.665, 0.018, 8, 40), darkSteel);
        rib.rotation.x = Math.PI / 2;
        rib.position.y = -0.3 + i * 0.42;
        g.add(rib);
      }

      g.scale.setScalar(1.05);
      return g;
    }

    function sparkPlug() {
      var g = new THREE.Group();

      var terminal = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.3, 18), steel);
      terminal.position.y = 1.18;
      g.add(terminal);

      var insulator = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.25, 1.15, 24), ceramic);
      insulator.position.y = 0.46;
      g.add(insulator);

      var corrugation;
      var i;
      for (i = 0; i < 4; i += 1) {
        corrugation = new THREE.Mesh(new THREE.TorusGeometry(0.235, 0.028, 8, 24), ceramic);
        corrugation.rotation.x = Math.PI / 2;
        corrugation.position.y = 0.6 + i * 0.16;
        g.add(corrugation);
      }

      var hex = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.26, 6), steel);
      hex.position.y = -0.2;
      g.add(hex);

      var shell = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.52, 22), darkSteel);
      shell.position.y = -0.58;
      g.add(shell);

      for (i = 0; i < 6; i += 1) {
        var turn = new THREE.Mesh(new THREE.TorusGeometry(0.215, 0.022, 8, 22), darkSteel);
        turn.rotation.x = Math.PI / 2;
        turn.position.y = -0.4 - i * 0.075;
        g.add(turn);
      }

      var tip = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.26, 12), copper);
      tip.position.y = -0.95;
      g.add(tip);

      var ground = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.3, 0.07), darkSteel);
      ground.position.set(0.16, -0.95, 0);
      g.add(ground);

      var hook = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.07, 0.07), darkSteel);
      hook.position.set(0.08, -1.08, 0);
      g.add(hook);

      g.scale.setScalar(1.08);
      return g;
    }

    var PARTS = [
      { label: 'Disco de freio ventilado', build: brakeDisc, spin: 0.006 },
      { label: 'Filtro de óleo', build: oilFilter, spin: 0.0075 },
      { label: 'Vela de ignição', build: sparkPlug, spin: 0.0075 }
    ];

    var turntable = new THREE.Group();
    scene.add(turntable);

    var RADIUS = 2.15;
    var nodes = PARTS.map(function (part, index) {
      var angle = (index / PARTS.length) * Math.PI * 2;
      var pivot = new THREE.Group();
      pivot.position.set(Math.sin(angle) * RADIUS, 0, Math.cos(angle) * RADIUS);
      var mesh = part.build();
      pivot.add(mesh);
      turntable.add(pivot);
      return { pivot: pivot, mesh: mesh, spin: part.spin, angle: angle };
    });

    var caption = document.querySelector('[data-hero-caption]');
    var current = -1;
    function updateCaption(rotation) {
      if (!caption) { return; }
      var best = 0;
      var bestScore = -Infinity;
      nodes.forEach(function (node, index) {
        var score = Math.cos(node.angle + rotation);
        if (score > bestScore) { bestScore = score; best = index; }
      });
      if (best !== current) {
        current = best;
        caption.textContent = PARTS[best].label;
        caption.classList.remove('is-shown');
        void caption.offsetWidth;
        caption.classList.add('is-shown');
      }
    }

    function resize() {
      var w = canvas.clientWidth;
      var h = canvas.clientHeight;
      if (!w || !h) { return false; }
      if (canvas.width !== w || canvas.height !== h) {
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      return true;
    }

    var running = true;
    function frame() {
      if (!running) { return; }
      window.requestAnimationFrame(frame);
      if (!resize()) { return; }
      turntable.rotation.y += 0.0024;
      nodes.forEach(function (node) {
        node.mesh.rotation.y += node.spin;
        node.pivot.rotation.y = -turntable.rotation.y;
      });
      updateCaption(turntable.rotation.y);
      renderer.render(scene, camera);
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !running) { running = true; frame(); }
          else if (!entry.isIntersecting) { running = false; }
        });
      }, { threshold: 0 }).observe(canvas);
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { running = false; }
      else if (!running) { running = true; frame(); }
    });

    canvas.setAttribute('data-ready', 'true');
    frame();
  }

  /* Part search over a demonstration catalogue, ending in a WhatsApp quote. */
  function partSearch() {
    var input = document.querySelector('[data-search-input]');
    var results = document.querySelector('[data-search-results]');
    var count = document.querySelector('[data-search-count]');
    if (!input || !results || !count) { return; }

    var CATALOGUE = [
      { nome: 'Pastilha de freio dianteira', aplicacao: 'Gol, Voyage, Saveiro', codigo: 'PF1042', linha: 'Freios' },
      { nome: 'Pastilha de freio traseira', aplicacao: 'Onix, Prisma', codigo: 'PF2088', linha: 'Freios' },
      { nome: 'Disco de freio ventilado', aplicacao: 'Palio, Siena', codigo: 'DF3301', linha: 'Freios' },
      { nome: 'Amortecedor dianteiro', aplicacao: 'Uno, Fiorino', codigo: 'AM5120', linha: 'Suspensão' },
      { nome: 'Amortecedor traseiro', aplicacao: 'Celta, Corsa', codigo: 'AM5310', linha: 'Suspensão' },
      { nome: 'Bieleta estabilizadora', aplicacao: 'HB20, Creta', codigo: 'BE5520', linha: 'Suspensão' },
      { nome: 'Filtro de óleo', aplicacao: 'HB20, i30', codigo: 'FO7701', linha: 'Filtros' },
      { nome: 'Filtro de ar do motor', aplicacao: 'Ka, Fiesta', codigo: 'FA7820', linha: 'Filtros' },
      { nome: 'Filtro de combustível', aplicacao: 'Strada, Toro', codigo: 'FC7905', linha: 'Filtros' },
      { nome: 'Correia dentada', aplicacao: 'Sandero, Logan', codigo: 'CD4410', linha: 'Motor' },
      { nome: 'Bomba de água', aplicacao: 'Corolla, Etios', codigo: 'BA6200', linha: 'Motor' },
      { nome: 'Vela de ignição', aplicacao: 'Civic, Fit', codigo: 'VI8830', linha: 'Motor' },
      { nome: 'Kit de embreagem', aplicacao: 'Gol, Voyage', codigo: 'KE9140', linha: 'Motor' },
      { nome: 'Bateria 60 Ah', aplicacao: 'Uso geral', codigo: 'BT6000', linha: 'Elétrica' },
      { nome: 'Lâmpada de farol H4', aplicacao: 'Uso geral', codigo: 'LH0401', linha: 'Elétrica' },
      { nome: 'Óleo de motor 5W30 sintético', aplicacao: 'Uso geral', codigo: 'OL5300', linha: 'Lubrificantes' }
    ];

    function normalise(value) {
      return value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    }

    var INDEXED = CATALOGUE.map(function (item) {
      return {
        item: item,
        haystack: normalise(item.nome + ' ' + item.aplicacao + ' ' + item.codigo + ' ' + item.linha)
      };
    });

    function render(list, term) {
      results.textContent = '';

      if (!list.length) {
        count.textContent = term
          ? 'Nenhum item do catálogo de demonstração bate com essa busca. Peça a cotação pelo WhatsApp.'
          : '';
        return;
      }

      count.textContent = list.length === 1
        ? '1 item encontrado'
        : list.length + ' itens encontrados';

      list.forEach(function (item, index) {
        var li = document.createElement('li');
        li.className = 'result';
        li.style.animationDelay = Math.min(index, 8) * 35 + 'ms';

        var info = document.createElement('div');
        info.className = 'result__info';

        var name = document.createElement('p');
        name.className = 'result__name';
        name.textContent = item.nome;

        var meta = document.createElement('p');
        meta.className = 'result__meta';
        meta.textContent = item.aplicacao + ' · código ' + item.codigo;

        info.appendChild(name);
        info.appendChild(meta);

        var message = [
          'Olá! Quero cotação desta peça.',
          'Peça: ' + item.nome,
          'Aplicação: ' + item.aplicacao,
          'Código: ' + item.codigo
        ].join('\n');

        var action = document.createElement('a');
        action.className = 'btn btn--primary result__action';
        action.setAttribute('href', 'https://wa.me/0000000000?text=' + encodeURIComponent(message));
        action.textContent = 'Cotar';

        li.appendChild(info);
        li.appendChild(action);
        results.appendChild(li);
      });
    }

    function search() {
      var term = normalise(input.value.trim());
      if (!term) {
        render([], '');
        return;
      }
      var words = term.split(/\s+/);
      var found = INDEXED.filter(function (entry) {
        return words.every(function (word) { return entry.haystack.indexOf(word) !== -1; });
      }).map(function (entry) { return entry.item; });
      render(found, term);
    }

    input.addEventListener('input', search);
    search();
  }

  /* Reveal on scroll. Without script the page stays visible, so this is additive. */
  function reveal() {
    if (reduced || !('IntersectionObserver' in window)) { return; }

    var targets = [].slice.call(document.querySelectorAll('.hero__inner, .hero__media, .section > .container'));
    if (!targets.length) { return; }

    document.documentElement.classList.add('js-reveal');

    targets.forEach(function (target) {
      target.setAttribute('data-reveal', '');
      if (target.classList.contains('hero__media')) {
        target.setAttribute('data-reveal-delay', '1');
      }
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    targets.forEach(function (target) { observer.observe(target); });
  }

  reveal();
  heroCanvas();
  partSearch();
})();
