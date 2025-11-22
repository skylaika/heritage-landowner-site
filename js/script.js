/* ---------------------------------------------------------
   Heritage Claims – Search, UI Logic, Autosuggest, FAQ, etc.
---------------------------------------------------------- */

let NAME_LIST = [];
let isSearchRunning = false;

// Load names.json
fetch("data/names.json")
  .then((res) => res.json())
  .then((data) => {
    NAME_LIST = data.map((item) => {
      if (typeof item === "string") return { name: item };
      return item;
    });
  })
  .catch((err) => console.error("Failed loading names.json", err));

/* ---------------------------------------------------------
   Debounce Helper
---------------------------------------------------------- */
function debounce(fn, delay = 250) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/* ---------------------------------------------------------
   Elements
---------------------------------------------------------- */
const searchInput = document.getElementById("searchBox");
const resultsBox = document.getElementById("results");
const loadingIndicator = document.getElementById("loading");

const suggestBox = document.createElement("div");
suggestBox.id = "autosuggest";
document.querySelector(".search-input-wrapper").appendChild(suggestBox);

/* ---------------------------------------------------------
   Shimmer Loader
---------------------------------------------------------- */
function createShimmerCard() {
  const div = document.createElement("div");
  div.className = "card shimmer-card";
  return div;
}

function showShimmer() {
  resultsBox.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    resultsBox.appendChild(createShimmerCard());
  }
}

/* ---------------------------------------------------------
   Render Search Results
---------------------------------------------------------- */
function renderResults(matches) {
  resultsBox.innerHTML = "";

  if (!matches || matches.length === 0) {
    resultsBox.innerHTML = `
      <div class="card" style="opacity: 0.7;">
        No matches found.
      </div>
    `;
    return;
  }

  matches.forEach((item) => {
    const div = document.createElement("div");
    div.className = "card";
    div.textContent = item.name;
    div.onclick = () => {
      window.location.href =
        "https://form.jotform.com/253242615800045";
    };
    resultsBox.appendChild(div);
  });
}

/* ---------------------------------------------------------
   Autosuggest (highlight matches)
---------------------------------------------------------- */
function highlightMatch(full, query) {
  const regex = new RegExp(`(${query})`, "i");
  return full.replace(regex, "<strong>$1</strong>");
}

function renderAutosuggest(matches, query) {
  if (!query || matches.length === 0) {
    suggestBox.innerHTML = "";
    suggestBox.style.display = "none";
    return;
  }

  suggestBox.style.display = "block";
  suggestBox.innerHTML = matches
    .map(
      (item) => `
      <div class="suggest-item">
        ${highlightMatch(item.name, query)}
      </div>`
    )
    .join("");

  document.querySelectorAll(".suggest-item").forEach((el) => {
    el.addEventListener("click", () => {
      searchInput.value = el.innerText;
      suggestBox.style.display = "none";
      performSearch();
    });
  });
}

/* ---------------------------------------------------------
   Main Search
---------------------------------------------------------- */
const performSearch = debounce(() => {
  if (isSearchRunning) return;

  const query = searchInput.value.trim();
  if (!query) {
    resultsBox.innerHTML = "";
    loadingIndicator.style.display = "none";
    suggestBox.style.display = "none";
    return;
  }

  isSearchRunning = true;
  showShimmer();
  loadingIndicator.style.display = "block";

  // Fuzzy search
  const matches = window.searchNames(query, NAME_LIST);

  // Autosuggest (top 5)
  renderAutosuggest(matches.slice(0, 5), query);

  loadingIndicator.style.display = "none";
  renderResults(matches);
  isSearchRunning = false;
});

/* ---------------------------------------------------------
   FAQ Accordion
---------------------------------------------------------- */
function setupFAQ() {
  const items = document.querySelectorAll(".faq-item");

  items.forEach((item) => {
    const button = item.querySelector(".faq-btn");
    const answer = item.querySelector(".faq-answer");
    const icon = item.querySelector(".faq-icon");

    answer.style.display = "none";
    answer.style.maxHeight = "0px";
    answer.style.transition = "max-height 0.25s ease";

    button.addEventListener("click", () => {
      const isOpen = answer.style.maxHeight !== "0px";

      document.querySelectorAll(".faq-answer").forEach((other) => {
        other.style.maxHeight = "0px";
      });
      document.querySelectorAll(".faq-icon").forEach((ic) => {
        ic.classList.remove("open");
      });

      if (!isOpen) {
        answer.style.maxHeight = answer.scrollHeight + "px";
        icon.classList.add("open");
      }
    });
  });
}

/* ---------------------------------------------------------
   Fade-in Sections on Scroll
---------------------------------------------------------- */
const fadeEls = document.querySelectorAll(".fade");

function revealOnScroll() {
  const trigger = window.innerHeight * 0.85;

  fadeEls.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < trigger) el.classList.add("visible");
  });
}

/* ---------------------------------------------------------
   Init
---------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  setupFAQ();
  searchInput.addEventListener("input", performSearch);

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();
});
