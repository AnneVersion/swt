// Zet foto's op hun plek, als ze er zijn.
//
// De site kijkt of het bestand bestaat. Zo niet, dan blijft de plek gewoon leeg
// en gaat er niets stuk. Bij elke foto hoort een regel in fotos/credits.json met
// de fotograaf en de licentie; staat die er niet, dan zegt de site dat erbij in
// plaats van de foto zonder bronvermelding te tonen.

(function () {
  var basis = (location.pathname.indexOf('/pioniers/') >= 0) ? '../fotos/' : 'fotos/';

  function toon(plek, naam, gegevens) {
    var bestand = basis + naam + '.jpg';
    var img = new Image();

    img.onload = function () {
      var rij = gegevens && gegevens[naam];
      var fig = document.createElement('figure');
      fig.className = 'plaatje';
      fig.appendChild(img);

      var bij = document.createElement('figcaption');
      if (rij) {
        bij.textContent = (rij.wat || naam) + ' · ' + (rij.fotograaf || 'fotograaf onbekend') +
                          ' · ' + (rij.licentie || 'licentie onbekend');
        if (rij.bron) {
          bij.appendChild(document.createTextNode(' · '));
          var a = document.createElement('a');
          a.href = rij.bron; a.textContent = 'bron'; a.target = '_blank'; a.rel = 'noopener';
          bij.appendChild(a);
        }
      } else {
        bij.textContent = 'Let op: voor deze foto staat nog geen fotograaf en licentie in ' +
                          'fotos/credits.json. Vul die eerst in.';
      }
      fig.appendChild(bij);
      plek.innerHTML = '';
      plek.appendChild(fig);
    };

    img.onerror = function () { plek.hidden = true; };
    img.alt = naam;
    img.src = bestand;
  }

  // De regel onder de pagina die vertelt welke foto de achtergrond is.
  function bron(plek, naam, gegevens) {
    var rij = gegevens && gegevens[naam];
    plek.hidden = true;
    if (!rij || !rij.licentie) return;
    // Pas de regel tonen als het bestand er echt is. Anders zou de site een
    // foto vermelden die niemand ziet.
    var proef = new Image();
    proef.onload = function () { plek.hidden = false; };
    proef.src = basis + naam + '.jpg';
    plek.textContent = 'Achtergrond: ' + rij.wat + ' \u00b7 ' + rij.fotograaf +
                       ' \u00b7 ' + rij.licentie + ' \u00b7 ';
    var a = document.createElement('a');
    a.href = rij.bron; a.textContent = 'bron'; a.target = '_blank'; a.rel = 'noopener';
    plek.appendChild(a);
  }

  // Een foto als band, bijvoorbeeld de kop van de studio. Pas tonen als het
  // bestand er echt is, met de vermelding eroverheen.
  function band(plek, naam, gegevens) {
    var rij = gegevens && gegevens[naam];
    if (!rij || !rij.licentie) return;
    var proef = new Image();
    proef.onload = function () {
      plek.style.backgroundImage = 'url(' + basis + naam + '.jpg)';
      plek.classList.add('erin');
      var bij = document.createElement('p');
      bij.className = 'bij';
      bij.textContent = rij.wat + ' \u00b7 ' + rij.fotograaf + ' \u00b7 ' + rij.licentie + ' \u00b7 ';
      var a = document.createElement('a');
      a.href = rij.bron; a.textContent = 'bron'; a.target = '_blank'; a.rel = 'noopener';
      bij.appendChild(a);
      plek.appendChild(bij);
    };
    proef.src = basis + naam + '.jpg';
  }

  var plekken = document.querySelectorAll('[data-foto]');
  var bronnen = document.querySelectorAll('[data-fotobron]');
  var banden  = document.querySelectorAll('[data-fotoband]');
  if (!plekken.length && !bronnen.length && !banden.length) return;

  fetch(basis + 'credits.json', { cache: 'no-store' })
    .then(function (a) { return a.ok ? a.json() : null; })
    .catch(function () { return null; })
    .then(function (gegevens) {
      Array.prototype.forEach.call(plekken, function (plek) {
        toon(plek, plek.getAttribute('data-foto'), gegevens);
      });
      Array.prototype.forEach.call(bronnen, function (plek) {
        bron(plek, plek.getAttribute('data-fotobron'), gegevens);
      });
      Array.prototype.forEach.call(banden, function (plek) {
        band(plek, plek.getAttribute('data-fotoband'), gegevens);
      });
    });
})();
