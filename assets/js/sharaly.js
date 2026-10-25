// Shared Sharaly ordering popup.
(function () {
  'use strict';

  document.addEventListener('click', function (event) {
    const link = event.target.closest('a[data-sharaly-popup]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey ||
        event.ctrlKey || event.shiftKey || event.altKey) return;
    // Let normal links work in older browsers and with JavaScript disabled.
    if (typeof HTMLDialogElement === 'undefined' ||
        typeof HTMLDialogElement.prototype.showModal !== 'function') return;
    event.preventDefault();
    window.openSharalyPopup();
  });

  window.openSharalyPopup = function () {
    const existing = document.getElementById('sharaly-overlay');
    if (existing) return;

    const trigger = document.activeElement;
    const overlay = document.createElement('dialog');
    overlay.id = 'sharaly-overlay';
    overlay.className = 'sharaly-popup';
    overlay.setAttribute('aria-label', 'Mama Rosa online ordering');

    const toolbar = document.createElement('div');
    toolbar.className = 'sharaly-toolbar';
    const title = document.createElement('span');
    title.textContent = 'Mama Rosa · Order Online';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'sharaly-close';
    closeBtn.textContent = '×';
    closeBtn.setAttribute('aria-label', 'Close Sharaly popup');
    closeBtn.autofocus = true;
    closeBtn.addEventListener('click', function () { overlay.close(); });

    const iframe = document.createElement('iframe');
    iframe.src = 'https://app.sharaly.com/mamarosa';
    iframe.title = 'Order online from Mama Rosa on Sharaly';
    iframe.className = 'sharaly-frame';

    toolbar.append(title, closeBtn);
    overlay.append(toolbar, iframe);
    overlay.addEventListener('click', function (event) {
      if (event.target !== overlay) return;
      const rect = overlay.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right ||
          event.clientY < rect.top || event.clientY > rect.bottom) overlay.close();
    });
    const previousOverflow = document.body.style.overflow;
    overlay.addEventListener('close', function () {
      document.body.style.overflow = previousOverflow;
      overlay.remove();
      if (trigger && trigger.isConnected) trigger.focus();
    }, { once: true });

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    overlay.showModal();
  };
}());
