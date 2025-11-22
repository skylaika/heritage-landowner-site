/* ---------------------------------------------------------
   Fuzzy Search Engine for Heritage Claims
   Uses Levenshtein distance for ranked fuzzy matching
---------------------------------------------------------- */

// Levenshtein distance for fuzzy scoring
function levenshtein(a, b) {
  const matrix = [];

  const al = a.length;
  const bl = b.length;

  for (let i = 0; i <= al; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= bl; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      if (a.charAt(i - 1) === b.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[al][bl];
}

window.searchNames = function (query, NAME_LIST) {
  if (!query || NAME_LIST.length === 0) return [];

  const normalized = query.toLowerCase();

  const matches = NAME_LIST
    .map((item) => {
      const name = item.name.toLowerCase();
      const score = levenshtein(normalized, name);

      return { name: item.name, score };
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, 8);

  return matches;
};
