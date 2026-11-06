'use strict';
/* =====================================================================
   CRAZY CHEMISTRY — interface, discovery codex, tools, scenes
   ===================================================================== */
const $=s=>document.querySelector(s);
const rgb=c=>`rgb(${c[0]},${c[1]},${c[2]})`;
const lum=c=>(c[0]*.299+c[1]*.587+c[2]*.114);
const U=s=>String(s).toUpperCase();

/* ---------- persistence ---------- */
const LS='crazychem.v2';
let sandbox=false;
try{
  const saved=JSON.parse(localStorage.getItem(LS)||'null');
  if(saved){(saved.known||[]).forEach(k=>{if(ID[k]!==undefined)KNOWN[ID[k]]=1});sandbox=!!saved.sandbox}
}catch(e){}
if(/unlock/.test(location.search))sandbox=true;
function save(){try{localStorage.setItem(LS,JSON.stringify({known:ELS.filter(e=>KNOWN[e.id]&&!e.base).map(e=>e.key),sandbox}))}catch(e){}}

/* ---------- sound (starts after first click) ---------- */
let AC=null,muted=false;
function ac(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}return AC}
function blip(f,d,ty,v,at){
  const a=ac();if(!a||muted)return;
  const t=a.currentTime+(at||0),o=a.createOscillator(),g=a.createGain();
  o.type=ty||'square';o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(v||.04,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);
  o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+d+.02);
}
function sfxFound(){[523,659,784,1047,1319].forEach((f,i)=>blip(f,.14,'square',.045,i*.07))}
function sfxBoom(r){
  const a=ac();if(!a||muted)return;
  const len=Math.floor(a.sampleRate*(.25+r*.05)),buf=a.createBuffer(1,len,a.sampleRate),d=buf.getChannelData(0);
  for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.2);
  const s=a.createBufferSource(),g=a.createGain(),f=a.createBiquadFilter();
  f.type='lowpass';f.frequency.value=400+r*120;g.gain.value=Math.min(.5,.12+r*.04);
  s.buffer=buf;s.connect(f);f.connect(g);g.connect(a.destination);s.start();
}
function sfxClick(){blip(660,.05,'square',.03)}
onBoom=r=>{sfxBoom(r);if(r>=3)shake(r)};

/* ---------- screen shake ---------- */
const frameEl=$('#frame');
function shake(r){const s=Math.min(14,r*1.6);frameEl.style.setProperty('--s',s+'px');frameEl.classList.remove('shake');void frameEl.offsetWidth;frameEl.classList.add('shake')}

/* ---------- items ---------- */
const items=[];
const TOOLS=[
  {kind:'heat',nm:'Heat gun',name:'Heat gun',sym:'+HEAT',col:[255,106,92],desc:'Pumps heat into everything under the brush. Hold it on metal to melt it.',tag:['+90 C / TICK']},
  {kind:'cool',nm:'Chiller',name:'Chiller',sym:'-HEAT',col:[92,200,255],desc:'Pulls heat out. Freezes water and solidifies melts.',tag:['-90 C / TICK']},
  {kind:'erase',nm:'Eraser',name:'Eraser',sym:'ERASE',col:[246,239,224],desc:'Removes anything under the brush, glass and benches too.'},
  {kind:'vial',nm:'Vial',name:'Vial capture',sym:'[  ]',col:[255,212,94],desc:'Drag a box round some chemicals to bottle them. Then click the vial in the rack and hold on the bench to pour it out.'},
  {kind:'bolt',nm:'Lightning',name:'Lightning',sym:'ZZAP',col:[160,255,255],desc:'Click to drop a lightning bolt from the sky. Lights fuel, shatters glass, runs down metal.'},
  {kind:'stamp',stamp:'beaker',nm:'Beaker',name:'Beaker',sym:'U',col:[150,205,215],desc:'Click to place a glass beaker.'},
  {kind:'stamp',stamp:'tube',nm:'Test tube',name:'Test tube',sym:'I',col:[150,205,215],desc:'Click to place a test tube.'},
  {kind:'stamp',stamp:'flask',nm:'Flask',name:'Flask',sym:'V',col:[150,205,215],desc:'Click to place a flask.'},
];
for(const t of TOOLS)items.push({cat:'lab',kind:'tool',tool:t,nm:t.nm,name:t.name,sym:t.sym,col:t.col,desc:t.desc,tag:t.tag||[],state:'TOOL'});
for(const e of ELS){
  if(e.hide||e.cat==='-'||e.id===0)continue;
  items.push({cat:e.cat,kind:'el',el:e,tool:{kind:'el',id:e.id},nm:e.nm||e.name,name:e.name,sym:e.sym,col:e.col,desc:e.desc,tag:e.tag||[],state:BEHN[e.beh]});
}

