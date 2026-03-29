# HA Dashboard — React Dashboard for Home Assistant

A React-based Home Assistant dashboard with Apple Liquid Glass design, replacing the YAML-based Lovelace dashboard.

## Related Repository

The HA configuration management repo is at `brumi1024/claude-homeassistant` (`/Users/benjaminteke/Developer/personal/workspace/claude-homeassistant`). Entity IDs, automations, and the YAML dashboard live there.

## Project Structure

```
src/
├── App.tsx                     # HassConnect + ThemeProvider + Router
├── main.tsx                    # Entry point
├── index.css                   # Global CSS — Liquid Glass classes, animations, background
├── config/
│   └── rooms.ts                # All entity IDs, room definitions, scene actions, energy/EV/go-e/home/calendar/media entities
├── styles/
│   └── theme.ts                # Color tokens, spacing, border radius
├── components/
│   ├── layout/                 # AppShell, Sidebar, TabBar, MediaPlayerBar
│   ├── shared/                 # StatBadge, AnimatedCounter, DeviceCard, DeviceSection
│   ├── home/                   # WeatherBadge, GreetingCard, TemperatureDisplay, ScenesGrid, SecurityStatus, ModesSection, NotificationBadge, EventsTab, ActiveEntitiesTab
│   ├── rooms/                  # RoomCard, RoomDetailView, ActiveTab
│   ├── energy/                 # BalanceHeader, SolarChart, GridSection, AmperageSection, NetMeteringSection, ProductionStats
│   ├── ev/                     # VehicleCard, ChargerMode, GoECharger, GoEControls
│   └── system/                 # SystemHealth, UpdatesList
└── views/                      # HomeView, RoomsView, RoomDetailPage, SolarGridView, EVChargingView, SystemView
```

## Tech Stack

- **Vite 8** + **React 19** + **TypeScript 5**
- **@hakit/core** — WebSocket connection, entity hooks (`useEntity`, `useHistory`, `useService`)
- **@hakit/components** — Pre-built HA cards (ClimateCard, MediaPlayerCard, etc.)
- **Recharts** — Energy charts
- **Framer Motion** — Page transitions, spring animations
- **React Router v7** — View routing
- **@mdi/react + @mdi/js** — Material Design Icons
- **liquid-glass-react** — Apple Liquid Glass effect (standalone elements only)

## Running Locally

```bash
cp .env.example .env
# Edit .env with your HA URL and long-lived access token
npm install
npm run dev
```

## Build

```bash
npm run build     # TypeScript check + Vite build
npm run preview   # Preview production build
```

## Design System — Apple Liquid Glass

### CSS Classes (defined in `index.css`)

| Class | Use for | Effect |
|-------|---------|--------|
| `.liquid-glass` | Cards, panels, buttons | blur(40px), refraction borders (bright top, dark bottom), hover lift |
| `.liquid-glass-prominent` | Room cards, hero elements | blur(50px), stronger hover (scale 1.02) |
| `.liquid-pill` | Chips, badges, tab buttons | blur(30px), pill shape, subtle refraction top |
| `.liquid-pill-active` | Active tab/chip state | Stronger glow |
| `.stagger-in` | Container whose children animate in | Spring-in with cascading delays |

### Gotchas

- **`liquid-glass-react` library breaks CSS grid/flex layouts.** Only use it on standalone block elements, never on grid items or fixed-position elements. For repeated elements (room cards, device cards, chips), use the CSS classes above instead.
- **`@mdi/react` uses named export:** `import { Icon } from '@mdi/react'` — NOT `import Icon from '@mdi/react'` (default export is the module object, causes runtime crash).
- **`useEntity` typing:** Cast entity IDs as `EntityName` not `as any`. Using `as any` causes the return type to resolve to `never`. Pattern: `useEntity(entityId as EntityName, { returnNullIfNotFound: true })`.
- **Service calls on union types:** When `useEntity` returns a union type, service methods resolve to `never`. Use `(entity as any).service.toggle()` for the service call only.
- **Conditional hooks:** React hooks can't be called after early returns. Use a wrapper component pattern (see `RoomDetailPage.tsx` → `RoomDetailContent`).
- **Background image:** Served from `public/background.jpg`. AppShell applies a frosted overlay (`backdrop-filter: blur(3px)`) for readability.
- **`@mdi/js` icon names:** Not all intuitive names exist. `mdiGarageDoor` → doesn't exist, use `mdiGarage`. Verify icon exports: `node -e "const m=require('@mdi/js');console.log(Object.keys(m).filter(k=>k.includes('Garage')))"`.
- **`@hakit/components` cards:** `MediaPlayerCard` supports `layout="slim"` for mini player bars. Entity prop needs `as any` cast when computed dynamically. The library uses emotion CSS internally — don't wrap cards in `liquid-glass-react`.
- **`input_select` service calls:** `(entity as any).service.select_option({ serviceData: { option: 'value' } })`. The `options` attribute contains available values: `(entity.attributes as { options?: string[] }).options`.

## Entity Configuration

All entity IDs are centralized in `src/config/rooms.ts`. This includes:
- `rooms[]` — Room definitions with temp/humidity sensors, lights, switches, appliances
- `sceneActions[]` — Scene/script activations (Morning, Night, Away, etc.)
- `energyEntities` — Solar, grid, phase, net metering sensors
- `evEntities` — Tesla Raikiri and Go-e charger entities
- `securityEntities` — Front door lock, garage doors
- `homeEntities` — Home mode (`input_select`), notification count, active lights count
- `calendarEntities` — 6 calendar entities for Events tab
- `goEEntities` — Go-e charger sensors and controls (18 entities)
- `evChargerEntities` — Custom charger mode (`input_select`), max/target amps
- `mediaEntities` — Living Room Sonos and TV

When adding new rooms or devices, update this file. Entity IDs follow the HA naming convention from the config repo: `location_room_device_sensor`.

## Home Assistant Connection

- Uses `HassConnect` from `@hakit/core` with WebSocket API
- Auth via long-lived access token in `.env` (`VITE_HA_TOKEN`)
- Entity state is reactive via `useEntity()` hooks — no manual polling
- Service calls: `entity.service.toggle()`, `entity.service.turn_on({ brightness: 200 })`

## Migration Plan

See `docs/migration-plan.md` for the full status of the YAML → React migration.

**Process:** Go view by view — user provides screenshots of the current YAML dashboard, explains interactions, then we implement the React equivalent.

## Verification Tools

- **Home Assistant MCP** — Use `ha_search_entities` to verify entity IDs against live HA. Always verify before adding new entity IDs to config.
- **Playwright MCP** — Can screenshot the YAML dashboard at `http://homeassistant.local:8123`. Authenticate by injecting token into localStorage: `localStorage.setItem("hassTokens", JSON.stringify({ hassUrl, clientId, access_token, ... }))`.
- **YAML dashboard URL pattern** — `http://homeassistant.local:8123/dashboard-home/<view>` (overview, rooms, energy, scenes, camera)

## Security

- `.env` is gitignored — contains HA access token
- `.env.example` has placeholder values for setup
- Entity IDs are committed (community standard for public HA repos) — they reveal device names but can't be used without network access + valid token
- No credentials, API keys, or secrets in source code
