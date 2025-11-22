/* ---------------------------------------------------------
   Modern UI Script – Heritage Claims
   R2 Upgrade: navbar shrink, back-to-top, counters, shimmer
---------------------------------------------------------- */

const FORM_URL = "https://form.jotform.com/253242615800045";

/* ---------------- DEBOUNCE ---------------- */
function debounce(fn, delay = 250) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/* ---------------- SEARCH LOGIC ---------------- */
const searchInput = document.getElementById("searchBox");
const resultsBox = document.getElementById("results");
const loadingIndicator = document.getElementById("loading");

function createShimmerCard() {
  const div = document.createElement("div");
  div.className = "card shimmer-card";
  return div;
}

function showShimmer() {
  resultsBox.innerHTML = "";
  for (let i = 0; i < 3; i++) resultsBox.appendChild(createShimmerCard());
}

function renderResults(matches) {
  resultsBox.innerHTML = "";

  if (!matches || matches.length === 0) {
    resultsBox.innerHTML = `
      <div class="card" style="cursor:default;opacity:0.7;">
        No matches found.
      </div>`;
    return;
  }

  matches.forEach((item) => {
    const div = document.createElement("div");
    div.className = "card";
    div.textContent = item.name;
    div.onclick = () => window.location.href = FORM_URL;
    resultsBox.appendChild(div);
  });
}

const performSearch = debounce(() => {
  const query = searchInput.value.trim();

  if (!query) {
    resultsBox.innerHTML = "";
    loadingIndicator.style.display = "none";
    return;
  }

  showShimmer();
  loadingIndicator.style.display = "block";

  const matches = window.searchNames(query);

  loadingIndicator.style.display = "none";
  renderResults(matches);
});

/* ---------------- FAQ ACCORDION ---------------- */
function setupFAQ() {
  const items = document.querySelectorAll(".faq-item");

  items.forEach((item) => {
    const button = item.querySelector(".faq-btn");
    const answer = item.querySelector(".faq-answer");

    answer.style.display = "none";
    answer.style.maxHeight = "0px";
    answer.style.overflow = "hidden";
    answer.style.transition = "max-height 0.25s ease";

    button.addEventListener("click", () => {
      const isOpen = answer.style.maxHeight !== "0px";

      document.querySelectorAll(".faq-answer").forEach((other) => {
        other.style.maxHeight = "0px";
      });

      if (!isOpen) {
        answer.style.display = "block";
        answer.style.maxHeight = answer.scrollHeight + "px";
      } else {
        answer.style.maxHeight = "0px";
      }
    });
  });
}

/* ---------------- SHRINKING NAV ---------------- */
const nav = document.querySelector(".nav");

function onScrollNavbar() {
  if (window.scrollY > 20) {
    nav.classList.add("shrink");
  } else {
    nav.classList.remove("shrink");
  }
}

/* ---------------- BACK TO TOP BUTTON ---------------- */
const backTop = document.createElement("button");
backTop.id = "backToTop";
backTop.textContent = "↑";
document.body.appendChild(backTop);

backTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function toggleBackToTop() {
  if (window.scrollY > 500) backTop.classList.add("show");
  else backTop.classList.remove("show");
}

/* ---------------- COUNTER ANIMATION ---------------- */
function animateCounter(el, target) {
  let current = 0;
  const increment = Math.ceil(target / 40);

  const step = () => {
    current += increment;
    if (current >= target) {
      el.textContent = target.toLocaleString() + "+";
    } else {
      el.textContent = current.toLocaleString();
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
}

function triggerCounters() {
  document.querySelectorAll(".stat-number").forEach((el) => {
    const text = el.textContent.replace(/[^0-9]/g, "");
    const target = Number(text);
    animateCounter(el, target);
  });
}

/* ---------------- FADE-IN SECTIONS ---------------- */
const fadeEls = document.querySelectorAll(".fade");

function revealOnScroll() {
  const trigger = window.innerHeight * 0.85;

  fadeEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < trigger) el.classList.add("visible");
  });
}

/* ---------------- MOBILE NAVIGATION ---------------- */
const mobileBtn = document.getElementById("mobileMenuBtn");
const mobileNav = document.getElementById("mobileNav");

mobileBtn.addEventListener("click", () => {
  mobileBtn.classList.toggle("active");
  mobileNav.classList.toggle("open");
});

/* ---------------- INITIAL LOAD ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  setupFAQ();
  searchInput.addEventListener("input", performSearch);
  window.addEventListener("scroll", onScrollNavbar);
  window.addEventListener("scroll", toggleBackToTop);
  window.addEventListener("scroll", revealOnScroll);

  revealOnScroll();
  triggerCounters();
});
