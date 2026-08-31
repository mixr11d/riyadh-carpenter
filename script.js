/**
 * نجار الرياض المحترف | High-Performance Multi-Page Engine
 * Core Web Vitals +98% Optimized | Google Ads Fast Tracking Architecture
 */

(function () {
  'use strict';

  // ==========================================
  // 1. ثوابت المشروع وإعدادات التتبع
  // ==========================================
  const CONFIG = {
    phoneLocal: '0570053235',
    phoneInternational: '966570053235',
    devPhone: '966578539687',
    googleAdsId: 'AW-xxxxxxxxxxxxx',
    callConversionLabel: 'xxxxxxxxxxxxxxxxx',
    waConversionLabel: 'xxxxxxxxxxxxxx',
    formConversionLabel: 'xxxxxxxxxxxxxxxxxxx',
    brandName: 'نجار الرياض المحترف'
  };

  // التحقق مما إذا كان المستخدم هو المطور لاستثنائه من احتساب الإعلانات
  function isDeveloperSession() {
    return (
      window.location.search.includes('dev_mode=true') ||
      localStorage.getItem('is_dev_user') === 'true'
    );
  }

  // ==========================================
  // 2. تحميل Google Ads و gtag عبر requestIdleCallback لمنع حظر العرض
  // ==========================================
  function initGoogleAdsTracking() {
    if (isDeveloperSession()) {
      console.warn('[Tracking Disabled]: Developer Mode Active.');
      return;
    }

    const loadAdsScript = () => {
      if (document.getElementById('google-ads-gtag')) return;

      const script = document.createElement('script');
      script.id = 'google-ads-gtag';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.googleAdsId}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', CONFIG.googleAdsId);
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadAdsScript, { timeout: 3000 });
    } else {
      setTimeout(loadAdsScript, 2000);
    }
  }

  // إرسال حدث التحويل
  function triggerConversion(label, callback) {
    if (isDeveloperSession() || typeof window.gtag !== 'function') {
      if (typeof callback === 'function') callback();
      return;
    }

    let callbackCalled = false;
    const executeCallback = () => {
      if (!callbackCalled && typeof callback === 'function') {
        callbackCalled = true;
        callback();
      }
    };

    // مهلة زمنية احتياطية (Fallback)
    setTimeout(executeCallback, 600);

    window.gtag('event', 'conversion', {
      send_to: `${CONFIG.googleAdsId}/${label}`,
      event_callback: executeCallback
    });
  }

  // ==========================================
  // 3. التحكم بقائمة الجوال الذكية
  // ==========================================
  function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger-btn');
    const drawer = document.querySelector('.mobile-nav-drawer');
    const backdrop = document.querySelector('.mobile-nav-backdrop');
    const closeBtn = document.querySelector('.close-drawer-btn');
    const navLinks = document.querySelectorAll('.mobile-nav-links a');

    if (!hamburger || !drawer || !backdrop) return;

    const openMenu = () => {
      drawer.classList.add('active');
      backdrop.classList.add('active');
      document.body.classList.add('menu-open');
    };

    const closeMenu = () => {
      drawer.classList.remove('active');
      backdrop.classList.remove('active');
      document.body.classList.remove('menu-open');
    };

    hamburger.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    backdrop.addEventListener('click', closeMenu);

    navLinks.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });
  }

  // ==========================================
  // 4. زر الصعود للأعلى وزر الاتصال العائم
  // ==========================================
  function initScrollBehavior() {
    const scrollBtn = document.querySelector('.floating-scroll-left');
    if (!scrollBtn) return;

    window.addEventListener(
      'scroll',
      () => {
        if (window.scrollY > 300) {
          scrollBtn.classList.add('show');
        } else {
          scrollBtn.classList.remove('show');
        }
      },
      { passive: true }
    );

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================
  // 5. ربط أحداث التحويل بروابط الاتصال والواتساب
  // ==========================================
  function initConversionTrackingEvents() {
    // جميع روابط الواتساب
    const waLinks = document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"]');
    waLinks.forEach((link) => {
      link.addEventListener('click', function (e) {
        // استثناء رابط المطور
        if (this.href.includes(CONFIG.devPhone)) return;

        e.preventDefault();
        const targetUrl = this.href;
        triggerConversion(CONFIG.waConversionLabel, () => {
          window.open(targetUrl, '_blank', 'noopener,noreferrer');
        });
      });
    });

    // جميع روابط الاتصال
    const telLinks = document.querySelectorAll('a[href^="tel:"]');
    telLinks.forEach((link) => {
      link.addEventListener('click', function (e) {
        if (this.href.includes(CONFIG.devPhone)) return;

        e.preventDefault();
        const targetUrl = this.href;
        triggerConversion(CONFIG.callConversionLabel, () => {
          window.location.href = targetUrl;
        });
      });
    });
  }

  // ==========================================
  // 6. حاسبة الأسعار التفاعلية ونموذج الطلب السريع
  // ==========================================
  function initWoodCalculator() {
    const calcForm = document.getElementById('woodPriceCalculator');
    if (!calcForm) return;

    const serviceSelect = document.getElementById('calcServiceType');
    const woodTypeSelect = document.getElementById('calcWoodType');
    const quantityInput = document.getElementById('calcQuantity');
    const priceDisplay = document.getElementById('calcEstimatedPrice');
    const submitBtn = document.getElementById('calcSubmitWhatsapp');

    const rates = {
      doors: { swedish: 650, oak: 1200, mdf: 500, walnut: 1600 },
      wardrobes: { swedish: 750, oak: 1400, mdf: 600, walnut: 1800 },
      bedroom_assembly: { swedish: 250, oak: 300, mdf: 200, walnut: 350 },
      cladding: { swedish: 120, oak: 190, mdf: 100, walnut: 230 }
    };

    function calculate() {
      const srv = serviceSelect ? serviceSelect.value : 'doors';
      const wood = woodTypeSelect ? woodTypeSelect.value : 'swedish';
      const qty = parseFloat(quantityInput ? quantityInput.value : 1) || 1;

      const unitPrice = rates[srv] && rates[srv][wood] ? rates[srv][wood] : 300;
      const total = unitPrice * qty;

      if (priceDisplay) {
        priceDisplay.textContent = `يبدأ من ${total.toLocaleString('ar-SA')} ريال تقريباً`;
      }
      return { srv, wood, qty, total };
    }

    [serviceSelect, woodTypeSelect, quantityInput].forEach((el) => {
      if (el) el.addEventListener('input', calculate);
    });

    if (submitBtn) {
      submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const res = calculate();
        const srvText = serviceSelect.options[serviceSelect.selectedIndex].text;
        const woodText = woodTypeSelect.options[woodTypeSelect.selectedIndex].text;
        
        const message = `السلام عليكم ورحمة الله، أرغب في حجز خدمة من نجار الرياض المحترف:\n\n- الخدمة: ${srvText}\n- نوع الخشب/المادة: ${woodText}\n- الكمية/المتر: ${res.qty}\n- التقدير المبدئي: ${res.total} ريال\n\nأرجو تزويدي بالموعد المتاح للتنفيذ والمعاينة.`;
        const waUrl = `https://wa.me/${CONFIG.phoneInternational}?text=${encodeURIComponent(message)}`;

        triggerConversion(CONFIG.formConversionLabel, () => {
          window.open(waUrl, '_blank', 'noopener,noreferrer');
        });
      });
    }
  }

  // معالجة النماذج العامة
  function initSmartForms() {
    const contactForms = document.querySelectorAll('.smart-contact-form');
    contactForms.forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = form.querySelector('[name="name"]');
        const phoneInput = form.querySelector('[name="phone"]');
        const serviceInput = form.querySelector('[name="service"]');
        const noteInput = form.querySelector('[name="notes"]');

        const name = nameInput ? nameInput.value.trim() : 'عميل';
        const phone = phoneInput ? phoneInput.value.trim() : '';
        const service = serviceInput ? serviceInput.value : 'عام';
        const notes = noteInput ? noteInput.value.trim() : 'لا توجد ملاحظات';

        const message = `طلب خدمة جديد من الموقع:\n\n- الاسم: ${name}\n- الجوال: ${phone}\n- الخدمة: ${service}\n- التفاصيل: ${notes}`;
        const waUrl = `https://wa.me/${CONFIG.phoneInternational}?text=${encodeURIComponent(message)}`;

        triggerConversion(CONFIG.formConversionLabel, () => {
          window.location.href = 'thank-you.html';
          setTimeout(() => {
            window.open(waUrl, '_blank', 'noopener,noreferrer');
          }, 400);
        });
      });
    });
  }

  // ==========================================
  // 7. استرجاع الصور التلقائي عند أي خطأ
  // ==========================================
  function initImageFallbacks() {
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      img.addEventListener('error', function () {
        if (!this.getAttribute('data-fallback-applied')) {
          this.setAttribute('data-fallback-applied', 'true');
          this.src = 'images/logo_result.webp';
        }
      });
    });
  }

  // ==========================================
  // 8. تشغيل وتنسيق المحرك عند تحميل الصفحة
  // ==========================================
  document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initScrollBehavior();
    initConversionTrackingEvents();
    initWoodCalculator();
    initSmartForms();
    initImageFallbacks();
    initGoogleAdsTracking();
  });
})();
