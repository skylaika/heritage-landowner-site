
let names=[];
fetch('data/names.json').then(r=>r.json()).then(d=>names=d);

document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('searchBox').addEventListener('input', search);
  document.querySelectorAll('.faq-item button').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const ans=btn.nextElementSibling;
      ans.style.display = ans.style.display==='block'?'none':'block';
    });
  });
});

function search(){
  let q=document.getElementById('searchBox').value.toLowerCase();
  let res=document.getElementById('results');
  res.innerHTML='';
  if(q.length<2) return;
  let scored = names.map(n=>({name:n, score:levenshtein(q, n.toLowerCase())}));
  scored.sort((a,b)=>a.score-b.score);
  scored.slice(0,10).forEach(item=>{
    let div=document.createElement('div');
    div.className='card';
    div.textContent=item.name;
    div.onclick=()=>{ window.location.href='https://form.jotform.com'; };
    res.appendChild(div);
  });
}
