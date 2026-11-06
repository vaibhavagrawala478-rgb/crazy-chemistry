'use strict';
/* =====================================================================
   CRAZY CHEMISTRY — element + reaction data
   ===================================================================== */
const W=384,H=240,N=W*H;
const EMPTY=0,STATIC=1,POWDER=2,LIQUID=3,GAS=4,FIREB=5,SPARKB=6;
const AIR=0.00122;
const ELS=[],ID={};
const CATS=[
  ['lab','LAB','#ffd45e'],['powder','POWDERS','#f2b968'],['liquid','LIQUIDS','#5cc8ff'],['gas','GASES','#8be8c4'],
  ['metal','METALS','#c9d3e0'],['alloy','ALLOYS','#e8b86a'],['mineral','MINERALS','#c2a8c8'],['life','LIFE','#6ee7a0'],['flora','FLORA','#7be07a'],
  ['boom','BOOM','#ff6a5c'],['demo','DEMOS','#b896ff']
];
const BEHN=['EMPTY','SOLID','POWDER','LIQUID','GAS','ENERGY','ENERGY'];
const D_COND=[.012,.3,.15,.5,.03,.8,.8],D_CAP=[1,2,1.6,3,1,1,1];

function def(key,nm,name,sym,cat,beh,dens,col,o){
  o=Object.assign({key,nm,name,sym,cat,beh,dens,col,cond:D_COND[beh],cap:D_CAP[beh]},o||{});
  if(beh===LIQUID){if(o.flow===undefined)o.flow=1;if(o.spread===undefined)o.spread=5}
  if(beh===GAS&&o.alpha===undefined)o.alpha=.3;
  o.id=ELS.length;ELS.push(o);ID[key]=o.id;return o;
}
function metal(key,nm,name,sym,dens,col,melt,o){
  return def(key,nm,name,sym,(o&&o.cat)||'metal',STATIC,dens,col,Object.assign({cond:.8,cap:1.7,conduct:1,hot:{t:melt,to:'molten'}},o||{}));
}
function dust(key,nm,name,sym,dens,col,srcKey,melt,o){
  return def(key,nm,name,sym,'powder',POWDER,dens,col,Object.assign({cond:.4,hot:{t:melt,to:'molten',src:srcKey}},o||{}));
}

/* ---------------- special cells ---------------- */
def('empty','','Empty','','-',EMPTY,AIR,[10,11,12],{cond:.012,cap:1});
def('fire','Fire','Fire','FIRE','lab',FIREB,.0003,[255,150,45],{base:1,flame:[255,150,45],flameT:950,lifeBase:18,tag:['HOT'],
  desc:'Open flame. Lights anything flammable and heats what it touches. Water, CO2 and nitrogen put it out.'});
def('spark','Spark','Electric spark','ZAP','lab',SPARKB,.0003,[140,255,255],{base:1,lifeBase:6,tag:['ELECTRIC'],
  desc:'Runs along metals and wire. Splits water into hydrogen and oxygen. Lights gases and powders.'});
def('molten','Molten','Molten','MELT','-',LIQUID,3,[255,140,40],{cond:.7,cap:2,flow:.35,spread:2,hide:1});

/* ---------------- lab gear ---------------- */
def('bench','Bench','Lab bench','BENCH','lab',STATIC,9,[70,66,92],{base:1,cond:.3,cap:5,desc:'Indestructible. Nothing burns, melts or breaks it.'});
def('burner','Burner','Bunsen burner','FLAME','lab',STATIC,9,[120,118,150],{base:1,cond:1,cap:5,fixedT:1450,flameOut:1,flame:[90,130,255],flameT:1300,tag:['HOT'],
  desc:'Always on. Holds 1450 C and throws a flame upward.'});
def('hotplate','Hot plate','Hot plate','PLATE','lab',STATIC,9,[150,84,74],{base:1,cond:1,cap:5,fixedT:520,tag:['HOT'],desc:'Holds 520 C. Boils water and melts lead, but never lights anything by itself.'});
def('coldplate','Cold plate','Freezer plate','FRZR','lab',STATIC,9,[60,120,160],{base:1,cond:1,cap:5,fixedT:-70,tag:['COLD'],desc:'Holds -70 C. Freezes water, brine and mercury.'});
def('wire','Wire','Copper wire','WIRE','lab',STATIC,8.9,[255,150,86],{base:1,cond:1,cap:1.7,conduct:1,desc:'Carries sparks. Hook it to a battery and watch the pulse run.'});
def('battery','Battery','Battery','CELL','lab',STATIC,9,[76,206,124],{base:1,cond:.5,cap:3,emit:14,desc:'Fires a spark into any wire or metal it touches, over and over.'});

/* ---------------- powders ---------------- */
def('sand','Sand','Sand','SiO2','powder',POWDER,1.6,[214,190,130],{base:1,cond:.2,hot:{t:1500,to:'molten'},frozen:'glass',ext:.3,desc:'Quartz sand. Melts at 1500 C and cools into clear glass.'});
def('salt','Salt','Table salt','NaCl','powder',POWDER,1.2,[240,240,236],{base:1,cond:.2,hot:{t:801,to:'molten'},desc:'Dissolves in water. Mixed with ice it makes a freezing mix.'});
def('sulfur','Sulfur','Sulfur','S','powder',POWDER,2,[238,222,60],{base:1,cond:.1,flame:[70,110,255],flameT:1000,
  burn:{T:250,p:.04,to:'so2',heat:160,flame:1,eq:'S + O2 -> SO2'},tag:['FLAMMABLE'],desc:'Brimstone. Burns blue and makes choking sulfur dioxide. Bonds to hot iron.'});
def('coal','Coal','Coal','C','powder',POWDER,1.2,[40,40,48],{base:1,cond:.2,flame:[255,120,35],flameT:1050,
  burn:{T:380,p:.02,to:'ash',heat:420,flame:1,smoke:.3,eq:'C + O2 -> CO2'},tag:['FLAMMABLE'],desc:'Carbon fuel. Smelts rust into iron and turns molten iron into steel.'});
def('charcoal','Charcoal','Charcoal','C','powder',POWDER,.7,[28,28,34],{cond:.15,flame:[255,130,40],flameT:1000,
  burn:{T:350,p:.03,to:'ash',heat:380,flame:1,eq:'C + O2 -> CO2'},tag:['FLAMMABLE'],desc:'Burnt wood or dehydrated sugar. Burns clean and hot.'});
def('chalk','Chalk','Chalk','CaCO3','powder',POWDER,1.5,[236,233,222],{base:1,cond:.15,hot:{t:900,to:'quicklime',alt:{p:.4,to:'co2'},eq:'CaCO3 -> CaO + CO2'},desc:'Limestone. Fizzes in acid. Roast it to get quicklime.'});
def('quicklime','Quicklime','Quicklime','CaO','powder',POWDER,1.6,[248,246,238],{base:1,cond:.15,tag:['CAUSTIC'],desc:'Hungry for water. Slakes into limewater with a burst of heat.'});
def('gunpowder','Gunpowder','Gunpowder','KNO3','powder',POWDER,1.05,[78,76,90],{base:1,cond:.1,flame:[255,170,60],flameT:1300,
  burn:{T:280,p:.5,to:'smoke',heat:1000,flame:1,boom:[.3,4],eq:'Black powder deflagration'},tag:['EXPLOSIVE'],desc:'Black powder. Needs just a flame, then blows holes.'});
def('thermite','Thermite','Thermite','Al+FeO','powder',POWDER,2.5,[170,80,64],{base:1,cond:.15,flame:[255,245,220],flameT:2300,
  burn:{T:560,p:.4,moltenOf:'iron',heat:2400,flame:1,eq:'Fe2O3 + 2Al -> 2Fe + Al2O3'},tag:['2500 C'],desc:'Aluminium and iron oxide. Hard to light, impossible to stop. Leaves molten iron.'});
def('phosphorus','White P','White phosphorus','P4','powder',POWDER,1.8,[240,228,160],{base:1,cond:.15,flame:[255,255,215],flameT:1100,
  burn:{T:35,p:.12,to:'smoke',heat:650,flame:1,dry:1,eq:'P4 + 5O2 -> P4O10'},tag:['PYROPHORIC'],desc:'Lights itself at 35 C. Keep it under water.'});
