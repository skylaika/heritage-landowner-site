/* ---------------------------------------------------------
   Advanced Genealogy Search System
   - Multi-word smart search
   - Tokenized fuzzy matching
   - Weighted scoring
   - Substring & starts-with priority
   - Fuzzy threshold (max dist = 2)
---------------------------------------------------------- */

let names = [];

fetch("data/names.json")
  .then((r) => r.json())
  .then((d) => (names = d));

/* --------- Levenshtein Distance (Fuzzy) --------- */
function levenshtein(a, b) {
  if (!a) return b.length;
  if (!b) return a.length;

  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
    if (i === 0) continue;

    for (let j = 1; j <= a.length; j++) {
      matrix[0][j] = j;

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + (b.charAt(i - 1) === a.charAt(j - 1) ? 0 : 1) // substitution
      );
    }
  }

  return matrix[b.length][a.length];
}

/* --------- Token-based match scoring --------- */
function scoreName(query, fullname) {
  const q = query.toLowerCase().trim();
  const name = fullname.toLowerCase().trim();

  let totalScore = 999; // worst (large number = bad)
  let matched = false;

  // Exact match
  if (name === q) {
    return { matched: true, score: 0 };
  }

  // Tokenize
  const qTokens = q.split(/\s+/);
  const nTokens = name.split(/\s+/);

  let score = 0;

  for (let qt of qTokens) {
    let bestTokenScore = 999;
    for (let nt of nTokens) {
      // starts-with match (strong)
      if (nt.startsWith(qt)) {
        bestTokenScore = Math.min(bestTokenScore, 1);
      }

      // substring match
      if (nt.includes(qt)) {
        bestTokenScore = Math.min(bestTokenScore, 2);
      }

      // fuzzy match (levenshtein)
      const dist = levenshtein(qt, nt);
      if (dist <= 2) {
        bestTokenScore = Math.min(bestTokenScore, 3 + dist);
      }
    }

    if (bestTokenScore < 999) {
      matched = true;
    }

    score += bestTokenScore;
  }

  return { matched, score };
}

/* --------- Main Search --------- */
function search() {
  const q = document.getElementById("searchBox").value.trim().toLowerCase();
  const res = document.getElementById("results");
  res.innerHTML = "";

  if (q.length < 2) return; // don't show results too early

  const results = [];

  for (let name of names) {
    const s = scoreName(q, name);
    if (s.matched && s.score < 10) {
      // threshold keeps results clean
      results.push({ name, score: s.score });
    }
  }

  // Sort by weighted score
  results.sort((a, b) => a.score - b.score);

  const top = results.slice(0, 10);

  for (let item of top) {
    const div = document.createElement("div");
    div.className = "card";
    div.textContent = item.name;

    div.onclick = () => {
      const base = "https://form.jotform.com/253242615800045";
      const url =
        base +
        "?matchedName=" +
        encodeURIComponent(item.name) +
        "&relevantAncestor=" +
        encodeURIComponent(item.name);

      window.location.href = url;
    };

    res.appendChild(div);
  }
}

/* --------- Event Listeners --------- */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("searchBox").addEventListener("input", search);

  // FAQ Accordion
  document.querySelectorAll(".faq-item button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const ans = btn.nextElementSibling;
      ans.style.display = ans.style.display === "block" ? "none" : "block";
    });
  });
});
