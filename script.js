const STORAGE_KEY = "aiot_components";

const DEFAULT_COMPONENTS = [
  {
    id: "arduino-uno-r3",
    name: "Arduino Uno R3",
    category: "Board",
    voltage: "5V logic, 7V - 12V input",
    pins: "Digital I/O, Analog In, 5V, 3.3V, GND",
    purpose: "A beginner-friendly microcontroller board for basic control and sensing projects.",
    commonIssues: "Wrong COM port, missing USB driver, or connecting high-current loads directly to pins.",
    example: "Traffic light demo, sensor reader, line-following robot controller.",
    wiringNote: "Connect sensors to 5V/GND and signal pins; keep total pin current within board limits."
  },
  {
    id: "esp32-devkit",
    name: "ESP32 DevKit",
    category: "Board",
    voltage: "3.3V logic, 5V USB input",
    pins: "GPIO, 3V3, VIN, GND, EN, ADC pins",
    purpose: "Wi-Fi and Bluetooth development board for connected AIoT prototypes.",
    commonIssues: "Using 5V signals on GPIO can damage the board; boot pins may block upload if pulled wrong.",
    example: "MQTT sensor node, web-controlled relay, BLE beacon, edge telemetry gateway.",
    wiringNote: "Power from USB or VIN 5V; connect external modules using 3.3V logic or a level shifter."
  },
  {
    id: "servo-sg90",
    name: "Servo SG90",
    category: "Output",
    voltage: "4.8V - 6V",
    pins: "VCC, GND, Signal",
    purpose: "Controls angular position from 0 to 180 degrees.",
    commonIssues: "Weak power supply may cause jittering or unstable movement.",
    example: "Mini door lock, robot arm, smart home model.",
    wiringNote: "VCC -> 5V, GND -> GND, Signal -> D9 on Arduino Uno."
  },
  {
    id: "relay-module",
    name: "Relay Module",
    category: "Output",
    voltage: "5V module input",
    pins: "VCC, GND, IN, COM, NO, NC",
    purpose: "Switches higher-voltage devices using a low-voltage control signal.",
    commonIssues: "No shared ground, wrong NO/NC terminal, or insufficient isolation for mains wiring.",
    example: "Lamp switch, fan controller, pump automation.",
    wiringNote: "VCC -> 5V, GND -> GND, IN -> digital pin; route load through COM and NO or NC."
  },
  {
    id: "lcd-i2c-16x2",
    name: "LCD I2C 16x2",
    category: "Module",
    voltage: "5V typical",
    pins: "VCC, GND, SDA, SCL",
    purpose: "Shows text output while using only two I2C signal pins.",
    commonIssues: "Wrong I2C address or contrast trimmer set too low.",
    example: "Temperature monitor, menu screen, device status display.",
    wiringNote: "VCC -> 5V, GND -> GND, SDA -> A4 and SCL -> A5 on Arduino Uno."
  },
  {
    id: "hc-sr04-ultrasonic-sensor",
    name: "HC-SR04 Ultrasonic Sensor",
    category: "Sensor",
    voltage: "5V",
    pins: "VCC, GND, Trig, Echo",
    purpose: "Measures distance by sending ultrasonic pulses and reading the echo time.",
    commonIssues: "Echo pin returns 5V, which needs level shifting for ESP32.",
    example: "Obstacle avoidance, tank level measurement, parking distance alert.",
    wiringNote: "VCC -> 5V, GND -> GND, Trig -> D8, Echo -> D7; use divider for ESP32 Echo."
  },
  {
    id: "ldr-sensor",
    name: "LDR Sensor",
    category: "Sensor",
    voltage: "3.3V - 5V",
    pins: "VCC, GND, AO, DO",
    purpose: "Detects ambient light level for simple day/night decisions.",
    commonIssues: "Digital threshold needs tuning with the onboard potentiometer.",
    example: "Automatic night lamp, light logger, smart curtain trigger.",
    wiringNote: "VCC -> 5V or 3.3V, GND -> GND, AO -> analog input for smooth light readings."
  },
  {
    id: "rain-sensor",
    name: "Rain Sensor",
    category: "Sensor",
    voltage: "3.3V - 5V",
    pins: "VCC, GND, AO, DO",
    purpose: "Detects water droplets on a conductive plate.",
    commonIssues: "Sensor plate corrodes if powered continuously in wet conditions.",
    example: "Rain alarm, smart window cover, irrigation safety cutoff.",
    wiringNote: "VCC -> 3.3V or 5V, GND -> GND, AO -> analog input; power only during readings."
  },
  {
    id: "buzzer",
    name: "Buzzer",
    category: "Output",
    voltage: "3.3V - 5V",
    pins: "Positive, Negative or VCC, GND, Signal",
    purpose: "Produces simple tones or alerts for device feedback.",
    commonIssues: "Passive buzzers need PWM tone output; active buzzers only need on/off control.",
    example: "Alarm system, button feedback, countdown timer.",
    wiringNote: "Signal or positive pin -> digital pin through a resistor if needed; negative -> GND."
  },
  {
    id: "logic-level-shifter",
    name: "Logic Level Shifter",
    category: "Module",
    voltage: "1.8V - 5V logic sides",
    pins: "HV, LV, GND, HV channels, LV channels",
    purpose: "Converts signal voltage between 3.3V and 5V devices.",
    commonIssues: "HV and LV references must both be connected for reliable shifting.",
    example: "Connect 5V Arduino modules to ESP32 GPIO safely.",
    wiringNote: "HV -> 5V, LV -> 3.3V, both GNDs common; route matching signal channels across sides."
  }
];