def('carbide','Carbide','Calcium carbide','CaC2','powder',POWDER,2.2,[110,112,120],{base:1,cond:.15,tag:['REACTIVE'],desc:'Add water and it gives off acetylene gas.'});
def('sugar','Sugar','Sugar','C12H22','powder',POWDER,1.55,[250,246,236],{base:1,cond:.15,flame:[255,170,60],flameT:900,burn:{T:190,p:.02,to:'charcoal',heat:80,flame:1,smoke:.4},desc:'Dissolves in water. Oil of vitriol strips it down to black carbon.'});
def('flour','Flour','Flour','dust','powder',POWDER,.55,[244,236,214],{base:1,cond:.1,flame:[255,170,70],flameT:1100,
  burn:{T:400,p:.3,to:'void',heat:350,flame:1,boom:[.02,3],eq:'Flour dust flash fire'},tag:['FLAMMABLE'],desc:'Fine dust. It burns shockingly fast.'});
def('bakingsoda','Soda','Baking soda','NaHCO3','powder',POWDER,1.4,[246,246,250],{base:1,cond:.15,hot:{t:200,to:'ash',alt:{p:.5,to:'co2'}},desc:'Fizzes with any acid, including vinegar.'});
def('yeast','Yeast','Yeast','fungi','powder',POWDER,1.1,[206,170,110],{base:1,cond:.15,desc:'Eats sugar water and makes ethanol and CO2.'});
def('dirt','Dirt','Dirt','soil','powder',POWDER,1.3,[110,76,50],{base:1,cond:.15,desc:'Plain soil. Turns to mud when wet.'});
def('clay','Clay','Clay','Al2Si2','powder',POWDER,1.7,[188,118,92],{base:1,cond:.2,hot:{t:900,to:'brick'},desc:'Fire it at 900 C and it becomes brick.'});
def('cement','Cement','Cement','CaSiO','powder',POWDER,1.5,[160,160,160],{base:1,cond:.15,desc:'Add water and it sets into concrete.'});
def('strontium','Strontium','Strontium','Sr','metal',POWDER,2.64,[200,196,170],{base:1,cond:.5,cap:1.7,conduct:1,flame:[255,36,70],flameT:1000,
  burn:{T:400,p:.025,to:'ash',heat:200,flame:1,dry:1,eq:'Strontium: crimson flame'},tag:['RED FLAME'],desc:'Alkaline earth metal. Burns deep crimson, the firework red.'});
def('coppersulfate','CuSO4','Copper sulfate','CuSO4','powder',POWDER,2.3,[56,130,230],{base:1,cond:.2,flame:[60,240,150],flameT:1000,
  burn:{T:500,p:.025,to:'ash',heat:100,flame:1,eq:'Copper: green-blue flame'},tag:['GREEN FLAME'],desc:'Blue crystals. Dissolves into blue copper solution and burns green.'});
def('ash','Ash','Ash','ash','powder',POWDER,.5,[118,114,112],{base:1,cond:.1,ext:.2,desc:'What is left after burning. Floats on water.'});
def('rust','Rust','Rust','Fe2O3','powder',POWDER,1.8,[150,70,40],{cond:.15,desc:'Iron oxide. Smelt it with coal to get iron back.'});
def('verdigris','Verdigris','Verdigris','CuCO3','powder',POWDER,1.9,[84,190,150],{cond:.15,desc:'Green crust from copper and vinegar.'});
def('fes','FeS','Iron sulfide','FeS','powder',POWDER,2.5,[60,52,54],{cond:.2,desc:'Dark crumbly mineral. Acid turns it into rotten egg gas.'});
def('nh4cl','Salmiac','Ammonium chloride','NH4Cl','powder',POWDER,1.4,[236,238,240],{cond:.15,desc:'White crust where ammonia meets acid.'});
def('agcl','AgCl','Silver chloride','AgCl','powder',POWDER,2.6,[232,230,244],{cond:.15,desc:'White curds that fall out when silver nitrate meets salt.'});
def('ammoniumnitrate','NH4NO3','Ammonium nitrate','NH4NO3','powder',POWDER,1.7,[226,222,208],{cond:.15,flame:[255,200,120],flameT:1200,
  burn:{T:210,p:.2,to:'nitrogen',heat:700,flame:1,boom:[.1,5],eq:'NH4NO3 -> N2 + 2H2O + O2'},tag:['EXPLOSIVE'],desc:'Fertiliser that turns violent when it gets hot.'});
dust('copperdust','Cu dust','Copper dust','Cu',8,[210,110,70],'copper',1085,{desc:'Copper that crashed out of solution. Melts back into a bead.'});
dust('silverdust','Ag dust','Silver dust','Ag',8,[240,242,248],'silver',962,{desc:'Silver precipitate. It grows in crystals on copper.'});
dust('golddust','Au dust','Gold dust','Au',9,[255,208,60],'gold',1064,{desc:'Gold powder from aqua regia. Mercury sticks to it.'});
def('tnt','TNT','TNT','C7H5N3','powder',POWDER,1.6,[196,60,48],{cond:.1,flame:[255,170,60],flameT:1500,
  burn:{T:240,p:.35,to:'smoke',heat:1400,flame:1,boom:[.35,6],eq:'TNT detonation'},tag:['EXPLOSIVE'],desc:'Stable until heated or lit. Chain-reacts across a pile.'});

/* alkali metals sit in the powder family so they can be dropped */
def('lithium','Lithium','Lithium','Li','metal',POWDER,.53,[160,164,172],{base:1,cond:.7,cap:1.7,conduct:1,flame:[255,50,60],flameT:1100,
  burn:{T:180,p:.02,to:'ash',heat:250,flame:1,dry:1,eq:'4Li + O2 -> 2Li2O (red flame)'},tag:['REACTIVE'],desc:'Lightest metal. Floats, fizzes in water, burns red.'});
def('sodium','Sodium','Sodium','Na','metal',POWDER,.97,[190,196,218],{base:1,cond:.7,cap:1.7,conduct:1,flame:[255,205,50],flameT:1100,
  burn:{T:140,p:.03,to:'ash',heat:320,flame:1,dry:1,eq:'4Na + O2 -> 2Na2O (yellow flame)'},tag:['REACTIVE'],desc:'Soft, floats and detonates in water. Keep it under oil.'});
def('potassium','Potassium','Potassium','K','metal',POWDER,.86,[182,188,204],{base:1,cond:.7,cap:1.7,conduct:1,flame:[200,120,255],flameT:1100,
  burn:{T:62,p:.06,to:'ash',heat:400,flame:1,dry:1,eq:'4K + O2 -> 2K2O (lilac flame)'},tag:['VIOLENT'],desc:'Worse than sodium. Lights itself with water and burns lilac.'});
def('calcium','Calcium','Calcium','Ca','metal',POWDER,1.55,[214,208,190],{base:1,cond:.6,cap:1.7,flame:[255,130,40],flameT:1000,
  burn:{T:550,p:.02,to:'quicklime',heat:300,flame:1,eq:'2Ca + O2 -> 2CaO (orange flame)'},tag:['REACTIVE'],desc:'Fizzes in water to make limewater. Burns orange into quicklime.'});

/* ---------------- liquids ---------------- */
def('water','Water','Water','H2O','liquid',LIQUID,1,[58,128,222],{base:1,alpha:.85,cond:.6,cap:3,ext:.5,
  hot:{t:100,to:'steam',p:.5,latent:25,eq:'Water boils'},cold:{t:-1,to:'ice',p:.5},desc:'Boils at 100 C, freezes at 0 C.'});
def('saltwater','Brine','Salt water','NaCl aq','liquid',LIQUID,1.15,[78,150,208],{alpha:.88,cond:.6,cap:2.8,ext:.5,
  hot:{t:102,to:'steam',p:.5,latent:25,alt:{p:.3,to:'salt'},eq:'Brine boils, salt crystallises'},cold:{t:-6,to:'ice',p:.4},desc:'Boil it and salt stays behind.'});
