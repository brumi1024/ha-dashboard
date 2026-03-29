# Dashboard Migration Completion Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the YAML → React dashboard migration by fixing entity mismatches, finishing incomplete alpha views, and building remaining views — all verified against live HA entity data.

**Architecture:** View-by-view completion. Each view is self-contained with its own components under `src/components/<domain>/`. All entity IDs are centralized in `src/config/rooms.ts`. Components use `useEntity()` hooks from `@hakit/core` for reactive state and the Liquid Glass CSS design system.

**Tech Stack:** Vite 8, React 19, TypeScript 5, @hakit/core 6, @hakit/components 6, Recharts 3, Framer Motion 12, React Router v7, @mdi/react + @mdi/js

---

## Entity Audit (from live HA MCP, 2026-03-30)

Before implementation, these are the verified findings from querying Home Assistant:

### Entity ID Corrections Needed in `rooms.ts`
| Current Config Value | Correct Entity ID | Issue |
|---|---|---|
| `sensor.goe_249593_car` (goEStatus) | `sensor.goe_249593_car_value` | Config uses wrong entity; `_car` is not a sensor, `_car_value` is |
| `device_tracker.raikiri_location_tracker` (location) | `device_tracker.raikiri_location` | `_tracker` suffix doesn't exist |

### Key Entities Available for New Features
| Feature | Entity ID | State (sample) |
|---|---|---|
| Home Mode | `input_select.home_mode` | "Home" |
| Home Mode Automation | `automation.mode_home_mode_controller` | on |
| Notification Count | `sensor.active_notification_count` | 1 |
| Notifications Enabled | `input_boolean.notifications_enabled` | on |
| Active Lights Count | `sensor.active_lights_count` | 14 |
| Weather | `weather.forecast_home` | "cloudy" |
| Calendars (8) | `calendar.benjamin_s_calendar`, `calendar.birthdays`, `calendar.privat`, `calendar.bteke_cloudera_com`, `calendar.holidays_in_hungary`, `calendar.unnepnapok_magyarorszag`, `calendar.nyaralo_calendar`, `calendar.mvm_next` | — |
| Front Door Lock | `lock.smart_lock_pro` | locked |
| Garage Doors | `cover.right_garage_door`, `cover.garage_door` | closed |
| Garage Door Sensors | `binary_sensor.myggbett_door_window_sensor_door`, `binary_sensor.left_garage_door_sensor_door` | off |
| Living Room Sonos | `media_player.living_room_sonos` | playing |
| Living Room TV | `media_player.living_room_tv` | on |
| EV Charger Mode | `input_select.ev_charger_mode` | "Off" |
| EV Max Amps | `input_number.ev_charger_max_amps` | 16 |
| EV Grid Fallback Amps | `input_number.ev_charger_grid_fallback_amps` | 8 |
| EV Target Amps | `sensor.ev_charger_target_amps` | 0 |
| Go-e Requested Current | `number.goe_249593_amp` | 8 |
| Go-e Force State | `select.goe_249593_frc` | 0 |
| Go-e Logic Mode | `select.goe_249593_lmo` | 3 |
| Go-e Power Total | `sensor.goe_249593_nrg_11` | 0 |
| Go-e Energy Total | `sensor.goe_249593_eto` | 4903.574 |
| Go-e Car Connected | `binary_sensor.goe_249593_car_0` | off |
| Go-e Charging Duration | `sensor.goe_249593_cdi_value` | 0 |
| Tesla Battery | `sensor.raikiri_battery_level` | 59 |
| Tesla Range | `sensor.raikiri_battery_range` | 298.08 |
| Tesla Charge Current | `number.raikiri_charge_current` | 16 |
| Tesla Charge Limit | `number.raikiri_charge_limit` | 80 |
| Tesla Inside Temp | `sensor.raikiri_inside_temperature` | 18.5 |
| Tesla Sentry | `switch.raikiri_sentry_mode` | off |
| DHW Pump Status | `sensor.dhw_pump_status` | "Auto Standby" |
| DHW Pump Boost | `input_boolean.dhw_pump_boost` | off |
| DHW Pump Auto Mode | `input_boolean.dhw_pump_auto_mode` | on |
| 3D Printer Camera | `camera.x1c_00m00a2b0805242_camera` | streaming |
| 3D Printer Status | `input_select.printer_3d_status` | "Offline" |
| 3D Print Progress | `sensor.x1c_00m00a2b0805242_print_progress` | 100 |

### Views Removed from Scope
| View | Reason |
|---|---|
| Irrigation | 0 entities exist in HA |
| Scenes (standalone view) | Only 5 scripts + 1 toggle — already served by ScenesGrid on HomeView. Enhance in place. |
| Camera (security) | Only camera is Bambu Lab 3D printer. Repurpose as "3D Printer" view or section in System. |

---

## File Structure

