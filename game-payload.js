window.__TG3D_GZIP_READY = fetch('./game-payload-v7.txt?v=flip-collision-v7').then(response=>{
  if(!response.ok) throw new Error(`Payload returned ${response.status}`);
  return response.text();
}).then(text=>{
  const newline=text.indexOf('\n');
  if(text.slice(0,newline)!=='TG3D-B64-v7') throw new Error('Invalid game payload');
  return text.slice(newline+1).trim();
});
