/* ====================================
   Stylo e Beleza - JavaScript
   Versão: 1.0
   ==================================== */

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', function() {
  initThemeToggle();
  initMobileMenu();
  initSmoothScroll();
  initGallery();
  initScrollEffects();
});

// ========== THEME TOGGLE (Light/Dark Mode) ==========
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Verificar tema salvo no localStorage
  const savedTheme = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  // Event listener para toggle
  themeToggle.addEventListener('click', function() {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#themeToggle i');
  if (theme === 'dark') {
    icon.className = 'fas fa-sun';
  } else {
    icon.className = 'fas fa-moon';
  }
}

// ========== MOBILE MENU ==========
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-link');

  // Toggle menu
  menuToggle.addEventListener('click', function() {
    menuToggle.classList.toggle('active');
    nav.classList.toggle('active');
  });

  // Fechar menu ao clicar em um link
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      menuToggle.classList.remove('active');
      nav.classList.remove('active');
    });
  });

  // Fechar menu ao clicar fora (mobile)
  document.addEventListener('click', function(e) {
    if (!nav.contains(e.target) && !menuToggle.contains(e.target) && nav.classList.contains('active')) {
      menuToggle.classList.remove('active');
      nav.classList.remove('active');
    }
  });
}

// ========== SMOOTH SCROLL ==========
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      // Ignorar links vazios ou apenas "#"
      if (href === '#' || href === '') {
        e.preventDefault();
        return;
      }

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();
        const headerHeight = document.getElementById('header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ========== GALLERY & LIGHTBOX ==========
function initGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentIndex = 0;
  let imagesArray = [];

  // Construir array de imagens
  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    imagesArray.push({
      src: img.src,
      alt: img.alt
    });

    // Click para abrir lightbox
    item.addEventListener('click', function() {
      currentIndex = index;
      openLightbox();
    });
  });

  // Abrir lightbox
  function openLightbox() {
    lightbox.classList.add('active');
    updateLightboxImage();
    document.body.style.overflow = 'hidden';
  }

  // Fechar lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Atualizar imagem do lightbox
  function updateLightboxImage() {
    const currentImage = imagesArray[currentIndex];
    lightboxImage.src = currentImage.src;
    lightboxImage.alt = currentImage.alt;
    lightboxCounter.textContent = `${currentIndex + 1} de ${imagesArray.length}`;
  }

  // Imagem anterior
  function prevImage() {
    currentIndex = (currentIndex - 1 + imagesArray.length) % imagesArray.length;
    updateLightboxImage();
  }

  // Próxima imagem
  function nextImage() {
    currentIndex = (currentIndex + 1) % imagesArray.length;
    updateLightboxImage();
  }

  // Event listeners
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', prevImage);
  lightboxNext.addEventListener('click', nextImage);

  // Clicar fora da imagem fecha o lightbox
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Navegação por teclado
  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('active')) return;

    switch(e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        prevImage();
        break;
      case 'ArrowRight':
        nextImage();
        break;
    }
  });
}

// ========== SCROLL EFFECTS ==========
function initScrollEffects() {
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;

    // Adicionar shadow no header ao scrollar
    if (currentScroll > 0) {
      header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
      header.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
  });

  // Intersection Observer para animações (opcional)
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observar elementos com classe 'fade-in' (se adicionar no HTML)
  const fadeElements = document.querySelectorAll('.fade-in');
  fadeElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// ========== UTILITY FUNCTIONS ==========

// Debounce para performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Log para debug (remover em produção)
console.log('🎨 Stylo e Beleza - Website carregado com sucesso!');
