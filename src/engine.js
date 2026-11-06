'use strict';
/* =====================================================================
   CRAZY CHEMISTRY — simulation engine
   ===================================================================== */
const type=new Uint8Array(N),aux=new Uint8Array(N),life=new Uint8Array(N),stamp=new Uint8Array(N),vr=new Uint8Array(N);
const T=new Float32Array(N).fill(20);
const KNOWN=new Uint8Array(NE);
for(const e of ELS)if(e.base||e.hide||e.id===0)KNOWN[e.id]=1;
let cur=1,frame=0,hood=true,thermal=false,paused=false,stepOnce=false,speed=1,speedAcc=0;
const rnd=Math.random;
let noteFn=()=>{},onFound=()=>{},onBoom=()=>{},onGrown=()=>{};
const note=(k,t)=>noteFn(k,t);
function found(id){if(id>0&&!KNOWN[id]){KNOWN[id]=1;onFound(id)}}

function setCell(i,t,a){type[i]=t;aux[i]=a|0;vr[i]=(rnd()*8)|0;const l=LIFE[t];life[i]=l?l+((rnd()*l*.5)|0):0;stamp[i]=cur}
function made(i,t,a){setCell(i,t,a);if(t===MOLTEN)found(a);else if(t>0)found(t)}
function swap(i,j){let v=type[i];type[i]=type[j];type[j]=v;v=aux[i];aux[i]=aux[j];aux[j]=v;v=life[i];life[i]=life[j];life[j]=v;v=vr[i];vr[i]=vr[j];vr[j]=v;
  const t=T[i];T[i]=T[j];T[j]=t;stamp[i]=stamp[j]=cur}
