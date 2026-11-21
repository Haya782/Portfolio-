// Project a ribbed 3D loop into a high-resolution, offline canvas illustration.
function drawSculpture(canvas) {
  const ctx = canvas.getContext('2d');
  const size = canvas.getBoundingClientRect();
  if (!size.width || !size.height) return;
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(size.width * ratio);
  canvas.height = Math.round(size.height * ratio);
  ctx.scale(ratio, ratio);
  const type = canvas.dataset.art;
  const scale = Math.min(size.width, size.height) * .205;
  const faces = [];
  const tau = Math.PI * 2;
  const center = t => type === 'studio'
    ? [1.36*Math.cos(t), .83*Math.sin(t), .62*Math.sin(3*t)]
    : [(1+.34*Math.cos(3*t))*Math.cos(2*t), (1+.34*Math.cos(3*t))*Math.sin(2*t), .82*Math.sin(3*t)];
  function vertex(i,j) {
    const t = i*tau/180, v = j*tau/28, c = center(t), d = center(t+.001);
    const dx=d[0]-c[0], dy=d[1]-c[1], dz=d[2]-c[2];
    const xy=Math.hypot(dx,dy), len=Math.hypot(xy,dz);
    const r=type==='studio'?.47:.36;
    const x=c[0]+r*(-dy/xy*Math.cos(v)-dx*dz/(xy*len)*Math.sin(v));
    const y=c[1]+r*(dx/xy*Math.cos(v)-dy*dz/(xy*len)*Math.sin(v));
    const z=c[2]+r*xy/len*Math.sin(v);
    return [x*.93-y*.36,(x*.36+y*.93)*.86-z*.5,(x*.36+y*.93)*.5+z*.86];
  }
  const mesh=Array.from({length:181},(_,i)=>Array.from({length:29},(_,j)=>vertex(i,j)));
  for(let i=0;i<180;i++)for(let j=0;j<28;j++){
    const p=[mesh[i][j],mesh[i+1][j],mesh[i+1][j+1],mesh[i][j+1]];
    const a=p[0],b=p[1],c=p[3],u=b.map((x,k)=>x-a[k]),v=c.map((x,k)=>x-a[k]);
    const n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
    const light=n.reduce((s,x,k)=>s+x*[-.45,-.65,.6][k],0)/Math.hypot(...n);
    const hue=type==='portfolio'?324+i/10:222+i/7;
    faces.push({p,z:p.reduce((s,x)=>s+x[2]/4,0),color:'hsl('+hue+' 62% '+(50+27*light+(i%3===0?-7:1))+'%)'});
  }
  const shadow=ctx.createRadialGradient(0,0,0,0,0,1);
  shadow.addColorStop(0,'#46406d44');shadow.addColorStop(1,'#46406d00');
  ctx.save();ctx.translate(size.width/2,size.height*.85);ctx.scale(scale*1.6,scale*.18);ctx.fillStyle=shadow;ctx.fillRect(-1,-1,2,2);ctx.restore();
  for(const f of faces.sort((a,b)=>a.z-b.z)){
    ctx.beginPath();f.p.forEach(([x,y],i)=>ctx[i?'lineTo':'moveTo'](size.width/2+x*scale*1.15,size.height*.46+y*scale*1.15));
    ctx.closePath();ctx.lineWidth=.55;ctx.strokeStyle=ctx.fillStyle=f.color;ctx.fill();ctx.stroke();
  }
}
document.querySelectorAll('[data-art]').forEach(canvas=>new ResizeObserver(()=>drawSculpture(canvas)).observe(canvas));
