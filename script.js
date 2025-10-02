// --- Ensure Custom Cursor Circle is always created ---
(function() {
  if (!document.getElementById('custom-cursor')) {
    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    document.body.appendChild(cursor);
  }
})();
// --- Custom Cursor Circle ---
(function() {
  const cursor = document.getElementById('custom-cursor');
  document.body.style.cursor = 'none';
  cursor.style.position = 'fixed';
  cursor.style.pointerEvents = 'none';
  cursor.style.zIndex = '9999';
  cursor.style.width = '28px';
  cursor.style.height = '28px';
  cursor.style.borderRadius = '50%';
  cursor.style.background = 'rgba(100, 180, 255, 0.18)'; // soft blue
  cursor.style.border = '2.5px solid #3b82f6'; // vibrant blue
  cursor.style.boxShadow = '0 2px 8px 0 rgba(59,130,246,0.12)';
  cursor.style.transition = 'background 0.2s, border 0.2s, box-shadow 0.2s, transform 0.15s';
  cursor.style.transform = 'translate(-50%, -50%)';

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  function setCursorHover(state) {
    if(state) {
      cursor.style.background = 'rgba(168, 85, 247, 0.22)'; // purple accent
      cursor.style.border = '2.5px solid #a855f7'; // vibrant purple
      cursor.style.boxShadow = '0 4px 16px 0 rgba(168,85,247,0.18)';
      cursor.style.transform = 'translate(-50%, -50%) scale(1.22)';
    } else {
      cursor.style.background = 'rgba(100, 180, 255, 0.18)';
      cursor.style.border = '2.5px solid #3b82f6';
      cursor.style.boxShadow = '0 2px 8px 0 rgba(59,130,246,0.12)';
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    }
  }

  function addHoverListeners() {
    const hoverables = document.querySelectorAll('button, a, .feature-box-inner');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => setCursorHover(true));
      el.addEventListener('mouseleave', () => setCursorHover(false));
    });
  }

  addHoverListeners();
  // In case of dynamic content, re-apply listeners
  const observer = new MutationObserver(addHoverListeners);
  observer.observe(document.body, { childList: true, subtree: true });
})();
// --- End Custom Cursor Circle ---