const dn=k=>{const t=type[k];return t===MOLTEN?DENS[aux[k]]*.9:DENS[t]};
function rn(i,x,y){const dx=(rnd()*3|0)-1,dy=(rnd()*3|0)-1;const nx=x+dx,ny=y+dy;if((dx|dy)===0||nx<0||nx>=W||ny<0||ny>=H)return -1;return ny*W+nx}
function spawnFire(i,x,y,tint){
  for(let k=0;k<4;k++){const j=rn(i,x,y);if(j>=0&&type[j]===0){setCell(j,FIRE,tint);life[j]=16+((rnd()*26)|0);T[j]=(ELS[tint].flameT||950);return true}}
  return false;
}
function spawnGas(i,x,y,id){
  for(let k=0;k<6;k++){const j=rn(i,x,y);if(j>=0&&(type[j]===0||(k>2&&ELS[type[j]].beh===LIQUID))){made(j,id);T[j]=Math.max(T[i],20);return true}}
  return false;
}
const DIRS8=[[0,-1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[1,1],[-1,1]];
const BLOOM=ID.bloom,WOODID=ID.wood;
function bloomAt(i,x,y,sp){
  const bc=SPB[sp];if(!bc)return;
  for(let n=0;n<2;n++){
    for(let k=0;k<5;k++){
      const d=DIRS8[(rnd()*8)|0],nx=x+d[0],ny=y+(d[1]>0?-1:d[1]);if(nx<0||nx>=W||ny<0||ny>=H)continue;
      const q=ny*W+nx;if(type[q]===0){setCell(q,BLOOM,sp);T[q]=20;break}
    }
  }
}
function tryGrowFrom(i,x,y,sp){
  const f=SPF[sp],b=life[i];
  if(b===0){if(rnd()<.05)bloomAt(i,x,y,sp);return false}
  let dx=0,dy=-1,t=PLANT;
  const bud=BUD[sp];
  switch(f){
    case 'T':
      if(b>bud*.42){t=WOODID;dx=rnd()<.2?(rnd()<.5?-1:1):0;dy=-1}
      else{const d=DIRS8[(rnd()*8)|0];dx=d[0];dy=d[1]}
      break;
    case 'C':                       /* conifer: straight trunk, then a tall narrow crown */
      if(b>bud*.78){t=WOODID;dx=0;dy=-1}
      else{const r=rnd();dy=r<.5?-1:(r<.8?0:-1);dx=rnd()<.55?(rnd()<.5?-1:1):0}
      break;
    case 'M':                       /* palm: bare trunk, fronds arch out at the top */
      if(b>bud*.2){t=WOODID;dx=rnd()<.06?(rnd()<.5?-1:1):0;dy=-1}
      else{const a=[[-1,-1],[1,-1],[-1,0],[1,0],[0,-1],[-2,0],[2,0]][(rnd()*7)|0];dx=a[0];dy=a[1]}
      break;
    case 'K':{                      /* cactus: fat green column, an arm now and then */
      const r=rnd();
      if(r<.3){dx=rnd()<.5?-1:1;dy=0}else{dx=0;dy=-1}
      break}
    case 'R':{                      /* rosette or ball: stays low and wide */
      const r=rnd();dx=r<.4?-1:(r<.8?1:0);dy=rnd()<.35?-1:0;
      if(!dx&&!dy)dy=-1;
      break}
    case 'F':case 'E':dx=rnd()<.1?(rnd()<.5?-1:1):0;dy=-1;break;
    case 'G':{const r=rnd();dx=r<.4?-1:(r<.8?1:0);dy=rnd()<.5?-1:0;break}
    case 'S':case 'P':{const d=DIRS8[(rnd()*8)|0];dx=d[0];dy=d[1]>0?0:d[1];break}
    case 'V':{const r=rnd();dx=r<.4?-1:(r<.8?1:0);dy=rnd()<.55?0:(rnd()<.5?-1:1);break}
  }
  if(!dx&&!dy)return false;
  const nx=x+dx,ny=y+dy;if(nx<0||nx>=W||ny<0||ny>=H)return false;
  const k=ny*W+nx;if(type[k]!==0)return false;
  setCell(k,t,sp);T[k]=20;life[k]=b-1;life[i]=b-1;
  if(f==='K'&&dy===-1){const sx=nx+(rnd()<.5?-1:1);if(sx>=0&&sx<W){const k2=ny*W+sx;if(type[k2]===0){setCell(k2,PLANT,sp);T[k2]=20;life[k2]=b-1}}}
  if(b-1<=((BUD[sp]*.35)|0)){if(sp&&!GROWN[sp]){GROWN[sp]=1;onGrown(sp)}if(rnd()<.5)bloomAt(k,nx,ny,sp)}
  return true;
}
function growPlant(i,x,y,w){
  if(w>=0){const tw=type[w];if(tw===ID.water){if(rnd()<.35)setCell(w,0)}else if(tw===ID.mud&&rnd()<.04)setCell(w,ID.dirt)}
  const sp=aux[i];if(!sp&&type[i]!==PLANT)return;
  /* water travels up the stem: walk through the same plant until a cell can grow */
  let ci=i,cx=x,cy=y;
  for(let h=0;h<60;h++){
    if(tryGrowFrom(ci,cx,cy,sp))return;
    /* step to a neighbouring cell of this plant, preferring up */
    let moved=false;
    for(let a=0;a<4&&!moved;a++){
      const up=a===0||rnd()<.35;
      const d=up?[(rnd()*3|0)-1,-1]:DIRS8[(rnd()*8)|0];
      const nx=cx+d[0],ny=cy+d[1];if(nx<0||nx>=W||ny<0||ny>=H)continue;
      const q=ny*W+nx,tq=type[q];
      if((tq===PLANT||tq===WOODID)&&aux[q]===sp){ci=q;cx=nx;cy=ny;moved=true}
    }
    if(!moved)return;
  }
}

/* explosions */
function boom(cx,cy,r){
  const r2=r*r;
  for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){
    const d2=dx*dx+dy*dy;if(d2>r2)continue;
    const x=cx+dx,y=cy+dy;if(x<0||x>=W||y<0||y>=H)continue;
    const k=y*W+x,tt=type[k];if(tt===BENCH||ELS[tt].fixedT!==undefined)continue;
    const d=Math.sqrt(d2)/r,e=ELS[tt];
    if(e.beh===STATIC){
      if(tt===GLASS&&rnd()<(1-d)*.9&&r>=3){setCell(k,ID.sand);T[k]+=300}else T[k]+=600*(1-d);
      continue;
    }
    if(d<.55&&rnd()<.85){setCell(k,FIRE,0);life[k]=10+((rnd()*18)|0);T[k]=1500}
    else if(rnd()<.55){setCell(k,rnd()<.3?ID.smoke:0);T[k]=Math.max(T[k],300*(1-d))}
    else T[k]+=500*(1-d);
  }
  onBoom(r);
  note('boom','BOOM  radius '+r);
}
function lightning(cx,cy){
  let x=cx+((rnd()*16)|0)-8;
  for(let y=0;y<=cy;y++){
    x+=((rnd()*3)|0)-1;x+= (cx-x)>0?(rnd()<.25?1:0):(rnd()<.25?-1:0);
    if(x<0||x>=W)continue;
    for(let q=-1;q<=0;q++){const xx=x+q;if(xx<0||xx>=W)continue;const k=y*W+xx;if(type[k]===BENCH)continue;setCell(k,SPARK,0);life[k]=5;T[k]=3000}
  }
  boom(Math.max(0,Math.min(W-1,x)),cy,3);
  note('bolt','LIGHTNING STRIKE');
}