def('sugarwater','Syrup','Sugar water','C12 aq','liquid',LIQUID,1.2,[240,206,110],{alpha:.85,cond:.5,cap:2.8,ext:.4,hot:{t:104,to:'steam',p:.4,latent:25,alt:{p:.2,to:'sugar'}},desc:'Yeast turns this into ethanol.'});
def('acid','HCl','Hydrochloric acid','HCl','liquid',LIQUID,1.1,[160,240,70],{base:1,alpha:.88,cond:.5,cap:2.8,ext:.15,hot:{t:110,to:'steam',p:.4,latent:20},tag:['CORROSIVE'],
  desc:'Strong acid. Eats most metals, chalk and rust. Gold and copper shrug it off.'});
def('vinegar','Vinegar','Vinegar','CH3COOH','liquid',LIQUID,1.01,[226,200,130],{base:1,alpha:.7,cond:.5,cap:3,ext:.4,hot:{t:104,to:'steam',p:.4,latent:25},desc:'Weak acid. Fizzes with baking soda and turns copper green.'});
def('nitricacid','HNO3','Nitric acid','HNO3','liquid',LIQUID,1.5,[246,226,110],{base:1,alpha:.8,cond:.5,cap:2.8,ext:.1,hot:{t:120,to:'no2',p:.3},tag:['CORROSIVE'],desc:'Dissolves copper and silver, and makes brown fumes. Gold ignores it.'});
def('sulfuricacid','H2SO4','Sulfuric acid','H2SO4','liquid',LIQUID,1.83,[206,196,120],{base:1,alpha:.9,cond:.5,cap:2.8,ext:.1,hot:{t:300,to:'so2',p:.2},tag:['CORROSIVE'],desc:'Oil of vitriol. Strips water out of sugar and wood.'});
def('aquaregia','Aq regia','Aqua regia','HCl+HNO3','liquid',LIQUID,1.3,[255,176,60],{alpha:.88,cond:.5,cap:2.8,tag:['CORROSIVE'],desc:'Acid plus nitric acid. Dissolves gold.'});
def('base','NaOH','Sodium hydroxide','NaOH','liquid',LIQUID,1.25,[200,100,226],{base:1,alpha:.88,cond:.5,cap:2.8,ext:.15,hot:{t:140,to:'steam',p:.4,latent:20},tag:['CAUSTIC'],
  desc:'Caustic soda. Cancels acid, dissolves aluminium and zinc.'});
def('limewater','Limewater','Limewater','Ca(OH)2','liquid',LIQUID,1.05,[214,236,230],{alpha:.7,cond:.6,cap:3,ext:.4,hot:{t:100,to:'steam',p:.4,latent:25},desc:'Goes milky when CO2 bubbles through.'});
def('bleach','Bleach','Bleach','NaOCl','liquid',LIQUID,1.1,[218,232,150],{base:1,alpha:.7,cond:.5,cap:3,ext:.3,tag:['TOXIC'],desc:'Never mix it with acid. It gives off chlorine.'});
def('oil','Oil','Oil','C12H26','liquid',LIQUID,.8,[165,110,36],{base:1,alpha:.92,cond:.15,cap:2,flow:.8,spread:4,flame:[255,140,40],flameT:1000,
  hot:{t:320,to:'smoke',p:.2},burn:{T:250,p:.07,to:'void',heat:450,flame:1,smoke:.5,eq:'Oil + O2 -> CO2 + H2O + soot'},tag:['FLAMMABLE'],desc:'Floats on water. Burns smoky. Stores sodium safely.'});
def('fuel','Fuel','Gasoline','C8H18','liquid',LIQUID,.74,[236,200,120],{base:1,alpha:.65,cond:.12,cap:2,flame:[255,150,50],flameT:1200,
  hot:{t:90,to:'smoke',p:.3},burn:{T:220,p:.18,to:'void',heat:520,flame:1,smoke:.2,boom:[.003,3],eq:'Gasoline + O2 -> CO2 + H2O'},tag:['FLAMMABLE'],desc:'Burns hard and fast. Fumes ignite explosively.'});
def('napalm','Napalm','Napalm','gel','liquid',LIQUID,.9,[236,140,56],{base:1,alpha:.92,cond:.12,cap:2,flow:.18,spread:2,flame:[255,120,30],flameT:1300,
  burn:{T:180,p:.05,to:'void',heat:600,flame:1,smoke:.4,eq:'Gelled fuel burns long'},tag:['FLAMMABLE'],desc:'Sticky fire. Slow, clinging, hard to put out.'});
def('ethanol','Ethanol','Ethanol','C2H5OH','liquid',LIQUID,.79,[172,206,236],{base:1,alpha:.7,cond:.2,cap:2.4,flame:[110,150,255],flameT:900,
  hot:{t:78,to:'ethvapor',p:.3},burn:{T:200,p:.12,to:'void',heat:300,flame:1,eq:'C2H5OH + 3O2 -> 2CO2 + 3H2O'},tag:['FLAMMABLE'],desc:'Alcohol. Evaporates and burns pale blue.'});
def('glycerin','Glycerin','Glycerin','C3H8O3','liquid',LIQUID,1.26,[226,236,214],{base:1,alpha:.6,cond:.2,cap:2.6,flow:.4,spread:3,desc:'Thick and harmless alone. Nitric acid turns it into nitroglycerin.'});
def('nitro','Nitro','Nitroglycerin','C3H5N3O9','liquid',LIQUID,1.6,[250,240,150],{alpha:.85,cond:.2,cap:2.4,flow:.6,spread:3,flame:[255,220,120],flameT:1800,
  burn:{T:150,p:.6,to:'void',heat:1600,flame:1,boom:[.6,7],eq:'4C3H5N3O9 -> 12CO2 + 10H2O + 6N2 + O2'},tag:['EXPLOSIVE'],desc:'Detonates when warmed. Cool hands only.'});
def('mercury','Mercury','Mercury','Hg','liquid',LIQUID,13.5,[196,202,212],{base:1,cond:.6,cap:1.6,spread:4,conduct:0,hot:{t:357,to:'hgvapor',p:.3},tag:['TOXIC'],
  desc:'Liquid metal, 13x water. Gold floats on it. Picks up gold dust into amalgam.'});
def('peroxide','H2O2','Hydrogen peroxide','H2O2','liquid',LIQUID,1.45,[172,224,240],{base:1,alpha:.7,cond:.5,cap:2.8,ext:.3,hot:{t:150,to:'oxygen',p:.4},tag:['OXIDISER'],
  desc:'Breaks into water and oxygen on rust, iron or copper. Turns SO2 into sulfuric acid.'});
def('ln2','LN2','Liquid nitrogen','LN2','liquid',LIQUID,.8,[176,220,255],{base:1,alpha:.7,cond:.6,cap:4,initT:-196,ext:.9,hot:{t:-150,to:'nitrogen',p:.6},tag:['-196 C'],desc:'Flash-freezes water on contact.'});
def('cusol','Cu soln','Copper solution','Cu2+','liquid',LIQUID,1.2,[40,150,220],{alpha:.8,cond:.5,cap:2.8,flame:[60,240,150],flameT:1000,hot:{t:105,to:'steam',p:.3,latent:20,alt:{p:.2,to:'coppersulfate'}},desc:'Blue copper ions. Iron or zinc will plate the copper back out.'});
def('agsol','Ag soln','Silver nitrate','AgNO3','liquid',LIQUID,1.5,[214,226,232],{alpha:.55,cond:.5,cap:2.8,desc:'Clear. Copper grows silver trees in it, salt crashes it into white curds.'});
def('ausol','Au soln','Gold chloride','AuCl3','liquid',LIQUID,1.4,[255,214,78],{alpha:.85,cond:.5,cap:2.8,desc:'Gold in solution. Iron or zinc pulls out gold dust.'});
def('mud','Mud','Mud','dirt+H2O','liquid',LIQUID,1.5,[88,62,42],{cond:.3,cap:2.6,flow:.12,spread:2,hot:{t:110,to:'dirt',p:.04,latent:10},desc:'Slow, thick, great for seeds.'});
def('wetconcrete','Wet crete','Wet concrete','CaSiO aq','liquid',LIQUID,1.9,[130,130,126],{cond:.3,cap:2.6,flow:.14,spread:2,cold:{t:2000,to:'concrete',p:.0025},desc:'Pour it quick. It sets by itself.'});

