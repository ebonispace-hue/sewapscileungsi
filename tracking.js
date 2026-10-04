/* =====================================================
   Pelacakan Eboni Space
   - Meta Pixel (dataset "Rat1", ID 1239338047134772)
   - Google Analytics 4 (G-P8VT5KGDBM)
   - Klik tombol WhatsApp = "Contact" (Meta) dan
     "generate_lead" (GA4)
   Semua halaman memuat file ini, jadi perubahan cukup di sini.
===================================================== */
(function () {
  var PIXEL_ID = "1239338047134772";
  var GA4_ID = "G-P8VT5KGDBM";
  var NOMOR_BOT = "6283187916091";

  /* Kode dasar Meta Pixel */
  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
    t = b.createElement(e); t.async = !0; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

  fbq("init", PIXEL_ID);
  fbq("track", "PageView");

  /* Google Analytics 4 */
  var gaScript = document.createElement("script");
  gaScript.async = true;
  gaScript.src = "https://www.googletagmanager.com/gtag/js?id=" + GA4_ID;
  document.head.appendChild(gaScript);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  gtag("js", new Date());
  gtag("config", GA4_ID);

  /* Klik tombol WhatsApp = event Contact (dipakai untuk optimasi iklan Meta) */
  document.addEventListener("click", function (event) {
    var target = event.target;
    var link = target && target.closest
      ? target.closest('a[href*="wa.me"], a[href*="api.whatsapp.com"]')
      : null;
    if (!link) return;

    var keBot = link.href.indexOf(NOMOR_BOT) !== -1;
    fbq("track", "Contact", {
      content_name: keBot ? "WhatsApp Bot" : "WhatsApp CS",
      content_category: location.pathname
    });
    gtag("event", "generate_lead", {
      method: keBot ? "whatsapp_bot" : "whatsapp_cs",
      page_path: location.pathname
    });
  }, true);
})();
