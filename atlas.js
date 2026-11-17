const gear = [
  {name:"Field Bow",category:"Weapons",detail:"A quiet recurved bow for taking careful shots from cover."},
  {name:"Slingcaster",category:"Weapons",detail:"Launches elemental payloads across a crowded trail."},
  {name:"Hunter Spear",category:"Weapons",detail:"A balanced close-range tool for defense and precision strikes."},
  {name:"Tripwire Kit",category:"Weapons",detail:"Deploy a concealed line to slow or disrupt a pursuing machine."},
  {name:"Shock Bolts",category:"Ammunition",detail:"Charged bolts designed to interrupt exposed mechanisms."},
  {name:"Precision Arrows",category:"Ammunition",detail:"Heavy-fletched arrows for accurate long-range shots."},
  {name:"Fire Canisters",category:"Ammunition",detail:"Sealed incendiary charges for controlled area denial."},
  {name:"Frost Pouches",category:"Ammunition",detail:"Cold-packed ammunition that chills vulnerable targets."},
  {name:"Smoke Bombs",category:"Ammunition",detail:"Break line of sight and make a fast retreat through haze."},
  {name:"Rope Coils",category:"Tools",detail:"Tough braided line for climbing, hauling, and quick repairs."},
  {name:"Climbing Hooks",category:"Tools",detail:"A pair of forged hooks for rough rock and old structures."},
  {name:"Focus Lens",category:"Tools",detail:"A calibrated lens for reading faint signals and tracks."},
  {name:"Trail Markers",category:"Tools",detail:"Bright weatherproof tags to make a safe route easy to find."},
  {name:"Repair Spanner",category:"Tools",detail:"A compact wrench for field repairs to straps and equipment."},
  {name:"Signal Mirror",category:"Tools",detail:"Flash a distant outpost when radio contact is unreliable."},
  {name:"Herbal Poultice",category:"Medicine",detail:"A soothing field dressing made from dried valley herbs."},
  {name:"Stitching Roll",category:"Medicine",detail:"Clean thread, needles, and gauze for minor injuries."},
  {name:"Antidote Vial",category:"Medicine",detail:"A broad-spectrum remedy for common trail toxins."},
  {name:"Cooling Salve",category:"Medicine",detail:"Protects skin from heat, ash, and sun-baked stone."},
  {name:"Focus Tonic",category:"Medicine",detail:"A bitter herbal blend used to stay alert on long watches."},
  {name:"Dried Berries",category:"Provisions",detail:"Lightweight trail food with a bright, tart finish."},
  {name:"Smoked Rations",category:"Provisions",detail:"A durable meal wrapped for travel beyond the settlements."},
  {name:"Canteen",category:"Provisions",detail:"A hard-wearing flask with a replaceable filter cloth."},
  {name:"Salt Cakes",category:"Provisions",detail:"Dense provisions that help replenish energy on steep climbs."},
  {name:"Trail Tea",category:"Provisions",detail:"A warming blend packed in single-use leaf sachets."},
  {name:"Machine Wire",category:"Crafting",detail:"Flexible conductive strands recovered from broken components."},
  {name:"Armor Plate",category:"Crafting",detail:"A sturdy scrap panel useful for reinforcing camp gear."},
  {name:"Cooling Gel",category:"Crafting",detail:"A clean, sealed compound used in elemental equipment."},
  {name:"Power Cell",category:"Crafting",detail:"A rechargeable unit salvaged from dormant machinery."},
  {name:"Ceramic Shards",category:"Crafting",detail:"Lightweight fragments that can be shaped into tool edges."},
  {name:"Camp Lantern",category:"Camp Gear",detail:"A shuttered lamp with a low-glow setting for night travel."},
  {name:"Bedroll",category:"Camp Gear",detail:"A weather-resistant roll for a dry night's rest."},
  {name:"Water Filter",category:"Camp Gear",detail:"A pocket filter for drawing water from clear streams."},
  {name:"Cooking Pot",category:"Camp Gear",detail:"A nesting pot that fits neatly inside a travel pack."},
  {name:"Weather Cloak",category:"Camp Gear",detail:"A layered hooded cloak for rain, wind, and mountain chill."},
  {name:"Cloth Patches",category:"Crafting",detail:"Strong fabric squares for quick pack and clothing repairs."},
  {name:"Resin Bundle",category:"Crafting",detail:"Sticky tree resin used to seal containers and fletch arrows."},
  {name:"Bone Needles",category:"Crafting",detail:"Fine hand-carved needles for mending leather and canvas."},
  {name:"Copper Filament",category:"Crafting",detail:"Thin conductive wire salvaged from old-world devices."},
  {name:"Scout's Map Case",category:"Tools",detail:"A waterproof sleeve that keeps route notes readable."}
];

