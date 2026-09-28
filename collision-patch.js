const standardCollision = String.raw`    function collideStandardCarBall(car) {
      const h=car.hitbox, dx=ball.x-h.x, dz=ball.z-h.z;
      const fx=Math.cos(h.angle), fz=Math.sin(h.angle), rx=-fz, rz=fx;
      const halfLength=h.halfLength, halfWidth=h.halfWidth, bottom=h.bottom, top=h.top;
      const localX=dx*fx+dz*fz, localZ=dx*rx+dz*rz, localY=ball.y-h.y;
      const closestX=clamp(localX,-halfLength,halfLength), closestY=clamp(localY,bottom,top), closestZ=clamp(localZ,-halfWidth,halfWidth);
      let nxLocal=localX-closestX, ny=localY-closestY, nzLocal=localZ-closestZ;
      const distance=Math.hypot(nxLocal,ny,nzLocal);
      if(distance>ball.radius) return;
      if(ball.hitCooldown>0&&ball.lastHit===car.team) return;
      if(distance<1e-7) {
        const xGap=halfLength-Math.abs(localX), yGap=Math.min(localY-bottom,top-localY), zGap=halfWidth-Math.abs(localZ);
        if(xGap<=yGap&&xGap<=zGap) { nxLocal=localX>=0?1:-1; ny=0; nzLocal=0; }
        else if(yGap<=zGap) { nxLocal=0; ny=localY>=(bottom+top)/2?1:-1; nzLocal=0; }
        else { nxLocal=0; ny=0; nzLocal=localZ>=0?1:-1; }
      } else { nxLocal/=distance; ny/=distance; nzLocal/=distance; }
      let worldNx=fx*nxLocal+rx*nzLocal, worldNy=ny, worldNz=fz*nxLocal+rz*nzLocal;
      const horizontalNormal=Math.hypot(nxLocal,nzLocal);
      const sideContact=clamp((horizontalNormal-.15)/.85,0,1);
      const ballBottom=localY-ball.radius;
      const lowerContact=clamp(1-Math.max(0,ballBottom-bottom)/(ball.radius*.7),0,1);
      const liftFactor=sideContact*lowerContact;
      if(liftFactor>0) {
        // A low side impact behaves like a shallow bumper bevel; lift changes the contact normal, not the impulse magnitude.
        const liftNormalY=Math.sin(Math.PI/5*liftFactor), horizontal=Math.hypot(worldNx,worldNz);
        if(worldNy<liftNormalY&&horizontal>1e-8) {
          const scale=Math.sqrt(Math.max(0,1-liftNormalY*liftNormalY))/horizontal;
          worldNx*=scale; worldNz*=scale; worldNy=liftNormalY;
        }
      }
      const relativeNormal=((ball.vx-car.vx)*60)*worldNx+(ball.vy-car.vy)*worldNy+((ball.vz-car.vz)*60)*worldNz;
      if(relativeNormal>=-.02) return;
      const closingSpeed=-relativeNormal;
      const impulse=closingSpeed*.22;
      ball.vx+=worldNx*impulse/60; ball.vy+=worldNy*impulse; ball.vz+=worldNz*impulse/60;
      const bs=Math.hypot(ball.vx,ball.vz); if(bs>3.2){ball.vx=ball.vx/bs*3.2;ball.vz=ball.vz/bs*3.2;}
      car.vx-=worldNx*.14; car.vz-=worldNz*.14; car.hitFlash=.12; ball.lastHit=car.team; ball.hitCooldown=.06;
    }`;
window.__TG3D_PATCH_STANDARD_COLLISION=(html)=>{
  const pattern=/    function collideStandardCarBall\(car\) \{[\s\S]*?\n    \}/;
  const matches=html.match(/    function collideStandardCarBall\(car\) \{/g)||[];
  if(matches.length!==1) throw new Error('Não foi possível identificar unicamente a colisão padrão do carro com a bola.');
  return html.replace(pattern,standardCollision);
};
