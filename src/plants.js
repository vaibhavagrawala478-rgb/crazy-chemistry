'use strict';
/* =====================================================================
   CRAZY CHEMISTRY — flora. One seed element, one plant element, one bloom element,
   and a species table (aux byte) that sets colour and growth habit.
   Row: Name | Latin | form | foliage hex | accent hex (variegation, spines, pink veins) | bloom or fruit hex
   Forms: T broadleaf tree, C conifer, M palm, S shrub, F flower, G grass, K columnar cactus,
          R rosette or ball, V vine, P foliage plant, E edible crop
   Colours follow how each plant actually looks (foliage, flowers, fruit), not a generic green.
   ===================================================================== */
const FORMS={
  T:{name:'TREE',bud:110},C:{name:'CONIFER',bud:100},M:{name:'PALM',bud:90},S:{name:'SHRUB',bud:40},F:{name:'FLOWER',bud:24},
  G:{name:'GRASS',bud:8},K:{name:'CACTUS',bud:30},R:{name:'ROSETTE',bud:12},V:{name:'VINE',bud:64},P:{name:'FOLIAGE',bud:16},E:{name:'EDIBLE',bud:20}
};
const SPECIES_RAW=`Abelia|Abelia|S|3d8a45|d9b65a|f6d7e0
Actaea|Actaea|F|2f6b3a|-|f6f2e8
Adam's Needle|Yucca filamentosa|R|7da58a|-|f3ecd0
Aeonium|Aeonium|R|5e9a6a|7a3b62|f2d54a
African Daisy|Osteospermum x hybrida|F|4a8f4f|-|8a5bd0
African Iris|Dietes iridioides|F|4f8c4a|-|f4f1f6
African Marigold|Tagetes erecta|F|3f8a3f|-|f6a21a
African Milk Tree|Euphorbia trigona|K|2f6a45|d9e6d6|-
Baby Rubber Plant|Peperomia obtusifolia|P|2b6b3a|-|-
Baby Tears|Soleirolia soleirolii|G|58b04a|-|-
Baby's Breath|Gypsophila|F|7fa86a|-|fbfaf6
Bacopa|Sutera cordata|V|4c9a50|-|f7f5f8
Bahia Grass|Paspalum notatum|G|5f9b3b|-|-
Ball Cactus|Parodia magnifica|R|5f9a72|e8d27a|f2d03c
Balloon Flower|Platycodon grandiflorus|F|5a9a6a|-|6b6ed8
Baltic Blue Pothos|Epipremnum pinnatum 'Baltic Blue'|V|4f8f86|9dc1bd|-
Cabbage|Brassica oleracea|E|7fb06a|3d7a46|a8d18f
Cactus|Cactaceae|K|4a9564|d9d3a0|e8508c
Caladium|Caladium|P|3f8a4f|d9366a|-
Calathea Beauty Star|Calathea ornata|P|2f6f45|e7a2bf|-
Calathea Musaica|Calathea musaica|P|4f9a50|1f5f36|-
Calathea Orbifolia|Calathea orbifolia|P|7fb08a|bfd8c4|-
Calathea Ornata|Goeppertia ornata|P|2f6b3f|e8a6c0|-
Calathea Roseopicta|Calathea roseopicta|P|2f6b45|d96d96|-
Daffodil|Narcissus|F|4d9a6a|-|f7d417
Dahlia|Dahlia|F|2f6b3a|-|d9246c
Daphne|Daphne|S|2c6b3a|-|e9c0d0
Date Palm|Phoenix dactylifera|M|6f9a5a|-|c4762a
Dawn Redwood|Metasequoia glyptostroboides|C|7ba24a|-|-
Daylily|Hemerocallis|F|4f9a45|-|f08a1c
Delphinium|Delphinium|F|3f8a4a|-|3a5fe0
Dendrobium Orchid|Dendrobium|F|4a8a45|-|c860b0
Early Girl Tomato|Solanum lycopersicum 'Early Girl'|E|3f7f3a|-|d9301f
Easter Cactus|Rhipsalidopsis gaertneri|R|4f9a5f|-|e0452e
Easter Lily|Lilium longiflorum|F|3f8a45|-|fbf9f2
Eastern Prickly Pear Cactus|Opuntia humifusa|K|6a9a5a|d8d4a0|f2d53c
Eastern Red Cedar|Juniperus virginiana|C|2f6a4a|-|-
Eastern White Pine|Pinus strobus|C|4f8a5a|-|-
Echeveria|Echeveria|R|8fb3a8|c9798f|f08a5d
Echinocereus|Echinocereus spp.|R|5a9a5f|e8e0c0|d9408f
Fall Fiesta Sugar Maple|Acer saccharum 'Bailsta'|T|4a9a3f|e0742a|-
False Aralia|Plerandra elegantissima|P|2a5a3a|6a4a3a|-
False Holly|Osmanthus heterophyllus|S|2c6b3a|-|f4efe0
False Indigo|Baptisia australis|F|6a9a8a|-|4a4ac8
False Sunflower|Heliopsis helianthoides|F|4a8a45|-|f5c518
Fan Flower|Scaevola aemula|V|4a9a50|-|6a6ad8
Fatsia Spider Web|Fatsia japonica 'Spider Web'|S|3f8a55|dfeee0|efe8d0
Fava Bean|Vicia faba|E|5f9a6a|-|f4f1ee
Garden Phlox|Phlox paniculata|F|3f8a45|-|d94f9a
Gardenia|Gardenia jasminoides|S|1f5a35|-|fbf9f2
Garlic|Allium sativum|E|6fa05a|-|f1ead8
Gas Plant|Dictamnus albus|F|4f8a4a|-|e8b4d0
Gasteria|Gasteria|R|2f6a45|d8e4d6|e8756a
Gaura|Oenothera lindheimeri|F|5f9a55|-|f7e4ea
Gazania|Gazania rigens|F|7fa090|-|f29a1c
Geranium|Pelargonium spp.|F|3f8a45|7a4a3a|e0332c
Halcyon Hosta|Hosta 'Halcyon'|R|7fa5c0|-|b6a0e0
Hardy Geranium|Geranium spp.|F|4f9a4a|-|7a6ad8
Hardy Hibiscus|Hibiscus moscheutos|S|3f8a45|-|f07aa8
Hardy Kiwi|Actinidia arguta|V|4f9a45|-|9bcf5a
Hardy Mum|Chrysanthemum morifolium|F|3f7f45|-|e8782a
Hawaiian Pothos|Epipremnum aureum 'Hawaiian'|V|4f9a4a|e8d65a|-
Haworthia Cooperi|Haworthia cooperi|R|8fc29a|-|-
Haworthia|Haworthia|R|2f6a45|e8efe8|f4f1ea
Ice Plant|Delosperma|R|7fb08a|-|e0409a
Iceland Poppy|Papaver nudicaule|F|7fa88a|-|f6902a
Impatiens|Impatiens|F|3f8a45|-|e8508a
Inaba Shidare Japanese Maple|Acer palmatum 'Inaba Shidare'|T|6a1f2a|8a2a3a|-
Inch Plant|Tradescantia zebrina|V|5f4a8a|b8c0c8|d870c0
Incrediball Hydrangea|Hydrangea arborescens 'Abetwo'|S|4a8a4a|-|f6f4ea
Indian Hawthorn|Rhaphiolepis indica|S|2c6b3a|-|f6cddc
Inkberry Holly|Ilex glabra|S|2a5a35|-|2a2a2f
Jacaranda Tree|Jacaranda mimosifolia|T|4f9a50|-|8a6fd8
Jack-in-the-Pulpit|Arisaema triphyllum|F|3f8a45|-|7a4a8a
Jackfruit|Artocarpus heterophyllus|T|2f6a3a|-|a8b84a
Jackman Clematis|Clematis 'Jackmanii'|V|4a8a4a|-|5a2fb0
Jacob's Ladder|Polemonium caeruleum|F|5f9a5a|-|7a8ae8
Jade Plant|Crassula ovata|S|3f8a55|b84a4a|f7e4ea
Jade Pothos|Epipremnum aureum 'Jade'|V|2f8a45|-|-
Jalapeño Pepper|Capsicum annuum 'Jalapeño'|E|3f8a3f|-|4fa030
Kalanchoe Fedtschenkoi|Bryophyllum fedtschenkoi|R|8fb3a8|c98a9a|e8785a
Kalanchoe Pinnata|Kalanchoe pinnata|R|5f9a5a|a85a6a|d98a8a
Kalanchoe Thyrsiflora|Kalanchoe thyrsiflora|R|9fb89a|d86a4a|f2d65a
Kalanchoe|Kalanchoe blossfeldiana|R|2f7a45|-|e0302c
Kale|Brassica oleracea|E|356a50|6a4a7a|-
Kangaroo Paw|Anigozanthos|F|4f8a55|-|d8382c
Karl Foerster Feather Reed Grass|Calamagrostis x acutifolia 'Karl Foerster'|G|5f9a4a|-|d8c58a
Katsura Tree|Cercidiphyllum japonicum|T|5aa06a|e8a04a|-
Lace Aloe|Aristaloe aristata|R|6fa08a|e8f0e8|f27a4a
Lacecap Hydrangea|Hydrangea macrophylla|S|4a8a4a|-|7a9ae0
Lady Fern|Athyrium filix-femina|P|6fb050|-|-
Lady Palm|Rhapis excelsa|M|2f6a3a|-|-
Lady Slipper Orchid|Cypripedium spp.|F|4f8a4a|-|e88ab0
Lady's Mantle|Alchemilla mollis|F|7fb060|-|d6e25e
Lamb's Ear|Stachys byzantina|R|b8c4b4|-|c880b8
Lantana|Lantana camara|S|3f8a45|-|f08a2a
'Miss Kim' Lilac|Syringa pubescens subsp. patula 'Miss Kim'|S|3f8a4a|-|c8a0e0
Macadamia Nut Tree|Macadamia spp.|T|2c6b3a|-|f4ecd8
Mache|Valerianella locusta|E|5fa055|-|-
Macho Fern|Nephrolepis biserrata|P|5fa050|-|-
Madagascar Palm|Pachypodium lamerei|K|7f9a78|e0e0d8|f7f5ee
Magnolia Ann|Magnolia liliflora x 'Ann'|T|3f8a45|-|b83a8a
Magnolia Grandiflora|Magnolia grandiflora|T|1f5a35|-|fbf9f2
Mahonia|Mahonia|S|2c5f45|-|f2d83a
N'Joy Pothos|Epipremnum aureum 'N'Joy'|V|3f9a50|f2f2e8|-
Nanking Cherry|Prunus tomentosa|S|4f9a45|-|f8d8e0
Nasturtium|Tropaeolum|V|5fa050|-|f06a1a
Natal Plum|Carissa macrocarpa|S|2c6b3a|-|f7f4ee
Nemesia|Nemesia|F|4f8a4a|-|e070b8
Neon Pothos|Epipremnum aureum 'Neon'|V|8cc83a|-|-
Neoregelia Bromeliad|Neoregelia|R|4f8a4a|d8302c|-
Nerve Plant|Fittonia albivenis|P|2f7a45|f0a0b8|-
Oakleaf Hydrangea|Hydrangea quercifolia|S|3f7a40|-|f4f0e0
October Glory Maple|Acer rubrum 'October Glory'|T|4f9a3a|c0301f|-
Okra|Abelmoschus esculentus|E|3f8a3a|-|6aa83a
Oleander|Nerium oleander|S|3f7a3a|-|f07aa8
Onion|Allium cepa|E|6fa850|-|d2a85c
Orange Daylily|Hemerocallis fulva|F|4f9a45|-|f58a1c
Orange Jasmine|Murraya paniculata|S|2c6b3a|-|f7f4ee
Orange Lily|Lilium bulbiferum|F|4a8a45|-|f0731a
Pagoda Dogwood|Cornus alternifolia|T|4f9a4a|-|f7f4ee
Painted Daisy|Tanacetum coccineum|F|4f8f4a|-|e03a5a
Painted Lady Philodendron|Philodendron erubescens 'Painted Lady'|V|7fc040|4a8a3a|-
Palm Tree|Arecaceae|M|3f8a45|-|-
Pampas Grass|Cortaderia selloana|G|7fa070|-|f2f0e6
Pansy|Viola x wittrockiana|F|3f8a45|-|8a4ad0
Papaya|Carica papaya|T|4f9a4a|-|f28a2a
Paper Birch|Betula papyrifera|T|6fae4a|-|-
Quaking Aspen|Populus tremuloides|T|7fb850|-|-
Queen Anne's Lace|Daucus carota|F|5f9a55|-|f8f6ee
Queen Elizabeth Rose|Rosa 'Queen Elizabeth'|S|2f6a3a|-|f09ab8
Quick Fire Hydrangea|Hydrangea paniculata 'Bulk'|S|4a8a4a|-|e87a9a
Quinoa|Chenopodium quinoa|E|6fa05a|-|c8502a
Radish|Raphanus sativus|E|4f9a4a|-|d9304a
Rain Lily|Zephyranthes candida|G|3f8a45|-|faf8f2
Rainbow Elephant Bush|Portulacaria afra 'Variegata'|S|6fa05a|f0e8b0|-
Rambutan|Nephelium lappaceum|T|2f6a3a|-|d8302a
Ramps|Allium tricoccum|E|4f9a50|-|c87a98
Ranunculus|Ranunculus spp.|F|4a8a4a|-|f08a3a
Raspberry Bush|Rubus idaeus|S|4f9a45|-|d8244a
Rat Tail Cactus|Aporocactus flagelliformis|V|6fa05a|-|e8406a
Sago Palm|Cycas revoluta|M|2c6a3a|-|-
San Marzano Tomato|Solanum lycopersicum 'San Marzano'|E|3f7f3a|-|cf2a1f
Saskatoon Serviceberry|Amelanchier alnifolia|S|4f9a4a|-|f7f4ee
Sassafras|Sassafras albidum|T|5fa045|-|d6d85a
Satin Pothos|Scindapsus pictus|V|4f8a5f|c7d4c8|-
Satsuma Mandarin|Citrus unshiu|T|2f6a3a|-|f78c1a
Saucer Magnolia|Magnolia x soulangiana|T|4a8a45|-|f3b8d0
Scabiosa|Scabiosa|F|5f9a65|-|9aaaf0
Tall Fescue Grass|Festuca arundinacea|G|5a9a40|-|-
Tamarack|Larix laricina|C|7aae4a|-|-
Tarragon|Artemisia dracunculus|E|5f9a50|-|-
Taylor Juniper|Juniperus virginiana 'Taylor'|C|5a8a85|-|-
Tea Olive|Osmanthus fragrans|S|2c6b3a|-|f2c870
Tea Plant|Camellia sinensis|S|2f7a40|-|f7f4e8
Teddy Bear Cactus|Cylindropuntia bigelovii|K|c9b868|8fa86a|d8d860
Teddy Bear Sunflower|Helianthus annuus 'Teddy Bear'|F|4f9a3f|-|f6c012
Utah Juniper|Juniperus osteosperma|C|6f9a80|-|-
Vanda Orchid|Vanda|F|5fa045|-|7a5fe0
Vanilla Strawberry Hydrangea|Hydrangea paniculata 'Renhy'|S|4a8a4a|-|f0b0c0
Vanilla|Vanilla planifolia|V|3f8a4a|-|e8e8a0
Variegated String of Hearts|Ceropegia woodii var. variegata|V|6f9a8a|e8a0b8|-
Venus Fly Trap|Dionaea muscipula|R|6fb040|d8303c|f7f5ee
Verbena|Verbena x hybrida|V|4f8a4a|-|9a4ad8
Veronica Spicata|Veronica spicata|F|4f8a55|-|4a5ae0
Viburnum|Viburnum|S|3f8a45|-|f7f5ee
Wallflower|Erysimum|F|5f9a5a|-|f29a2a
Wandflower|Gaura lindheimeri|F|5f9a55|-|f7e6ee
Wasabi|Wasabia japonica|E|3f8a4a|-|9cc86a
Washington Hawthorn|Crataegus phaenopyrum|T|4f9a4a|-|d8302a
Water Lettuce|Pistia stratiotes|P|8fcf7a|-|-
Water Lily|Nymphaea|F|3f8a4a|-|f07aa8
Watercress|Nasturtium officinale|E|4f9a40|-|-
Watermelon Peperomia|Peperomia argyreia|P|5fa088|cfe3d6|-
Xanthosoma|Xanthosoma spp.|P|3f9a4a|-|-
Yarrow|Achillea millefolium|F|6a9a5a|-|f6f2e6
Yaupon|Ilex vomitoria|S|3f7f45|-|d8302a
Yellow Bells|Tecoma stans|S|4f9a3a|-|f6d21a
Yellow Iris|Iris pseudacorus|F|5fa070|-|f7d21a
Yellow Pear Tomato|Solanum lycopersicum 'Yellow Pear'|E|3f7f3a|-|f5d02a
Yerba Mate|Ilex paraguariensis|S|3f7a40|-|f4f0e6
Yew Tree|Taxus|C|1f5238|-|d8302f
Yucca Plant|Yucca|R|7fa58a|-|f4efd8
Zebra Grass|Miscanthus sinensis 'Zebrinus'|G|6fa04a|e8d870|-
Zebra Plant|Aphelandra squarrosa|P|2f6a45|f0f0e0|f6c81a
Zinnia|Zinnia elegans|F|4a8a45|-|e03a8a
Zoysia Grass|Zoysia spp.|G|6aa048|-|-
ZZ Plant|Zamioculcas zamiifolia|P|1f6a3f|-|-`;

