// Video's van YouTube, maar pas als jij erop klikt.
//
// Er gaat geen enkel verzoek naar YouTube zolang je niets aanklikt: je ziet
// eerst alleen een kaartje met de titel en het kanaal. Klik je op afspelen,
// dan pas komt de speler erin, via youtube-nocookie.com.
//
// De lijst staat in video/lijst.json. Zet er alleen filmpjes in van officiele
// kanalen of van rechthebbenden, en vul het veld waarom in, zodat later na te
// gaan is waarom dit filmpje daar mag staan.

(function () {
  var basis = (location.pathname.indexOf('/pioniers/') >= 0) ? '../video/' : 'video/';

  function kaart(rij) {
    var doos = document.createElement('div');
    doos.className = 'videodoos';

    var kop = document.createElement('p');
    kop.className = 'videotitel';
    kop.textContent = rij.titel || 'Zonder titel';

    var bij = document.createElement('p');
    bij.className = 'videobij';
    bij.textContent = (rij.kanaal ? rij.kanaal : 'kanaal onbekend') +
                      (rij.waarom ? ' · ' + rij.waarom : '');

    var knop = document.createElement('button');
    knop.type = 'button';
    knop.textContent = 'Afspelen';
    knop.onclick = function () {
      var frame = document.createElement('iframe');
      frame.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(rij.id) +
                  '?rel=0&modestbranding=1';
      frame.title = rij.titel || 'video';
      frame.width = '560'; frame.height = '315';
      frame.loading = 'lazy';
      frame.setAttribute('frameborder', '0');
      frame.setAttribute('allow', 'accelerometer; encrypted-media; picture-in-picture');
      frame.setAttribute('allowfullscreen', '');
      doos.replaceChild(frame, vak);
    };

    var open = document.createElement('a');
    open.href = 'https://www.youtube.com/watch?v=' + encodeURIComponent(rij.id);
    open.target = '_blank'; open.rel = 'noopener';
    open.textContent = 'Openen op YouTube';

    var vak = document.createElement('div');
    vak.className = 'videovak';
    vak.appendChild(knop);
    vak.appendChild(open);

    doos.appendChild(kop);
    doos.appendChild(bij);
    doos.appendChild(vak);
    return doos;
  }

  var plekken = document.querySelectorAll('[data-video]');
  if (!plekken.length) return;

  fetch(basis + 'lijst.json', { cache: 'no-store' })
    .then(function (a) { return a.ok ? a.json() : null; })
    .catch(function () { return null; })
    .then(function (lijst) {
      Array.prototype.forEach.call(plekken, function (plek) {
        var sleutel = plek.getAttribute('data-video');
        var rijen = lijst && lijst[sleutel];
        if (!rijen || !rijen.length) { plek.hidden = true; return; }
        var kop = document.createElement('h2');
        kop.textContent = 'Kijken en luisteren';
        plek.appendChild(kop);
        rijen.forEach(function (rij) { plek.appendChild(kaart(rij)); });
      });
    });
})();
