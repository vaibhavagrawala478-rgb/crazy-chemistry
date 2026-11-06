'use strict';
/* =====================================================================
   CRAZY CHEMISTRY — flora. One seed element, one plant element, one bloom element,
   and a species table (aux byte) that sets look and growth habit.
   Code: form (T tree, S shrub, F flower, G grass, K cactus/succulent, V vine, P foliage, E edible)
         leaf colour, bloom colour (n = none)
   ===================================================================== */
const LEAFC={g:[64,170,80],d:[30,112,62],l:[140,200,70],b:[70,160,150],p:[122,70,122],r:[200,70,50],y:[182,190,72],s:[150,176,160],v:[124,192,112]};
const BLOOMC={w:[250,248,240],y:[255,220,60],o:[255,150,50],r:[236,50,62],p:[255,150,190],m:[222,60,160],u:[152,92,222],b:[92,142,255],g:[160,232,120]};
const FORMS={
  T:{name:'TREE',bud:110},S:{name:'SHRUB',bud:40},F:{name:'FLOWER',bud:24},G:{name:'GRASS',bud:7},
  K:{name:'CACTUS OR SUCCULENT',bud:26},V:{name:'VINE',bud:64},P:{name:'FOLIAGE',bud:16},E:{name:'EDIBLE',bud:20}
};
const SPECIES_RAW=`Abelia|Abelia|Sgp
Actaea|Actaea|Fdw
Adam's Needle|Yucca filamentosa|Kbw
Aeonium|Aeonium|Kpy
African Daisy|Osteospermum x hybrida|Fgu
African Iris|Dietes iridioides|Fgw
African Marigold|Tagetes erecta|Fgy
African Milk Tree|Euphorbia trigona|Kdn
Baby Rubber Plant|Peperomia obtusifolia|Pdn
Baby Tears|Soleirolia soleirolii|Gln
Baby's Breath|Gypsophila|Fgw
Bacopa|Sutera cordata|Vgw
Bahia Grass|Paspalum notatum|Gyn
Ball Cactus|Parodia magnifica|Kgy
Balloon Flower|Platycodon grandiflorus|Fgb
Baltic Blue Pothos|Epipremnum pinnatum 'Baltic Blue'|Vbn
Cabbage|Brassica oleracea|Egg
Cactus|Cactaceae|Kdp
Caladium|Caladium|Prn
Calathea Beauty Star|Calathea ornata|Pdp
Calathea Musaica|Calathea musaica|Pvn
Calathea Orbifolia|Calathea orbifolia|Pbn
Calathea Ornata|Goeppertia ornata|Ppn
Calathea Roseopicta|Calathea roseopicta|Prp
Daffodil|Narcissus|Fgy
Dahlia|Dahlia|Fgm
Daphne|Daphne|Sdp
Date Palm|Phoenix dactylifera|Tgn
Dawn Redwood|Metasequoia glyptostroboides|Tln
Daylily|Hemerocallis|Fgo
Delphinium|Delphinium|Fgb
Dendrobium Orchid|Dendrobium|Fdm
Early Girl Tomato|Solanum lycopersicum 'Early Girl'|Egr
Easter Cactus|Rhipsalidopsis gaertneri|Kgr
Easter Lily|Lilium longiflorum|Fgw
Eastern Prickly Pear Cactus|Opuntia humifusa|Kdy
Eastern Red Cedar|Juniperus virginiana|Tdn
Eastern White Pine|Pinus strobus|Tdn
Echeveria|Echeveria|Ksp
Echinocereus|Echinocereus spp.|Kgm
Fall Fiesta Sugar Maple|Acer saccharum 'Bailsta'|Trn
False Aralia|Plerandra elegantissima|Pdn
False Holly|Osmanthus fragrans|Sdw
False Indigo|Baptisia australis|Fbu
False Sunflower|Heliopsis helianthoides|Fgy
Fan Flower|Scaevola aemula|Vgu
Fatsia Spider Web|Fatsia japonica 'Spider Web'|Sgw
Fava Bean|Vicia faba|Egw
Garden Phlox|Phlox paniculata|Fgm
Gardenia|Gardenia jasminoides|Sdw
Garlic|Allium sativum|Elw
Gas Plant|Dictamnus albus|Fgp
Gasteria|Gasteria|Kdr
Gaura|Oenothera lindheimeri|Fgw
Gazania|Gazania rigens|Fso
Geranium|Pelargonium spp.|Fgr
Halcyon Hosta|Hosta 'Halcyon'|Pbu
Hardy Geranium|Geranium spp.|Fgu
Hardy Hibiscus|Hibiscus moscheutos|Sgp
Hardy Kiwi|Actinidia arguta|Vgg
Hardy Mum|Chrysanthemum morifolium|Fgo
Hawaiian Pothos|Epipremnum aureum 'Hawaiian'|Vvn
Haworthia Cooperi|Haworthia cooperi|Kbn
Haworthia|Haworthia|Kdw
Ice Plant|Delosperma|Kgm
Iceland Poppy|Papaver nudicaule|Fgo
Impatiens|Impatiens|Fgp
Inaba Shidare Japanese Maple|Acer palmatum 'Inaba Shidare'|Trn
Inch Plant|Tradescantia zebrina|Vpn
Incrediball Hydrangea|Hydrangea arborescens 'Abetwo'|Sgw
Indian Hawthorn|Rhaphiolepis indica|Sdp
Inkberry Holly|Ilex glabra|Sdn
Jacaranda Tree|Jacaranda mimosifolia|Tgu
Jack-in-the-Pulpit|Arisaema triphyllum|Fdp
Jackfruit|Artocarpus heterophyllus|Tdy
Jackman Clematis|Clematis 'Jackmanii'|Vgu
Jacob's Ladder|Polemonium caeruleum|Fgb
Jade Plant|Crassula ovata|Kdp
Jade Pothos|Epipremnum aureum 'Jade'|Vdn
Jalapeño Pepper|Capsicum annuum 'Jalapeño'|Egr
Kalanchoe Fedtschenkoi|Bryophyllum fedtschenkoi|Ksn
Kalanchoe Pinnata|Kalanchoe pinnata|Kgr
Kalanchoe Thyrsiflora|Kalanchoe thyrsiflora|Ksy
Kalanchoe|Kalanchoe blossfeldiana|Kdr
Kale|Brassica oleracea|Edp
Kangaroo Paw|Anigozanthos|Fgr
Karl Foerster Feather Reed Grass|Calamagrostis x acutifolia 'Karl Foerster'|Gyn
Katsura Tree|Cercidiphyllum japonicum|Tgp
Lace Aloe|Aristaloe aristata|Ksr
Lacecap Hydrangea|Hydrangea macrophylla|Sgb
Lady Fern|Athyrium filix-femina|Pln
Lady Palm|Rhapis excelsa|Tdn
Lady Slipper Orchid|Cypripedium spp.|Fgm
Lady's Mantle|Alchemilla mollis|Fsy
Lamb's Ear|Stachys byzantina|Fsp
Lantana|Lantana camara|Sgo
'Miss Kim' Lilac|Syringa pubescens subsp. patula 'Miss Kim'|Sgu
Macadamia Nut Tree|Macadamia spp.|Tdw
Mache|Valerianella locusta|Elw
Macho Fern|Nephrolepis biserrata|Pln
Madagascar Palm|Pachypodium lamerei|Kdw
Magnolia Ann|Magnolia liliflora x 'Ann'|Tgm
Magnolia Grandiflora|Magnolia grandiflora|Tdw
Mahonia|Mahonia|Sdy
N'Joy Pothos|Epipremnum aureum 'N'Joy'|Vvn
Nanking Cherry|Prunus tomentosa|Sgp
Nasturtium|Tropaeolum|Vgo
Natal Plum|Carissa macrocarpa|Sdw
Nemesia|Nemesia|Fgp
Neon Pothos|Epipremnum aureum 'Neon'|Vln
Neoregelia Bromeliad|Neoregelia|Pgr
Nerve Plant|Fittonia albivenis|Pvr
Oakleaf Hydrangea|Hydrangea quercifolia|Sgw
October Glory Maple|Acer rubrum 'October Glory'|Trn
Okra|Abelmoschus esculentus|Egg
Oleander|Nerium oleander|Sdp
Onion|Allium cepa|Elw
Orange Daylily|Hemerocallis fulva|Fgo
Orange Jasmine|Murraya paniculata|Sdw
Orange Lily|Lilium bulbiferum|Fgo
Pagoda Dogwood|Cornus alternifolia|Tgw
Painted Daisy|Tanacetum coccineum|Fgr
Painted Lady Philodendron|Philodendron erubescens 'Painted Lady'|Vyn
Palm Tree|Arecaceae|Tgn
Pampas Grass|Cortaderia selloana|Gsw
Pansy|Viola x wittrockiana|Fgu
Papaya|Carica papaya|Tgo
Paper Birch|Betula papyrifera|Tln
Quaking Aspen|Populus tremuloides|Tln
Queen Anne's Lace|Daucus carota|Fgw
Queen Elizabeth Rose|Rosa 'Queen Elizabeth'|Sdp
Quick Fire Hydrangea|Hydrangea paniculata 'Bulk'|Sgp
Quinoa|Chenopodium quinoa|Egr
Radish|Raphanus sativus|Egr
Rain Lily|Zephyranthes candida|Gdw
Rainbow Elephant Bush|Portulacaria afra 'Variegata'|Kvp
Rambutan|Nephelium lappaceum|Tdr
Ramps|Allium tricoccum|Elw
Ranunculus|Ranunculus spp.|Fgo
Raspberry Bush|Rubus idaeus|Sgr
Rat Tail Cactus|Aporocactus flagelliformis|Kgm
Sago Palm|Cycas revoluta|Tdn
San Marzano Tomato|Solanum lycopersicum 'San Marzano'|Egr
Saskatoon Serviceberry|Amelanchier alnifolia|Sgw
Sassafras|Sassafras albidum|Tgy
Satin Pothos|Scindapsus pictus|Vsn
Satsuma Mandarin|Citrus unshiu|Tdo
Saucer Magnolia|Magnolia x soulangiana|Tgp
Scabiosa|Scabiosa|Fgb
Tall Fescue Grass|Festuca arundinacea|Ggn
Tamarack|Larix laricina|Tln
Tarragon|Artemisia dracunculus|Egn
Taylor Juniper|Juniperus virginiana 'Taylor'|Tbn
Tea Olive|Osmanthus fragrans|Sdw
Tea Plant|Camellia sinensis|Sdw
Teddy Bear Cactus|Cylindropuntia bigelovii|Kyn
Teddy Bear Sunflower|Helianthus annuus 'Teddy Bear'|Fgy
Utah Juniper|Juniperus osteosperma|Tbn
Vanda Orchid|Vanda|Fgu
Vanilla Strawberry Hydrangea|Hydrangea paniculata 'Renhy'|Sgp
Vanilla|Vanilla planifolia|Vgy
Variegated String of Hearts|Ceropegia woodii var. variegata|Vvp
Venus Fly Trap|Dionaea muscipula|Fgr
Verbena|Verbena x hybrida|Vgm
Veronica Spicata|Veronica spicata|Fgb
Viburnum|Viburnum|Sgw
Wallflower|Erysimum|Fgo
Wandflower|Gaura lindheimeri|Fgw
Wasabi|Wasabia japonica|Egn
Washington Hawthorn|Crataegus phaenopyrum|Tgr
Water Lettuce|Pistia stratiotes|Pln
Water Lily|Nymphaea|Fgp
Watercress|Nasturtium officinale|Egn
Watermelon Peperomia|Peperomia argyreia|Psn
Xanthosoma|Xanthosoma spp.|Pdn
Yarrow|Achillea millefolium|Fsw
Yaupon|Ilex vomitoria|Sdr
Yellow Bells|Tecoma stans|Sgy
Yellow Iris|Iris pseudacorus|Fgy
Yellow Pear Tomato|Solanum lycopersicum 'Yellow Pear'|Egy
Yerba Mate|Ilex paraguariensis|Sgn
Yew Tree|Taxus|Tdn
Yucca Plant|Yucca|Kbw
Zebra Grass|Miscanthus sinensis 'Zebrinus'|Gvn
Zebra Plant|Aphelandra squarrosa|Pdy
Zinnia|Zinnia elegans|Fgm
Zoysia Grass|Zoysia spp.|Gln
ZZ Plant|Zamioculcas zamiifolia|Pdn`;