/* ---------------- gases ---------------- */
def('steam','Steam','Steam','H2O g','gas',GAS,.0006,[226,236,246],{base:1,alpha:.3,cold:{t:70,to:'water',p:.04},desc:'Rises, then rains back as water.'});
def('hydrogen','Hydrogen','Hydrogen','H2','gas',GAS,.00008,[205,215,255],{base:1,alpha:.22,flame:[170,195,255],flameT:900,
  burn:{T:500,p:.5,to:'steam',heat:500,flame:1,boom:[.03,3],eq:'2H2 + O2 -> 2H2O'},tag:['FLAMMABLE'],desc:'Lightest gas. Mixed with oxygen it goes bang.'});
def('oxygen','Oxygen','Oxygen','O2','gas',GAS,.00133,[140,200,255],{base:1,alpha:.28,tag:['OXIDISER'],desc:'Anything burning next to it burns four times faster.'});
def('nitrogen','Nitrogen','Nitrogen','N2','gas',GAS,.00115,[190,200,218],{base:1,alpha:.22,ext:.2,desc:'Inert. Smothers fire.'});
def('chlorine','Chlorine','Chlorine','Cl2','gas',GAS,.0032,[196,232,90],{base:1,alpha:.5,tag:['TOXIC'],desc:'Heavy green gas. Reacts with almost everything.'});
def('methane','Methane','Methane','CH4','gas',GAS,.0007,[150,185,165],{base:1,alpha:.25,flame:[100,150,255],flameT:1000,
  burn:{T:460,p:.5,to:'co2',heat:600,flame:1,boom:[.03,3],eq:'CH4 + 2O2 -> CO2 + 2H2O'},tag:['FLAMMABLE'],desc:'Natural gas. Rises and burns blue.'});
def('co2','CO2','Carbon dioxide','CO2','gas',GAS,.0018,[165,165,180],{base:1,alpha:.3,ext:.28,desc:'Heavy invisible blanket. Puts out fires, turns limewater milky.'});
def('smoke','Smoke','Smoke','soot','gas',GAS,.0008,[92,92,98],{base:1,alpha:.5,lifeBase:90,desc:'Soot drifting up.'});
def('so2','SO2','Sulfur dioxide','SO2','gas',GAS,.0026,[220,208,140],{alpha:.4,tag:['TOXIC'],desc:'Choking gas. Peroxide turns it into sulfuric acid.'});
def('h2s','H2S','Hydrogen sulfide','H2S','gas',GAS,.0014,[210,200,90],{alpha:.35,flame:[90,120,255],flameT:900,burn:{T:260,p:.4,to:'so2',heat:400,flame:1,eq:'2H2S + 3O2 -> 2SO2 + 2H2O'},tag:['TOXIC'],desc:'Rotten egg gas. Meets SO2 and makes sulfur.'});
def('nh3','Ammonia','Ammonia','NH3','gas',GAS,.0007,[196,224,236],{base:1,alpha:.3,tag:['TOXIC'],desc:'Sharp gas. Makes salmiac with acid and nitrate with nitric acid.'});
def('no2','NO2','Nitrogen dioxide','NO2','gas',GAS,.0021,[214,110,40],{alpha:.5,tag:['TOXIC'],desc:'Brown fumes. In water they make nitric acid.'});
def('acetylene','C2H2','Acetylene','C2H2','gas',GAS,.0011,[236,226,170],{alpha:.3,flame:[255,236,180],flameT:2800,
  burn:{T:305,p:.5,to:'co2',heat:1400,flame:1,smoke:.5,boom:[.05,4],eq:'2C2H2 + 5O2 -> 4CO2 + 2H2O'},tag:['FLAMMABLE'],desc:'Welding gas. Burns at 3000 C.'});
def('hgvapor','Hg vapor','Mercury vapour','Hg g','gas',GAS,.008,[205,185,225],{alpha:.4,cold:{t:340,to:'mercury',p:.2},hide:1});
def('ethvapor','EtOH g','Ethanol vapour','EtOH g','gas',GAS,.0016,[185,212,232],{alpha:.3,flame:[110,150,255],flameT:900,cold:{t:70,to:'ethanol',p:.1},
  burn:{T:300,p:.5,to:'co2',heat:400,flame:1,boom:[.03,2],eq:'Ethanol vapour flash'},hide:1});

/* ---------------- metals ---------------- */
metal('iron','Iron','Iron','Fe',7.8,[142,148,158],1538,{base:1,desc:'Rusts in brine. Dissolves in acid. Melts at 1538 C.'});
metal('copper','Copper','Copper','Cu',8.9,[204,118,72],1085,{base:1,desc:'Great conductor. Acid ignores it. Nitric acid dissolves it.'});
metal('zinc','Zinc','Zinc','Zn',7.1,[152,160,170],420,{base:1,desc:'Soft and reactive. Melt it with copper for brass.'});
metal('tin','Tin','Tin','Sn',7.3,[198,202,208],232,{base:1,desc:'Melts at 232 C. Mixes into bronze and solder.'});
metal('lead','Lead','Lead','Pb',11.3,[100,106,132],327,{base:1,desc:'Heavy and soft. Melts at 327 C.'});
metal('silver','Silver','Silver','Ag',10.5,[228,232,238],962,{base:1,desc:'Best conductor. Nitric acid dissolves it.'});
metal('gold','Gold','Gold','Au',19.3,[244,198,62],1064,{base:1,desc:'Noble. Only aqua regia dissolves it.'});
metal('platinum','Platinum','Platinum','Pt',21.4,[216,220,226],1768,{base:1,desc:'Heavier than gold and tougher.'});
metal('nickel','Nickel','Nickel','Ni',8.9,[170,172,176],1455,{base:1,desc:'Hard, shiny, barely corrodes.'});
metal('titanium','Titanium','Titanium','Ti',4.5,[150,156,168],1668,{base:1,desc:'Strong and light. Acids do nothing.'});
metal('tungsten','Tungsten','Tungsten','W',19.3,[92,96,106],3422,{base:1,desc:'Melts at 3422 C. The hottest metal here.'});
metal('aluminum','Aluminium','Aluminium','Al',2.7,[206,210,220],660,{base:1,cond:.85,desc:'Light. Dissolves in base. Mercury strips its coat.'});
metal('magnesium','Magnesium','Magnesium','Mg',1.7,[216,220,224],3000,{base:1,flame:[245,255,255],flameT:3000,
  burn:{T:650,p:.05,to:'ash',heat:2200,flame:1,eq:'2Mg + O2 -> 2MgO'},tag:['BURNS WHITE'],desc:'Burns blinding white at 3000 C. Keeps burning in CO2.'});

/* ---------------- alloys (made by mixing molten metals) ---------------- */
metal('steel','Steel','Steel','Fe+C',7.85,[122,130,146],1450,{cat:'alloy',desc:'Molten iron plus coal. Tougher than iron.'});
metal('brass','Brass','Brass','Cu+Zn',8.5,[220,180,72],930,{cat:'alloy',desc:'Molten copper plus zinc.'});
metal('bronze','Bronze','Bronze','Cu+Sn',8.8,[170,122,62],950,{cat:'alloy',desc:'Molten copper plus tin.'});
metal('solder','Solder','Solder','Sn+Pb',8.4,[186,190,196],183,{cat:'alloy',desc:'Molten tin plus lead. Melts at 183 C.'});
metal('electrum','Electrum','Electrum','Au+Ag',14,[230,208,124],1000,{cat:'alloy',desc:'Molten gold plus silver.'});
def('amalgam','Amalgam','Gold amalgam','Hg+Au','alloy',POWDER,12,[206,208,216],{cond:.5,hot:{t:357,to:'hgvapor',p:.3,alt:{p:.5,to:'golddust'}},tag:['TOXIC'],desc:'Mercury soaked up gold. Heat it and the mercury boils away.'});

