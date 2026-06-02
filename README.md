# AIoT Component Library Admin

A small vanilla HTML, CSS and JavaScript web app for managing an AIoT component library for Arduino, ESP32, sensors, output modules and wiring notes.

## Features

- Library page with component cards.
- Search by component name.
- Filter by category: All, Board, Sensor, Output, Module, Power and Tool.
- Copy wiring notes from each component card.
- Admin panel for adding, editing and deleting components.
- JSON export and import for backup.
- Data persistence with `localStorage`.
- Responsive layout for laptop and mobile screens.

## How To Run

Open `index.html` directly in a browser.

No framework, backend, build step or database is required.

## Admin UI

1. Open `admin.html` or use the Admin button from the library page.
2. Fill in the component form and select a category.
3. Click Add component to save a new component.
4. Click Edit on an existing component to load it into the form, then Update component to save changes.
5. Click Delete to remove a component after confirmation.
6. Use Export JSON to download `components-backup.json`.
7. Use Import JSON to restore a valid component array from a `.json` file.

## Files

- `index.html`: Public component library page.
- `admin.html`: Admin management page.
- `style.css`: Shared responsive UI styles.
- `script.js`: Shared storage helpers, default data and library page logic.
- `admin.js`: Admin form, edit/delete, import and export logic.
- `README.md`: Project documentation.

## Phase 2 Ideas

- Add images for each component.
- Add tags.
- Add Notion API integration.
- Add Firebase/Supabase backend.
- Deploy to GitHub Pages or Vercel.

## Notes

This is a frontend-only demo. All data is stored in the user's browser using localStorage. There is no backend or shared database.