function loadDefaultComponents() {
  saveComponents(DEFAULT_COMPONENTS);
  return [...DEFAULT_COMPONENTS];
}

function getComponents() {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return loadDefaultComponents();
  }

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : loadDefaultComponents();
  } catch (error) {
    console.error("Could not parse saved components:", error);
    return loadDefaultComponents();
  }
}

function saveComponents(components) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(components));
}

function createIdFromName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || `component-${Date.now()}`;
}

function showMessage(message, type = "success") {
  const box = document.getElementById("messageBox");
  if (!box) return;

  box.textContent = message;
  box.classList.toggle("error", type === "error");
  box.classList.add("show");

  window.clearTimeout(showMessage.timer);
  showMessage.timer = window.setTimeout(() => {
    box.classList.remove("show");
  }, 2600);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  textArea.style.top = "0";
  document.body.appendChild(textArea);
  textArea.select();

  try {
    document.execCommand("copy");
  } finally {
    textArea.remove();
  }
}

(function initLibraryPage() {
  const grid = document.getElementById("componentGrid");
  if (!grid) return;

  const searchInput = document.getElementById("searchInput");
  const emptyState = document.getElementById("emptyState");
  const componentCount = document.getElementById("componentCount");
  const categoryCount = document.getElementById("categoryCount");
  const filterButtons = [...document.querySelectorAll(".filter-button")];
  let activeCategory = "All";

  function getFilteredComponents() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    return getComponents().filter((component) => {
      const matchesSearch = component.name.toLowerCase().includes(searchTerm);
      const matchesCategory = activeCategory === "All" || component.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }

  function renderStats(components) {
    const categories = new Set(components.map((component) => component.category));
    componentCount.textContent = components.length;
    categoryCount.textContent = categories.size;
  }

  function renderComponents() {
    const allComponents = getComponents();
    const filteredComponents = getFilteredComponents();
    renderStats(allComponents);

    emptyState.hidden = filteredComponents.length > 0;
    grid.innerHTML = filteredComponents.map((component) => `
      <article class="component-card">
        <div class="card-top">
          <h2>${escapeHtml(component.name)}</h2>
          <span class="badge">${escapeHtml(component.category)}</span>
        </div>
        <dl class="detail-list">
          <div>
            <dt>Voltage</dt>
            <dd>${escapeHtml(component.voltage)}</dd>
          </div>
          <div>
            <dt>Purpose</dt>
            <dd>${escapeHtml(component.purpose)}</dd>
          </div>
          <div>
            <dt>Pins</dt>
            <dd>${escapeHtml(component.pins)}</dd>
          </div>
          <div>
            <dt>Common issues</dt>
            <dd>${escapeHtml(component.commonIssues)}</dd>
          </div>
          <div>
            <dt>Example</dt>
            <dd>${escapeHtml(component.example)}</dd>
          </div>
          <div>
            <dt>Wiring note</dt>
            <dd>${escapeHtml(component.wiringNote)}</dd>
          </div>
        </dl>
        <button class="button button-secondary copy-button" type="button" data-copy-id="${escapeHtml(component.id)}">Copy wiring note</button>
      </article>
    `).join("");
  }

  searchInput.addEventListener("input", renderComponents);

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      filterButtons.forEach((item) => item.classList.toggle("active", item === button));
      renderComponents();
    });
  });

  grid.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-copy-id]");
    if (!button) return;

    const component = getComponents().find((item) => item.id === button.dataset.copyId);
    if (!component) return;

    try {
      await copyText(component.wiringNote);
      showMessage("Wiring note copied.");
    } catch (error) {
      console.error("Clipboard copy failed:", error);
      showMessage("Could not copy wiring note.", "error");
    }
  });

  renderComponents();
})();
