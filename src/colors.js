'use strict';
/* =====================================================================
   CRAZY CHEMISTRY — real-world colours
   Each value is how the substance actually looks (metals silvery-white unless they are not,
   acids and bases clear, gases colourless or faintly tinted, flame colours from flame tests).
   Colourless gases and liquids get a faint neutral tint and low alpha only so they stay visible on the stage.
   ===================================================================== */
const REAL={
  /* powders */
  sand:[222,198,144],salt:[244,244,240],sulfur:[240,224,62],coal:[38,38,42],charcoal:[30,30,34],chalk:[240,238,230],quicklime:[244,242,236],
  gunpowder:[54,52,56],thermite:[132,108,96],phosphorus:[244,236,190],carbide:[96,98,104],sugar:[252,250,244],flour:[246,242,230],bakingsoda:[248,248,250],
  yeast:[214,182,130],dirt:[112,80,54],clay:[176,110,86],cement:[150,150,148],ash:[128,126,124],rust:[162,76,40],verdigris:[96,180,160],fes:[48,44,44],
  nh4cl:[244,244,244],agcl:[240,240,244],ammoniumnitrate:[240,238,230],tnt:[232,220,150],epsom:[244,246,250],mgoh2:[250,250,252],fepo4:[100,104,110],
  coppersulfate:[46,120,224],copperdust:[176,98,60],silverdust:[196,198,204],golddust:[226,178,52],
  /* alkali and alkaline earth metals */
  lithium:[188,192,198],sodium:[208,212,224],potassium:[206,210,220],rubidium:[200,204,212],cesium:[232,222,190],francium:[200,200,210],
  calcium:[214,210,196],barium:[206,208,190],strontium:[214,208,176],
  /* metals */
  iron:[150,154,160],copper:[208,120,78],zinc:[158,170,184],tin:[200,204,208],lead:[96,102,122],silver:[232,234,238],gold:[255,200,64],platinum:[220,222,226],
  nickel:[176,176,170],titanium:[160,164,172],tungsten:[104,108,116],aluminum:[210,214,222],magnesium:[222,226,230],beryllium:[170,178,180],radium:[210,214,208],
  cobalt:[140,152,176],manganese:[168,160,170],chromium:[208,214,220],gallium:[192,204,220],indium:[188,190,198],bismuth:[210,176,190],
  steel:[128,134,146],stainless:[196,204,212],brass:[214,176,76],bronze:[176,122,62],solder:[178,182,188],pewter:[160,164,166],electrum:[226,206,128],amalgam:[200,204,212],
  /* liquids */
  water:[60,134,224],saltwater:[74,150,210],sugarwater:[240,224,170],acid:[238,240,196],vinegar:[232,216,170],nitricacid:[242,232,176],sulfuricacid:[222,224,212],
  aquaregia:[255,170,50],base:[208,222,236],limewater:[214,232,236],bleach:[218,230,150],oil:[168,112,40],fuel:[238,214,146],napalm:[236,150,60],ethanol:[208,228,240],
  glycerin:[226,236,226],nitro:[246,236,160],mercury:[200,204,212],peroxide:[208,228,242],ln2:[180,222,255],cusol:[36,140,226],agsol:[220,230,236],ausol:[255,208,70],
  mud:[92,66,46],wetconcrete:[128,128,124],phosacid:[232,232,214],acetone:[210,226,240],methanol:[208,226,240],toluene:[214,224,232],
  /* gases */
  steam:[240,244,248],hydrogen:[226,232,244],oxygen:[224,234,248],nitrogen:[226,230,238],chlorine:[208,226,104],methane:[226,234,230],co2:[226,228,234],
  smoke:[88,88,94],so2:[236,236,230],h2s:[232,234,214],nh3:[228,236,242],no2:[196,104,52],acetylene:[232,232,228],hgvapor:[214,214,222],ethvapor:[226,232,240],solvvapor:[226,232,240],
  /* structures */
  glass:[168,214,222],stone:[112,108,106],ice:[196,232,252],dryice:[232,238,242],concrete:[146,146,142],brick:[170,82,62],wood:[134,94,58]
};
const REAL_ALPHA={acid:.7,vinegar:.6,nitricacid:.65,sulfuricacid:.8,base:.6,limewater:.6,ethanol:.5,glycerin:.55,peroxide:.6,agsol:.5,phosacid:.6,acetone:.45,methanol:.45,toluene:.5,fuel:.6,
  hydrogen:.16,oxygen:.18,nitrogen:.16,methane:.18,co2:.2,so2:.22,h2s:.2,nh3:.2,acetylene:.18,hgvapor:.2,ethvapor:.18,solvvapor:.18};
const REAL_FLAME={lithium:[220,40,60],sodium:[255,210,40],potassium:[190,120,240],rubidium:[200,50,120],cesium:[130,150,255],calcium:[240,110,40],strontium:[240,30,60],
  barium:[140,240,90],coppersulfate:[60,220,150],cusol:[60,220,150],sulfur:[80,110,255],ethanol:[120,150,255],methanol:[150,170,255],acetylene:[255,230,160],francium:[200,120,255]};
for(const k in REAL){if(ID[k]!==undefined)ELS[ID[k]].col=REAL[k];else throw new Error('colors.js: unknown element '+k)}
for(const k in REAL_ALPHA)ELS[ID[k]].alpha=REAL_ALPHA[k];
for(const k in REAL_FLAME)ELS[ID[k]].flame=REAL_FLAME[k];
ELS[ID.cesium].desc='Silvery gold, soft, and runny just above room temperature. Detonates in water.';
ELS[ID.acid].desc='Strong acid, clear with a faint yellow tint. Eats most metals, chalk and rust. Gold and copper shrug it off.';
ELS[ID.tnt].desc='Pale yellow solid. Stable until heated or lit. Chain-reacts across a pile.';
