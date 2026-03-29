# React Dashboard for Home Assistant

## Context

The current Home Assistant dashboard is a 19-view, 409-card YAML configuration using Mushroom Cards, Streamline Card, Bubble Card, and other community cards. While visually polished (green gradient background, warm room cards, clean energy layout), it has reached the limits of what YAML-based configuration can offer in terms of:

- **Visual design**: No custom animations, limited transition control, constrained by card APIs
- **Interactions**: Bubble-Card popup navigation is fragile (hash-based, doesn't work nested), no gesture support
- **Customization**: Hit walls with conditional rendering, layout flexibility, and component composition
- **Maintenance**: 5,000+ lines of YAML across dashboard files, difficult to refactor or reuse patterns

The goal is to build a React-based dashboard using [ha-component-kit](https://github.com/shannonhochkins/ha-component-kit) that eventually replaces the YAML dashboard entirely, starting with a parallel experiment of key views.

## Approach

**ha-component-kit** — use the full library (@hakit/core for WebSocket connection + @hakit/components for pre-built cards). Deploy as a Home Assistant add-on accessible from the sidebar. Start with simplified versions of complex cards (weather, charts) and enhance over time.

### Why ha-component-kit over alternatives

- **vs. custom React + raw WebSocket API**: hakit handles auth, state subscriptions, connection lifecycle, and provides typed entity hooks. Building this from scratch would add weeks with no user-facing benefit.
- **vs. @hakit/core only (no components)**: The pre-built ClimateCard, LightControls, and MediaPlayerCard cover ~40% of room controls out of the box. Skipping them means rebuilding well-tested UI for common device types.

### Risks

- **ha-component-kit maturity**: ~1,200 GitHub stars, some components still WIP, breaking changes between major versions. Mitigation: use hakit for connection/hooks heavily, use their components where they fit, but own the layout and custom components entirely.
- **HA WebSocket API changes**: React dashboard is third-party; YAML dashboards are first-class. Mitigation: hakit abstracts the API; updates to hakit track HA changes.
- **Missing card equivalents**: Community cards like weather-forecast-extended-card, auto-entities, calendar-card-pro have no React equivalent. Mitigation: simplify-and-iterate strategy — build basic versions first, enhance over time.

## Tech Stack

| Component | Choice | Version | Purpose |
|-----------|--------|---------|---------|
| Build tool | Vite | ^7.x | Fast dev server + build |
| UI framework | React | >=19.x | Component architecture |
| Language | TypeScript | ^5.x | Type safety for entities |
| HA connection | @hakit/core | latest | WebSocket auth, entity hooks |
| HA cards | @hakit/components | latest | Pre-built device cards |
| Charts | Recharts | latest | Interactive energy charts |
| Animations | Framer Motion | latest | Page transitions, state animations |
| Routing | React Router | v7 | View navigation |

Scaffolded via `npm create hakit@latest` into a `dashboard/` directory at the repo root.

## Architecture

### Project Structure

```
dashboard/
├── src/
│   ├── App.tsx                    # HassConnect + ThemeProvider + Router
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx       # Sidebar + content area
│   │   │   ├── Sidebar.tsx        # Navigation (Home, Rooms, Scenes, Energy, More)
│   │   │   └── TabBar.tsx         # Reusable tab switcher
│   │   ├── shared/
│   │   │   ├── StatBadge.tsx      # Icon + value + label badge
│   │   │   ├── AnimatedCounter.tsx # Number that rolls on change
│   │   │   ├── DeviceCard.tsx     # Toggle card for lights/switches
│   │   │   └── DeviceSection.tsx  # Titled group of DeviceCards
│   │   ├── home/
│   │   │   ├── WeatherBadge.tsx   # Compact weather display
│   │   │   ├── GreetingCard.tsx   # Time-of-day greeting + presence
│   │   │   ├── TemperatureDisplay.tsx  # Indoor/outdoor + sparkline
│   │   │   ├── ScenesGrid.tsx     # Scene activation buttons
│   │   │   ├── SecurityStatus.tsx # Lock + garage door status
│   │   │   └── NotificationPanel.tsx  # Slide-out notification panel
│   │   ├── rooms/
│   │   │   ├── RoomCard.tsx       # Room overview card (temp, humidity, icon, alerts)
│   │   │   ├── RoomDetailView.tsx # Full room with device sections
│   │   │   └── ActiveTab.tsx      # List of active entities in room
│   │   ├── energy/
│   │   │   ├── SolarChart.tsx     # Actual vs forecast production chart
│   │   │   ├── GridSection.tsx    # Import/export with 24h chart
│   │   │   ├── AmperageSection.tsx # Phase A/B/C with imbalance
│   │   │   ├── NetMeteringSection.tsx # Balance, import/export totals
│   │   │   ├── ProductionStats.tsx    # Today/monthly/lifetime
│   │   │   └── ForecastDisplay.tsx    # Today/tomorrow forecast
│   │   └── ev/
│   │       ├── VehicleCard.tsx    # Tesla battery gauge + controls
│   │       ├── ChargerMode.tsx    # Charger mode selector + fallback
│   │       └── GoECharger.tsx     # Go-e charger status + controls
│   ├── views/
│   │   ├── HomeView.tsx
│   │   ├── RoomsView.tsx
│   │   ├── RoomDetailPage.tsx
│   │   ├── SolarGridView.tsx
│   │   └── EVChargingView.tsx
│   ├── config/
│   │   └── rooms.ts              # Room definitions (entities, icons, colors)
│   └── styles/
│       └── theme.ts              # Color palette, spacing, shared styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### Component Hierarchy

```
App
└── HassConnect (WebSocket auth)
    └── ThemeProvider (ha-component-kit theming)
        └── AppShell
            ├── Sidebar
            └── <Router>
                ├── HomeView
                │   ├── WeatherBadge
                │   ├── GreetingCard
                │   ├── TabBar (Home / Events / Active)
                │   ├── TemperatureDisplay
                │   ├── ScenesGrid
                │   ├── SecurityStatus
                │   └── NotificationPanel (slide-out)
                ├── RoomsView
                │   └── RoomCard[] → navigates to:
                ├── RoomDetailPage
                │   ├── RoomHeader (name, temp, humidity)
                │   ├── TabBar (Room / Active)
                │   ├── RoomTab
                │   │   ├── DeviceSection (Lights) → DeviceCard[]
                │   │   ├── DeviceSection (Switches) → DeviceCard[]
                │   │   └── DeviceSection (Appliances) → ApplianceIcon[]
                │   └── ActiveTab → ActiveEntityList
                ├── SolarGridView
                │   ├── BalanceHeader
                │   ├── LiveStatsRow
                │   ├── SolarChart
                │   ├── GridSection
                │   ├── AmperageSection
                │   ├── NetMeteringSection
                │   ├── ProductionStats
                │   └── ForecastDisplay
                └── EVChargingView
                    ├── VehicleCard (Tesla)
                    ├── ChargerMode
                    └── GoECharger
```

### Data Flow

1. `HassConnect` establishes WebSocket connection to Home Assistant, handles authentication
2. Entity state flows through hakit's `useEntity("sensor.xyz")` hook — returns reactive state
3. Service calls (toggle light, activate scene) go through hakit's `useService()` hook
4. History data for charts uses hakit's `useHistory()` hook
5. No separate state management needed — hakit's hooks are the single source of truth

## Views Detail

### Overview (HomeView)

Mirrors the current dashboard's Home view:

- **Header**: Date/time, notification bell with badge count, weather summary
- **Greeting**: "Good Night, Benjamin!" with avatar and presence (Home/Away)
- **Tab bar**: Home / Events / Active (Events shows calendar, Active shows currently-on entities — both simplified lists in v1)
- **Home tab**: Indoor/outdoor temperature with animated sparkline, Modes toggles, Scenes grid (Morning, Night, Away, Welcome, All Off, Hot Water), Security status (lock, garage doors L/R)
- **Notification panel**: Slide-out from right (replaces Bubble-Card popup). Shows open doors, running appliances, alerts.
- **Weather detail**: Tap weather badge → simplified forecast panel (daily forecast strip, no animated weather scene in v1)

**React improvements**: Animated sparkline on load, scene buttons with press feedback, security icons animate between states, notification panel slides smoothly.

### Rooms (RoomsView + RoomDetailPage)

**RoomsView**: 2-column grid of RoomCards with tab filter (Main / Home / other categories).

**RoomCard** props: `name`, `icon`, `color` (warm-gold, cool-blue, neutral-gray), `temperatureEntity`, `humidityEntity`, `alertCount`. One component definition used for all rooms.

**RoomDetailPage**: Header with temp/humidity badges, Room/Active tab bar.
- **Room tab**: Sections grouped by category — Lights (DeviceCards with toggle), Switches (same DeviceCard component), Appliances (icons that open slide-up control panels)
- **Active tab**: Flat list of entities currently "on", updates in real-time

**React improvements**: RoomCard tap triggers Framer Motion `layoutId` transition (card expands into room view). Appliance controls in smooth slide-up panels instead of Bubble-Card hash popups. Active tab updates live as you toggle devices.

### Solar & Grid (SolarGridView)

Consolidates current tabs 1-4 into one scrollable page:

- **Balance header**: "Balanced" / "Importing" / "Exporting" with Solar/Home power values
- **Live stats row**: Producing (W), Self Use (%), Coverage (%)
- **Solar chart**: Actual vs Forecast overlaid, interactive (hover for values, drag to zoom time range). Future battery state forecast overlaid if available.
- **Grid section**: Import/Export live values + 24h chart (dual series: import red, export purple)
- **Amperage section**: Phase A/B/C with proportional color-coded bars, imbalance indicator with severity coloring
- **Net metering section**: Deficit/Surplus indicator, Total Import/Export, Monthly grid used/exported, Lifetime solar production
- **Production row**: Today / Monthly kWh
- **Forecast row**: Today / Tomorrow kWh predictions

**React improvements**: All charts interactive and zoomable (Recharts). Animated counters for live power values. Phase bars animate proportionally. Single scrollable page eliminates tab switching for related data.

### EV Charging (EVChargingView)

Current tab 5 as its own dedicated page:

- **Vehicle card (Tesla Raikiri)**: Animated arc battery gauge (62%, color shifts red→yellow→green), range + connection status, charge limit slider, charge current slider, sentry mode toggle, lock toggle with animation
- **Charger mode section**: EV Charger Mode selector (Solar + Grid / Solar Only / Grid Only), Grid Fallback Min slider
- **Go-e Charger section**: Status display (Idle/Charging/Standby + total kWh), requested current slider, force state selector, PV Surplus Charging toggle

**React improvements**: Battery gauge is an animated SVG arc. Sliders give immediate visual feedback. Charger mode changes animate the UI to reflect new mode.

## Navigation

| Sidebar Item | Route | View |
|-------------|-------|------|
| Home | `/` | HomeView |
| Rooms | `/rooms` | RoomsView |
| Rooms → detail | `/rooms/:roomId` | RoomDetailPage |
| Scenes | `/scenes` | (future — not in experiment) |
| Energy → Solar | `/energy/solar` | SolarGridView |
| Energy → EV | `/energy/ev` | EVChargingView |
| More | `/more` | (future — not in experiment) |

Page transitions use Framer Motion `AnimatePresence` for smooth slide/fade between views.

## Deployment

**Home Assistant Add-on** that:
1. Serves the built React static files (output of `vite build`)
2. Registers as a sidebar panel in Home Assistant
3. Uses HA's ingress for seamless integration (no separate port/auth)

The add-on configuration will need the HA instance URL and a long-lived access token for the WebSocket connection.

Build pipeline: `npm run build` in `dashboard/` produces `dist/` → add-on serves these files.

## Experiment Success Criteria

The parallel experiment succeeds if:

1. **All 4 views are functional** — Overview, Rooms (with at least Kitchen detail), Solar & Grid, EV Charging all work with live HA data
2. **Interactions feel better** — page transitions, slide-up panels, and animated state changes are noticeably smoother than the YAML dashboard
3. **Charts are more useful** — Energy charts are interactive (zoom, hover tooltips) vs. static ApexCharts
4. **Development velocity** — adding a new room or modifying a component feels faster than editing YAML
5. **Stability** — WebSocket connection is reliable, no stale state, handles HA restarts gracefully

If these criteria are met, proceed with migrating remaining views (Scenes, individual rooms, Camera, System, Irrigation, etc.).

## What's NOT in Scope (v1)

- Scenes view (future)
- Camera view (future)
- System/settings view (future)
- Irrigation view (future)
- Animated weather scenes (simplified weather in v1)
- Calendar integration
- Drag-and-drop dashboard editor
- Multi-user/multi-device config sync
- Standalone mobile app — the React dashboard renders inside the HA app via the add-on sidebar, so the existing HA app is the mobile experience
