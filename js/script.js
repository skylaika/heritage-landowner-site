/* ---------------------------------------------------------
   Heritage Claims – Search, UI Logic, Autosuggest (fixed)
---------------------------------------------------------- */

let NAME_LIST = [];
let isSearchRunning = false;
let lastClickSearch = false;

// Load names.json
fetch("data/names.json")
  .then(res => res.json())
  .then(data => {
    NAME_LIST = data.map(item => {
      if (typeof item === "string") return { name: item };
      return item;
    });
  });

/* ---------------- Debounce ---------------- */
function debounce(fn, delay = 250) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/* ---------------- Elements ---------------- */
const searchInput = document.getElementById("searchBox");
const resultsBox = document.getElementById("results");
const loadingIndicator = document.getElementById("loading");
const searchBtn = document.getElementById("searchBtn");

// AUTOSUGGEST BOX
const suggestBox = document.createElement("div");
suggestBox.id = "autosuggest";
document.querySelector(".search-input-wrapper").appendChild(suggestBox);

/* ---------------------------------------------------------
   STRICT autosuggest logic — begins after 3 letters
---------------------------------------------------------- */
function strictSuggest(query) {
  if (query.length < 3) return [];

  const q = query.toLowerCase();

  return NAME_LIST.filter(item =>
    item.name.toLowerCase().includes(q)
  ).slice(0, 5);
}

function renderAutosuggest(matches, query) {
  if (!query || query.length < 3 || matches.length === 0) {
    suggestBox.innerHTML = "";
    suggestBox.style.display = "none";
    return;
  }

  suggestBox.style.display = "block";

  suggestBox.innerHTML = matches
    .map(item => `
      <div class="suggest-item">${item.name}</div>
    `)
    .join("");

  document.querySelectorAll(".suggest-item").forEach(el => {
    el.addEventListener("click", () => {
      searchInput.value = el.innerText;
      suggestBox.style.display = "none";
    });
  });
}

/* ---------------------------------------------------------
   STRICT search — runs ONLY when Search button clicked
---------------------------------------------------------- */
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  lastClickSearch = true;

  if (!query || query.length < 3) {
    resultsBox.innerHTML = `<div class="card">Please enter at least 3 letters.</div>`;
    return;
  }

  performSearch(query);
});

/* ---------------------------------------------------------
   Main search function (strict)
---------------------------------------------------------- */
function performSearch(query) {
  if (isSearchRunning) return;
  isSearchRunning = true;

  showShimmer();
  loadingIndicator.style.display = "block";

  setTimeout(() => {
    const q = query.toLowerCase();

    const matches = NAME_LIST.filter(item =>
      item.name.toLowerCase().includes(q)
    ).slice(0, 20);

    loadingIndicator.style.display = "none";
    renderResults(matches);

    isSearchRunning = false;
  }, 200);
}

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
  for (let i = 0; i < 3; i++) resultsBox.appendChild(createShimmerCard());
}

/* ---------------------------------------------------------
   Results Renderer
---------------------------------------------------------- */
function renderResults(matches) {
  resultsBox.innerHTML = "";

  if (!matches || matches.length === 0) {
    resultsBox.innerHTML = `<div class="card">No matches found.</div>`;
    return;
  }

  matches.forEach(item => {
    const div = document.createElement("div");
    div.className = "card";
    div.textContent = item.name;
    div.onclick = () =>
      window.location.href = "https://form.jotform.com/253242615800045";

    resultsBox.appendChild(div);
  });
}

/* ---------------------------------------------------------
   Autosuggest triggers
---------------------------------------------------------- */
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();
  if (lastClickSearch) {
    // User typed AFTER clicking search — reset results
    resultsBox.innerHTML = "";
    lastClickSearch = false;
  }

  const suggestions = strictSuggest(query);
  renderAutosuggest(suggestions, query);
});

/* Hide autosuggest when clicking outside */
document.addEventListener("click", (e) => {
  if (!suggestBox.contains(e.target) && e.target !== searchInput) {
    suggestBox.style.display = "none";
  }
});
