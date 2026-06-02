(function initAdminPage() {
  const form = document.getElementById("componentForm");
  if (!form) return;

  const fields = {
    id: document.getElementById("componentId"),
    name: document.getElementById("name"),
    category: document.getElementById("category"),
    voltage: document.getElementById("voltage"),
    pins: document.getElementById("pins"),
    purpose: document.getElementById("purpose"),
    commonIssues: document.getElementById("commonIssues"),
    example: document.getElementById("example"),
    wiringNote: document.getElementById("wiringNote")
  };

  const submitButton = document.getElementById("submitButton");
  const resetButton = document.getElementById("resetButton");
  const exportButton = document.getElementById("exportButton");
  const importButton = document.getElementById("importButton");
  const importFile = document.getElementById("importFile");
  const adminList = document.getElementById("adminList");
  const adminCount = document.getElementById("adminCount");
  const emptyState = document.getElementById("adminEmptyState");

  function getFormData() {
    const name = fields.name.value.trim();
    const existingId = fields.id.value.trim();

    return {
      id: existingId || createUniqueId(name),
      name,
      category: fields.category.value,
      voltage: fields.voltage.value.trim(),
      pins: fields.pins.value.trim(),
      purpose: fields.purpose.value.trim(),
      commonIssues: fields.commonIssues.value.trim(),
      example: fields.example.value.trim(),
      wiringNote: fields.wiringNote.value.trim()
    };
  }

  function createUniqueId(name) {
    const baseId = createIdFromName(name);
    const existingIds = new Set(getComponents().map((component) => component.id));
    let candidate = baseId;
    let index = 2;

    while (existingIds.has(candidate)) {
      candidate = `${baseId}-${index}`;
      index += 1;
    }

    return candidate;
  }

  function fillForm(component) {
    fields.id.value = component.id;
    fields.name.value = component.name;
    fields.category.value = component.category;
    fields.voltage.value = component.voltage;
    fields.pins.value = component.pins;
    fields.purpose.value = component.purpose;
    fields.commonIssues.value = component.commonIssues;
    fields.example.value = component.example;
    fields.wiringNote.value = component.wiringNote;
    submitButton.textContent = "Update component";
    fields.name.focus();
  }

  function resetForm() {
    form.reset();
    fields.id.value = "";
    submitButton.textContent = "Add component";
    fields.category.value = "Board";
  }

  function renderAdminList() {
    const components = getComponents();
    adminCount.textContent = `${components.length} component${components.length === 1 ? "" : "s"}`;
    emptyState.hidden = components.length > 0;

    adminList.innerHTML = components.map((component) => `
      <article class="admin-item">
        <div class="admin-item-main">
          <div class="admin-item-title">
            <h3>${escapeHtml(component.name)}</h3>
            <span class="badge">${escapeHtml(component.category)}</span>
          </div>
          <p>${escapeHtml(component.voltage)} | ${escapeHtml(component.pins)}</p>
        </div>
        <div class="admin-item-actions">
          <button class="button button-secondary" type="button" data-action="edit" data-id="${escapeHtml(component.id)}">Edit</button>
          <button class="button button-danger" type="button" data-action="delete" data-id="${escapeHtml(component.id)}">Delete</button>
        </div>
      </article>
    `).join("");
  }

  function validateImportData(data) {
    const requiredFields = ["id", "name", "category", "voltage", "pins", "purpose", "commonIssues", "example", "wiringNote"];
    const validCategories = ["Board", "Sensor", "Output", "Module", "Power", "Tool"];

    if (!Array.isArray(data)) {
      return "JSON must be an array of components.";
    }

    if (data.length === 0) {
      return "JSON must contain at least one component.";
    }

    const ids = new Set();

    for (const component of data) {
      const missingField = requiredFields.find((field) => typeof component[field] !== "string" || component[field].trim() === "");

      if (missingField) {
        return `Component "${component.name || "unknown"}" is missing ${missingField}.`;
      }

      if (!validCategories.includes(component.category)) {
        return `Component "${component.name}" has an invalid category.`;
      }

      if (ids.has(component.id)) {
        return `Duplicate id found: ${component.id}.`;
      }

      ids.add(component.id);
    }

    return "";
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const component = getFormData();
    const components = getComponents();
    const editingIndex = components.findIndex((item) => item.id === component.id);

    if (editingIndex >= 0) {
      components[editingIndex] = component;
      saveComponents(components);
      showMessage("Component updated.");
    } else {
      components.push(component);
      saveComponents(components);
      showMessage("Component added.");
    }

    resetForm();
    renderAdminList();
  });

  resetButton.addEventListener("click", resetForm);

  adminList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const components = getComponents();
    const component = components.find((item) => item.id === button.dataset.id);

    if (button.dataset.action === "edit" && component) {
      fillForm(component);
      return;
    }

    if (button.dataset.action === "delete" && component) {
      const confirmed = confirm(`Delete "${component.name}"?`);
      if (!confirmed) return;

      saveComponents(components.filter((item) => item.id !== component.id));
      if (fields.id.value === component.id) resetForm();
      renderAdminList();
      showMessage("Component deleted.");
    }
  });

  exportButton.addEventListener("click", () => {
    const data = JSON.stringify(getComponents(), null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "components-backup.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    showMessage("JSON exported.");
  });

  importButton.addEventListener("click", () => {
    importFile.click();
  });

  importFile.addEventListener("change", () => {
    const file = importFile.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const importedData = JSON.parse(reader.result);
        const validationError = validateImportData(importedData);

        if (validationError) {
          showMessage(validationError, "error");
          return;
        }

        saveComponents(importedData);
        resetForm();
        renderAdminList();
        showMessage("JSON imported.");
      } catch (error) {
        console.error("Import failed:", error);
        showMessage("Invalid JSON file.", "error");
      } finally {
        importFile.value = "";
      }
    };

    reader.onerror = () => {
      showMessage("Could not read file.", "error");
      importFile.value = "";
    };

    reader.readAsText(file);
  });

  renderAdminList();
})();