/* trunk colours for trees that have a distinctive bark */
const TRUNK_SPECIAL={'Paper Birch':'e6e2d8','Quaking Aspen':'d6dccb','Date Palm':'8a6a45','Lady Palm':'7a5a3a','Palm Tree':'8a6a45','Sago Palm':'6a4a35',
  'Eastern White Pine':'6a4632','Eastern Red Cedar':'7a4a36','Dawn Redwood':'7a4a38','Tamarack':'7a5a42','Utah Juniper':'7a5a46','Taylor Juniper':'7a5a46','Yew Tree':'7a4a3a'};
const hex=h=>[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];
const SPN=['Plant'],SPL=['plant'],SPF=['F'],SPC=[hex('46aa54')],SPA=[null],SPB=[hex('ff96be')],SPT=[hex('845c38')];
for(const line of SPECIES_RAW.split('\n')){
  const [nm,latin,form,leaf,acc,bl]=line.split('|');
  SPN.push(nm);SPL.push(latin);SPF.push(form);SPC.push(hex(leaf));SPA.push(acc==='-'?null:hex(acc));SPB.push(bl==='-'?null:hex(bl));
  SPT.push(TRUNK_SPECIAL[nm]?hex(TRUNK_SPECIAL[nm]):hex('845c38'));
}
const NS=SPN.length-1;
const BUD=new Uint8Array(NS+1);
for(let s=0;s<=NS;s++)BUD[s]=FORMS[SPF[s]].bud;
const GROWN=new Uint8Array(NS+1);
const LEAFPAL=new Uint32Array((NS+1)*8),BLOOMPAL=new Uint32Array((NS+1)*8),TRUNKPAL=new Uint32Array((NS+1)*8);
const pk=(c,f)=>{const q=k=>Math.max(0,Math.min(255,c[k]*f))|0;return (255<<24)|(q(2)<<16)|(q(1)<<8)|q(0)};
for(let s=0;s<=NS;s++){
  const lc=SPC[s],ac=SPA[s],bc=SPB[s]||lc,tc=SPT[s];
  for(let v=0;v<8;v++){
    const f=.84+.3*(v/7);
    LEAFPAL[s*8+v]=pk(ac&&v>=(SPF[s]==='K'?7:5)?ac:lc,f);
    BLOOMPAL[s*8+v]=pk(bc,f);
    TRUNKPAL[s*8+v]=pk(tc,.86+.24*(v/7));
  }
}