const regionLocations = {
  "Greenreach": [
    ["Mosslight Crossing","A shallow ford where luminous moss gathers after rain."],
    ["Fernwatch Rise","A lookout above the winding southern trail."],
    ["Old Pine Camp","A sheltered rest stop beneath ancient pines."],
    ["Whispering Weir","A broken water gate humming in the breeze."],
    ["Three-Stone Meadow","A quiet grassland marked by three standing stones."],
    ["Bracken Hollow","A hidden hollow with a clear spring and soft ground."]
  ],
  "Emberwild": [
    ["Cinder Gate","A basalt arch overlooking a valley of warm ash."],
    ["Redglass Quarry","A bright ravine of naturally fused red stone."],
    ["Sootwind Camp","A windbreak camp tucked behind a black-rock shelf."],
    ["Ashen Orchard","The remains of a terraced grove beneath gray branches."],
    ["Kilnwatch Tower","A half-standing watchtower above the lava fields."],
    ["Coalflower Basin","A bowl-shaped plain dotted with ember-colored blooms."]
  ],
  "Frostline": [
    ["Blue Ice Pass","A narrow route through a clear glacier wall."],
    ["Snowmelt Refuge","A sheltered cabin beside a fast-running melt stream."],
    ["Rimebell Ridge","A high ridge where ice chimes in the wind."],
    ["Whitebark Shelter","A timber hideout surrounded by pale-barked trees."],
    ["Northstar Observatory","A ruined sky station with an open view of the stars."],
    ["Glacier's End","A stony overlook at the edge of the old ice shelf."]
  ],
  "Suncoast": [
    ["Tideglass Beach","A curved shore scattered with smooth colored glass."],
    ["Saltwind Pier","A weathered pier above a shallow turquoise inlet."],
    ["Pelican Cliffs","A line of sea cliffs carved by wind and surf."],
    ["Driftwood Market","A small trading camp built from salvaged timber."],
    ["Coral Steps","A natural stairway descending to a sheltered cove."],
    ["Beacon of Morrow","A broken lighthouse that still catches the dawn."]
  ],
  "Oldworld Reach": [
    ["Verdant Terminal","A transit hall reclaimed by vines and climbing flowers."],
    ["Glasshouse Ruins","A cracked conservatory sheltering a wild garden."],
    ["Echo Station","An underground platform where every footstep rings."],
    ["Memory Plaza","A quiet square ringed by weathered information screens."],
    ["Skybridge Nine","A raised walkway linking two overgrown towers."],
    ["Archive Steps","A sunken stairwell leading to a sealed record room."]
  ]
};

const locations = Object.entries(regionLocations).flatMap(([region, entries]) => entries.map(([name, description], index) => ({
  name, region, description, number: String(index + 1).padStart(2, "0")
})));

const gearGrid = document.getElementById("gear-grid");
const locationGrid = document.getElementById("location-grid");
const gearCategory = document.getElementById("gear-category");
const locationRegion = document.getElementById("location-region");
const gearSearch = document.getElementById("gear-search");
const locationSearch = document.getElementById("location-search");

function addOptions(select, values) {
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

addOptions(gearCategory, [...new Set(gear.map((item) => item.category))]);
addOptions(locationRegion, Object.keys(regionLocations));

document.getElementById("gear-count").textContent = String(gear.length);
document.getElementById("location-count").textContent = String(locations.length);

function makeCard({ meta, tag, title, description, extraClass = "" }) {
  const card = document.createElement("article");
  card.className = `atlas-card ${extraClass}`.trim();
  const line = document.createElement("div");
  line.className = "card-meta";
  const category = document.createElement("span");
  category.textContent = meta;
  const marker = document.createElement("span");
  marker.textContent = tag;
  line.append(category, marker);
  const heading = document.createElement("h3");
  heading.textContent = title;
  const copy = document.createElement("p");
  copy.textContent = description;
  card.append(line, heading, copy);
  return card;
}

function renderGear() {
  const query = gearSearch.value.trim().toLowerCase();
  const category = gearCategory.value;
  const shown = gear.filter((item) => (category === "all" || item.category === category) && `${item.name} ${item.category} ${item.detail}`.toLowerCase().includes(query));
  gearGrid.replaceChildren();
  document.getElementById("gear-results").textContent = `Showing ${shown.length} of ${gear.length} entries`;
  if (!shown.length) {
    const empty = document.createElement("p"); empty.className = "empty"; empty.textContent = "No gear matches that search. Try another word or category."; gearGrid.appendChild(empty); return;
  }
  shown.forEach((item) => gearGrid.appendChild(makeCard({ meta: item.category, tag: "FIELD KIT", title: item.name, description: item.detail })));
}

function renderLocations() {
  const query = locationSearch.value.trim().toLowerCase();
  const region = locationRegion.value;
  const shown = locations.filter((place) => (region === "all" || place.region === region) && `${place.name} ${place.region} ${place.description}`.toLowerCase().includes(query));
  locationGrid.replaceChildren();
  document.getElementById("location-results").textContent = `Showing ${shown.length} of ${locations.length} mapped locations`;
  if (!shown.length) {
    const empty = document.createElement("p"); empty.className = "empty"; empty.textContent = "No locations match that search. Try another name or region."; locationGrid.appendChild(empty); return;
  }
  shown.forEach((place) => locationGrid.appendChild(makeCard({ meta: place.region, tag: `SITE ${place.number}`, title: place.name, description: place.description, extraClass: "location-card" })));
}

gearSearch.addEventListener("input", renderGear);
gearCategory.addEventListener("change", renderGear);
locationSearch.addEventListener("input", renderLocations);
locationRegion.addEventListener("change", renderLocations);
renderGear();
renderLocations();
