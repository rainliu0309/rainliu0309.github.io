(() => {
const footerYear = document.querySelector(".portfolio-footer-year");
if (footerYear) footerYear.textContent = new Date().getFullYear();

const themeSwitch = document.querySelector("[data-case-theme-switch]");
const themeColor = document.querySelector('meta[name="theme-color"]');
const logo = document.querySelector(".portfolio-logo img");
const setTheme = (theme) => {
  const isDark = theme === "dark";
  const normalizedTheme = isDark ? "dark" : "light";

  document.documentElement.dataset.theme = normalizedTheme;
  themeSwitch?.setAttribute("aria-checked", String(isDark));
  themeSwitch?.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  if (logo) logo.src = isDark ? "./media/logo-dark.svg" : "./media/logo-light.svg";
  if (themeColor) themeColor.content = isDark ? "#0c111d" : "#f5f5f5";
  try { localStorage.setItem("rain-theme", normalizedTheme); } catch {}
};

setTheme(document.documentElement.dataset.theme);
themeSwitch?.addEventListener("click", () => {
  setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});

const backToTop = document.querySelector(".back-to-top");
if (backToTop) {
  const updateBackToTop = () => backToTop.classList.toggle("is-visible", window.scrollY > 520);
  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

const revealElements = document.querySelectorAll(".reveal-on-scroll, .case-reveal:not([hidden])");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
if (reduceMotion.matches || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0 }
  );
  revealElements.forEach((element) => revealObserver.observe(element));
}
})();

(() => {
  const menu = document.querySelector('#case-navigation');
  const toggle = document.querySelector('.navigation-toggle');
  const compact = window.matchMedia('(max-width: 1180px)');
  const setOpen = (open) => {
    menu.classList.toggle('is-open', open);
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.querySelector('a').addEventListener('click', () => setOpen(false));
  document.addEventListener('click', (event) => {
    if (!menu.contains(event.target) && !toggle.contains(event.target)) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  compact.addEventListener('change', () => setOpen(false));
})();