/* ---------------- more lab chemicals ---------------- */
def('epsom','Epsom','Epsom salt','MgSO4','powder',POWDER,1.68,[244,244,250],{base:1,cond:.15,desc:'Bath salt. Dissolves in water, and sodium hydroxide turns it into milk of magnesia.'});
def('mgoh2','Mg milk','Milk of magnesia','Mg(OH)2','powder',POWDER,1.5,[250,248,252],{cond:.15,desc:'White precipitate. A gentle antacid.'});
def('fepo4','FePO4','Iron phosphate','FePO4','powder',POWDER,2.4,[120,124,132],{cond:.15,desc:'The grey coat left when phosphoric acid treats rust.'});
def('phosacid','H3PO4','Phosphoric acid','H3PO4','liquid',LIQUID,1.69,[236,236,196],{base:1,alpha:.8,cond:.5,cap:2.8,ext:.15,hot:{t:158,to:'steam',p:.3,latent:20},tag:['CORROSIVE'],desc:'Rust remover and cola ingredient. Turns rust into iron phosphate.'});
def('acetone','Acetone','Acetone','C3H6O','liquid',LIQUID,.79,[196,220,244],{base:1,alpha:.6,cond:.2,cap:2.2,flame:[255,170,90],flameT:1000,
  hot:{t:56,to:'solvvapor',p:.4},burn:{T:200,p:.15,to:'void',heat:350,flame:1,smoke:.2,eq:'C3H6O + 4O2 -> 3CO2 + 3H2O'},tag:['FLAMMABLE'],desc:'Nail polish remover. Evaporates almost at once and burns easily.'});
def('methanol','Methanol','Methanol','CH3OH','liquid',LIQUID,.79,[206,222,238],{base:1,alpha:.6,cond:.2,cap:2.4,flame:[150,170,255],flameT:950,
  hot:{t:65,to:'solvvapor',p:.35},burn:{T:200,p:.1,to:'void',heat:320,flame:1,eq:'2CH3OH + 3O2 -> 2CO2 + 4H2O (almost invisible flame)'},tag:['FLAMMABLE','TOXIC'],desc:'Wood alcohol. Burns with a pale flame. Toxic.'});
def('toluene','Toluene','Toluene','C7H8','liquid',LIQUID,.87,[214,196,150],{base:1,alpha:.7,cond:.15,cap:2.2,flame:[255,140,50],flameT:1100,
  hot:{t:110,to:'solvvapor',p:.3},burn:{T:220,p:.1,to:'void',heat:400,flame:1,smoke:.6,eq:'C7H8 + 9O2 -> 7CO2 + 4H2O (sooty)'},tag:['FLAMMABLE'],desc:'Paint solvent. Nitric acid turns it into TNT.'});
def('solvvapor','Solvent g','Solvent vapour','vapour','gas',GAS,.0034,[200,214,236],{alpha:.3,lifeBase:140,flame:[130,160,255],flameT:900,
  burn:{T:300,p:.5,to:'co2',heat:400,flame:1,boom:[.03,2],eq:'Solvent vapour flash fire'},hide:1});

/* ---------------- more metals ---------------- */
def('rubidium','Rubidium','Rubidium','Rb','metal',POWDER,1.53,[176,178,192],{base:1,cond:.5,cap:1.7,conduct:1,flame:[214,64,130],flameT:1100,
  burn:{T:40,p:.08,to:'ash',heat:450,flame:1,dry:1,eq:'4Rb + O2 -> 2Rb2O (red-violet flame)'},tag:['VIOLENT'],desc:'Heavier cousin of potassium. Lights in air above 40 C.'});
def('cesium','Cesium','Cesium','Cs','metal',POWDER,1.93,[226,206,130],{base:1,cond:.4,cap:1.7,conduct:1,flame:[130,150,255],flameT:1200,
  burn:{T:28,p:.1,to:'ash',heat:500,flame:1,dry:1,eq:'4Cs + O2 -> 2Cs2O (blue flame)'},tag:['VIOLENT'],desc:'Golden and almost liquid. Detonates in water.'});
def('francium','Francium','Francium','Fr','metal',POWDER,2.5,[206,196,216],{base:1,cond:.4,cap:1.7,conduct:1,flame:[200,120,255],flameT:1200,
  burn:{T:20,p:.12,to:'ash',heat:600,flame:1,dry:1,eq:'Francium oxidises on sight'},tag:['VIOLENT','RADIOACTIVE'],desc:'The rarest metal. Reacts with everything, instantly.'});
def('barium','Barium','Barium','Ba','metal',POWDER,3.6,[188,196,170],{base:1,cond:.5,cap:1.7,conduct:1,flame:[120,255,100],flameT:1000,
  burn:{T:350,p:.025,to:'ash',heat:240,flame:1,dry:1,eq:'2Ba + O2 -> 2BaO (green flame)'},tag:['GREEN FLAME','TOXIC'],desc:'Burns apple green. Fizzes in water.'});
metal('beryllium','Beryllium','Beryllium','Be',1.85,[190,198,198],1287,{base:1,tag:['TOXIC'],desc:'Light, stiff and toxic dust. Melts at 1287 C.'});
def('radium','Radium','Radium','Ra','metal',STATIC,5,[200,236,206],{base:1,cond:.5,cap:1.7,conduct:1,emit:260,tag:['RADIOACTIVE'],desc:'Glows and fires a spark into neighbouring metal now and then.'});
metal('cobalt','Cobalt','Cobalt','Co',8.9,[112,132,172],1495,{base:1,desc:'Blue-grey and magnetic. Dissolves slowly in acid.'});
metal('manganese','Manganese','Manganese','Mn',7.4,[162,152,172],1246,{base:1,desc:'Brittle and brisk in acid. Makes steel tough.'});
metal('chromium','Chromium','Chromium','Cr',7.2,[192,202,212],1907,{base:1,desc:'Mirror bright. Melt it into steel to make stainless.'});
metal('gallium','Gallium','Gallium','Ga',5.9,[198,208,218],30,{base:1,desc:'Melts at 30 C, so a warm hand turns it liquid.'});
metal('indium','Indium','Indium','In',7.3,[182,186,202],157,{base:1,desc:'Soft, low melting.'});
metal('bismuth','Bismuth','Bismuth','Bi',9.8,[206,172,190],271,{base:1,desc:'Pink-tinged and low melting. Mixed with tin it makes pewter.'});
metal('stainless','Stainless','Stainless steel','Fe+Cr',7.9,[184,192,202],1400,{cat:'alloy',desc:'Molten steel plus chromium. Does not rust.'});
metal('pewter','Pewter','Pewter','Sn+Bi',7.3,[170,174,172],230,{cat:'alloy',desc:'Soft tin alloy. Molten tin plus bismuth.'});

/* ---------------- plant parts (species data lives in plants.js) ---------------- */
def('bloom','Bloom','Bloom','flower','life',STATIC,.4,[255,150,190],{hide:1,cond:.2,cap:2,flame:[255,150,50],flameT:900,
  burn:{T:240,p:.06,to:'ash',heat:150,flame:1,smoke:.2}});

/* ---------------- minerals / structures ---------------- */
def('glass','Glass','Glass','SiO2','mineral',STATIC,2.5,[150,205,215],{base:1,alpha:.5,cond:.3,cap:1.8,hot:{t:1450,to:'molten'},desc:'Beakers and flasks. Takes 1400 C. Shatters in blasts.'});
def('stone','Stone','Stone','rock','mineral',STATIC,2.6,[108,102,100],{base:1,cond:.25,cap:2,hot:{t:1000,to:'molten'},desc:'Melts at 1000 C into lava.'});
def('ice','Ice','Ice','H2O s','mineral',STATIC,.92,[192,232,255],{base:1,alpha:.8,cond:.4,cap:2.4,initT:-30,hot:{t:1,to:'water',p:.2},desc:'Melts above 0 C. Add salt and it gets colder.'});
def('dryice','Dry ice','Dry ice','CO2 s','mineral',STATIC,1.5,[222,232,238],{base:1,alpha:.9,cond:.3,cap:2,initT:-78,hot:{t:-70,to:'co2',p:.1},tag:['-78 C'],desc:'Frozen CO2. Skips the liquid and goes straight to gas.'});
def('concrete','Concrete','Concrete','set','mineral',STATIC,2.4,[140,140,138],{cond:.25,cap:2.2,desc:'Wet cement that set hard.'});
def('brick','Brick','Brick','fired','mineral',STATIC,2,[178,84,64],{cond:.2,cap:2,desc:'Fired clay.'});
def('wood','Wood','Wood','C6H10','life',STATIC,.7,[132,92,56],{base:1,cond:.15,cap:2,flame:[255,150,50],flameT:950,
  burn:{T:280,p:.02,to:'charcoal',heat:380,flame:1,smoke:.3,eq:'Cellulose + O2 -> CO2 + H2O'},tag:['FLAMMABLE'],desc:'Solid plank. Burns to charcoal.'});
