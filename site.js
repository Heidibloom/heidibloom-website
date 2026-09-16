const getJSON = async (path) => {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) throw new Error(path);
  return response.json();
};

const liveImage = (path) => {
  if (!path) return '';
  if (path.startsWith('/uploads/')) {
    return `https://raw.githubusercontent.com/Heidibloom/heidibloom-website/main${path}`;
  }
  return path;
};

(async () => {
  try {
    const [site, gallery, testimonials] = await Promise.all([
      getJSON('https://raw.githubusercontent.com/Heidibloom/heidibloom-website/main/content/site.json'),
      getJSON('https://raw.githubusercontent.com/Heidibloom/heidibloom-website/main/content/gallery.json'),
      getJSON('https://raw.githubusercontent.com/Heidibloom/heidibloom-website/main/content/testimonials.json')
    ]);

    // Basic website settings
    document.getElementById('brand').textContent =
      site.siteName || 'Heidi Bloom';

    document.getElementById('tagline').textContent =
      site.tagline || '';

    document.getElementById('heroImage').src =
      liveImage(site.homepageImage) || '/uploads/hero-placeholder.svg';

    // Theme
    document.body.classList.add('theme-' + (site.theme || 'classic'));

    if (site.useCustomAccent === true && site.customAccent) {
      document.body.style.setProperty(
        '--accent',
        site.customAccent
      );
    }

    // Section visibility
    const sectionSettings = [
      {
        show: site.showAbout !== false,
        id: 'about',
        label: 'About Heidi'
      },
      {
        show: site.showServices === true,
        id: 'services',
        label: 'Services & Rates'
      },
      {
        show: site.showRestrictions === true,
        id: 'restrictions',
        label: 'Restrictions'
      },
      {
        show: site.showSocials === true,
        id: 'socials',
        label: 'Socials'
      },
      {
        show: site.showGallery !== false,
        id: 'gallerySection',
        label: 'Gallery'
      },
      {
        show: site.showTestimonials !== false,
        id: 'testimonialsSection',
        label: 'Testimonials'
      },
      {
        show: site.showInquiry !== false,
        id: 'inquiry',
        label: 'Private Inquiry'
      }
    ];

    sectionSettings.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) {
        element.style.display = section.show ? '' : 'none';
      }
    });

    // About
    document.getElementById('aboutText').textContent =
      site.about || '';

    // Services
    const servicesList = document.getElementById('servicesList');
    servicesList.innerHTML = '';

    (site.services || []).forEach(service => {
      const card = document.createElement('div');
      card.className = 'service-card';

      const title = document.createElement('h3');
      title.textContent = service.name || '';
      card.appendChild(title);

      if (service.description) {
        const description = document.createElement('p');
        description.textContent = service.description;
        card.appendChild(description);
      }

      const meta = document.createElement('div');
      meta.className = 'service-meta';

      if (service.duration) {
        const duration = document.createElement('span');
        duration.textContent = service.duration;
        meta.appendChild(duration);
      }

      if (service.rate) {
        const rate = document.createElement('strong');
        rate.textContent = service.rate;
        meta.appendChild(rate);
      }

      if (meta.children.length) {
        card.appendChild(meta);
      }

      servicesList.appendChild(card);
    });

    // Restrictions
    const restrictionsList =
      document.getElementById('restrictionsList');

    restrictionsList.innerHTML = '';

    if ((site.restrictions || []).length) {
      const list = document.createElement('ul');

      site.restrictions.forEach(item => {
        const li = document.createElement('li');

        if (typeof item === 'string') {
          li.textContent = item;
        } else {
          li.textContent = item.item || '';
        }

        list.appendChild(li);
      });

      restrictionsList.appendChild(list);
    }

    // Socials
    const socialLinks = document.getElementById('socialLinks');
    socialLinks.innerHTML = '';

    const socials = [
      ['Instagram', site.instagram],
      ['X / Twitter', site.twitter],
      [site.otherSocialLabel || 'Other', site.otherSocialUrl]
    ];

    socials.forEach(([label, url]) => {
      if (!url) return;

      const link = document.createElement('a');
      link.href = url;
      link.textContent = label;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      socialLinks.appendChild(link);
    });

    // Gallery
    const galleryBox = document.getElementById('gallery');
    galleryBox.innerHTML = '';

    (gallery.images || []).forEach(item => {
      if (!item.image) return;

      const image = document.createElement('img');
      image.src = liveImage(item.image);
      image.alt = item.alt || 'Gallery image';
      image.loading = 'lazy';
      galleryBox.appendChild(image);
    });

    // Testimonials
    let testimonialIndex = 0;
    const items = testimonials.items || [];
    const testimonialBox = document.getElementById('testimonial');

    function drawTestimonial() {
      testimonialBox.innerHTML = '';

      if (!items.length) return;

      const item = items[testimonialIndex];
      const card = document.createElement('div');
      card.className = 'testimonial-card';

      if (item.type === 'image' && item.image) {
        const image = document.createElement('img');
        image.src = liveImage(item.image);
        image.alt = 'Testimonial screenshot';
        card.appendChild(image);
      } else {
        if (item.text) {
          const text = document.createElement('p');
          text.textContent = `“${item.text}”`;
          card.appendChild(text);
        }

        if (item.name) {
          const name = document.createElement('span');
          name.textContent = item.name;
          card.appendChild(name);
        }
      }

      testimonialBox.appendChild(card);
    }

    document.getElementById('prevT').onclick = () => {
      if (!items.length) return;
      testimonialIndex =
        (testimonialIndex - 1 + items.length) % items.length;
      drawTestimonial();
    };

    document.getElementById('nextT').onclick = () => {
      if (!items.length) return;
      testimonialIndex =
        (testimonialIndex + 1) % items.length;
      drawTestimonial();
    };

    drawTestimonial();

    setInterval(() => {
      if (items.length > 1) {
        testimonialIndex =
          (testimonialIndex + 1) % items.length;
        drawTestimonial();
      }
    }, 6000);

    // Inquiry
    document.getElementById('inquiryHeading').textContent =
      site.inquiryHeading || 'Private Inquiry';

    document.getElementById('inquiryNote').textContent =
      site.inquiryNote || '';

    // Hamburger menu
    const menuButton = document.getElementById('menuButton');
    const menuClose = document.getElementById('menuClose');
    const siteMenu = document.getElementById('siteMenu');
    const menuBackdrop = document.getElementById('menuBackdrop');
    const menuLinks = document.getElementById('menuLinks');

    const visibleSections =
      sectionSettings.filter(section => section.show);

    visibleSections.forEach(section => {
      const link = document.createElement('a');
      link.href = `#${section.id}`;
      link.textContent = section.label;
      menuLinks.appendChild(link);
    });

    function openMenu() {
      siteMenu.classList.add('open');
      menuBackdrop.classList.add('open');
      document.body.classList.add('menu-open');
      menuButton.setAttribute('aria-expanded', 'true');
      siteMenu.setAttribute('aria-hidden', 'false');
    }

    function closeMenu() {
      siteMenu.classList.remove('open');
      menuBackdrop.classList.remove('open');
      document.body.classList.remove('menu-open');
      menuButton.setAttribute('aria-expanded', 'false');
      siteMenu.setAttribute('aria-hidden', 'true');
    }

    menuButton.addEventListener('click', openMenu);
    menuClose.addEventListener('click', closeMenu);
    menuBackdrop.addEventListener('click', closeMenu);

    menuLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });

    // Explore button goes to first visible content section
    const exploreButton = document.getElementById('exploreButton');

    const firstVisible =
      visibleSections.find(section => section.id !== 'inquiry') ||
      visibleSections[0];

    if (firstVisible) {
      exploreButton.href = `#${firstVisible.id}`;
    } else {
      exploreButton.style.display = 'none';
    }

  } catch (error) {
    console.error('Unable to load website content:', error);
  }

  document.getElementById('year').textContent =
    new Date().getFullYear();
})();