### Files to Modify
- `src/config/rooms.ts` — Fix entity IDs, add new entity groups (calendar, modes, DHW, go-e controls, system)
- `src/views/HomeView.tsx` — Wire Events tab, Active tab, add Modes section, add Notification badge
- `src/views/EVChargingView.tsx` — Add go-e controls section, fix charger mode to use `input_select`
- `src/views/RoomsView.tsx` — No changes needed (room cards already work)
- `src/components/layout/Sidebar.tsx` — Add System nav item
- `src/App.tsx` — Add System route

### Files to Create
- `src/components/home/ModesSection.tsx` — Home/Away/Guest mode toggle
- `src/components/home/EventsTab.tsx` — Calendar events display
- `src/components/home/ActiveEntitiesTab.tsx` — Active lights/devices across home
- `src/components/home/NotificationBadge.tsx` — Notification count indicator
- `src/components/ev/GoEControls.tsx` — Interactive go-e charger controls
- `src/components/system/UpdatesList.tsx` — HA update entities list
- `src/components/system/SystemHealth.tsx` — HA system status
- `src/views/SystemView.tsx` — System status dashboard

---

## Phase 1: Entity Fixes & Config Expansion

### Task 1: Fix Incorrect Entity IDs in Config

**Files:**
- Modify: `src/config/rooms.ts:197-212`

- [ ] **Step 1: Fix goEStatus entity ID**

In `src/config/rooms.ts`, change the `evEntities` object:

```typescript
// Change this line:
goEStatus: 'sensor.goe_249593_car',
// To:
goEStatus: 'sensor.goe_249593_car_value',
```

- [ ] **Step 2: Fix Raikiri location entity ID**

```typescript
// Change this line:
location: 'device_tracker.raikiri_location_tracker',
// To:
location: 'device_tracker.raikiri_location',
```

- [ ] **Step 3: Verify the build still compiles**

Run: `cd /Users/benjaminteke/Developer/personal/workspace/ha-dashboard && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/config/rooms.ts
git commit -m "fix: correct entity IDs for go-e status and Raikiri location"
```

### Task 2: Add New Entity Groups to Config

**Files:**
- Modify: `src/config/rooms.ts`

- [ ] **Step 1: Add home mode entities**

Add after `securityEntities`:

```typescript
export const homeEntities = {
  homeMode: 'input_select.home_mode',
  notificationCount: 'sensor.active_notification_count',
  notificationsEnabled: 'input_boolean.notifications_enabled',
  activeLightsCount: 'sensor.active_lights_count',
} as const

export const calendarEntities = [
  'calendar.benjamin_s_calendar',
  'calendar.birthdays',
  'calendar.privat',
  'calendar.bteke_cloudera_com',
  'calendar.holidays_in_hungary',
  'calendar.mvm_next',
] as const
```

- [ ] **Step 2: Add go-e control entities**

Add after the new `calendarEntities`:

```typescript
export const goEEntities = {
  carConnected: 'binary_sensor.goe_249593_car_0',
  carState: 'sensor.goe_249593_car_value',
  energyTotal: 'sensor.goe_249593_eto',
  powerTotal: 'sensor.goe_249593_nrg_11',
  requestedCurrent: 'number.goe_249593_amp',
  forceState: 'select.goe_249593_frc',
  logicMode: 'select.goe_249593_lmo',
  chargingDuration: 'sensor.goe_249593_cdi_value',
  chargingAllowed: 'binary_sensor.goe_249593_alw',
  voltageL1: 'sensor.goe_249593_nrg_0',
  voltageL2: 'sensor.goe_249593_nrg_1',
  voltageL3: 'sensor.goe_249593_nrg_2',
  currentL1: 'sensor.goe_249593_nrg_4',
  currentL2: 'sensor.goe_249593_nrg_5',
  currentL3: 'sensor.goe_249593_nrg_6',
  tempSensor1: 'sensor.goe_249593_tma_0',
  tempSensor2: 'sensor.goe_249593_tma_1',
} as const

export const evChargerEntities = {
  mode: 'input_select.ev_charger_mode',
  maxAmps: 'input_number.ev_charger_max_amps',
  gridFallbackAmps: 'input_number.ev_charger_grid_fallback_amps',
  targetAmps: 'sensor.ev_charger_target_amps',
} as const
```

- [ ] **Step 3: Add media player entities for rooms**

```typescript
export const mediaEntities = {
  livingRoomSonos: 'media_player.living_room_sonos',
  livingRoomTV: 'media_player.living_room_tv',
} as const
```

- [ ] **Step 4: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/config/rooms.ts
git commit -m "feat: add entity groups for home modes, calendars, go-e controls, EV charger, media"
```

---

## Phase 2: Complete HomeView

### Task 3: Notification Badge Component

**Files:**
- Create: `src/components/home/NotificationBadge.tsx`

- [ ] **Step 1: Create the notification badge**

```tsx
import { useEntity } from '@hakit/core'
import type { EntityName } from '@hakit/core'
import { homeEntities } from '../../config/rooms'
import { Icon } from '@mdi/react'
import { mdiBellOutline } from '@mdi/js'
import { colors, spacing } from '../../styles/theme'