def('seed','Seed','Seed','seed','life',POWDER,1,[218,176,90],{base:1,cond:.15,flame:[255,150,50],flameT:900,burn:{T:260,p:.04,to:'ash',heat:120,flame:1},desc:'Add water and it sprouts.'});
def('plant','Plant','Plant','leaf','life',STATIC,.8,[70,176,84],{cond:.2,cap:2,flame:[255,150,50],flameT:900,
  burn:{T:240,p:.05,to:'charcoal',heat:220,flame:1,smoke:.4,eq:'Plant matter burns'},desc:'Grows upward while it drinks. Burns, and breathes CO2 into oxygen.'});
def('dynamite','Dynamite','Dynamite','TNT+','boom',STATIC,1.5,[212,56,52],{base:1,cond:.1,flame:[255,200,100],flameT:1600,
  burn:{T:180,p:.5,to:'void',heat:1800,flame:1,boom:[1,9],eq:'Dynamite!'},tag:['EXPLOSIVE'],desc:'Solid stick. Big boom.'});

const NE=ELS.length;
const FIRE=ID.fire,SPARK=ID.spark,MOLTEN=ID.molten,OXY=ID.oxygen,GLASS=ID.glass,BENCH=ID.bench,ICE=ID.ice,PLANT=ID.plant;
const resolveKey=k=>k==='void'?0:ID[k];
for(const e of ELS){
  if(e.hot){
    e.hot.toId=e.hot.to==='molten'?MOLTEN:resolveKey(e.hot.to);
    e.hot.srcId=e.hot.src?ID[e.hot.src]:e.id;
    if(e.hot.alt)e.hot.alt.toId=resolveKey(e.hot.alt.to);
  }
  if(e.cold)e.cold.toId=resolveKey(e.cold.to);
  if(e.burn){e.burn.toId=e.burn.to?resolveKey(e.burn.to):0;if(e.burn.moltenOf)e.burn.moltenId=ID[e.burn.moltenOf]}
  if(e.frozen)e.frozenId=ID[e.frozen];
}

/* typed lookups */
const COND=new Float32Array(NE),CAP=new Float32Array(NE),AMB=new Float32Array(NE),LIFE=new Uint8Array(NE),DENS=new Float32Array(NE);
for(const e of ELS){COND[e.id]=e.cond;CAP[e.id]=e.cap;LIFE[e.id]=e.lifeBase||0;DENS[e.id]=e.dens;
  AMB[e.id]=e.beh===EMPTY?.04:(e.beh===GAS?.02:(e.beh===FIREB||e.beh===SPARKB?0:(e.beh===STATIC?.0004:.0015)))}

/* ---------------- reactions ---------------- */
const RX=new Array(NE*NE);
const RECIPES={};  /* product id -> list of strings */
const molt=k=>-(2+ID[k]);       /* result code: molten with aux=k */
function code(k){return k===undefined||k===null?-1:(typeof k==='number'?k:(k==='void'?0:(k.startsWith('molten:')?molt(k.slice(7)):ID[k])))}
function recipe(pid,txt){if(pid<=0)return;(RECIPES[pid]=RECIPES[pid]||[]).push(txt)}
function rx(A,B,o){
  const a=code(o.a),b=code(o.b);
  const base={p:o.p===undefined?1:o.p,heat:o.heat||0,minT:o.minT,boom:o.boom,flame:o.flame?ID[o.flame]:-1,eq:o.eq,emit:o.emit?ID[o.emit]:-1,grow:o.grow?1:0,id:A+'+'+B};
  RX[ID[A]*NE+ID[B]]={...base,a,b,when:o.when};
  if(A!==B)RX[ID[B]*NE+ID[A]]={...base,a:b,b:a,when:o.when?((i,j)=>o.when(j,i)):undefined};
  ELS[ID[A]].rx=1;ELS[ID[B]].rx=1;
  const nm=ELS[ID[A]].nm||ELS[ID[A]].name,nm2=ELS[ID[B]].nm||ELS[ID[B]].name;
  const txt=(nm+' + '+nm2)+(o.minT?' (HOT)':'');
  for(const c of [a,b,o.emit?ID[o.emit]:-1]){if(c>=0)recipe(c,txt);else if(c<=-2)recipe(-c-2,txt)}
}
const each=(list,fn)=>list.forEach(fn);

/* alkali metals + water */
const WATERS=['water','saltwater'];
each(WATERS,w=>{
  rx('lithium',w,{a:'hydrogen',b:'base',p:.12,heat:90,flame:'lithium',eq:'2Li + 2H2O -> 2LiOH + H2'});
  rx('sodium',w,{a:'hydrogen',b:'base',p:.3,heat:220,flame:'sodium',boom:[.012,3],eq:'2Na + 2H2O -> 2NaOH + H2 (violent)'});
  rx('potassium',w,{a:'hydrogen',b:'base',p:.5,heat:380,flame:'potassium',boom:[.05,4],eq:'2K + 2H2O -> 2KOH + H2 (explosive)'});
  rx('calcium',w,{a:'hydrogen',b:'limewater',p:.1,heat:70,eq:'Ca + 2H2O -> Ca(OH)2 + H2'});
});
each(WATERS,w=>{
  rx('rubidium',w,{a:'hydrogen',b:'base',p:.55,heat:420,flame:'rubidium',boom:[.07,5],eq:'2Rb + 2H2O -> 2RbOH + H2 (explosive)'});
  rx('cesium',w,{a:'hydrogen',b:'base',p:.6,heat:480,flame:'cesium',boom:[.15,6],eq:'2Cs + 2H2O -> 2CsOH + H2 (detonates)'});
  rx('francium',w,{a:'hydrogen',b:'base',p:.7,heat:600,flame:'francium',boom:[.25,7],eq:'2Fr + 2H2O -> 2FrOH + H2 (catastrophic)'});
  rx('barium',w,{a:'hydrogen',b:'limewater',p:.12,heat:80,eq:'Ba + 2H2O -> Ba(OH)2 + H2'});
  rx('strontium',w,{a:'hydrogen',b:'base',p:.1,heat:70,eq:'Sr + 2H2O -> Sr(OH)2 + H2'});
});
rx('sodium','steam',{a:'hydrogen',b:'base',p:.3,heat:220,flame:'sodium'});
each(['sodium','potassium','lithium','calcium','rubidium','cesium','francium','barium','strontium'],m=>{
  rx(m,'acid',{a:'hydrogen',b:'salt',p:.5,heat:350,flame:m,boom:m==='potassium'?[.06,4]:[.03,3],eq:m+' + HCl -> salt + H2'});
  rx(m,'vinegar',{a:'hydrogen',b:'salt',p:.3,heat:120,eq:m+' + vinegar -> salt + H2'});
  rx(m,'chlorine',{a:'salt',b:'void',p:.4,heat:600,flame:m,eq:'2M + Cl2 -> 2MCl (brilliant flash)'});
});
/* metals + hydrochloric acid */
each([['iron',.05],['zinc',.12],['magnesium',.3],['aluminum',.07],['tin',.03],['nickel',.02],['lead',.012],['cobalt',.02],['manganese',.06],['chromium',.03],['gallium',.03],['indium',.02],['beryllium',.02]],([m,p])=>
  rx('acid',m,{a:'hydrogen',b:'void',p,heat:m==='magnesium'?60:20,eq:m+' + 2HCl -> chloride + H2'}));
