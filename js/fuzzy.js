window.searchNames = async function(q){
  const res = await fetch('data/names.json');
  const list = await res.json(); // list of strings
  const lower = q.toLowerCase();
  return list.filter(n => n.toLowerCase().includes(lower)).slice(0, 50);
};
