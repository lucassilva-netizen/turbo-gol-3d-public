window.__TG3D_GZIP_READY = Promise.all(Array.from({length:8},(_,i)=>{
  const id=String(i).padStart(2,'0');
  return fetch(`./game-payload-${id}.txt?v=second-jump-impulse-v4`).then(response=>{
    if(!response.ok) throw new Error(`Payload part ${id} returned ${response.status}`);
    return response.text();
  }).then(text=>{
    const newline=text.indexOf('\n'), marker=text.slice(0,newline);
    if(marker!==`TG3D-B64-${id}`) throw new Error(`Invalid payload part ${id}`);
    return text.slice(newline+1).trim();
  });
})).then(parts=>parts.join(''));
