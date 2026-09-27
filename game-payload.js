const payloadPartIds=["00","01","02","03","04","05","06","07","08"];
window.__TG3D_GZIP_READY = Promise.all(payloadPartIds.map(id=>{
  return fetch(`./game-payload-${id}.txt?v=flip-collision-v7`).then(response=>{
    if(!response.ok) throw new Error(`Payload part ${id} returned ${response.status}`);
    return response.text();
  }).then(text=>{
    const newline=text.indexOf('\n'), marker=text.slice(0,newline);
    if(marker!==`TG3D-B64-${id}`) throw new Error(`Invalid payload part ${id}`);
    return text.slice(newline+1).trim();
  });
})).then(parts=>parts.join(''));