/* ---------- scenes ---------- */
function setT(x0,y0,x1,y1,v){for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)T[y*W+x]=v}
const SCENES=[
 {n:'Sodium splash',d:'Na meets water',f(){clearAll();const b=beaker(190,232,100,70);fillRect(b.x0,b.y1-44,b.x1,b.y1,'water');
   for(let k=0;k<3;k++)fillRect(168+k*16,100,173+k*16,105,'sodium')}},
 {n:'Brass foundry',d:'Melt Cu + Zn together',f(){clearAll();for(let x=140;x<=240;x+=2)fillRect(x,226,x+1,229,'burner');
   const b=tube(190,225,64,42);for(let yy=224;yy<=225;yy++)for(let xx=b.x0-1;xx<=b.x1+1;xx++)setCell(yy*W+xx,ID.iron);fillRect(b.x0,b.y1-2,b.x1,b.y1,'iron');
   fillRect(b.x0+3,b.y1-12,b.x0+18,b.y1-3,'copper');fillRect(b.x0+22,b.y1-12,b.x0+34,b.y1-3,'zinc');fillRect(b.x0+38,b.y1-10,b.x1-3,b.y1-3,'copper');}},
 {n:'Thermite weld',d:'Magnesium fuse, 2500 C',f(){clearAll();fillRect(80,226,300,231,'stone');fillRect(130,214,250,225,'iron');
   fillRect(168,180,212,213,'thermite');fillRect(180,172,200,174,'magnesium');setT(180,172,200,174,800)}},
 {n:'Silver tree',d:'Copper in silver nitrate',f(){clearAll();const b=beaker(190,232,90,70);
   fillRect(b.x0+30,b.y1-46,b.x0+32,b.y1-10,'copper');fillRect(b.x0+22,b.y1-38,b.x0+40,b.y1-37,'copper');fillRect(b.x0+50,b.y1-40,b.x0+52,b.y1-5,'copper');
   fillRect(b.x0,b.y1-52,b.x1,b.y1,'agsol')}},
 {n:'Black snake',d:'Sugar + sulfuric acid',f(){clearAll();const b=beaker(190,232,70,60);fillRect(b.x0,b.y1-30,b.x1,b.y1,'sugar');fillRect(172,70,208,80,'sulfuricacid',.7)}},
 {n:'Volcano',d:'Baking soda + vinegar',f(){clearAll();const b=tube(190,232,34,90);fillRect(b.x0,b.y1-22,b.x1,b.y1,'bakingsoda');fillRect(176,50,204,60,'vinegar',.8)}},
 {n:'Gold from acid',d:'Aqua regia, then iron',f(){clearAll();const b=beaker(190,232,100,66);fillRect(b.x0+20,b.y1-10,b.x0+40,b.y1-3,'gold');fillRect(b.x1-18,b.y1-30,b.x1-12,b.y1-4,'iron');
   fillRect(b.x0+4,b.y1-28,b.x1-34,b.y1,'nitricacid',.5);fillRect(b.x0,b.y1-40,b.x1-30,b.y1,'acid')}},
 {n:'Flame test',d:'Colours from metal salts',f(){clearAll();fillRect(70,226,320,231,'stone');
   ['lithium','sodium','potassium','strontium','coppersulfate','calcium'].forEach((k,i)=>{const x=96+i*38;fillRect(x,214,x+10,225,k);setT(x,214,x+10,225,700)})}},
 {n:'Electrolysis',d:'Battery splits water',f(){clearAll();const b=beaker(190,232,110,76);
   fillRect(160,166,162,208,'copper');fillRect(218,166,220,208,'copper');for(let x=163;x<=217;x++)fillRect(x,166,x,166,'wire');
   setCell(166*W+190,ID.battery);fillRect(b.x0,b.y1-52,b.x1,b.y1,'water')}},
 {n:'Garden',d:'Seeds, soil and rain',f(){clearAll();fillRect(60,222,330,231,'dirt');fillRect(100,216,130,221,'dirt');fillRect(220,216,260,221,'dirt');
   for(let k=0;k<14;k++){const x=70+((Math.random()*250)|0);fillRect(x,205,x,206,'seed')}fillRect(80,120,310,126,'water',.18)}},
 {n:'Density tower',d:'Hg, water, oil, powders',f(){clearAll();const b=tube(190,232,44,170);
   fillRect(b.x0,b.y1-34,b.x1,b.y1,'mercury');fillRect(b.x0,b.y1-82,b.x1,b.y1-35,'water');fillRect(b.x0,b.y1-130,b.x1,b.y1-83,'oil');
   fillRect(b.x0+2,b.y1-160,b.x1-2,b.y1-152,'sulfur',.5);fillRect(b.x0+2,b.y1-152,b.x1-2,b.y1-146,'ash',.5);fillRect(b.x0+2,b.y1-146,b.x1-2,b.y1-140,'coal',.5);fillRect(b.x0+2,b.y1-140,b.x1-2,b.y1-134,'sand',.5)}},
 {n:'Spark bottle',d:'H2 + O2 in a tube',f(){clearAll();const b=beaker(190,232,64,60);
   for(let x=b.x0-1;x<=b.x1+1;x++){glassPut(x,176);glassPut(x,177)}
   fillRect(b.x0,178,b.x1,b.y1,'hydrogen',1);for(let y=178;y<=b.y1;y++)for(let x=b.x0;x<=b.x1;x++)if(rnd()<.33)setCell(y*W+x,OXY);
   setT(188,208,192,212,700)}},
];
for(const s of SCENES)items.push({cat:'demo',kind:'demo',scene:s,nm:s.n,name:s.n,sym:'DEMO',col:[184,150,255],desc:s.d.toUpperCase(),tag:[],state:'DEMO'});
function startBench(){
  clearAll();
  const b=beaker(110,232,76,58);fillRect(b.x0,b.y1-30,b.x1,b.y1,'water');
  const c=tube(206,232,28,68);fillRect(c.x0,c.y1-16,c.x1,c.y1,'mercury');fillRect(c.x0,c.y1-40,c.x1,c.y1-17,'oil');
  flask(296,232,72,70);
  fillRect(228,224,254,231,'salt',.9);fillRect(24,216,44,231,'sand',.9);
}

