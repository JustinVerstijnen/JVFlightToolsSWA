const weatherTools = [
  {
    title: "Weather bulletin General Aviation",
    icon: "🛩️",
    description: "Officieel KNMI-weerbulletin voor de kleine luchtvaart.",
    url: "https://www.knmi.nl/nederland-nu/luchtvaart/weerbulletin-kleine-luchtvaart",
    badge: "KNMI"
  },
  {
    title: "Significant Weather Charts",
    icon: "🌦️",
    description: "KNMI weerkaarten met waarschuwingen en verwachtingen.",
    url: "https://www.knmi.nl/nederland-nu/weer/waarschuwingen-en-verwachtingen/weerkaarten",
    badge: "Kaarten"
  },
  {
    title: "METARs",
    icon: "📡",
    description: "Snelle METAR-links voor de gevraagde luchthavens.",
    url: "https://aviationweather.gov/data/metar/?ids=EHDL",
    badge: "Live data",
    metars: [
      { code: "EHDL", url: "https://aviationweather.gov/data/metar/?ids=EHDL" },
      { code: "EHLE", url: "https://aviationweather.gov/data/metar/?ids=EHLE" },
      { code: "EHAM", url: "https://aviationweather.gov/data/metar/?ids=EHAM" },
      { code: "EHGG", url: "https://aviationweather.gov/data/metar/?ids=EHGG" }
    ]
  },
  {
    title: "Buienradar",
    icon: "🌧️",
    description: "Radarbeeld en lokale weersverwachting voor Teuge.",
    url: "https://www.buienradar.nl/weer/Teuge/NL/2746387",
    badge: "Radar"
  }
];

document.addEventListener("DOMContentLoaded", renderWeatherTools);

function renderWeatherTools() {
  const container = document.getElementById("weather-list");
  container.innerHTML = "";

  weatherTools.forEach(tool => {
    container.appendChild(createToolCard(tool));
  });
}

function createToolCard(tool) {
  const card = document.createElement("a");
  card.className = "weather-card";
  card.href = tool.url;
  card.target = "_blank";
  card.rel = "noopener noreferrer";
  card.setAttribute("aria-label", `${tool.title} openen`);

  const metarList = tool.metars
    ? `
      <div class="metar-list" aria-label="METAR stations">
        ${tool.metars
          .map(
            metar => `
              <span class="metar-item">${metar.code}</span>
            `
          )
          .join("")}
      </div>
    `
    : "";

  card.innerHTML = `
    <div class="card-main">
      <div class="icon">${tool.icon}</div>
      <div class="details">
        <div class="title-row">
          <h3>${tool.title}</h3>
          <span class="badge">${tool.badge}</span>
        </div>
        <p>${tool.description}</p>
        ${metarList}
      </div>
      <div class="open-hint" aria-hidden="true">↗</div>
    </div>
  `;

  if (tool.metars) {
    const items = card.querySelectorAll(".metar-item");
    items.forEach((item, index) => {
      item.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        window.open(tool.metars[index].url, "_blank", "noopener,noreferrer");
      });
    });
  }

  return card;
}