each([['magnesium',.05],['zinc',.02]],([m,p])=>rx('vinegar',m,{a:'hydrogen',b:'void',p,heat:5,eq:m+' + vinegar -> acetate + H2'}));
rx('base','aluminum',{a:'hydrogen',b:'void',p:.04,heat:40,eq:'2Al + 2NaOH + 6H2O -> 2Na[Al(OH)4] + 3H2'});
rx('base','zinc',{a:'hydrogen',b:'void',p:.03,heat:30,eq:'Zn + 2NaOH + 2H2O -> Na2[Zn(OH)4] + H2'});
/* acids and bases */
rx('acid','base',{a:'saltwater',b:'saltwater',p:.7,heat:140,eq:'HCl + NaOH -> NaCl + H2O (neutralisation)'});
rx('vinegar','base',{a:'saltwater',b:'saltwater',p:.5,heat:60,eq:'Vinegar + NaOH -> acetate + H2O'});
rx('sulfuricacid','base',{a:'saltwater',b:'saltwater',p:.7,heat:240,eq:'H2SO4 + 2NaOH -> Na2SO4 + 2H2O'});
rx('nitricacid','base',{a:'saltwater',b:'saltwater',p:.7,heat:160,eq:'HNO3 + NaOH -> NaNO3 + H2O'});
rx('acid','chalk',{a:'co2',b:'saltwater',p:.35,heat:15,eq:'CaCO3 + 2HCl -> CaCl2 + H2O + CO2'});
rx('vinegar','chalk',{a:'co2',b:'saltwater',p:.15,heat:5,eq:'CaCO3 + 2CH3COOH -> Ca(OAc)2 + H2O + CO2'});
rx('acid','bakingsoda',{a:'saltwater',b:'co2',p:.5,heat:10,eq:'NaHCO3 + HCl -> NaCl + H2O + CO2'});
rx('vinegar','bakingsoda',{a:'saltwater',b:'co2',p:.45,heat:0,eq:'NaHCO3 + vinegar -> acetate + H2O + CO2 (volcano)'});
rx('acid','quicklime',{a:'saltwater',b:'saltwater',p:.4,heat:120,eq:'CaO + 2HCl -> CaCl2 + H2O'});
rx('acid','rust',{a:'saltwater',b:'saltwater',p:.15,heat:10,eq:'Fe2O3 + 6HCl -> 2FeCl3 + 3H2O'});
rx('acid','fes',{a:'saltwater',b:'h2s',p:.25,heat:20,eq:'FeS + 2HCl -> FeCl2 + H2S'});
rx('acid','nh3',{a:'void',b:'nh4cl',p:.4,heat:40,eq:'NH3 + HCl -> NH4Cl'});
rx('acid','nitricacid',{a:'aquaregia',b:'aquaregia',p:.5,heat:40,eq:'3HCl + HNO3 -> aqua regia'});
rx('aquaregia','gold',{a:'no2',b:'ausol',p:.1,heat:30,eq:'Au + aqua regia -> AuCl3 + NO2'});
rx('aquaregia','platinum',{a:'no2',b:'ausol',p:.03,heat:30,eq:'Pt + aqua regia -> chloride + NO2'});
rx('acid','agsol',{a:'void',b:'agcl',p:.2});
/* nitric acid on metals */
rx('nitricacid','copper',{a:'no2',b:'cusol',p:.15,heat:30,eq:'Cu + 4HNO3 -> Cu(NO3)2 + 2NO2 + 2H2O'});
rx('nitricacid','silver',{a:'no2',b:'agsol',p:.12,heat:30,eq:'Ag + 2HNO3 -> AgNO3 + NO2 + H2O'});
rx('nitricacid','zinc',{a:'no2',b:'void',p:.12,heat:30});
rx('nitricacid','iron',{a:'no2',b:'rust',p:.08,heat:30});
rx('nitricacid','lead',{a:'no2',b:'void',p:.04,heat:20});
rx('nitricacid','tin',{a:'no2',b:'void',p:.04,heat:20});
rx('nitricacid','nh3',{a:'ammoniumnitrate',b:'void',p:.3,heat:60,eq:'NH3 + HNO3 -> NH4NO3'});
rx('nitricacid','glycerin',{a:'nitro',b:'nitro',p:.04,heat:90,eq:'Glycerin + 3HNO3 -> nitroglycerin + 3H2O'});
rx('no2','water',{a:'void',b:'nitricacid',p:.06,eq:'3NO2 + H2O -> 2HNO3 + NO'});
/* sulfuric acid */
rx('sulfuricacid','sugar',{a:'steam',b:'charcoal',p:.25,heat:200,eq:'C12H22O11 -> 12C + 11H2O (black snake)'});
each(['wood','plant','flour'],m=>rx('sulfuricacid',m,{a:'steam',b:'charcoal',p:.1,heat:100,eq:'Acid strips the water from '+m}));
rx('sulfuricacid','zinc',{a:'hydrogen',b:'void',p:.1,heat:40});
rx('sulfuricacid','iron',{a:'hydrogen',b:'void',p:.06,heat:40});
rx('sulfuricacid','magnesium',{a:'hydrogen',b:'void',p:.3,heat:60});
rx('sulfuricacid','copper',{a:'so2',b:'coppersulfate',p:.08,minT:150,heat:20,eq:'Cu + 2H2SO4 -> CuSO4 + SO2 + 2H2O'});
each(['water','saltwater'],w=>rx('sulfuricacid',w,{a:'water',b:'water',p:.35,heat:90,eq:'Dilution releases heat'}));
rx('sulfuricacid','salt',{a:'acid',b:'void',p:.05,eq:'2NaCl + H2SO4 -> 2HCl + Na2SO4'});
rx('so2','peroxide',{a:'void',b:'sulfuricacid',p:.3,heat:60,eq:'SO2 + H2O2 -> H2SO4'});
rx('so2','water',{a:'void',b:'acid',p:.06,eq:'SO2 + H2O -> H2SO3 (acid rain)'});
rx('h2s','so2',{a:'sulfur',b:'void',p:.25,eq:'2H2S + SO2 -> 3S + 2H2O'});
/* chlorine family */
rx('chlorine','water',{a:'void',b:'acid',p:.05,eq:'Cl2 + H2O -> HCl + HOCl'});
rx('chlorine','base',{a:'void',b:'bleach',p:.12,eq:'Cl2 + 2NaOH -> NaOCl + NaCl + H2O (bleach)'});
rx('chlorine','hydrogen',{a:'acid',b:'void',p:.6,minT:250,heat:900,flame:'hydrogen',boom:[.08,3],eq:'H2 + Cl2 -> 2HCl'});
rx('chlorine','nh3',{a:'nitrogen',b:'acid',p:.2,heat:100,eq:'2NH3 + 3Cl2 -> N2 + 6HCl'});
rx('bleach','acid',{a:'chlorine',b:'saltwater',p:.3,heat:30,eq:'NaOCl + 2HCl -> Cl2 + NaCl + H2O (never mix these)'});
each(['plant','seed'],m=>{rx('bleach',m,{a:'void',b:'ash',p:.1});rx('acid',m,{a:'void',b:'ash',p:.05});rx('base',m,{a:'void',b:'ash',p:.03})});
rx('sulfuricacid','plant',{a:'steam',b:'charcoal',p:.1,heat:100});
/* limes */
rx('quicklime','water',{a:'limewater',b:'limewater',p:.3,heat:150,eq:'CaO + H2O -> Ca(OH)2 (slaking, hot)'});
rx('limewater','co2',{a:'chalk',b:'void',p:.3,eq:'Ca(OH)2 + CO2 -> CaCO3 + H2O (milky)'});
rx('carbide','water',{a:'acetylene',b:'limewater',p:.3,heat:40,eq:'CaC2 + 2H2O -> C2H2 + Ca(OH)2'});
/* salts and sugars */
each(WATERS,w=>rx('salt',w,{a:'saltwater',b:'saltwater',p:.12,eq:'NaCl dissolves'}));
rx('sugar','water',{a:'sugarwater',b:'sugarwater',p:.1,eq:'Sugar dissolves'});
rx('yeast','sugarwater',{b:'ethanol',p:.03,emit:'co2',eq:'C6H12O6 -> 2C2H5OH + 2CO2 (fermentation)'});
rx('ice','salt',{a:'saltwater',b:'void',p:.15,heat:-60,eq:'Ice + NaCl -> brine (freezing mix)'});
rx('dryice','water',{a:'co2',b:'steam',p:.2,heat:-30,eq:'Dry ice + water -> fog'});
/* rust, copper, smelting */
rx('iron','water',{a:'rust',p:.003,eq:'4Fe + 3O2 + 6H2O -> 4Fe(OH)3'});
rx('iron','saltwater',{a:'rust',p:.012,eq:'Iron rusts fast in brine'});
rx('copper','vinegar',{a:'verdigris',p:.02,eq:'Copper + vinegar -> verdigris'});
rx('copper','saltwater',{a:'verdigris',p:.003});
rx('rust','coal',{a:'molten:iron',b:'co2',minT:850,p:.15,heat:200,eq:'2Fe2O3 + 3C -> 4Fe + 3CO2 (smelting)'});
rx('verdigris','coal',{a:'molten:copper',b:'co2',minT:700,p:.15,heat:200,eq:'Verdigris + C -> Cu + CO2 (smelting)'});
rx('sulfur','iron',{a:'void',b:'fes',minT:250,p:.05,heat:120,eq:'Fe + S -> FeS'});
rx('magnesium','co2',{a:'ash',b:'charcoal',minT:650,p:.2,heat:300,eq:'2Mg + CO2 -> 2MgO + C (burns in CO2)'});
/* precipitation + displacement */
each(['iron','zinc','aluminum','magnesium'],m=>{
  rx('cusol',m,{a:'copperdust',b:'void',p:.1,heat:20,eq:'Cu2+ + '+m+' -> Cu + '+m+' ion (plating out)'});
  rx('ausol',m,{a:'golddust',b:'void',p:.1,heat:20,eq:'Au3+ + '+m+' -> Au (gold precipitate)'});
});
rx('agsol','copper',{a:'silverdust',b:'void',p:.07,heat:10,eq:'2Ag+ + Cu -> 2Ag + Cu2+ (silver tree)'});
each(WATERS.concat(['salt']),w=>rx('agsol',w,{a:'agcl',b:w==='salt'?'void':'water',p:.3,eq:'AgNO3 + NaCl -> AgCl + NaNO3 (white precipitate)'}));
rx('coppersulfate','water',{a:'cusol',b:'void',p:.08,eq:'CuSO4 dissolves blue'});
rx('mercury','golddust',{a:'amalgam',b:'void',p:.1,eq:'Hg + Au -> amalgam'});
rx('mercury','aluminum',{b:'ash',p:.03,eq:'4Al + 3O2 -> 2Al2O3 (mercury strips the oxide skin)'});
/* ammonia + haber */
rx('nitrogen','hydrogen',{a:'nh3',b:'nh3',minT:400,p:.03,eq:'N2 + 3H2 -> 2NH3 (Haber)'});
rx('nh3','water',{a:'void',b:'base',p:.05});
/* gas fire reactions */
rx('hydrogen','oxygen',{a:'steam',b:'steam',p:.8,minT:450,heat:1200,flame:'hydrogen',boom:[.25,4],eq:'2H2 + O2 -> 2H2O (explosive)'});
rx('methane','oxygen',{a:'co2',b:'steam',p:.6,minT:460,heat:900,flame:'methane',boom:[.12,3],eq:'CH4 + 2O2 -> CO2 + 2H2O'});
rx('acetylene','oxygen',{a:'co2',b:'steam',p:.7,minT:305,heat:1600,flame:'acetylene',boom:[.15,4],eq:'2C2H2 + 5O2 -> 4CO2 + 2H2O (3000 C)'});
/* electrolysis */
rx('spark','water',{b:'hydrogen',emit:'oxygen',p:.3,eq:'2H2O -> 2H2 + O2 (electrolysis)'});
rx('spark','saltwater',{b:'hydrogen',emit:'chlorine',p:.3,eq:'2NaCl + 2H2O -> H2 + Cl2 + 2NaOH (chlor-alkali)'});
/* melts */
each(WATERS,w=>rx('molten',w,{b:'steam',p:.4,heat:-120,boom:[.01,3],eq:'Hot melt + water -> flash steam (quench)'}));
rx('molten','coal',{a:'molten:steel',b:'void',p:.1,when:(i,j)=>aux[i]===ID.iron,eq:'Molten iron + carbon -> steel'});
rx('molten','charcoal',{a:'molten:steel',b:'void',p:.1,when:(i,j)=>aux[i]===ID.iron,eq:'Molten iron + carbon -> steel'});
/* household and industrial chemicals */
each(WATERS,w=>rx('epsom',w,{a:'saltwater',b:'saltwater',p:.1,eq:'MgSO4 dissolves'}));
rx('epsom','base',{a:'mgoh2',b:'saltwater',p:.15,eq:'MgSO4 + 2NaOH -> Mg(OH)2 + Na2SO4 (milk of magnesia)'});
rx('phosacid','rust',{a:'saltwater',b:'fepo4',p:.12,heat:10,eq:'Rust + H3PO4 -> iron phosphate (rust converter)'});
rx('phosacid','base',{a:'saltwater',b:'saltwater',p:.6,heat:120,eq:'H3PO4 + 3NaOH -> Na3PO4 + 3H2O'});
rx('phosacid','chalk',{a:'co2',b:'saltwater',p:.2,heat:10,eq:'3CaCO3 + 2H3PO4 -> Ca3(PO4)2 + 3H2O + 3CO2'});
rx('phosacid','zinc',{a:'hydrogen',b:'void',p:.03,heat:10});
rx('phosacid','magnesium',{a:'hydrogen',b:'void',p:.1,heat:20});
rx('toluene','nitricacid',{a:'tnt',b:'void',p:.04,heat:80,eq:'C7H8 + 3HNO3 -> C7H5N3O6 + 3H2O (nitration, TNT)'});
/* life */
rx('seed','water',{a:'plant',b:'void',p:.04,eq:'Seed + water -> shoot'});
rx('seed','mud',{a:'plant',b:'dirt',p:.07,eq:'Seed + mud -> shoot'});
rx('plant','water',{p:.45,grow:1,eq:'Plant drinks and grows'});
rx('plant','mud',{p:.45,grow:1});
rx('wood','water',{p:.45,grow:1});
rx('wood','mud',{p:.45,grow:1});
rx('plant','co2',{b:'oxygen',p:.03,eq:'6CO2 + 6H2O -> C6H12O6 + 6O2 (photosynthesis)'});
rx('dirt','water',{a:'mud',b:'mud',p:.05});
rx('clay','water',{a:'mud',b:'mud',p:.04});
rx('cement','water',{a:'wetconcrete',b:'wetconcrete',p:.1,heat:30,eq:'Cement + water -> wet concrete'});