/* ---------- dock ---------- */
let cat='powder',tool=null,curItem=null,lastTool=null;
const dockTabs=$('#tabs'),dockGrid=$('#grid');
const visible=it=>it.kind!=='el'||sandbox||KNOWN[it.el.id];
function counts(){
  const k=PRODUCTS.filter(id=>KNOWN[id]).length;
  $('#cdxn').textContent=k+'/'+PRODUCTS.length;
  $('#cdxbar').style.width=(k/PRODUCTS.length*100)+'%';
}
function buildTabs(){
  dockTabs.innerHTML=CATS.map(([k,n,c])=>{const total=items.filter(i=>i.cat===k&&visible(i)).length;
    if(!total&&k!==cat)return '';
    return `<button class="tab ${k===cat?'on':''}" data-k="${k}" style="--c:${c}"><span>${n}</span><i>${total}</i></button>`}).join('');
}
function buildGrid(){
  dockGrid.innerHTML=items.map((it,i)=>({it,i})).filter(o=>o.it.cat===cat&&visible(o.it)).map(({it,i})=>{
    const c=it.col,dark=lum(c)>150;
    return `<button class="el ${it===curItem?'on':''} ${dark?'lt':''}" data-i="${i}" style="--c:${rgb(c)};--bg:${rgb(c.map(v=>Math.round(v*.52)))}"><b>${U(it.nm)}</b></button>`}).join('');
}
dockTabs.addEventListener('click',e=>{const b=e.target.closest('.tab');if(!b)return;sfxClick();cat=b.dataset.k;buildTabs();buildGrid()});
dockGrid.addEventListener('click',e=>{const b=e.target.closest('.el');if(!b)return;sfxClick();select(items[+b.dataset.i])});