export function NotificationBadge() {
  const countEntity = useEntity(homeEntities.notificationCount as EntityName, { returnNullIfNotFound: true })
  const count = countEntity ? Number(countEntity.state) : 0

  if (count === 0) return null

  return (
    <div
      className="liquid-pill"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing.xs,
        padding: `${spacing.xs} ${spacing.sm}`,
        cursor: 'pointer',
      }}
    >
      <Icon path={mdiBellOutline} size={0.7} color={colors.accentAmber} />
      <span style={{ fontSize: '13px', fontWeight: 600, color: colors.accentAmber }}>
        {count}
      </span>
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/home/NotificationBadge.tsx
git commit -m "feat: add NotificationBadge component showing active notification count"
```

### Task 4: Modes Section Component

**Files:**
- Create: `src/components/home/ModesSection.tsx`

- [ ] **Step 1: Create the modes section**

```tsx
import { useEntity } from '@hakit/core'
import type { EntityName } from '@hakit/core'
import { homeEntities } from '../../config/rooms'
import { Icon } from '@mdi/react'
import { mdiHome, mdiHomeExportOutline, mdiAccountGroup } from '@mdi/js'
import { colors, spacing } from '../../styles/theme'

const modeConfig: Record<string, { icon: string; color: string }> = {
  Home: { icon: mdiHome, color: colors.accentGreen },
  Away: { icon: mdiHomeExportOutline, color: colors.accentAmber },
  Guest: { icon: mdiAccountGroup, color: colors.accentBlue },
}