/* ---------------- per-cell update ---------------- */
function transform(i,to,a){const t=T[i];made(i,to,a);T[i]=t}
function phaseUp(i,e){
  const h=e.hot;
  if(h.toId===MOLTEN){transform(i,MOLTEN,h.srcId);note('m'+e.id,e.name.toUpperCase()+' melts at '+h.t+' C');return}
  let to=h.toId;if(h.alt&&rnd()<h.alt.p)to=h.alt.toId;
  transform(i,to);if(h.latent)T[i]-=h.latent;
  if(h.eq)note('p'+e.id,h.eq.toUpperCase());
}
function kick(x,y,amt,n){
  for(let q=0;q<n;q++){const j=rn(0,x,y);if(j<0||type[j]===0)continue;const ne=ELS[type[j]];if(ne.fixedT!==undefined)continue;
    T[j]+=amt;if(ne.burn&&ne.burn.T<1500&&rnd()<.9&&T[j]<ne.burn.T+30)T[j]=ne.burn.T+30}
}
function tryBurn(i,x,y,e){
  const b=e.burn;
  if(b.dry){
    if(x>0&&ELS[type[i-1]].beh===LIQUID)return false;
    if(x<W-1&&ELS[type[i+1]].beh===LIQUID)return false;
    if(y>0&&ELS[type[i-W]].beh===LIQUID)return false;
    if(y<H-1&&ELS[type[i+W]].beh===LIQUID)return false;
  }
  let p=b.p;
  const j=rn(i,x,y);
  if(j>=0&&type[j]===OXY){p=Math.min(1,p*4);if(rnd()<.4)setCell(j,0)}
  if(rnd()>p)return false;
  if(b.moltenId!==undefined){made(i,MOLTEN,b.moltenId);T[i]=b.heat}
  else{made(i,b.toId);T[i]=Math.max(T[i],0)+b.heat}
  if(b.heat>=300)kick(x,y,b.heat*.45,5);
  if(b.flame&&rnd()<.75)spawnFire(i,x,y,e.id);
  if(b.smoke&&rnd()<b.smoke){const k=rn(i,x,y);if(k>=0&&type[k]===0)setCell(k,ID.smoke)}
  if(b.boom&&rnd()<b.boom[0])boom(x,y,b.boom[1]);
  if(b.eq)note('b'+e.id,b.eq.toUpperCase());
  return true;
}
function applyCode(i,c){
  if(c===-1)return;
  const tt=T[i];
  if(c<=-2)made(i,MOLTEN,-c-2);else made(i,c);
  T[i]=tt;
}
function react(i,x,y,t){
  const j=rn(i,x,y);if(j<0)return;
  const tj=type[j];
  if(t===MOLTEN&&tj===MOLTEN&&aux[i]!==aux[j]){
    const al=ALLOY[aux[i]*NE+aux[j]];
    if(al&&rnd()<.25){aux[i]=aux[j]=al;found(al);note('al'+al,('Alloy: '+ELS[al].name).toUpperCase());return}
  }
  const r=RX[t*NE+tj];if(!r)return;
  if(rnd()>r.p)return;
  if(r.minT!==undefined&&T[i]<r.minT&&T[j]<r.minT)return;
  if(r.when&&!r.when(i,j))return;
  const ai=aux[i],aj=aux[j];
  applyCode(i,r.a);applyCode(j,r.b);
  if(type[i]===PLANT&&t===ID.seed){aux[i]=ai;life[i]=BUD[ai]||20;found(PLANT)}
  else if(type[j]===PLANT&&tj===ID.seed){aux[j]=aj;life[j]=BUD[aj]||20;found(PLANT)}
  if(r.heat){T[i]+=r.heat;T[j]+=r.heat;if(r.heat>=300)kick(x,y,r.heat*.4,5)}
  if(r.flame>=0&&rnd()<.6)spawnFire(i,x,y,r.flame);
  if(r.emit>=0&&rnd()<.6)spawnGas(i,x,y,r.emit);
  if(r.grow)growPlant(i,x,y,j);
  if(r.boom&&rnd()<r.boom[0])boom(x,y,r.boom[1]);
  if(r.eq)note(r.id,r.eq.toUpperCase());
}
function canFall(dm,j){
  const tj=type[j];if(tj===0)return true;
  const b=ELS[tj].beh;
  if(b===GAS||b===FIREB)return true;
  if(b===LIQUID)return dm>dn(j)&&rnd()<.6;
  return false;
}
function energise(x,y){
  /* hand the pulse to adjacent conductors that are ready */
  if(x>0)pulse(y*W+x-1);if(x<W-1)pulse(y*W+x+1);if(y>0)pulse((y-1)*W+x);if(y<H-1)pulse((y+1)*W+x);
}
function pulse(k){
  const tk=type[k];
  if(tk!==SPARK&&ELS[tk].conduct&&life[k]===0){setCell(k,SPARK,tk);life[k]=2;T[k]=Math.max(T[k],60)}
}
function updateCell(i,x,y,t){
  const e=ELS[t];
  if(t===SPARK){
    const c=aux[i];
    if(--life[i]<=0||life[i]>200){if(c){const tt=T[i];setCell(i,c);life[i]=6;T[i]=Math.min(tt,120)}else setCell(i,0);return}
    if(c){energise(x,y);T[i]=Math.max(T[i],120)}
    else{T[i]=1100;energise(x,y)}
    const j=rn(i,x,y);
    if(j>=0){const nt=type[j],ne=ELS[nt];if(ne.burn&&rnd()<.35&&T[j]<ne.burn.T+40)T[j]=ne.burn.T+40;
      if(!c&&nt===0&&rnd()<.5)swap(i,j)}
    if(c===0&&y<H-1&&rnd()<.3){}
    return;
  }
  if(e.fixedT!==undefined){
    T[i]=e.fixedT;
    if(e.flameOut&&y>0&&type[i-W]===0&&rnd()<.3){const j=i-W;setCell(j,FIRE,t);life[j]=14+((rnd()*14)|0);T[j]=1300}
    return;
  }
  if(e.emit){if((frame%e.emit)===0)energise(x,y);return}
  if(e.conduct&&life[i]>0)life[i]--;
  const Ti=T[i];
  if(t===MOLTEN){
    const src=aux[i],se=ELS[src];
    if(Ti<se.hot.t-40){const to=se.frozenId!==undefined?se.frozenId:src;transform(i,to);note('f'+src,(moltenName(src)+' solidifies').toUpperCase());return}
  }else{
    if(e.hot&&Ti>e.hot.t&&(e.hot.p===undefined||rnd()<e.hot.p)){phaseUp(i,e);return}
    if(e.cold&&Ti<e.cold.t&&(e.cold.p===undefined||rnd()<e.cold.p)){transform(i,e.cold.toId);return}
  }
  if(e.burn&&Ti>=e.burn.T&&tryBurn(i,x,y,e))return;
  if(e.rx)react(i,x,y,t);
  if(stamp[i]===cur)return;
  switch(e.beh){
    case POWDER:{
      if(y>=H-1)return;
      const dm=e.dens;
      let j=i+W;if(canFall(dm,j)){swap(i,j);return}
      const d=rnd()<.5?-1:1;
      if(x+d>=0&&x+d<W){j=i+W+d;if(canFall(dm,j)){swap(i,j);return}}
      if(x-d>=0&&x-d<W){j=i+W-d;if(canFall(dm,j)){swap(i,j);return}}
      return;
    }
    case LIQUID:{
      if(e.flow<1&&rnd()>e.flow)return;
      const dm=t===MOLTEN?DENS[aux[i]]*.9:e.dens;
      if(y>0&&t!==MOLTEN){const k=i-W;if(type[k]===t&&Ti-T[k]>6&&rnd()<.25){swap(i,k);return}}
      if(y<H-1){
        let j=i+W,tj=type[j];
        if(tj===0||ELS[tj].beh===GAS||ELS[tj].beh===FIREB||(ELS[tj].beh===LIQUID&&dm>dn(j)*1.02&&rnd()<.5)){swap(i,j);return}
        const d=rnd()<.5?-1:1;
        if(x+d>=0&&x+d<W){j=i+W+d;tj=type[j];if(tj===0||ELS[tj].beh===GAS||ELS[tj].beh===FIREB||(ELS[tj].beh===LIQUID&&dm>dn(j)*1.02&&rnd()<.4)){swap(i,j);return}}
        if(x-d>=0&&x-d<W){j=i+W-d;tj=type[j];if(tj===0||ELS[tj].beh===GAS||ELS[tj].beh===FIREB||(ELS[tj].beh===LIQUID&&dm>dn(j)*1.02&&rnd()<.4)){swap(i,j);return}}
      }
      const dir=rnd()<.5?-1:1;let pos=i;
      for(let s=1;s<=e.spread;s++){
        const nx=x+dir*s;if(nx<0||nx>=W)break;
        const jj=y*W+nx,tj=type[jj];
        if(tj===0||ELS[tj].beh===GAS)pos=jj;else break;
      }
      if(pos!==i)swap(i,pos);
      return;
    }
    case GAS:{
      if(y===0&&hood&&rnd()<.25){setCell(i,0);return}
      if(e.lifeBase){if(life[i]<=1){setCell(i,0);return}life[i]--}
      const s=(AIR-e.dens)/AIR;
      const pv=Math.min(.9,Math.abs(s)*.8+.04);
      let dy=0;if(rnd()<pv)dy=s>0?-1:1;else if(rnd()<.35)dy=(rnd()*3|0)-1;
      const dx=(rnd()*3|0)-1;
      if(!dx&&!dy)return;
      const nx=x+dx,ny=y+dy;if(nx<0||nx>=W||ny<0||ny>=H)return;
      const j=ny*W+nx,tj=type[j];
      if(tj===0){swap(i,j);return}
      const tb=ELS[tj].beh;
      if(tb===GAS){if(dy<0?e.dens<ELS[tj].dens:dy>0?e.dens>ELS[tj].dens:rnd()<.3)swap(i,j)}
      else if(tb===LIQUID&&dy<0&&s>0&&rnd()<.5)swap(i,j);
      return;
    }
    case FIREB:{
      if(--life[i]<=0||life[i]>200){setCell(i,rnd()<.2?ID.smoke:0);return}
      const fe=ELS[aux[i]];
      T[i]=fe.flameT||950;
      const j0=rn(i,x,y);
      if(j0>=0){const ex=ELS[type[j0]].ext;if(ex&&rnd()<ex){setCell(i,0);return}}
      const dy=rnd()<.7?-1:0,dx=(rnd()*3|0)-1;
      const nx=x+dx,ny=y+dy;if(nx<0||nx>=W||ny<0||ny>=H)return;
      const j=ny*W+nx;if(type[j]===0)swap(i,j);
      return;
    }
  }
}
function step(){
  cur++;if(cur>250){cur=1;stamp.fill(0)}
  frame++;
  const ltr=frame&1;
  for(let y=H-1;y>=0;y--){
    const row=y*W;
    for(let xx=0;xx<W;xx++){
      const x=ltr?xx:W-1-xx,i=row+x,t=type[i];
      if(t===0||stamp[i]===cur)continue;
      updateCell(i,x,y,t);
    }
  }
  heatStep();
}
function heatStep(){
  for(let y=0;y<H;y++){
    const row=y*W;
    for(let x=0;x<W;x++){
      const i=row+x,ti=type[i];
      let Ti=T[i];
      Ti+=(20-Ti)*AMB[ti];
      if(x<W-1){const j=i+1,tj=type[j],a=COND[ti],b=COND[tj],k=(a<b?a:b)*.3,d=Ti-T[j];if(d>.4||d<-.4){const q=k*d;Ti-=q/CAP[ti];T[j]+=q/CAP[tj]}}
      if(y<H-1){const j=i+W,tj=type[j],a=COND[ti],b=COND[tj],k=(a<b?a:b)*.3,d=Ti-T[j];if(d>.4||d<-.4){const q=k*d;Ti-=q/CAP[ti];T[j]+=q/CAP[tj]}}
      T[i]=Ti<-273?-273:Ti>5000?5000:Ti;
    }
  }
}

