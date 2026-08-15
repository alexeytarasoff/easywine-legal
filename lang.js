// Language switcher for the hosted legal pages. Each translation is a <section data-lang="…"> already
// in the HTML; this only decides which one is shown, so there is nothing to build and nothing to fetch.
//
// Progressive enhancement on purpose. With scripting off no section is hidden and the whole document is
// there in all three languages — a privacy policy that a store reviewer or a crawler can only read by
// running scripts would be a bad trade for a nicer control.
//
// The choice lives in the URL fragment rather than storage: #es is shareable, so a store listing can
// link straight at one language, and nothing is persisted about the reader.
(function () {
  var sections = document.querySelectorAll('[data-lang]');
  if (!sections.length) return;

  var NAMES = { ru: 'Русский', en: 'English', es: 'Español' };
  var available = [];
  for (var i = 0; i < sections.length; i++) {
    available.push(sections[i].getAttribute('data-lang'));
  }

  function preferred() {
    var fromHash = location.hash.replace('#', '').toLowerCase();
    if (available.indexOf(fromHash) !== -1) return fromHash;
    var accepted = navigator.languages || [navigator.language || ''];
    for (var i = 0; i < accepted.length; i++) {
      var code = String(accepted[i]).slice(0, 2).toLowerCase();
      if (available.indexOf(code) !== -1) return code;
    }
    return available.indexOf('en') !== -1 ? 'en' : available[0];
  }

  function show(lang) {
    for (var i = 0; i < sections.length; i++) {
      var section = sections[i];
      var isCurrent = section.getAttribute('data-lang') === lang;
      section.hidden = !isCurrent;
      // The tab title has to follow too — a bookmarked policy that says "Privacy Policy" while showing
      // Spanish is the same mismatch the switcher exists to fix.
      if (isCurrent && section.getAttribute('data-title')) {
        document.title = section.getAttribute('data-title');
      }
    }
    document.documentElement.setAttribute('lang', lang);
    var links = document.querySelectorAll('.langs a');
    for (var j = 0; j < links.length; j++) {
      links[j].setAttribute('aria-current', links[j].getAttribute('href') === '#' + lang ? 'true' : 'false');
    }
  }

  var nav = document.createElement('nav');
  nav.className = 'langs';
  nav.setAttribute('aria-label', 'Language / Язык / Idioma');
  for (var k = 0; k < available.length; k++) {
    var link = document.createElement('a');
    link.href = '#' + available[k];
    link.setAttribute('lang', available[k]);
    link.textContent = NAMES[available[k]] || available[k];
    nav.appendChild(link);
  }
  document.body.insertBefore(nav, document.body.firstChild);

  show(preferred());
  window.addEventListener('hashchange', function () { show(preferred()); });
})();
