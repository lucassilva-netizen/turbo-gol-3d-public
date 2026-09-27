const payloadPartIds=["00","01","02a","02b","02c","02d","03","04a","04b","04c","04d","05a","05b","05c","05d","06a","06b","06c","06d","07"];
window.__TG3D_GZIP_READY = Promise.all(payloadPartIds.map(id=>{
  return fetch(`./game-payload-${id}.txt?v=second-jump-strength-v6c`).then(response=>{
    if(!response.ok) throw new Error(`Payload part ${id} returned ${response.status}`);
    return response.text();
  }).then(text=>{
    const newline=text.indexOf('\n'), marker=text.slice(0,newline);
    if(marker!==`TG3D-B64-${id}`) throw new Error(`Invalid payload part ${id}`);
    return text.slice(newline+1).trim();
  });
})).then(parts=>parts.join(''));