/* ---------- inspector ---------- */
function fmt(v){return Math.round(v)+' C'}
function select(it){
  if(it.kind==='demo'){vials.length=0;armed=-1;renderRack();it.scene.f();note('scene','LOADED '+U(it.scene.n));return}
  curItem=it;armed=-1;renderRack();setTool(it.tool);lastTool=it.tool;
  buildGrid();inspect(it);
}
function inspect(it){
  const e=it.el,rows=[];
  if(e){
    rows.push(['STATE',BEHN[e.beh]]);
    rows.push(['DENSITY',e.dens<.01?'GAS':e.dens.toFixed(2)]);
    if(e.hot)rows.push([e.beh===GAS||e.beh===LIQUID?'BOILS':'MELTS',fmt(e.hot.t)]);
    if(e.cold)rows.push(['FREEZES',fmt(e.cold.t)]);
    if(e.burn)rows.push(['IGNITES',fmt(e.burn.T)]);
    if(e.fixedT!==undefined)rows.push(['HOLDS',fmt(e.fixedT)]);
    if(e.conduct)rows.push(['CONDUCTS','YES']);
  }
  const rec=e&&!e.base&&RECIPES[e.id]?[...new Set(RECIPES[e.id])].slice(0,3):null;
  $('#insp').style.setProperty('--c',rgb(it.col));
  $('#insp').innerHTML=`<div class="ihead"><div class="sw"></div><div><h3>${U(it.name)}</h3><span class="sym">${U(it.sym)}</span></div></div>
   <div class="tags">${it.tag.map(t=>`<span class="pill ${/FLAMM|EXPLOS|TOXIC|CORROS|CAUSTIC|REACT|VIOLENT|PYRO|HOT|2500/.test(t)?'warn':''}">${t}</span>`).join('')}</div>
   <p>${U(it.desc||'')}</p>
   ${rows.length?'<dl>'+rows.slice(0,6).map(r=>`<div><dt>${r[0]}</dt><dd>${r[1]}</dd></div>`).join('')+'</dl>':''}
   ${rec?`<div class="rec"><b>MADE BY</b>${rec.map(r=>`<span>${U(r)}</span>`).join('')}</div>`:''}`;
}
function setTool(t){
  tool=t;if(t.kind!=='pour')lastTool=t;
  const m=t.kind==='pour'?'POUR VIAL '+(t.slot+1):{el:'BRUSH',heat:'HEAT GUN',cool:'CHILLER',erase:'ERASER',vial:'VIAL CAPTURE',stamp:'PLACE GLASS',bolt:'LIGHTNING'}[t.kind];
  $('#hmode').textContent=m;updateRing();
}

/* ---------- notebook ---------- */
const logEl=$('#log'),lastLog={};
noteFn=(key,txt)=>{
  const now=performance.now();if(lastLog[key]&&now-lastLog[key]<2200)return;lastLog[key]=now;
  if(logEl.firstElementChild&&logEl.firstElementChild.dataset.empty)logEl.innerHTML='';
  const d=document.createElement('div');d.textContent=txt;logEl.prepend(d);
  while(logEl.children.length>7)logEl.lastElementChild.remove();
};

