const REPO_RAW = 'https://raw.githubusercontent.com/Heidibloom/heidibloom-website/main';

const getJSON = async path => {
  const r = await fetch(`${REPO_RAW}${path}?v=${Date.now()}`, {
    cache: 'no-store'
  });

  if (!r.ok) throw new Error(`Could not load ${path}`);
  return r.json();
};

const liveImage = path => {
  if (!path) return '';
  if (path.startsWith('/uploads/')) {
    return `${REPO_RAW}${path}`;
  }
  return path;
};

(async () => {
  try {
    const [site, gallery, testimonials] = await Promise.all([
      getJSON('/content/site.json'),
      getJSON('/content/gallery.json'),
      getJSON('/content/testimonials.json')
    ]);

    document.getElementById('brand').textContent =
      site.siteName || 'Heidi Bloom';

    document.getElementById('tagline').textContent =
      site.tagline || '';

    document.getElementById('aboutText').textContent =
      site.about || '';

    document.getElementById('heroImage').src =
      liveImage(site.homepageImage) ||
      `${REPO_RAW}/uploads/hero-placeholder.svg`;

    document.getElementById('inquiryHeading').textContent =
      site.inquiryHeading || 'Private Inquiry';

    document.getElementById('inquiryNote').textContent =
      site.inquiryNote || '';

    document.body.classList.add(
      'theme-' + (site.theme || 'classic')
    );

    if (site.theme === 'custom' && site.customAccent) {
      document.documentElement.style.setProperty(
        '--accent',
        site.customAccent
      );
    }

    const g = document.getElementById('gallery');

    (gallery.images || []).forEach(x => {
      const i = document.createElement('img');
      i.src = liveImage(x.image);
      i.alt = x.alt || 'Gallery image';
      g.appendChild(i);
    });

    let idx = 0;
    const items = testimonials.items || [];
    const box = document.getElementById('testimonial');

    function draw() {
      if (!items.length) {
        box.innerHTML = '';
        return;
      }

      const t = items[idx];

      box.innerHTML =
        '<div class="testimonial-card">' +
        (
          t.type === 'image' && t.image
            ? `<img src="${liveImage(t.image)}" alt="Testimonial screenshot">`
            : `<p>“${t.text || ''}”</p><span>${t.name || ''}</span>`
        ) +
        '</div>';
    }

    document.getElementById('prevT').onclick = () => {
      idx = (idx - 1 + items.length) % items.length;
      draw();
    };

    document.getElementById('nextT').onclick = () => {
      idx = (idx + 1) % items.length;
      draw();
    };

    draw();

    setInterval(() => {
      if (items.length > 1) {
        idx = (idx + 1) % items.length;
        draw();
      }
    }, 6000);

  } catch (e) {
    console.error('Unable to load website content:', e);
  }

  document.getElementById('year').textContent =
    new Date().getFullYear();
})();