export function ModesSection() {
  const modeEntity = useEntity(homeEntities.homeMode as EntityName, { returnNullIfNotFound: true })

  if (!modeEntity) return null

  const currentMode = modeEntity.state as string
  const options: string[] = (modeEntity.attributes as { options?: string[] }).options ?? ['Home', 'Away', 'Guest']

  const handleModeChange = (mode: string) => {
    ;(modeEntity as any).service.select_option({ serviceData: { option: mode } })
  }

  return (
    <div>
      <div className="section-label" style={{ marginBottom: spacing.sm }}>MODE</div>
      <div style={{ display: 'flex', gap: spacing.sm }}>
        {options.map((mode) => {
          const config = modeConfig[mode] ?? { icon: mdiHome, color: colors.textSecondary }
          const isActive = currentMode === mode
          return (
            <button
              key={mode}
              className={isActive ? 'liquid-pill liquid-pill-active' : 'liquid-pill'}
              onClick={() => handleModeChange(mode)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.xs,
                padding: `${spacing.sm} ${spacing.md}`,
                border: 'none',
                cursor: 'pointer',
                color: isActive ? config.color : colors.textSecondary,
                fontFamily: 'inherit',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              <Icon path={config.icon} size={0.7} color={isActive ? config.color : colors.textSecondary} />
              {mode}
            </button>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/home/ModesSection.tsx
git commit -m "feat: add ModesSection with Home/Away/Guest toggle pills"
```

### Task 5: Events Tab Component

**Files:**
- Create: `src/components/home/EventsTab.tsx`

- [ ] **Step 1: Create the events tab**

This uses the HA calendar API via `@hakit/core`. Calendar entities expose events through their attributes and the `get_events` service call. For the initial implementation, we'll show a static display of calendar entities with their upcoming event state.

```tsx
import { useEntity } from '@hakit/core'
import type { EntityName } from '@hakit/core'
import { calendarEntities } from '../../config/rooms'
import { Icon } from '@mdi/react'
import { mdiCalendar, mdiCalendarStar, mdiBriefcase, mdiCake, mdiCalendarHeart } from '@mdi/js'
import { colors, spacing } from '../../styles/theme'

const calendarIcons: Record<string, string> = {
  'calendar.benjamin_s_calendar': mdiCalendar,
  'calendar.birthdays': mdiCake,
  'calendar.privat': mdiCalendarHeart,
  'calendar.bteke_cloudera_com': mdiBriefcase,
  'calendar.holidays_in_hungary': mdiCalendarStar,
  'calendar.mvm_next': mdiCalendar,
}

const calendarNames: Record<string, string> = {
  'calendar.benjamin_s_calendar': "Benjamin's Calendar",
  'calendar.birthdays': 'Birthdays',
  'calendar.privat': 'Private',
  'calendar.bteke_cloudera_com': 'Work',
  'calendar.holidays_in_hungary': 'Holidays',
  'calendar.mvm_next': 'MVM Next',
}

function CalendarEntry({ entityId }: { entityId: string }) {
  const entity = useEntity(entityId as EntityName, { returnNullIfNotFound: true })

  if (!entity) return null

  const attrs = entity.attributes as {
    friendly_name?: string
    message?: string
    description?: string
    start_time?: string
    end_time?: string
    all_day?: boolean
  }

  const isActive = entity.state === 'on'
  const icon = calendarIcons[entityId] ?? mdiCalendar
  const name = calendarNames[entityId] ?? attrs.friendly_name ?? entityId

  return (
    <div
      className="liquid-glass"
      style={{
        padding: spacing.md,
        display: 'flex',
        alignItems: 'flex-start',
        gap: spacing.sm,
      }}
    >
      <Icon
        path={icon}
        size={0.8}
        color={isActive ? colors.accentBlue : colors.textMuted}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13px', color: colors.textSecondary, marginBottom: '2px' }}>
          {name}
        </div>
        {isActive && attrs.message ? (
          <div style={{ fontSize: '15px', color: colors.textPrimary, fontWeight: 500 }}>
            {attrs.message}
          </div>
        ) : (
          <div style={{ fontSize: '13px', color: colors.textMuted }}>
            No upcoming events
          </div>
        )}
        {isActive && attrs.start_time && (
          <div style={{ fontSize: '12px', color: colors.textMuted, marginTop: '2px' }}>
            {new Date(attrs.start_time).toLocaleString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export function EventsTab() {
  return (
    <div className="stagger-in" style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, width: '100%', maxWidth: '600px' }}>
      <div className="section-label">UPCOMING EVENTS</div>
      {calendarEntities.map((entityId) => (
        <CalendarEntry key={entityId} entityId={entityId} />
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/home/EventsTab.tsx
git commit -m "feat: add EventsTab showing upcoming calendar events"
```

### Task 6: Active Entities Tab Component

**Files:**
- Create: `src/components/home/ActiveEntitiesTab.tsx`

- [ ] **Step 1: Create the active entities tab**

This shows all currently active lights and open doors/covers across the home.

```tsx
import { useEntity } from '@hakit/core'
import type { EntityName } from '@hakit/core'
import { rooms, securityEntities, homeEntities } from '../../config/rooms'
import { Icon } from '@mdi/react'
import {
  mdiLightbulbOn,
  mdiLightbulbOutline,
  mdiGarageDoor,
  mdiDoorOpen,
  mdiLock,
  mdiLockOpen,
} from '@mdi/js'
import { colors, spacing } from '../../styles/theme'

function LightStatus({ entityId, roomName }: { entityId: string; roomName: string }) {
  const entity = useEntity(entityId as EntityName, { returnNullIfNotFound: true })
  if (!entity || entity.state !== 'on') return null
  const name = (entity.attributes as { friendly_name?: string }).friendly_name ?? entityId
  return (
    <div className="liquid-glass" style={{ padding: spacing.md, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
      <Icon path={mdiLightbulbOn} size={0.8} color={colors.accentAmber} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', color: colors.textPrimary, fontWeight: 500 }}>{name}</div>
        <div style={{ fontSize: '12px', color: colors.textMuted }}>{roomName}</div>
      </div>
      <button
        onClick={() => (entity as any).service.toggle()}
        style={{
          background: 'none',
          border: `1px solid ${colors.textMuted}`,
          borderRadius: '8px',
          color: colors.textSecondary,
          padding: `${spacing.xs} ${spacing.sm}`,
          cursor: 'pointer',
          fontSize: '12px',
          fontFamily: 'inherit',
        }}
      >
        Turn off
      </button>
    </div>
  )
}

function SecurityEntityStatus({ entityId, icon, label }: { entityId: string; icon: string; label: string }) {
  const entity = useEntity(entityId as EntityName, { returnNullIfNotFound: true })
  if (!entity) return null
  const isOpen = entity.state === 'open' || entity.state === 'unlocked'
  if (!isOpen) return null
  return (
    <div className="liquid-glass" style={{ padding: spacing.md, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
      <Icon path={icon} size={0.8} color={colors.accentRed} />
      <div style={{ fontSize: '14px', color: colors.textPrimary, fontWeight: 500 }}>{label}</div>
      <div style={{ marginLeft: 'auto', fontSize: '13px', color: colors.accentRed, fontWeight: 600 }}>
        {entity.state}
      </div>
    </div>
  )
}

function ActiveLightCount() {
  const entity = useEntity(homeEntities.activeLightsCount as EntityName, { returnNullIfNotFound: true })
  const count = entity ? Number(entity.state) : 0
  return (
    <div className="liquid-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.xs, padding: `${spacing.xs} ${spacing.sm}` }}>
      <Icon path={count > 0 ? mdiLightbulbOn : mdiLightbulbOutline} size={0.7} color={count > 0 ? colors.accentAmber : colors.textMuted} />
      <span style={{ fontSize: '13px', fontWeight: 600, color: count > 0 ? colors.accentAmber : colors.textMuted }}>
        {count} light{count !== 1 ? 's' : ''} on
      </span>
    </div>
  )
}

export function ActiveEntitiesTab() {
  const allLightEntities: { entityId: string; roomName: string }[] = []
  for (const room of rooms) {
    for (const lightId of room.lights) {
      allLightEntities.push({ entityId: lightId, roomName: room.name })
    }
    for (const switchId of room.switches) {
      allLightEntities.push({ entityId: switchId, roomName: room.name })
    }
  }

  return (
    <div className="stagger-in" style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, width: '100%', maxWidth: '600px' }}>
      <ActiveLightCount />

      <div className="section-label" style={{ marginTop: spacing.md }}>SECURITY</div>
      <SecurityEntityStatus entityId={securityEntities.frontDoorLock} icon={mdiLockOpen} label="Front Door" />
      <SecurityEntityStatus entityId={securityEntities.rightGarageDoor} icon={mdiGarageDoor} label="Right Garage" />
      <SecurityEntityStatus entityId={securityEntities.garageDoor} icon={mdiGarageDoor} label="Left Garage" />

      <div className="section-label" style={{ marginTop: spacing.md }}>ACTIVE LIGHTS</div>
      {allLightEntities.map(({ entityId, roomName }) => (
        <LightStatus key={entityId} entityId={entityId} roomName={roomName} />
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/home/ActiveEntitiesTab.tsx
git commit -m "feat: add ActiveEntitiesTab showing all active lights and open security entities"
```

### Task 7: Wire Everything into HomeView

**Files:**
- Modify: `src/views/HomeView.tsx`

- [ ] **Step 1: Update HomeView with all new components**

Replace the entire contents of `src/views/HomeView.tsx`:

```tsx
import { useState } from 'react'
import { WeatherBadge } from '../components/home/WeatherBadge'
import { GreetingCard } from '../components/home/GreetingCard'
import { TemperatureDisplay } from '../components/home/TemperatureDisplay'
import { ScenesGrid } from '../components/home/ScenesGrid'
import { SecurityStatus } from '../components/home/SecurityStatus'
import { ModesSection } from '../components/home/ModesSection'
import { NotificationBadge } from '../components/home/NotificationBadge'
import { EventsTab } from '../components/home/EventsTab'
import { ActiveEntitiesTab } from '../components/home/ActiveEntitiesTab'
import { TabBar } from '../components/layout/TabBar'
import { spacing, colors } from '../styles/theme'

const tabs = [
  { id: 'home', label: 'Home' },
  { id: 'events', label: 'Events' },
  { id: 'active', label: 'Active' },
]

export function HomeView() {
  const [activeTab, setActiveTab] = useState('home')
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg, alignItems: 'center', fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md }}>
        <div style={{ fontSize: '14px', color: colors.textMuted }}>{dateStr} - {timeStr}</div>
        <NotificationBadge />
      </div>
      <WeatherBadge />
      <GreetingCard />
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'home' && (
        <div className="stagger-in" style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl, width: '100%', maxWidth: '600px' }}>
          <ModesSection />
          <TemperatureDisplay />
          <ScenesGrid />
          <SecurityStatus />
        </div>
      )}
      {activeTab === 'events' && <EventsTab />}
      {activeTab === 'active' && <ActiveEntitiesTab />}
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/views/HomeView.tsx
git commit -m "feat: wire NotificationBadge, ModesSection, EventsTab, ActiveEntitiesTab into HomeView"
```

---

## Phase 3: Complete EV Charging View

### Task 8: Add Go-e Interactive Controls Component

**Files:**
- Create: `src/components/ev/GoEControls.tsx`

- [ ] **Step 1: Create the go-e controls component**

```tsx
import { useEntity } from '@hakit/core'
import type { EntityName } from '@hakit/core'
import { goEEntities, evChargerEntities } from '../../config/rooms'
import { Icon } from '@mdi/react'
import {
  mdiEvStation,
  mdiFlash,
  mdiThermometer,
  mdiCarElectric,
  mdiPowerPlug,
  mdiTimer,
  mdiSolarPower,
} from '@mdi/js'
import { colors, spacing } from '../../styles/theme'
import { AnimatedCounter } from '../shared/AnimatedCounter'

const chargerModeIcons: Record<string, string> = {
  Off: mdiPowerPlug,
  Solar: mdiSolarPower,
  'Solar+Grid': mdiFlash,
  Grid: mdiFlash,
}

function ChargerModeSelector() {
  const modeEntity = useEntity(evChargerEntities.mode as EntityName, { returnNullIfNotFound: true })
  const targetAmps = useEntity(evChargerEntities.targetAmps as EntityName, { returnNullIfNotFound: true })

  if (!modeEntity) return null

  const currentMode = modeEntity.state as string
  const options: string[] = (modeEntity.attributes as { options?: string[] }).options ?? ['Off', 'Solar', 'Solar+Grid', 'Grid']

  const handleModeChange = (mode: string) => {
    ;(modeEntity as any).service.select_option({ serviceData: { option: mode } })
  }

  return (
    <div className="liquid-glass" style={{ padding: spacing.md }}>
      <div className="section-label" style={{ marginBottom: spacing.sm }}>CHARGER MODE</div>
      <div style={{ display: 'flex', gap: spacing.xs, marginBottom: spacing.md }}>
        {options.map((mode) => {
          const isActive = currentMode === mode
          return (
            <button
              key={mode}
              className={isActive ? 'liquid-pill liquid-pill-active' : 'liquid-pill'}
              onClick={() => handleModeChange(mode)}
              style={{
                flex: 1,
                padding: `${spacing.sm} ${spacing.xs}`,
                border: 'none',
                cursor: 'pointer',
                color: isActive ? colors.accentGreen : colors.textSecondary,
                fontFamily: 'inherit',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Icon path={chargerModeIcons[mode] ?? mdiPowerPlug} size={0.7} color={isActive ? colors.accentGreen : colors.textSecondary} />
              {mode}
            </button>
          )
        })}
      </div>
      {targetAmps && (
        <div style={{ fontSize: '13px', color: colors.textMuted, textAlign: 'center' }}>
          Target: {targetAmps.state}A
        </div>
      )}
    </div>
  )
}

function GoEStatus() {
  const carState = useEntity(goEEntities.carState as EntityName, { returnNullIfNotFound: true })
  const carConnected = useEntity(goEEntities.carConnected as EntityName, { returnNullIfNotFound: true })
  const powerTotal = useEntity(goEEntities.powerTotal as EntityName, { returnNullIfNotFound: true })
  const energyTotal = useEntity(goEEntities.energyTotal as EntityName, { returnNullIfNotFound: true })
  const chargingDuration = useEntity(goEEntities.chargingDuration as EntityName, { returnNullIfNotFound: true })
  const temp1 = useEntity(goEEntities.tempSensor1 as EntityName, { returnNullIfNotFound: true })

  const isConnected = carConnected?.state === 'on'
  const power = powerTotal ? Number(powerTotal.state) : 0

  return (
    <div className="liquid-glass" style={{ padding: spacing.md }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md }}>
        <Icon path={mdiEvStation} size={1} color={isConnected ? colors.accentGreen : colors.textMuted} />
        <div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: colors.textPrimary }}>Go-e Charger</div>
          <div style={{ fontSize: '13px', color: isConnected ? colors.accentGreen : colors.textMuted }}>
            {carState?.state ?? 'Unknown'}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm }}>
        <div className="liquid-pill" style={{ padding: spacing.sm, textAlign: 'center' }}>
          <Icon path={mdiFlash} size={0.6} color={power > 0 ? colors.accentGreen : colors.textMuted} />
          <div style={{ fontSize: '18px', fontWeight: 700, color: colors.textPrimary }}>
            <AnimatedCounter value={power} /> W
          </div>
          <div style={{ fontSize: '11px', color: colors.textMuted }}>Power</div>
        </div>
        <div className="liquid-pill" style={{ padding: spacing.sm, textAlign: 'center' }}>
          <Icon path={mdiCarElectric} size={0.6} color={colors.textSecondary} />
          <div style={{ fontSize: '18px', fontWeight: 700, color: colors.textPrimary }}>
            {energyTotal ? Number(energyTotal.state).toFixed(1) : '—'} kWh
          </div>
          <div style={{ fontSize: '11px', color: colors.textMuted }}>Total Energy</div>
        </div>
        <div className="liquid-pill" style={{ padding: spacing.sm, textAlign: 'center' }}>
          <Icon path={mdiTimer} size={0.6} color={colors.textSecondary} />
          <div style={{ fontSize: '18px', fontWeight: 700, color: colors.textPrimary }}>
            {chargingDuration?.state ?? '—'}s
          </div>
          <div style={{ fontSize: '11px', color: colors.textMuted }}>Duration</div>
        </div>
        <div className="liquid-pill" style={{ padding: spacing.sm, textAlign: 'center' }}>
          <Icon path={mdiThermometer} size={0.6} color={colors.textSecondary} />
          <div style={{ fontSize: '18px', fontWeight: 700, color: colors.textPrimary }}>
            {temp1 ? Number(temp1.state).toFixed(1) : '—'}°C
          </div>
          <div style={{ fontSize: '11px', color: colors.textMuted }}>Charger Temp</div>
        </div>
      </div>
    </div>
  )
}

export function GoEControls() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
      <ChargerModeSelector />
      <GoEStatus />
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/ev/GoEControls.tsx
git commit -m "feat: add GoEControls with charger mode selector and detailed status"
```

### Task 9: Update EVChargingView to Include Go-e Controls

**Files:**
- Modify: `src/views/EVChargingView.tsx`

- [ ] **Step 1: Read current EVChargingView**

Read `src/views/EVChargingView.tsx` to understand current structure.

- [ ] **Step 2: Add GoEControls import and render**

Add import at top:
```tsx
import { GoEControls } from '../components/ev/GoEControls'
```

Add `<GoEControls />` after the existing Go-e charger section (after the `<GoECharger />` component or replacing it if it's just a status display).

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/views/EVChargingView.tsx
git commit -m "feat: integrate GoEControls with charger mode and detailed status into EV view"
```

---

## Phase 4: System View

### Task 10: System Health Component

**Files:**
- Create: `src/components/system/SystemHealth.tsx`

- [ ] **Step 1: Create the system health component**

```tsx
import { useEntity } from '@hakit/core'
import type { EntityName } from '@hakit/core'
import { Icon } from '@mdi/react'
import { mdiServerNetwork, mdiUpdate, mdiBellOutline } from '@mdi/js'
import { homeEntities } from '../../config/rooms'
import { colors, spacing } from '../../styles/theme'

export function SystemHealth() {
  const notifCount = useEntity(homeEntities.notificationCount as EntityName, { returnNullIfNotFound: true })
  const haCore = useEntity('update.home_assistant_core_update' as EntityName, { returnNullIfNotFound: true })
  const haOS = useEntity('update.home_assistant_operating_system_update' as EntityName, { returnNullIfNotFound: true })
  const supervisor = useEntity('update.home_assistant_supervisor_update' as EntityName, { returnNullIfNotFound: true })

  const coreVersion = (haCore?.attributes as { installed_version?: string })?.installed_version ?? '—'
  const osVersion = (haOS?.attributes as { installed_version?: string })?.installed_version ?? '—'
  const supVersion = (supervisor?.attributes as { installed_version?: string })?.installed_version ?? '—'

  const coreUpdateAvailable = haCore?.state === 'on'
  const osUpdateAvailable = haOS?.state === 'on'
  const supUpdateAvailable = supervisor?.state === 'on'

  return (
    <div className="liquid-glass" style={{ padding: spacing.md }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md }}>
        <Icon path={mdiServerNetwork} size={1} color={colors.accentBlue} />
        <div style={{ fontSize: '18px', fontWeight: 700, color: colors.textPrimary }}>Home Assistant</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: colors.textSecondary }}>Core</span>
          <span style={{ fontSize: '14px', color: coreUpdateAvailable ? colors.accentAmber : colors.textPrimary, fontWeight: 500 }}>
            {coreVersion} {coreUpdateAvailable ? '(update available)' : ''}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: colors.textSecondary }}>OS</span>
          <span style={{ fontSize: '14px', color: osUpdateAvailable ? colors.accentAmber : colors.textPrimary, fontWeight: 500 }}>
            {osVersion} {osUpdateAvailable ? '(update available)' : ''}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: colors.textSecondary }}>Supervisor</span>
          <span style={{ fontSize: '14px', color: supUpdateAvailable ? colors.accentAmber : colors.textPrimary, fontWeight: 500 }}>
            {supVersion} {supUpdateAvailable ? '(update available)' : ''}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: spacing.sm, marginTop: spacing.md }}>
        <div className="liquid-pill" style={{ flex: 1, padding: spacing.sm, textAlign: 'center' }}>
          <Icon path={mdiUpdate} size={0.6} color={colors.textSecondary} />
          <div style={{ fontSize: '12px', color: colors.textMuted, marginTop: '2px' }}>Updates</div>
        </div>
        <div className="liquid-pill" style={{ flex: 1, padding: spacing.sm, textAlign: 'center' }}>
          <Icon path={mdiBellOutline} size={0.6} color={colors.textSecondary} />
          <div style={{ fontSize: '14px', fontWeight: 600, color: colors.textPrimary }}>
            {notifCount ? notifCount.state : '0'}
          </div>
          <div style={{ fontSize: '12px', color: colors.textMuted }}>Notifications</div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/system/SystemHealth.tsx
git commit -m "feat: add SystemHealth component with HA version info and update status"
```

### Task 11: Updates List Component

**Files:**
- Create: `src/components/system/UpdatesList.tsx`

- [ ] **Step 1: Create the updates list**

This shows add-on and device firmware updates that have available updates (state === 'on').

```tsx
import { useEntity } from '@hakit/core'
import type { EntityName } from '@hakit/core'
import { Icon } from '@mdi/react'
import { mdiUpdate, mdiCheck } from '@mdi/js'
import { colors, spacing } from '../../styles/theme'

const trackedUpdates = [
  'update.tailscale_update',
  'update.mosquitto_broker_update',
  'update.studio_code_server_update',
  'update.matter_server_update',
  'update.advanced_ssh_web_terminal_update',
  'update.openthread_border_router_update',
  'update.get_hacs_update',
  'update.browser_mod_update',
  'update.adaptive_lighting_update',
]

function UpdateEntry({ entityId }: { entityId: string }) {
  const entity = useEntity(entityId as EntityName, { returnNullIfNotFound: true })
  if (!entity) return null

  const attrs = entity.attributes as {
    friendly_name?: string
    installed_version?: string
    latest_version?: string
  }
  const hasUpdate = entity.state === 'on'
  const name = attrs.friendly_name?.replace(' Update', '').replace(' update', '') ?? entityId

  return (
    <div
      className="liquid-glass"
      style={{
        padding: spacing.sm,
        display: 'flex',
        alignItems: 'center',
        gap: spacing.sm,
      }}
    >
      <Icon
        path={hasUpdate ? mdiUpdate : mdiCheck}
        size={0.7}
        color={hasUpdate ? colors.accentAmber : colors.accentGreen}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', color: colors.textPrimary, fontWeight: 500 }}>{name}</div>
        <div style={{ fontSize: '12px', color: colors.textMuted }}>
          {attrs.installed_version ?? '—'}
          {hasUpdate && attrs.latest_version ? ` → ${attrs.latest_version}` : ''}
        </div>
      </div>
    </div>
  )
}

export function UpdatesList() {
  return (
    <div>
      <div className="section-label" style={{ marginBottom: spacing.sm }}>ADD-ONS & INTEGRATIONS</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
        {trackedUpdates.map((entityId) => (
          <UpdateEntry key={entityId} entityId={entityId} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/system/UpdatesList.tsx
git commit -m "feat: add UpdatesList showing add-on and integration update status"
```

### Task 12: System View

**Files:**
- Create: `src/views/SystemView.tsx`

- [ ] **Step 1: Create the system view**

```tsx
import { SystemHealth } from '../components/system/SystemHealth'
import { UpdatesList } from '../components/system/UpdatesList'
import { spacing } from '../styles/theme'

export function SystemView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl, alignItems: 'center', fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif" }}>
      <div className="page-title">System</div>
      <div className="stagger-in" style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg, width: '100%', maxWidth: '600px' }}>
        <SystemHealth />
        <UpdatesList />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/views/SystemView.tsx
git commit -m "feat: add SystemView with health status and updates list"
```

### Task 13: Wire System View into Router and Sidebar

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/layout/Sidebar.tsx`

- [ ] **Step 1: Read current App.tsx and Sidebar.tsx**

Read both files to understand current routing and nav structure.

- [ ] **Step 2: Add System route to App.tsx**

Add import:
```tsx
import { SystemView } from './views/SystemView'
```

Add route inside the `<Route element={<AppShell />}>` block:
```tsx
<Route path="system" element={<SystemView />} />
```

- [ ] **Step 3: Add System nav item to Sidebar.tsx**

Add the System nav link. Use `mdiCogOutline` or `mdiServerNetwork` icon, path `/system`.

Import:
```tsx
import { mdiCogOutline } from '@mdi/js'
```

Add nav item after EV entry (before the "More" section if one exists):
```tsx
<NavLink to="/system" ...>System</NavLink>
```

Follow the exact pattern used by the existing NavLink items in the sidebar.

- [ ] **Step 4: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/components/layout/Sidebar.tsx
git commit -m "feat: add System route and sidebar navigation"
```

---

## Phase 5: Room Entity Completeness

### Task 14: Fill In Room Entity Mappings

**Files:**
- Modify: `src/config/rooms.ts`

> **Note:** This task requires verifying actual entity IDs from HA. Use the HA MCP `ha_search_entities` tool with area filters to find lights, switches, and appliances for each room. The rooms that need filling in are: Master Bedroom, Lilla's Room, Basement, Living Room (appliances — TV, Sonos), Garage (switches).

- [ ] **Step 1: Search HA for entities in each incomplete room**

Use `ha_search_entities` with area_filter for: "bedroom", "lilla_bedroom", "garage"
Also search for entities matching room names that may not be area-assigned.

- [ ] **Step 2: Update room configs with discovered entities**

Fill in the `lights`, `switches`, and `appliances` arrays for each room based on discovered entities.

- [ ] **Step 3: Add Living Room media/appliance entries**

```typescript
// In the living-room config, update appliances:
appliances: [
  { name: 'TV', icon: 'mdi:television', entity: 'media_player.living_room_tv' },
  { name: 'Sonos', icon: 'mdi:speaker', entity: 'media_player.living_room_sonos' },
],
```

- [ ] **Step 4: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/config/rooms.ts
git commit -m "feat: fill in room entity mappings for all rooms from live HA data"
```

---

## Phase 6: Migration Plan Update

### Task 15: Update Migration Plan

**Files:**
- Modify: `docs/migration-plan.md`

- [ ] **Step 1: Update the migration plan to reflect completed work**

Update the following:
- Move "Scenes" from "Remaining Views" to note: "Served by ScenesGrid on HomeView, no standalone view needed"
- Move "Camera" to note: "Only camera is Bambu Lab 3D printer — future 3D Printer view"
- Remove "Irrigation" — no entities exist
- Update HomeView incomplete features to reflect completed notifications, modes, events, active tabs
- Update EV Charging incomplete features to reflect go-e controls
- Add System view to Alpha Views table
- Update entity config status

- [ ] **Step 2: Commit**

```bash
git add docs/migration-plan.md
git commit -m "docs: update migration plan with completed features and entity audit findings"
```

---

## Summary of Phases

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | 1-2 | Fix entity IDs, expand config with new entity groups |
| 2 | 3-7 | Complete HomeView: notifications, modes, events, active entities |
| 3 | 8-9 | Complete EV view: go-e interactive controls, charger mode |
| 4 | 10-13 | New System view: health status, updates list, routing |
| 5 | 14 | Fill in room entity mappings from live HA data |
| 6 | 15 | Update migration plan documentation |

## Out of Scope (Future Work, Requires User Input)
- **Weather detail panel** — Needs design decision on forecast layout (daily/hourly, charts vs list)
- **Responsive/mobile layout** — Needs design for bottom tab bar, breakpoints
- **HA Add-on packaging** — Dockerfile, config.yaml, ingress setup
- **Error boundaries & loading states** — Infrastructure work, independent of views
- **3D Printer view** — Bambu Lab X1C dashboard (replaces "Camera" view from original plan)
- **DHW/Hot Water detail panel** — Rich DHW pump controls exist but need design
