let debounceTimer;
document.getElementById('searchBox').addEventListener('input', function() {
  clearTimeout(debounceTimer);
  const query = this.value.trim();
  document.getElementById('loading').style.display = 'block';
  debounceTimer = setTimeout(() => {
    document.getElementById('loading').style.display = 'none';
    runSearch(query);
  }, 250);
});

async function runSearch(q){
  const results = document.getElementById('results');
  results.innerHTML = "";
  if(!q){ results.innerHTML = ""; return; }

  const matches = await window.searchNames(q);
  if(matches.length===0){
    results.innerHTML = "<div class='card'>No matches found.</div>";
    return;
  }

  matches.forEach(name => {
    const div = document.createElement('div');
    div.className = 'card';
    div.textContent = name;
    div.onclick = ()=> {
      const url = `https://form.jotform.com/253242615800045?matchedName=${encodeURIComponent(name)}&relevantAncestor=${encodeURIComponent(name)}`;
      window.location.href = url;
    };
    results.appendChild(div);
  });
}
