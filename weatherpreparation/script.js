const weatherTools = [
  {
    title: "General Aviation Weather Bulletin",
    icon: "🛩️",
    description: "Official KNMI weather bulletin for general aviation in the Netherlands.",
    url: "https://www.knmi.nl/nederland-nu/luchtvaart/weerbulletin-kleine-luchtvaart",
    badge: "KNMI"
  },
  {
    title: "Significant Weather Charts",
    icon: "🌦️",
    description: "KNMI weather charts with warnings and forecast guidance.",
    url: "https://www.knmi.nl/nederland-nu/weer/waarschuwingen-en-verwachtingen/weerkaarten",
    badge: "Charts"
  },
  {
    title: "Airport Observations",
    icon: "📡",
    description: "Open KNMI airport observations for current field weather information across Dutch airfields.",
    url: "https://www.knmi.nl/nederland-nu/luchtvaart/vliegveldwaarnemingen",
    badge: "KNMI"
  },
  {
    title: "Buienradar",
    icon: "🌧️",
    description: "Radar and local weather view for Teuge.",
    url: "https://www.buienradar.nl/weer/Teuge/NL/2746387",
    badge: "Radar"
  }
];

document.addEventListener("DOMContentLoaded", () => {
  renderWeatherTools();
});

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
  card.setAttribute("aria-label", `Open ${tool.title}`);

  card.innerHTML = `
    <div class="card-main">
      <div class="icon">${tool.icon}</div>
      <div class="details">
        <div class="title-row">
          <h3>${tool.title}</h3>
          <span class="badge">${tool.badge}</span>
        </div>
        <p>${tool.description}</p>
      </div>
      <div class="open-hint" aria-hidden="true">↗</div>
    </div>
  `;

  return card;
}