/* ---------- discoveries ---------- */
const toasts=$('#toasts');
onFound=id=>{
  const e=ELS[id];if(!PRODUCTS.includes(id))return;
  sfxFound();save();counts();buildTabs();if(cat===e.cat)buildGrid();if(codexOpen)buildCodex();
  const d=document.createElement('div');d.className='toast';d.style.setProperty('--c',rgb(e.col));
  d.innerHTML=`<div class="tsw"></div><div><small>NEW DISCOVERY</small><b>${U(e.name)}</b><em>${U(e.sym)}</em></div>`;
  d.addEventListener('click',()=>{select(items.find(i=>i.el===e));d.remove()});
  toasts.prepend(d);while(toasts.children.length>3)toasts.lastElementChild.remove();
  setTimeout(()=>d.classList.add('out'),3800);setTimeout(()=>d.remove(),4300);
  noteFn('found'+id,'DISCOVERED '+U(e.name));
};
let codexOpen=false;
const codex=$('#codex');
function buildCodex(){
  const groups={};
  PRODUCTS.forEach(id=>{const c=ELS[id].cat;(groups[c]=groups[c]||[]).push(id)});
  $('#cxhead').textContent=PRODUCTS.filter(id=>KNOWN[id]).length+' / '+PRODUCTS.length+' DISCOVERED';
  $('#cxtiles').innerHTML=CATS.filter(c=>groups[c[0]]).map(([k,n,col])=>`<h4 style="--c:${col}">${n}</h4><div class="tiles">`+groups[k].map(id=>{
    const e=ELS[id],ok=KNOWN[id];
    const rec=[...new Set(RECIPES[id]||[])].slice(0,2).map(U).join(' / ')||'EXPERIMENT';
    return ok?`<button class="tile ok" data-id="${id}" style="--c:${rgb(e.col)}"><span class="tsw"></span><b>${U(e.nm||e.name)}</b><small>${U(e.sym)}</small><em>${rec}</em></button>`
             :`<button class="tile" data-id="${id}"><span class="tsw q">?</span><b>???</b><small>LOCKED</small><em class="hint">TAP FOR HINT</em></button>`}).join('')+'</div>').join('');
}
$('#cxtiles').addEventListener('click',e=>{
  const t=e.target.closest('.tile');if(!t)return;const id=+t.dataset.id,el=ELS[id];
  if(KNOWN[id]){codexToggle(false);select(items.find(i=>i.el===el))}
  else{const rec=[...new Set(RECIPES[id]||[])][0]||'TRY HEAT, ACID, OR ELECTRICITY';t.querySelector('em').textContent=U(rec);t.classList.add('peek')}
});
function codexToggle(v){codexOpen=v===undefined?!codexOpen:v;codex.classList.toggle('open',codexOpen);if(codexOpen)buildCodex();sfxClick()}
$('#bCodex').onclick=()=>codexToggle();
$('#cxclose').onclick=()=>codexToggle(false);
$('#cxunlock').onclick=function(){sandbox=!sandbox;this.setAttribute('aria-pressed',sandbox);save();buildTabs();buildGrid()};

