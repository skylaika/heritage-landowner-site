/* ---------------------------------------------------------
   Modern UI Script – Heritage Claims
   Clean, fast, commercial-grade interactions
   - Debounced Search
   - FAQ accordion with transitions
   - Dynamic search card rendering
   - Integrated with fuzzy.js engine
---------------------------------------------------------- */

/* ----------- CONFIG ----------- */
const FORM_URL = "https://form.jotform.com/253242615800045";

/* ----------- DEBOUNCE ----------- */
function debounce(fn, delay = 250) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/* ---------------------------------------------------------
   SEARCH LOGIC
---------------------------------------------------------- */
const searchInput = document.getElementById("searchBox");
const resultsBox = document.getElementById("results");
const loadingIndicator = document.getElementById("loading");

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

    div.onclick = () => {
      window.location.href = FORM_URL;
    };

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

  loadingIndicator.style.display = "block";

  // Call the fuzzy search engine provided in fuzzy.js
  const matches = window.searchNames(query);

  loadingIndicator.style.display = "none";
  renderResults(matches);
});

/* ---------------------------------------------------------
   FAQ ACCORDION (Smooth Animation)
---------------------------------------------------------- */
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

/* ---------------------------------------------------------
   ON PAGE LOAD
---------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  setupFAQ();

  searchInput.addEventListener("input", performSearch);
});

/* ---------------------------------------------------------
   MOBILE NAVIGATION
---------------------------------------------------------- */
const mobileBtn = document.getElementById("mobileMenuBtn");
const mobileNav = document.getElementById("mobileNav");

mobileBtn.addEventListener("click", () => {
  mobileBtn.classList.toggle("active");
  mobileNav.classList.toggle("open");
});

/* ---------------------------------------------------------
   FADE-IN ANIMATIONS
---------------------------------------------------------- */
const fadeEls = document.querySelectorAll(".fade");

function revealOnScroll() {
  const trigger = window.innerHeight * 0.85;

  fadeEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < trigger) {
      el.classList.add("visible");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);