const SPN=['Plant'],SPL=['plant'],SPF=['F'],SPC=[LEAFC.g],SPB=[BLOOMC.p];
for(const line of SPECIES_RAW.split('\n')){
  const [nm,latin,code]=line.split('|');
  SPN.push(nm);SPL.push(latin);SPF.push(code[0]);SPC.push(LEAFC[code[1]]);SPB.push(code[2]==='n'?null:BLOOMC[code[2]]);
}
const NS=SPN.length-1;
const BUD=new Uint8Array(NS+1);
for(let s=0;s<=NS;s++)BUD[s]=FORMS[SPF[s]].bud;
const GROWN=new Uint8Array(NS+1);
const LEAFPAL=new Uint32Array((NS+1)*8),BLOOMPAL=new Uint32Array((NS+1)*8);
for(let s=0;s<=NS;s++){
  const lc=SPC[s],bc=SPB[s]||lc;
  for(let v=0;v<8;v++){
    const f=.82+.36*(v/7);
    const p=(c,k)=>Math.max(0,Math.min(255,c[k]*f))|0;
    LEAFPAL[s*8+v]=(255<<24)|(p(lc,2)<<16)|(p(lc,1)<<8)|p(lc,0);
    BLOOMPAL[s*8+v]=(255<<24)|(p(bc,2)<<16)|(p(bc,1)<<8)|p(bc,0);
  }
}