/* ---------- vials ---------- */
const vials=[];let armed=-1;
function captureRect(x0,y0,x1,y1){
  const its=[];
  for(let y=Math.max(0,y0);y<=Math.min(H-1,y1);y++)for(let x=Math.max(0,x0);x<=Math.min(W-1,x1);x++){
    const k=y*W+x,t=type[k];
    if(t===0||t===BENCH||ELS[t].fixedT!==undefined||t===GLASS||t===FIRE||t===SPARK)continue;
    its.push([t,aux[k],T[k]]);setCell(k,0);T[k]=20;
  }
  if(!its.length)return false;
  for(let i=its.length-1;i>0;i--){const j=(rnd()*(i+1))|0;[its[i],its[j]]=[its[j],its[i]]}
  if(vials.length>=5){vials.shift()}
  vials.push({items:its,cap:its.length});
  armed=vials.length-1;setTool({kind:'pour',slot:armed});renderRack();
  note('vial','BOTTLED '+its.length+' PARTICLES');return true;
}
function compOf(v){
  const m=new Map();
  for(const [t,a] of v.items){const k=t===MOLTEN?'m'+a:t;m.set(k,(m.get(k)||0)+1)}
  return [...m.entries()].map(([k,c])=>{
    if(typeof k==='string'){const a=+k.slice(1),s=ELS[a];return {name:moltenName(a),c,col:s.col,d:s.dens*.9}}
    const e=ELS[k];return {name:e.name,c,col:e.col,d:e.dens}
  }).sort((a,b)=>b.d-a.d);
}
function renderRack(){
  let h='';
  for(let s=0;s<5;s++){
    const v=vials[s];
    if(!v){h+=`<div class="vial empty"><div class="tube"></div><small>EMPTY</small></div>`;continue}
    const comp=compOf(v),tot=v.items.length;let acc=0;
    const stops=comp.map(c=>{const a=acc;acc+=c.c/tot*100;return `${rgb(c.col)} ${a.toFixed(1)}% ${acc.toFixed(1)}%`}).join(',');
    const fill=Math.min(100,tot/Math.max(300,v.cap)*100);
    h+=`<div class="vial ${armed===s?'on':''}"><button class="x" data-x="${s}">X</button><button class="tube" data-s="${s}"><div class="fill" style="height:${fill}%;background:linear-gradient(to top,${stops})"></div></button><small>V${s+1} ${tot}</small></div>`;
  }
  $('#rack').innerHTML=h;$('#rackct').textContent=vials.length+'/5';
}
$('#rack').addEventListener('click',e=>{
  const x=e.target.closest('[data-x]');
  if(x){const s=+x.dataset.x;vials.splice(s,1);if(armed===s)armed=-1;else if(armed>s)armed--;renderRack();if(tool.kind==='pour')setTool(armed>=0?{kind:'pour',slot:armed}:lastTool);return}
  const t=e.target.closest('.tube[data-s]');
  if(t){sfxClick();const s=+t.dataset.s;if(armed===s){armed=-1;setTool(lastTool)}else{armed=s;setTool({kind:'pour',slot:s})}renderRack()}
});
function pourStep(cx,cy){
  const v=vials[tool.slot];if(!v)return;let n=0;
  for(let k=0;k<8&&v.items.length;k++){
    let placed=false;
    for(let tr=0;tr<5&&!placed;tr++){
      const x=cx+((rnd()*5)|0)-2,y=cy+((rnd()*3)|0)-1;if(x<0||x>=W||y<0||y>=H)continue;
      const q=y*W+x;if(type[q]!==0)continue;
      const it=v.items.pop();setCell(q,it[0],it[1]);T[q]=it[2];placed=true;n++;
    }
    if(!placed)break;
  }
  if(n){if(!v.items.length){vials.splice(tool.slot,1);armed=-1;setTool(lastTool);renderRack()}else if((frame&7)===0)renderRack()}
}

