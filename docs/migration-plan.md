# Migration Plan: YAML Dashboard → React Dashboard

## Status: Alpha + Phase 1 Complete (2026-03-30)

The alpha validates the approach — 5 views built with Apple Liquid Glass design, live HA data via WebSocket. Phase 1 completes the HomeView tabs, adds Go-e charger controls, System view, and persistent media player bar. Entity IDs verified against live HA instance.

## Process for Each View

1. User provides screenshots of the current YAML dashboard view
2. User explains what each element does, interactions, and edge cases
3. We design and implement the React equivalent, improving where possible
4. Verify with live HA data

## Alpha Views (Done)

| View | Status | Notes |
|------|--------|-------|
| Overview (Home) | **Complete** | Weather, greeting, temp, scenes, security, **notification badge, modes, events tab, active entities tab** |
| Rooms Grid | Alpha | Category tabs (Main/Home/Utility), room cards with temp/humidity |
| Room Detail | Alpha | Kitchen fully wired. Lights, switches, appliances, active tab |
| Solar & Grid | Alpha | Consolidated from 4 YAML tabs. Charts, phases, net metering (deliberately redesigned) |
| EV Charging | **Enhanced** | Tesla battery gauge, **Go-e charger mode selector (Off/Solar/Solar+Grid/Grid), detailed Go-e status** |
| System | **New** | HA Core/OS/Supervisor versions, update status for add-ons and integrations |

## Remaining Views

| View | Priority | Description |
|------|----------|-------------|
| ~~Scenes~~ | ~~High~~ | Served by ScenesGrid on HomeView — no standalone view needed |
| ~~Camera~~ | ~~Medium~~ | Only camera is Bambu Lab 3D printer — future 3D Printer view if needed |
| ~~Irrigation~~ | ~~Low~~ | **No entities exist in HA** — removed from scope |

## Entity Audit (2026-03-30)

Verified all entity IDs against live HA instance via MCP:

### Fixed Entity IDs
| Entity | Old (wrong) | New (correct) |
|--------|------------|---------------|
| Go-e car state | `sensor.goe_249593_car` | `sensor.goe_249593_car_value` |
| Raikiri location | `device_tracker.raikiri_location_tracker` | `device_tracker.raikiri_location` |

### New Entity Groups Added to Config
- `homeEntities` — home mode, notification count, active lights count
- `calendarEntities` — 6 calendar entities for Events tab
- `goEEntities` — 18 go-e charger sensors/controls
- `evChargerEntities` — charger mode (input_select), max amps, target amps
- `mediaEntities` — Living Room Sonos and TV

### Room Entity Completeness
- **Master Bedroom**: No smart lights/switches in HA — only sensors + air quality monitor
- **Lilla's Room**: No smart lights/switches in HA — only sensors
- **Basement**: No smart lights/switches in HA — only sensors
- **Living Room**: Added TV + Sonos as appliances
- **Garage**: Already had light configured; additional switch entities are Shelly relay duplicates

## Incomplete Features

### Rooms
- **Climate cards**: No home climate entity (only Tesla HVAC). hakit provides `ClimateCard`.
- **Media player cards**: hakit provides `MediaPlayerCard` — could add to Living Room detail.

### Solar & Grid
- **Chart interactivity**: Recharts charts render but zoom/pan not yet implemented.

### EV Charging
- **Charge limit/current sliders**: Currently display-only, not interactive.

## Infrastructure

| Item | Status | Description |
|------|--------|-------------|
| Media Player Bar | **Done** | Persistent mini player using `MediaPlayerCard` layout="slim" from @hakit/components |
| HA Add-on | Not started | Dockerfile, `config.yaml`, sidebar panel registration, ingress |
| Responsive layout | Not started | Mobile/tablet layout |
| Error boundaries | Not started | Graceful handling of entity-not-found, connection drops |
| Loading states | Not started | Skeleton screens while entities load |

## Design System

**Established (keep):**
- Apple Liquid Glass — frosted glass panels, refraction borders, system font
- Background image with subtle frosted overlay
- `.liquid-glass`, `.liquid-glass-prominent`, `.liquid-pill` CSS classes
- Spring animations (Framer Motion)
- Stagger-in entry animations

**Known limitation:**
- `liquid-glass-react` library breaks CSS grid/flex layouts. Use CSS classes for repeated elements. Library can only be used on standalone, non-grid elements.

## Tech Stack

- Vite 8 + React 19 + TypeScript 5
- @hakit/core + @hakit/components (WebSocket, entity hooks, pre-built cards)
- Recharts (energy charts)
- Framer Motion (page transitions, animations)
- React Router v7
- @mdi/react + @mdi/js (icons)
- liquid-glass-react (standalone glass elements only)
