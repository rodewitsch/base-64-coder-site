/**
 * Base64Coder Landing Page — Scripts
 * Mirrors the extension's convert page UI & logic
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ============================================================
  //  Utility Functions (mirrors the extension's lib.js)
  // ============================================================

  function isBase64(str) {
    try {
      return str.length > 3 && !(str.length % 4) && atob(str) && true;
    } catch (_) {
      return false;
    }
  }

  function isJWT(str) {
    const parts = str.split('.');
    if (parts.length === 3) {
      try {
        JSON.parse(base64UrlDecode(parts[1]));
        return true;
      } catch (_) {
        return false;
      }
    }
    return false;
  }

  function base64UrlDecode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    return atob(str);
  }

  function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  function isJSON(str) {
    if (typeof str !== 'string') return false;
    const s = str.trim();
    if (s.startsWith('{') || s.startsWith('[')) {
      try { JSON.parse(s); return true; } catch (_) { return false; }
    }
    return false;
  }

  function tryPrettyJSON(str) {
    try { return JSON.stringify(JSON.parse(str), null, 2); } catch (_) { return str; }
  }

  async function copyToClipboard(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch (_) { return false; }
  }

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  }

  function formatTimestamp(ts) {
    if (!ts) return '';
    const d = new Date(ts * 1000);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleString() + (d < new Date() ? ' ⚠️ Expired' : ' ✅ Valid');
  }

  function getDataUrlSize(dataUrl) {
    const base64String = dataUrl.split(',')[1];
    return ((base64String.length * 3 / 4 - (base64String.endsWith('==') ? 2 : 1)) / 1000).toFixed(2);
  }

  // ============================================================
  //  Nav
  // ============================================================

  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');

  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  navToggle.addEventListener('click', () => nav.classList.toggle('open'));
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });

  // ============================================================
  //  Intersection Observer
  // ============================================================

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.feature-card, .faq-item, .format-item').forEach(el => observer.observe(el));

  // ============================================================
  //  Demo — all DOM refs
  // ============================================================

  const source = document.getElementById('demo-source');
  const sourceLength = document.getElementById('demo-source-length');
  const resultDiv = document.getElementById('demo-result');
  const resultLength = document.getElementById('demo-result-length');
  const fileInfo = document.getElementById('demo-file-info');
  const fileName = document.getElementById('demo-file-name');
  const dropOverlay = document.getElementById('demo-drop-overlay');
  const fileInput = document.getElementById('demo-file-input');

  const decodeBtn = document.getElementById('demo-decode-btn');
  const encodeBtn = document.getElementById('demo-encode-btn');
  const jwtBtn = document.getElementById('demo-jwt-btn');
  const imageBtn = document.getElementById('demo-image-btn');


  const copySourceBtn = document.getElementById('demo-copy-source');
  const pasteSourceBtn = document.getElementById('demo-paste-source');
  const clearSourceBtn = document.getElementById('demo-clear-source');
  const copyResultBtn = document.getElementById('demo-copy-result');
  const clearResultBtn = document.getElementById('demo-clear-result');
  const beautifyBtn = document.getElementById('demo-beautify');

  const imgContainer = document.getElementById('demo-result-img-container');
  const imgEl = document.getElementById('demo-result-img');
  const imgMeta = document.getElementById('demo-result-img-meta');
  const imgSize = document.getElementById('demo-result-img-size');
  const imgResolution = document.getElementById('demo-result-img-resolution');


  let selectedFile = null;
  let resultType = null; // 'text' | 'base64' | 'jwt' | 'image' | 'audio' | 'video'

  // Initial button states
  activateBtns();

  // ============================================================
  //  Button enable/disable helpers
  // ============================================================

  function setActiveConvertBtn(btn) {
    document.querySelectorAll('.demo-convert-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
  }

  function setResultType(type) {
    resultType = type;
    // Hide all extras
    resultDiv.style.display = 'block';
    resultLength.style.display = 'block';
    imgContainer.classList.remove('active');
    imgContainer.style.display = 'none';

    beautifyBtn.style.display = 'none';
    copyResultBtn.style.display = '';
    imgEl.src = '';

    switch (type) {
      case 'text':
        copyResultBtn.classList.remove('disabled');
        if (isJSON(resultDiv.innerText)) beautifyBtn.style.display = 'flex';
        break;
      case 'base64':
        copyResultBtn.classList.remove('disabled');
        break;
      case 'jwt':
        resultDiv.style.display = 'block';
        copyResultBtn.classList.remove('disabled');
        if (isJSON(resultDiv.innerText)) beautifyBtn.style.display = 'flex';
        break;
      case 'image':
        resultDiv.style.display = 'none';
        resultLength.style.display = 'none';
        imgContainer.style.display = 'flex';
        copyResultBtn.style.display = 'none';
        break;

    }

    const hasResult = resultDiv.innerHTML && resultDiv.innerHTML !== '<br>'
      || (imgEl.src && !imgEl.src.endsWith('/null'))
      || (audioEl.src && !audioEl.src.endsWith('/null'))
      || (videoSource.src && !videoSource.src.endsWith('/null'));

    copyResultBtn.classList.toggle('disabled', !hasResult);
    clearResultBtn.classList.toggle('disabled', !hasResult);
  }

  function activateBtns() {
    setTimeout(() => {
      const val = source.value;
      if (val) {
        decodeBtn.classList.remove('disabled');
        encodeBtn.classList.remove('disabled');
        copySourceBtn.classList.remove('disabled');
        clearSourceBtn.classList.remove('disabled');
        pasteSourceBtn.classList.remove('disabled');


        if (isJWT(val)) {
          jwtBtn.classList.remove('disabled');
        } else {
          jwtBtn.classList.add('disabled');
        }

        const base64Val = val.replace(/^data:.+?;base64,/, '');
        if (isBase64(base64Val)) {
          imageBtn.classList.remove('disabled');
          decodeBtn.classList.remove('disabled');
        } else {
          imageBtn.classList.add('disabled');
        }
      } else if (selectedFile) {
        decodeBtn.classList.add('disabled');
        encodeBtn.classList.remove('disabled');
        imageBtn.classList.add('disabled');
        jwtBtn.classList.add('disabled');
        pasteSourceBtn.classList.add('disabled');
        copySourceBtn.classList.add('disabled');
        clearSourceBtn.classList.remove('disabled');
        beautifyBtn.style.display = 'none';
      } else {
        [decodeBtn, encodeBtn, imageBtn, jwtBtn].forEach(b => b.classList.add('disabled'));
        pasteSourceBtn.classList.remove('disabled');
        copySourceBtn.classList.add('disabled');
        clearSourceBtn.classList.add('disabled');
        beautifyBtn.style.display = 'none';
      }
    });
  }

  function showTextLength(text, el) {
    const len = text.length;
    el.textContent = len + (len === 1 ? ' character' : ' characters');
  }

  // ============================================================
  //  Source buttons
  // ============================================================

  pasteSourceBtn.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      source.value = text;
      source.style.display = 'block';
      sourceLength.style.display = 'block';
      selectedFile = null;
      fileInfo.classList.remove('active');
      showTextLength(text, sourceLength);
      activateBtns();
    } catch (_) {
      // silently ignore
    }
  });

  copySourceBtn.addEventListener('click', async () => {
    if (source.value) await copyToClipboard(source.value);
  });

  clearSourceBtn.addEventListener('click', () => {
    source.value = '';
    source.style.display = 'block';
    sourceLength.style.display = 'block';
    selectedFile = null;
    fileInfo.classList.remove('active');
    showTextLength('', sourceLength);
    setResultType(null);
    resultDiv.innerHTML = '';
    resultLength.textContent = '0 characters';
    activateBtns();
  });

  // File open
  document.getElementById('demo-open-file').addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (!file) return;
    selectedFile = file;
    fileName.textContent = file.name;
    fileInfo.classList.add('active');
    source.style.display = 'none';
    sourceLength.style.display = 'none';
    source.value = '';
    const b64 = await getBase64(file);
    resultDiv.textContent = b64;
    showTextLength(b64, resultLength);
    setResultType('base64');
    setActiveConvertBtn(encodeBtn);
    activateBtns();
  });

  // ============================================================
  //  Source input
  // ============================================================

  source.addEventListener('input', () => {
    source.style.display = 'block';
    sourceLength.style.display = 'block';
    selectedFile = null;
    fileInfo.classList.remove('active');
    showTextLength(source.value, sourceLength);
    activateBtns();
  });

  // ============================================================
  //  Drag & Drop overlay
  // ============================================================

  let dragCounter = 0;

  document.addEventListener('dragenter', (e) => {
    e.preventDefault();
    dragCounter++;
    if (dragCounter === 1) dropOverlay.classList.add('active');
  });

  document.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dragCounter--;
    if (dragCounter === 0) dropOverlay.classList.remove('active');
  });

  document.addEventListener('dragover', (e) => e.preventDefault());

  document.addEventListener('drop', async (e) => {
    e.preventDefault();
    dragCounter = 0;
    dropOverlay.classList.remove('active');
    const file = e.dataTransfer.files[0];
    if (!file) return;
    selectedFile = file;
    fileName.textContent = file.name;
    fileInfo.classList.add('active');
    const b64 = await getBase64(file);
    source.value = b64;
    showTextLength(b64, sourceLength);
    activateBtns();
  });

  // ============================================================
  //  Convert buttons
  // ============================================================

  // Encode to base64
  encodeBtn.addEventListener('click', async () => {
    if (selectedFile) {
      const b64 = await getBase64(selectedFile);
      source.value = '';
      source.style.display = 'none';
      sourceLength.style.display = 'none';
      fileInfo.classList.add('active');
      fileName.textContent = selectedFile.name;
      resultDiv.textContent = b64;
      showTextLength(b64, resultLength);
      setResultType('base64');
      setActiveConvertBtn(encodeBtn);
      activateBtns();
      return;
    }
    const val = source.value;
    if (!val) return;
    try {
      const encoded = btoa(unescape(encodeURIComponent(val)));
      resultDiv.textContent = encoded;
      setResultType('base64');
      showTextLength(encoded, resultLength);
      setActiveConvertBtn(encodeBtn);
      source.style.display = 'block';
      sourceLength.style.display = 'block';
    } catch (_) {
      try {
        const encoded = btoa(val);
        resultDiv.textContent = encoded;
        setResultType('base64');
        showTextLength(encoded, resultLength);
        setActiveConvertBtn(encodeBtn);
        source.style.display = 'block';
        sourceLength.style.display = 'block';
      } catch (__) {
        resultDiv.textContent = '⚠️ Error encoding to Base64';
      }
    }
  });

  // Decode to text
  decodeBtn.addEventListener('click', () => {
    const val = source.value.trim();
    if (!val) return;
    const clean = val.replace(/^data:.+?;base64,/, '');
    try {
      let decoded;
      try {
        decoded = decodeURIComponent(escape(atob(clean)));
      } catch (_) {
        decoded = atob(clean);
      }
      resultDiv.textContent = decoded;
      setResultType('text');
      showTextLength(decoded, resultLength);
      setActiveConvertBtn(decodeBtn);
    } catch (_) {
      resultDiv.textContent = '⚠️ Invalid Base64 string';
    }
  });

  // Decode JWT
  jwtBtn.addEventListener('click', () => {
    const val = source.value.trim();
    if (!val || !isJWT(val)) return;
    try {
      const parts = val.split('.');
      const headerObj = JSON.parse(base64UrlDecode(parts[0]));
      const payloadObj = parseJwt(val);

      const headerStr = JSON.stringify(headerObj, null, 2);
      const payloadStr = JSON.stringify(payloadObj, null, 2);

      let decoded = '=== HEADER ===\n' + headerStr + '\n\n=== PAYLOAD ===\n';
      const keys = Object.keys(payloadObj);
      keys.forEach((key, idx) => {
        let line = `  "${key}": ${JSON.stringify(payloadObj[key])}`;
        if ((key === 'iat' || key === 'exp' || key === 'nbf') && typeof payloadObj[key] === 'number') {
          line += `  // ${formatTimestamp(payloadObj[key])}`;
        }
        decoded += line;
        if (idx < keys.length - 1) decoded += ',';
        decoded += '\n';
      });

      resultDiv.textContent = decoded;
      setResultType('jwt');
      showTextLength(decoded, resultLength);
      setActiveConvertBtn(jwtBtn);
    } catch (_) {
      resultDiv.textContent = '⚠️ Error decoding JWT';
    }
  });

  // Decode to image
  imageBtn.addEventListener('click', () => {
    const val = source.value.trim();
    if (!val) return;
    // First set up the result container, then set the image src
    setResultType('image');
    // Now set image source (after setResultType won't clear it)
    imgEl.src = val;
    clearResultBtn.classList.remove('disabled');
    // Try to get metadata
    const img = new Image();
    img.onload = () => {
      imgResolution.textContent = img.naturalWidth + ' × ' + img.naturalHeight;
      imgMeta.style.display = 'flex';
    };
    img.onerror = () => {
      imgMeta.style.display = 'none';
    };
    img.src = val;
    try {
      imgSize.textContent = getDataUrlSize(val);
    } catch (_) {
      imgSize.textContent = '?';
    }
    setActiveConvertBtn(imageBtn);
  });

  // ============================================================
  //  Result buttons
  // ============================================================

  copyResultBtn.addEventListener('click', async () => {
    let text = '';
    if (resultType === 'text' || resultType === 'base64' || resultType === 'jwt') {
      text = resultDiv.innerText || resultDiv.textContent;
    } else if (resultType === 'image' && imgEl.src) {
      text = imgEl.src;
    }
    if (!text) return;
    const ok = await copyToClipboard(text);
    if (ok) {
      copyResultBtn.innerHTML = '<img draggable="false" src="assets/images/icons/copy.png" alt="copied" /><span>copied!</span>';
      setTimeout(() => {
        copyResultBtn.innerHTML = '<img draggable="false" src="assets/images/icons/copy.png" alt="copy" /><span>copy</span>';
      }, 1500);
    }
  });

  clearResultBtn.addEventListener('click', () => {
    resultDiv.innerHTML = '';
    resultLength.textContent = '0 characters';
    imgEl.src = '';
    imgMeta.style.display = 'none';
    imgContainer.classList.remove('active');
    imgContainer.style.display = 'none';
    // Restore source if file was loaded
    if (selectedFile) {
      source.style.display = 'block';
      sourceLength.style.display = 'block';
    }
    setResultType(null);
    setActiveConvertBtn(null);
  });

  beautifyBtn.addEventListener('click', () => {
    const text = resultDiv.innerText || resultDiv.textContent;
    if (!text) return;
    // Try to extract JSON from JWT output
    let jsonStr = text;
    if (text.includes('=== PAYLOAD ===')) {
      const parts = text.split('=== PAYLOAD ===');
      if (parts[1]) {
        // Reconstruct JSON from the pretty-printed payload
        const lines = parts[1].trim().split('\n');
        const obj = {};
        lines.forEach(line => {
          const match = line.match(/"([^"]+)"\s*:\s*(.+?)(?:\s*\/\/.*)?$/);
          if (match) {
            try { obj[match[1]] = JSON.parse(match[2]); } catch (_) { obj[match[1]] = match[2]; }
          }
        });
        jsonStr = JSON.stringify(obj, null, 2);
      } else {
        jsonStr = text.replace(/^=== HEADER ===\n[\s\S]*?\n\n=== PAYLOAD ===\n/, '');
      }
    }
    const pretty = tryPrettyJSON(jsonStr);
    resultDiv.textContent = pretty;
    showTextLength(pretty, resultLength);
  });

  // ============================================================
  //  Scroll-to-top button
  // ============================================================

  document.getElementById('demo-scroll-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});