/* ---------- controls ---------- */
const bPause=$('#bPause');
function setPause(v){paused=v;bPause.setAttribute('aria-pressed',v);bPause.firstElementChild.textContent=v?'PLAY':'PAUSE'}
bPause.onclick=()=>{sfxClick();setPause(!paused)};
$('#bStep').onclick=()=>{setPause(true);stepOnce=true};
$('#bThermal').onclick=function(){sfxClick();thermal=!thermal;this.setAttribute('aria-pressed',thermal)};
$('#bHood').onclick=function(){sfxClick();hood=!hood;this.setAttribute('aria-pressed',hood)};
$('#bClear').onclick=()=>{sfxClick();clearAll();note('clear','BENCH CLEARED')};
$('#bMute').onclick=function(){muted=!muted;this.setAttribute('aria-pressed',muted);this.firstElementChild.textContent=muted?'SFX OFF':'SFX ON'};
$('#speed').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;sfxClick();speed=+b.dataset.s;[...$('#speed').children].forEach(x=>x.classList.toggle('on',x===b))});
$('#brush').oninput=e=>{brush=+e.target.value;$('#bval').textContent=brush;updateRing()};
window.addEventListener('keydown',e=>{
  if(e.target.tagName==='INPUT')return;
  const k=e.key.toLowerCase();
  if(e.code==='Space'){e.preventDefault();setPause(!paused)}
  else if(k==='['){brush=Math.max(1,brush-1);$('#brush').value=brush;$('#bval').textContent=brush;updateRing()}
  else if(k===']'){brush=Math.min(14,brush+1);$('#brush').value=brush;$('#bval').textContent=brush;updateRing()}
  else if(k==='t')$('#bThermal').click();
  else if(k==='h')$('#bHood').click();
  else if(k==='c')$('#bClear').click();
  else if(k==='x')codexToggle();
  else if(k==='m')$('#bMute').click();
  else if(k==='.'){setPause(true);stepOnce=true}
  else if(k==='escape')codexToggle(false);
});

/* ---------- stage sizing ---------- */
const stagebox=$('#stagebox');
function fit(){
  const aw=stagebox.clientWidth-16,ah=stagebox.clientHeight-16;
  if(aw<=0||ah<=0)return;
  let w=aw,h=aw*H/W;if(h>ah){h=ah;w=ah*W/H}
  w=Math.floor(w);h=Math.floor(h);
  frameEl.style.width=w+'px';frameEl.style.height=h+'px';updateRing();
}
new ResizeObserver(fit).observe(stagebox);window.addEventListener('resize',fit);

/* ---------- pointer ---------- */
const cvEl=$('#sim'),ring=$('#ring'),selbox=$('#selbox');
const ptr={down:false,x:0,y:0,px:0,py:0,inside:false,sx:0,sy:0,cx:0,cy:0};
function cellFrom(e){const r=cvEl.getBoundingClientRect();return [Math.max(0,Math.min(W-1,Math.floor((e.clientX-r.left)/r.width*W))),Math.max(0,Math.min(H-1,Math.floor((e.clientY-r.top)/r.height*H)))]}
function updateRing(){
  if(!tool)return;
  const r=cvEl.getBoundingClientRect(),s=r.width/W;
  const rad=tool.kind==='stamp'||tool.kind==='vial'||tool.kind==='bolt'?3:(tool.kind==='pour'?3:brush+.5);
  ring.style.width=ring.style.height=(rad*2*s)+'px';
  ring.style.left=((ptr.cx+.5)*s)+'px';ring.style.top=((ptr.cy+.5)*s)+'px';
  ring.style.display=ptr.inside?'block':'none';
}
function line(x0,y0,x1,y1,fn){
  let dx=Math.abs(x1-x0),dy=Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1,err=dx-dy,n=0;
  const se=Math.max(1,brush>>1);
  for(;;){if(n++%se===0)fn(x0,y0);if(x0===x1&&y0===y1)break;const e2=2*err;if(e2>-dy){err-=dy;x0+=sx}if(e2<dx){err+=dx;y0+=sy}}
}
const STAMPS={beaker:[beaker,[56,60]],tube:[tube,[14,56]],flask:[flask,[48,56]]};
cvEl.addEventListener('pointerdown',e=>{
  ac();cvEl.setPointerCapture(e.pointerId);
  const [x,y]=cellFrom(e);ptr.down=true;ptr.x=ptr.px=x;ptr.y=ptr.py=y;ptr.sx=x;ptr.sy=y;ptr.inside=true;ptr.cx=x;ptr.cy=y;
  if(tool.kind==='stamp'){const [fn,[w,h]]=STAMPS[tool.stamp];fn(x,Math.min(H-1,y+(h>>1)),w,h);ptr.down=false}
  else if(tool.kind==='bolt'){lightning(x,y);ptr.down=false}
  else if(tool.kind==='vial')selbox.style.display='block';
  updateRing();
});
cvEl.addEventListener('pointermove',e=>{
  const [x,y]=cellFrom(e);ptr.x=x;ptr.y=y;ptr.cx=x;ptr.cy=y;ptr.inside=true;updateRing();
  if(tool.kind==='vial'&&ptr.down){
    const r=cvEl.getBoundingClientRect(),s=r.width/W;
    const x0=Math.min(ptr.sx,x),y0=Math.min(ptr.sy,y),x1=Math.max(ptr.sx,x),y1=Math.max(ptr.sy,y);
    Object.assign(selbox.style,{left:x0*s+'px',top:y0*s+'px',width:(x1-x0+1)*s+'px',height:(y1-y0+1)*s+'px'});
  }
});
const endPtr=()=>{
  if(!ptr.down)return;ptr.down=false;
  if(tool.kind==='vial'){selbox.style.display='none';captureRect(Math.min(ptr.sx,ptr.x),Math.min(ptr.sy,ptr.y),Math.max(ptr.sx,ptr.x),Math.max(ptr.sy,ptr.y))}
};
cvEl.addEventListener('pointerup',endPtr);cvEl.addEventListener('pointercancel',endPtr);
cvEl.addEventListener('pointerleave',()=>{ptr.inside=false;updateRing()});
cvEl.addEventListener('pointerenter',()=>{ptr.inside=true;updateRing()});
cvEl.addEventListener('contextmenu',e=>e.preventDefault());
function applyTool(){
  if(tool.kind==='el')line(ptr.px,ptr.py,ptr.x,ptr.y,(x,y)=>paintEl(x,y,tool.id));
  else if(tool.kind==='heat'||tool.kind==='cool'||tool.kind==='erase')line(ptr.px,ptr.py,ptr.x,ptr.y,(x,y)=>paintTool(x,y,tool.kind));
  else if(tool.kind==='pour')pourStep(ptr.x,ptr.y);
  ptr.px=ptr.x;ptr.py=ptr.y;
}
function hoverInfo(){
  if(!ptr.inside)return;
  const k=ptr.cy*W+ptr.cx,t=type[k];
  const n=t===0?'AIR':t===MOLTEN?moltenName(aux[k]):ELS[t].name;
  $('#hover').textContent=U(n)+'  '+T[k].toFixed(0)+' C';
  $('#hxy').textContent=ptr.cx+','+ptr.cy;
}