/* ---------------- rendering ---------------- */
let ctx,gctx,cv,gl,img,px;
const pack=(r,g,b)=>(255<<24)|((b&255)<<16)|((g&255)<<8)|(r&255);
const BGc=[12,10,18];
const BG=pack(12,10,18),DOT=pack(30,26,44);
const PAL=new Uint32Array(NE*8);
for(const e of ELS){
  const a=e.alpha===undefined?1:e.alpha;
  for(let v=0;v<8;v++){
    const f=.9+.2*(v/7);
    const c=e.col.map((c,k)=>Math.max(0,Math.min(255,BGc[k]+(c*f-BGc[k])*a)));
    PAL[e.id*8+v]=pack(c[0],c[1],c[2]);
  }
}
let R=0,Gc=0,B=0;
function ramp(st,t){
  if(t<=st[0][0]){R=st[0][1];Gc=st[0][2];B=st[0][3];return}
  for(let k=1;k<st.length;k++){
    if(t<=st[k][0]){const a=st[k-1],b=st[k],f=(t-a[0])/(b[0]-a[0]);R=a[1]+(b[1]-a[1])*f;Gc=a[2]+(b[2]-a[2])*f;B=a[3]+(b[3]-a[3])*f;return}
  }
  const l=st[st.length-1];R=l[1];Gc=l[2];B=l[3];
}
const BB=[[480,90,10,5],[700,170,30,10],[950,240,90,15],[1300,255,170,50],[1800,255,225,150],[2600,255,250,235]];
const TH=[[-200,40,60,220],[-60,60,140,250],[0,80,220,240],[20,34,28,52],[60,130,50,170],[200,240,60,110],[500,255,140,40],[1000,255,225,90],[2000,255,255,235]];
function initRender(canvas,glow){
  cv=canvas;gl=glow;ctx=cv.getContext('2d',{alpha:false});gctx=gl.getContext('2d');
  img=ctx.createImageData(W,H);px=new Uint32Array(img.data.buffer);
}
function render(){
  let cnt=0;
  for(let y=0;y<H;y++){
    const row=y*W;
    for(let x=0;x<W;x++){
      const i=row+x,t=type[i],Ti=T[i];
      let c;
      if(thermal){
        ramp(TH,Ti);if(t!==0){R=R*.75+55;Gc=Gc*.75+55;B=B*.75+55}
        c=pack(R,Gc,B);if(t)cnt++;
      }else if(t===0){
        if(Ti>230){const f=Math.min(.45,(Ti-230)/1800);c=pack(12+f*230,10+f*90,18+f*20)}
        else c=(x%8===0&&y%8===0)?DOT:BG;
      }else{
        cnt++;
        if(t===FIRE){
          const fe=ELS[aux[i]],fc=fe.flame||ELS[FIRE].flame,lf=Math.min(1,life[i]/26);
          const fl=.55+rnd()*.45;
          c=pack(Math.min(255,fc[0]*fl*(.6+lf*.5)+lf*40),Math.min(255,fc[1]*fl*(.5+lf*.6)+lf*40),Math.min(255,fc[2]*fl*(.5+lf*.5)+lf*30));
        }else if(t===WOODID&&aux[i]>0){c=TRUNKPAL[aux[i]*8+vr[i]];
        }else if(t===PLANT){c=LEAFPAL[aux[i]*8+vr[i]];
        }else if(t===BLOOM){c=BLOOMPAL[aux[i]*8+vr[i]];
        }else if(t===SPARK){
          const f=.6+rnd()*.4;c=pack(160*f+60,255*f,255);
        }else if(t===MOLTEN){
          const se=ELS[aux[i]];ramp(BB,Ti);
          const f=Math.max(.5,Math.min(1,(Ti-se.hot.t+200)/600)),v=vr[i]/7*.12;
          c=pack((se.col[0]*(1-f)+R*f)*(1-v),(se.col[1]*(1-f)+Gc*f)*(1-v),(se.col[2]*(1-f)+B*f)*(1-v));
        }else{
          c=PAL[t*8+vr[i]];
          if(Ti>480&&ELS[t].beh!==GAS){
            const f=Math.min(1,(Ti-480)/800);ramp(BB,Ti);
            c=pack((c&255)*(1-f)+R*f,((c>>8)&255)*(1-f)+Gc*f,((c>>16)&255)*(1-f)+B*f);
          }
        }
      }
      px[i]=c;
    }
  }
  ctx.putImageData(img,0,0);
  gctx.drawImage(cv,0,0,W/2,H/2);
  return cnt;
}

