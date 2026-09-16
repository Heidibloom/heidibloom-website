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

    document.querySelector('.menu-title').textContent =
      site.siteName || 'Heidi Bloom';

    document.getElementById('tagline').textContent =
      site.tagline || '';

    const heroImage = document.getElementById('heroImage');
    heroImage.src =
      liveImage(site.homepageImage) || '/uploads/hero-placeholder.svg';

    const allowedHeroPositions = ['top', 'center', 'bottom'];
    const heroPosition = allowedHeroPositions.includes(site.heroPosition)
      ? site.heroPosition
      : 'center';

    heroImage.style.objectPosition = `center ${heroPosition}`;

    // Theme
    document.body.classList.add(
      'theme-' + (site.theme || 'classic')
    );

    // Custom accent overrides the selected theme's normal accent
    if (site.useCustomAccent === true && site.customAccent) {
      document.body.style.setProperty(
        '--accent',
        site.customAccent
      );
    }

    // SEO and social sharing
    const seo = site.seoSettings || {};
    const pageTitle =
      seo.title || site.siteName || 'Heidi Bloom';
    const pageDescription =
      seo.description || site.tagline || 'Heidi Bloom';
    const socialImage =
      liveImage(seo.image || site.homepageImage || '');
    const pageUrl = window.location.href.split('#')[0];

    document.title = pageTitle;

    document
      .getElementById('metaDescription')
      .setAttribute('content', pageDescription);

    document
      .getElementById('ogTitle')
      .setAttribute('content', pageTitle);

    document
      .getElementById('ogDescription')
      .setAttribute('content', pageDescription);

    document
      .getElementById('ogUrl')
      .setAttribute('content', pageUrl);

    document
      .getElementById('twitterTitle')
      .setAttribute('content', pageTitle);

    document
      .getElementById('twitterDescription')
      .setAttribute('content', pageDescription);

    if (socialImage) {
      document
        .getElementById('ogImage')
        .setAttribute('content', socialImage);

      document
        .getElementById('twitterImage')
        .setAttribute('content', socialImage);
    }

    // Section visibility and hamburger navigation
    const sectionSettings = [
      {
        show: site.showAbout !== false,
        id: 'about',
        label: 'About Heidi'
      },
      {
        show: site.showAvailability === true,
        id: 'availability',
        label: 'Availability'
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
        show: site.showFaq === true,
        id: 'faq',
        label: 'FAQ'
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

    // Availability
    const availabilityList =
      document.getElementById('availabilityList');

    availabilityList.innerHTML = '';

    (site.availability || []).forEach(entry => {
      const card = document.createElement('div');
      card.className = 'availability-card';

      const location = document.createElement('h3');
      location.textContent = entry.location || '';
      card.appendChild(location);

      if (entry.dates) {
        const dates = document.createElement('strong');
        dates.className = 'availability-dates';
        dates.textContent = entry.dates;
        card.appendChild(dates);
      }

      if (entry.details) {
        const details = document.createElement('p');
        details.textContent = entry.details;
        card.appendChild(details);
      }

      availabilityList.appendChild(card);
    });

    // Services
    const servicesList =
      document.getElementById('servicesList');

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

    // FAQ
    const faqList = document.getElementById('faqList');
    faqList.innerHTML = '';

    (site.faq || []).forEach(item => {
      if (!item.question) return;

      const details = document.createElement('details');
      details.className = 'faq-item';

      const summary = document.createElement('summary');
      summary.textContent = item.question;
      details.appendChild(summary);

      const answer = document.createElement('p');
      answer.textContent = item.answer || '';
      details.appendChild(answer);

      faqList.appendChild(details);
    });

    // Socials
    const socialLinks =
      document.getElementById('socialLinks');

    socialLinks.innerHTML = '';

    const socials = [
      ['Instagram', site.instagram],
      ['X / Twitter', site.twitter],
      [
        site.otherSocialLabel || 'Other',
        site.otherSocialUrl
      ]
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
    const galleryBox =
      document.getElementById('gallery');

    galleryBox.innerHTML = '';

    const galleryItems =
      (gallery.images || []).filter(item => item.image);

    galleryItems.forEach((item, index) => {
      const image = document.createElement('img');

      image.src = liveImage(item.image);
      image.alt = item.alt || 'Gallery image';
      image.loading = 'lazy';
      image.tabIndex = 0;
      image.setAttribute('role', 'button');
      image.setAttribute(
        'aria-label',
        `Open gallery image ${index + 1}`
      );

      image.addEventListener('click', () => {
        openLightbox(index);
      });

      image.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openLightbox(index);
        }
      });

      galleryBox.appendChild(image);
    });

    // Gallery lightbox
    const lightbox =
      document.getElementById('lightbox');

    const lightboxImage =
      document.getElementById('lightboxImage');

    const lightboxClose =
      document.getElementById('lightboxClose');

    const lightboxPrev =
      document.getElementById('lightboxPrev');

    const lightboxNext =
      document.getElementById('lightboxNext');

    let lightboxIndex = 0;

    function drawLightbox() {
      if (!galleryItems.length) return;

      const item = galleryItems[lightboxIndex];

      lightboxImage.src = liveImage(item.image);
      lightboxImage.alt =
        item.alt || 'Gallery image';
    }

    function openLightbox(index) {
      if (!galleryItems.length) return;

      lightboxIndex = index;
      drawLightbox();

      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');

      lightboxClose.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lightbox-open');
    }

    function previousLightboxImage() {
      if (!galleryItems.length) return;

      lightboxIndex =
        (lightboxIndex - 1 + galleryItems.length) %
        galleryItems.length;

      drawLightbox();
    }

    function nextLightboxImage() {
      if (!galleryItems.length) return;

      lightboxIndex =
        (lightboxIndex + 1) %
        galleryItems.length;

      drawLightbox();
    }

    lightboxClose.addEventListener(
      'click',
      closeLightbox
    );

    lightboxPrev.addEventListener(
      'click',
      previousLightboxImage
    );

    lightboxNext.addEventListener(
      'click',
      nextLightboxImage
    );

    lightbox.addEventListener('click', event => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    // Testimonials
    let testimonialIndex = 0;

    const items = testimonials.items || [];

    const testimonialBox =
      document.getElementById('testimonial');

    function drawTestimonial() {
      testimonialBox.innerHTML = '';

      if (!items.length) return;

      const item = items[testimonialIndex];

      const card =
        document.createElement('div');

      card.className = 'testimonial-card';

      if (item.type === 'image' && item.image) {
        const image =
          document.createElement('img');

        image.src = liveImage(item.image);
        image.alt = 'Testimonial screenshot';

        card.appendChild(image);
      } else {
        if (item.text) {
          const text =
            document.createElement('p');

          text.textContent = `“${item.text}”`;
          card.appendChild(text);
        }

        if (item.name) {
          const name =
            document.createElement('span');

          name.textContent = item.name;
          card.appendChild(name);
        }
      }

      testimonialBox.appendChild(card);
    }

    document.getElementById('prevT').onclick = () => {
      if (!items.length) return;

      testimonialIndex =
        (testimonialIndex - 1 + items.length) %
        items.length;

      drawTestimonial();
    };

    document.getElementById('nextT').onclick = () => {
      if (!items.length) return;

      testimonialIndex =
        (testimonialIndex + 1) %
        items.length;

      drawTestimonial();
    };

    drawTestimonial();

    setInterval(() => {
      if (items.length > 1) {
        testimonialIndex =
          (testimonialIndex + 1) %
          items.length;

        drawTestimonial();
      }
    }, 6000);

    // Inquiry
    document.getElementById(
      'inquiryHeading'
    ).textContent =
      site.inquiryHeading || 'Private Inquiry';

    document.getElementById(
      'inquiryNote'
    ).textContent =
      site.inquiryNote || '';

    // Hamburger menu
    const menuButton =
      document.getElementById('menuButton');

    const menuClose =
      document.getElementById('menuClose');

    const siteMenu =
      document.getElementById('siteMenu');

    const menuBackdrop =
      document.getElementById('menuBackdrop');

    const menuLinks =
      document.getElementById('menuLinks');

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

      menuButton.setAttribute(
        'aria-expanded',
        'true'
      );

      siteMenu.setAttribute(
        'aria-hidden',
        'false'
      );
    }

    function closeMenu() {
      siteMenu.classList.remove('open');
      menuBackdrop.classList.remove('open');
      document.body.classList.remove('menu-open');

      menuButton.setAttribute(
        'aria-expanded',
        'false'
      );

      siteMenu.setAttribute(
        'aria-hidden',
        'true'
      );
    }

    menuButton.addEventListener(
      'click',
      openMenu
    );

    menuClose.addEventListener(
      'click',
      closeMenu
    );

    menuBackdrop.addEventListener(
      'click',
      closeMenu
    );

    menuLinks
      .querySelectorAll('a')
      .forEach(link => {
        link.addEventListener(
          'click',
          closeMenu
        );
      });

    // Keyboard controls
    document.addEventListener(
      'keydown',
      event => {
        if (
          event.key === 'Escape' &&
          lightbox.classList.contains('open')
        ) {
          closeLightbox();
          return;
        }

        if (event.key === 'Escape') {
          closeMenu();
        }

        if (
          event.key === 'ArrowLeft' &&
          lightbox.classList.contains('open')
        ) {
          previousLightboxImage();
        }

        if (
          event.key === 'ArrowRight' &&
          lightbox.classList.contains('open')
        ) {
          nextLightboxImage();
        }
      }
    );

    // Explore button
    const exploreButton =
      document.getElementById('exploreButton');

    const firstVisible =
      visibleSections.find(
        section => section.id !== 'inquiry'
      ) || visibleSections[0];

    if (firstVisible) {
      exploreButton.href =
        `#${firstVisible.id}`;
    } else {
      exploreButton.style.display = 'none';
    }

  } catch (error) {
    console.error(
      'Unable to load website content:',
      error
    );
  }

  document.getElementById('year').textContent =
    new Date().getFullYear();
})();
