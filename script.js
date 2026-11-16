const machines = [
  {
    name: "Thunderjaw",
    type: "Predator",
    description: "A towering armored hunter that tears through the forest with brutal force."
  },
  {
    name: "Watcher",
    type: "Scout",
    description: "A silent observer with a focused scan and a deadly line-of-sight advantage."
  },
  {
    name: "Glinthawk",
    type: "Air threat",
    description: "A fast-moving aerial predator that circles above isolation points and ruins."
  },
  {
    name: "Rockbreaker",
    type: "Heavy",
    description: "A hulking machine built for siege and shockwave attacks that split terrain."
  }
];

const missions = [
  { title: "Scout the eastern valley", status: "Active" },
  { title: "Disable the mine's shield grid", status: "Queued" },
  { title: "Retrieve a forgotten signal core", status: "Pending" },
  { title: "Track the machine migration", status: "Priority" }
];

const machineGrid = document.getElementById("machine-grid");
const missionList = document.getElementById("mission-list");

machines.forEach((machine) => {
  const card = document.createElement("article");
  card.className = "machine-card";
  card.innerHTML = `
    <span class="badge">${machine.type}</span>
    <h3>${machine.name}</h3>
    <p>${machine.description}</p>
  `;
  machineGrid.appendChild(card);
});

missions.forEach((mission) => {
  const item = document.createElement("article");
  item.className = "mission-item";
  item.innerHTML = `
    <div class="mission-copy">
      <div class="mission-title"><span class="dot"></span>${mission.title}</div>
      <p>Objective briefing: continue through the frontier and secure each route.</p>
    </div>
    <div class="mission-status">${mission.status}</div>
  `;
  missionList.appendChild(item);
});
