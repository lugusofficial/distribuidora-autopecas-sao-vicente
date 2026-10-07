// Hero canvas and part search. Progressive: the page is complete without this file.
(function () {
  'use strict';

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Hero: a brake disc turning slowly as the tall media of the hero. */
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 1.1, 7);
    camera.lookAt(0, 0, 0);

    var accent = new THREE.Color('#C45200');
    var rule = new THREE.Color('#B59482');

    var disc = new THREE.Group();
    disc.rotation.x = 1.05;
    disc.rotation.z = 0.2;
    scene.add(disc);

    disc.add(new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.CylinderGeometry(2.4, 2.4, 0.26, 56, 1, true)),
      new THREE.LineBasicMaterial({ color: rule, transparent: true, opacity: 0.55 })
    ));
    disc.add(new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.CylinderGeometry(1.05, 1.05, 0.5, 28, 1, true)),
      new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.6 })
    ));
    disc.add(new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.TorusGeometry(1.75, 0.012, 3, 64)),
      new THREE.LineBasicMaterial({ color: rule, transparent: true, opacity: 0.5 })
    ));

    var bolts = new THREE.Group();
    for (var i = 0; i < 5; i += 1) {
      var angle = (i / 5) * Math.PI * 2;
      var bolt = new THREE.Mesh(
        new THREE.SphereGeometry(0.075, 12, 10),
        new THREE.MeshBasicMaterial({ color: accent })
      );
      bolt.position.set(Math.cos(angle) * 1.4, 0.16, Math.sin(angle) * 1.4);
      bolts.add(bolt);
    }
    disc.add(bolts);

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
      disc.rotation.y += 0.0035;
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

      list.forEach(function (item) {
        var li = document.createElement('li');
        li.className = 'result';

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

  heroCanvas();
  partSearch();
})();