/* ---------- main loop ---------- */
let fpsN=0,fpsT=performance.now();
function loop(ts){
  requestAnimationFrame(loop);
  if(ptr.down)applyTool();
  if(!paused){speedAcc+=speed;while(speedAcc>=1){step();speedAcc-=1}}
  else if(stepOnce){step();stepOnce=false}
  const c=render();
  fpsN++;
  if(ts-fpsT>500){$('#fps').textContent=Math.round(fpsN*1000/(ts-fpsT));$('#cnt').textContent=c;fpsN=0;fpsT=ts;hoverInfo()}
}

/* ---------- boot ---------- */
(function boot(){
  initRender(cvEl,$('#glow'));
  $('#cxunlock').setAttribute('aria-pressed',sandbox);
  buildTabs();
  select(items.find(i=>i.el&&i.el.key==='water'));
  cat='liquid';buildTabs();buildGrid();
  counts();renderRack();fit();startBench();
  if(/codex/.test(location.hash))codexToggle(true);
  const m=/scene=(\d+)(?:&steps=(\d+))?/.exec(location.hash);
  if(m&&SCENES[+m[1]]){SCENES[+m[1]].f();for(let i=0;i<(+m[2]||0);i++)step()}
  const intro=$('#intro');
  if(/nointro/.test(location.search))intro.remove();else setTimeout(()=>intro.remove(),2900);
  window.__lab={step,render,SCENES,ID,ELS,type,T,aux,boom,startBench,clearAll,fillRect,setPause,KNOWN,found,RECIPES,PRODUCTS,get frame(){return frame}};
  requestAnimationFrame(loop);
})();
