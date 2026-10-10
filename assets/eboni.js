/* Eboni Space — panel "Rakit pesananmu".
   Menyusun pesan WhatsApp dari pilihan konsol, durasi, dan TV.
   Area diambil dari data-area pada .panel (boleh kosong). */
(function () {
  var panel = document.querySelector('.panel[data-wa]');
  if (!panel) return;
  var WA = 'https://wa.me/' + panel.getAttribute('data-wa') + '?text=';
  var area = panel.getAttribute('data-area') || '';
  var state = { konsol: 'PS4', durasi: '6 jam', tv: false };
  var link = panel.querySelector('[data-order]');
  var sumPaket = panel.querySelector('[data-sum="paket"]');
  var sumIsi = panel.querySelector('[data-sum="isi"]');
  var tvBtn = panel.querySelector('.ptoggle');
  var tvHelp = panel.querySelector('[data-tv-help]');

  function render() {
    var tvTxt = state.tv ? ' + TV 32 inci' : '';
    var stik = state.durasi.indexOf('hari') > -1 ? '3 stik' : '2 stik';
    sumPaket.textContent = state.konsol + ' · ' + state.durasi;
    sumIsi.textContent = stik + ' + game' + tvTxt;
    tvHelp.textContent = state.tv ? 'Ditambahkan ke pesanan' : 'Kalau TV di rumah tidak punya HDMI';
    var msg = 'Halo Eboni Space, saya mau sewa ' + state.konsol + ' durasi ' + state.durasi + tvTxt +
      (area ? ' untuk area ' + area : '') + '. Ini pin lokasi saya:';
    link.href = WA + encodeURIComponent(msg);
  }

  panel.querySelectorAll('[data-group]').forEach(function (group) {
    group.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-value]');
      if (!btn) return;
      group.querySelectorAll('button[data-value]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });
      state[group.getAttribute('data-group')] = btn.getAttribute('data-value');
      render();
    });
  });
  tvBtn.addEventListener('click', function () {
    state.tv = !state.tv;
    tvBtn.setAttribute('aria-pressed', String(state.tv));
    render();
  });
  render();
})();