/* alloys: molten metal meets molten metal */
const ALLOY=new Array(NE*NE);
function alloy(a,b,r){ALLOY[ID[a]*NE+ID[b]]=ID[r];ALLOY[ID[b]*NE+ID[a]]=ID[r];recipe(ID[r],'Molten '+ELS[ID[a]].nm+' + '+ELS[ID[b]].nm)}
alloy('copper','zinc','brass');alloy('copper','tin','bronze');alloy('tin','lead','solder');alloy('gold','silver','electrum');alloy('steel','chromium','stainless');alloy('tin','bismuth','pewter');
recipe(ID.steel,'Molten Iron + Coal');

/* phase / burn recipes */
for(const e of ELS){
  if(e.hot){const to=e.hot.toId;if(to!==MOLTEN&&to>0)recipe(to,'Heat '+(e.nm||e.name));if(e.hot.alt&&e.hot.alt.toId>0)recipe(e.hot.alt.toId,'Heat '+(e.nm||e.name))}
  if(e.cold&&e.cold.toId>0)recipe(e.cold.toId,'Cool '+(e.nm||e.name));
  if(e.burn){const b=e.burn;if(b.toId>0)recipe(b.toId,'Burn '+(e.nm||e.name));if(b.moltenId)recipe(b.moltenId,'Burn '+(e.nm||e.name))}
}
recipe(ID.wetconcrete,'Cement + Water');recipe(ID.concrete,'Let Wet crete set');recipe(ID.brick,'Fire Clay');
recipe(ID.mud,'Dirt + Water');recipe(ID.plant,'Seed + Water');

/* ---------------- unlock tree: base set + discoveries ---------------- */
const PRODUCTS=ELS.filter(e=>e.id>0&&!e.base&&!e.hide&&e.cat!=='-').map(e=>e.id);
const moltenName=a=>{const s=ELS[a];return a===ID.stone?'Lava':(a===ID.sand?'Molten glass':'Molten '+s.name.toLowerCase())};
