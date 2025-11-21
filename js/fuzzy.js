
function levenshtein(a,b){
 if(!a) return b.length;
 if(!b) return a.length;
 let m=[];
 for(let i=0;i<=b.length;i++){ m[i]=[i]; if(i===0) continue;
   for(let j=1;j<=a.length;j++){
     m[0][j]=j;
     m[i][j]=Math.min(m[i-1][j]+1, m[i][j-1]+1, m[i-1][j-1] + (b.charAt(i-1)==a.charAt(j-1)?0:1));
   }
 }
 return m[b.length][a.length];
}
