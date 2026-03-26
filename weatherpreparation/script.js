const METAR_STATIONS = ["EHDL", "EHLE", "EHAM", "EHGG"];
const METAR_API_URL = `https://aviationweather.gov/api/data/metar?ids=${METAR_STATIONS.join(",")}&format=json`;

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
    title: "METAR Overview",
    icon: "📡",
    description: "Current METARs shown directly below for EHDL, EHLE, EHAM and EHGG.",
    url: `https://aviationweather.gov/data/metar/?ids=${METAR_STATIONS.join(",")}`,
    badge: "Live data",
    metars: METAR_STATIONS.map(code => ({
      code,
      url: `https://aviationweather.gov/data/metar/?ids=${code}`
    }))
  },
  {
    title: "Buienradar",
    icon: "🌧️",
    description: "Radar and local weather view for Teuge.",
    url: "https://www.buienradar.nl/weer/Teuge/NL/2746387",
    badge: "Radar"
  }
];

document.addEventListener("DOMContentLoaded", async () => {
  renderWeatherTools();
  await loadMetars();
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

  const metarList = tool.metars
    ? `
      <div class="metar-list" aria-label="METAR stations">
        ${tool.metars
          .map(
            metar => `
              <div class="metar-item" data-station="${metar.code}" role="button" tabindex="0" aria-label="Open METAR for ${metar.code}">
                <div class="metar-code-row">
                  <span class="metar-code">${metar.code}</span>
                  <span class="metar-external" aria-hidden="true">↗</span>
                </div>
                <div class="metar-text is-loading">Loading current METAR...</div>
              </div>
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
      const openLink = () => {
        window.open(tool.metars[index].url, "_blank", "noopener,noreferrer");
      };

      item.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        openLink();
      });

      item.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          openLink();
        }
      });
    });
  }

  return card;
}

async function loadMetars() {
  const metarElements = document.querySelectorAll(".metar-item");

  try {
    const response = await fetch(METAR_API_URL, {
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`METAR request failed with status ${response.status}`);
    }

    const data = await response.json();
    const records = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
    const recordMap = new Map(
      records
        .map(record => {
          const code = (record?.icaoId || record?.station_id || "").toUpperCase();
          const raw = record?.rawOb || record?.raw_text || record?.rawText || "";
          const observed = record?.obsTime || record?.observation_time || record?.reportTime || "";
          return [code, { raw, observed }];
        })
        .filter(([code]) => code)
    );

    metarElements.forEach(element => {
      const station = element.dataset.station;
      const textNode = element.querySelector(".metar-text");
      const match = recordMap.get(station);

      if (match?.raw) {
        const observedText = formatObservedTime(match.observed);
        textNode.textContent = observedText ? `${match.raw} • ${observedText}` : match.raw;
        textNode.classList.remove("is-loading");
      } else {
        textNode.textContent = "No current METAR returned right now.";
        textNode.classList.remove("is-loading");
      }
    });
  } catch (error) {
    console.error("Unable to load METAR data:", error);
    metarElements.forEach(element => {
      const textNode = element.querySelector(".metar-text");
      textNode.textContent = "Live METAR could not be loaded here. Click to open the source page.";
      textNode.classList.remove("is-loading");
    });
  }
}

function formatObservedTime(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return `Observed ${date.toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short"
  })}`;
}