/* ---------------- painting helpers ---------------- */
function circle(cx,cy,r,fn){
  const r2=r*r+r*.5;
  for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){
    if(dx*dx+dy*dy>r2)continue;
    const x=cx+dx,y=cy+dy;if(x<0||x>=W||y<0||y>=H)continue;
    fn(y*W+x,x,y);
  }
}
let brush=4;
function paintEl(cx,cy,id,ax){
  const e=ELS[id],pr=e.beh===STATIC?1:e.beh===GAS||e.beh===FIREB||e.beh===SPARKB?.3:.55;
  circle(cx,cy,brush,k=>{
    if(type[k]!==0||rnd()>pr)return;
    setCell(k,id,ax||0);T[k]=e.initT!==undefined?e.initT:20;
    if(id===ID.seed&&ax)life[k]=0;
    if(id===FIRE){life[k]=14+((rnd()*26)|0);T[k]=950}
    if(id===SPARK){life[k]=6;T[k]=1100}
  });
}
function paintTool(cx,cy,kind){
  circle(cx,cy,brush,k=>{
    if(kind==='erase'){setCell(k,0);T[k]=20}
    else if(kind==='heat')T[k]=Math.min(3500,T[k]+90);
    else if(kind==='cool')T[k]=Math.max(-200,T[k]-90);
  });
}
const glassPut=(x,y)=>{if(x<0||x>=W||y<0||y>=H)return;const k=y*W+x;if(type[k]===0){setCell(k,GLASS);T[k]=20}};
function beaker(cx,by,w,h){
  const x0=cx-(w>>1),x1=x0+w-1,top=by-h+1;
  for(let y=top;y<=by;y++){glassPut(x0,y);glassPut(x1,y)}
  for(let x=x0;x<=x1;x++){glassPut(x,by);glassPut(x,by-1)}
  glassPut(x0-1,top);glassPut(x1+1,top);
  return {x0:x0+1,x1:x1-1,y0:top,y1:by-2};
}
function tube(cx,by,w,h){
  const x0=cx-(w>>1),x1=x0+w-1,top=by-h+1;
  for(let y=top;y<=by-2;y++){glassPut(x0,y);glassPut(x1,y)}
  for(let x=x0+1;x<=x1-1;x++)glassPut(x,by-1);
  for(let x=x0+2;x<=x1-2;x++)glassPut(x,by);
  glassPut(x0,by-1);glassPut(x1,by-1);
  return {x0:x0+1,x1:x1-1,y0:top,y1:by-2};
}
function flask(cx,by,w,h){
  const neck=6,nh=Math.round(h*.35),top=by-h+1;
  for(let y=top;y<=by;y++){
    let hw;
    if(y<top+nh)hw=neck/2;else hw=neck/2+(y-top-nh)/(h-nh)*(w/2-neck/2);
    glassPut(Math.round(cx-hw),y);glassPut(Math.round(cx+hw),y);
    glassPut(Math.round(cx-hw)+1,y);glassPut(Math.round(cx+hw)-1,y);
  }
  for(let x=cx-(w>>1);x<=cx+(w>>1);x++){glassPut(x,by);glassPut(x,by-1)}
  glassPut(cx-4,top);glassPut(cx+4,top);
}
function fillRect(x0,y0,x1,y1,key,pr,tmp){
  const id=ID[key],e=ELS[id];
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
    if(x<0||x>=W||y<0||y>=H)continue;
    const k=y*W+x;if(type[k]!==0)continue;
    if(pr!==undefined&&rnd()>pr)continue;
    setCell(k,id);T[k]=tmp!==undefined?tmp:(e.initT!==undefined?e.initT:20);
  }
}
function clearAll(){type.fill(0);aux.fill(0);life.fill(0);stamp.fill(0);T.fill(20);cur=1}
