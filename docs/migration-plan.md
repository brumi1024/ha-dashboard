# Migration Plan: YAML Dashboard → React Dashboard

## Status: Alpha Complete (2026-03-30)

The alpha validates the approach — 4 views built with Apple Liquid Glass design, live HA data via WebSocket. The next phase is a view-by-view migration where each view is designed from screenshots of the current YAML dashboard.

## Process for Each View

1. User provides screenshots of the current YAML dashboard view
2. User explains what each element does, interactions, and edge cases
3. We design and implement the React equivalent, improving where possible
4. Verify with live HA data

## Alpha Views (Done)

| View | Status | Notes |
|------|--------|-------|
| Overview (Home) | Alpha | Weather, greeting, temp, scenes, security. Missing: notification panel, modes, events/active tabs |
| Rooms Grid | Alpha | Category tabs (Main/Home/Utility), room cards with temp/humidity |
| Room Detail | Alpha | Kitchen fully wired. Lights, switches, appliances, active tab |
| Solar & Grid | Alpha | Consolidated from 4 YAML tabs. Charts, phases, net metering |
| EV Charging | Alpha | Tesla battery gauge, charger mode, Go-e status |

## Remaining Views (Not Started)

| View | Priority | Description |
|------|----------|-------------|
| Scenes | High | Scene activation/management — currently just buttons on HomeView |
| Camera | Medium | Camera feeds, likely iframe or HLS stream |
| System | Medium | HA system status, updates, settings |
| Irrigation | Low | Garden/lawn irrigation controls |

## Incomplete Features in Alpha Views

### Overview (HomeView)
- **Notification panel**: Slide-out showing open doors, running appliances, alerts. Currently no implementation.
- **Modes section**: Guest mode, Away mode toggles (`input_select.home_mode`). Not implemented.
- **Events tab**: Should show calendar/upcoming events. Currently placeholder.
- **Active tab**: Should show all currently active entities across the home. Currently placeholder.
- **Weather detail**: Tapping weather badge should open forecast panel (daily/hourly, rainfall, wind). Currently no detail view.

### Rooms
- **Room entity mapping**: Several rooms have empty `lights`/`switches`/`appliances` arrays in `rooms.ts`. Need to fill in actual entity IDs for: Master Bedroom, Lilla's Room, Basement.
- **Room-specific features**: Some rooms may have climate controls (heat pump), media players (Sonos), or other devices not yet supported.
- **Climate cards**: No climate/thermostat integration yet. hakit provides `ClimateCard` — should use it.
- **Media player cards**: No Sonos/media integration yet. hakit provides `MediaPlayerCard`.

### Solar & Grid
- **Chart interactivity**: Recharts charts render but zoom/pan not yet implemented.
- **History data**: `useHistory` hook usage needs verification — may need different approach for chart data.

### EV Charging
- **Charger mode entity**: `select.ev_charger_mode` may not be the correct entity ID. Needs verification.
- **Go-e charger controls**: Only shows status, missing: requested current slider, force state selector, PV surplus toggle.
- **Charge limit/current sliders**: Currently display-only, not interactive.

## Infrastructure

| Item | Status | Description |
|------|--------|-------------|
| HA Add-on | Not started | Dockerfile, `config.yaml`, sidebar panel registration, ingress |
| Responsive layout | Not started | Mobile/tablet layout, bottom tab bar on small screens |
| Error boundaries | Not started | Graceful handling of entity-not-found, connection drops |
| Loading states | Not started | Skeleton screens while entities load |
| Reconnection | Not started | Handle HA restarts, network drops (hakit may handle this) |
| Remaining icons | Partial | Some components still use emoji instead of MDI icons |

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
