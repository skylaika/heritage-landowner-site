/* ---------------------------------------------------------
   High-Precision Genealogy Search (Strict Mode)
   - Multi-word tokenized matching
   - Max fuzzy distance = 1
   - Very strict thresholds
   - "No matches found" support
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
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + (b[j - 1] === a[j - 1] ? 0 : 1)
      );
    }
  }

  return matrix[b.length][a.length];
}

/* --------- Strict scoring system --------- */
function scoreName(query, fullname) {
  const q = query.toLowerCase().trim();
  const name = fullname.toLowerCase().trim();

  // Full exact match
  if (name === q) {
    return { matched: true, score: 0 };
  }

  // Tokenize both sides
  const qTokens = q.split(/\s+/);
  const nTokens = name.split(/\s+/);

  let score = 0;
  let matchedAny = false;

  for (let qt of qTokens) {
    let bestTokenScore = 999;

    for (let nt of nTokens) {
      // Very strong start-with match
      if (nt.startsWith(qt)) {
        bestTokenScore = Math.min(bestTokenScore, 1);
      }

      // Substring match
      if (nt.includes(qt)) {
        bestTokenScore = Math.min(bestTokenScore, 2);
      }

      // Very strict fuzzy match (max distance = 1)
      const dist = levenshtein(qt, nt);
      if (dist <= 1) {
        bestTokenScore = Math.min(bestTokenScore, 3 + dist);
      }
    }

    // Must match at least one token strongly
    if (bestTokenScore < 999) {
      matchedAny = true;
    }

    score += bestTokenScore;
  }

  return { matched: matchedAny, score };
}

/* --------- Main Search --------- */
function search() {
  const q = document.getElementById("searchBox").value.trim().toLowerCase();
  const res = document.getElementById("results");
  res.innerHTML = "";

  if (q.length < 2) return;

  const results = [];

  for (let name of names) {
    const s = scoreName(q, name);

    // Very strict cutoff
    if (s.matched && s.score <= 6) {
      results.push({ name, score: s.score });
    }
  }

  // Sort results by strict quality score
  results.sort((a, b) => a.score - b.score);

  const top = results.slice(0, 10);

  if (top.length === 0) {
    const none = document.createElement("div");
    none.className = "card";
    none.textContent = "No matches found. Try another spelling.";
    res.appendChild(none);
    return;
  }

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

/* --------- FAQ Accordion + Search Input Binding --------- */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("searchBox").addEventListener("input", search);

  document.querySelectorAll(".faq-item button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const ans = btn.nextElementSibling;
      ans.style.display = ans.style.display === "block" ? "none" : "block";
    });
  });
});
