# React Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a React dashboard for Home Assistant using ha-component-kit with 4 views: Overview, Rooms, Solar & Grid, and EV Charging.

**Architecture:** Vite + React 19 + TypeScript app in `dashboard/` directory. Uses @hakit/core for WebSocket connection and entity hooks, @hakit/components for pre-built cards. Recharts for energy charts, Framer Motion for animations. Deployed as HA add-on.

**Tech Stack:** Vite 7, React 19, TypeScript 5, @hakit/core, @hakit/components, Recharts, Framer Motion, React Router v7

**Design spec:** `docs/superpowers/specs/2026-03-29-react-dashboard-design.md`

---

## File Structure

```
dashboard/
├── src/
│   ├── App.tsx                         # HassConnect + ThemeProvider + Router
│   ├── main.tsx                        # Entry point (from scaffold)
│   ├── config/
│   │   └── rooms.ts                    # Room definitions with entity IDs
│   ├── styles/
│   │   └── theme.ts                    # Color palette, shared CSS vars
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx            # Sidebar + animated content area
│   │   │   ├── Sidebar.tsx             # Icon nav (Home, Rooms, Energy, EV, More)
│   │   │   └── TabBar.tsx              # Reusable tab switcher
│   │   ├── shared/
│   │   │   ├── StatBadge.tsx           # Icon + value + label
│   │   │   ├── AnimatedCounter.tsx     # Number that rolls on change
│   │   │   ├── DeviceCard.tsx          # Toggle card for lights/switches
│   │   │   └── DeviceSection.tsx       # Titled group of DeviceCards
│   │   ├── home/
│   │   │   ├── WeatherBadge.tsx        # Compact weather + tap for forecast
│   │   │   ├── GreetingCard.tsx        # Time-of-day greeting + presence
│   │   │   ├── TemperatureDisplay.tsx  # Indoor/outdoor + sparkline
│   │   │   ├── ScenesGrid.tsx          # Scene/script activation buttons
│   │   │   ├── SecurityStatus.tsx      # Lock + garage door chips
│   │   │   └── NotificationPanel.tsx   # Slide-out panel for alerts
│   │   ├── rooms/
│   │   │   ├── RoomCard.tsx            # Room overview (temp, humidity, icon, badge)
│   │   │   ├── RoomDetailView.tsx      # Full room with device sections
│   │   │   └── ActiveTab.tsx           # List of active entities
│   │   ├── energy/
│   │   │   ├── BalanceHeader.tsx        # Solar/Home power status
│   │   │   ├── SolarChart.tsx           # Actual vs forecast chart
│   │   │   ├── GridSection.tsx          # Import/export + 24h chart
│   │   │   ├── AmperageSection.tsx      # Phase A/B/C bars + imbalance
│   │   │   ├── NetMeteringSection.tsx   # Balance, totals
│   │   │   └── ProductionStats.tsx      # Today/monthly/lifetime + forecast
│   │   └── ev/
│   │       ├── VehicleCard.tsx          # Tesla battery gauge + controls
│   │       ├── ChargerMode.tsx          # EV charger mode + fallback slider
│   │       └── GoECharger.tsx           # Go-e charger status + controls
│   └── views/
│       ├── HomeView.tsx
│       ├── RoomsView.tsx
│       ├── RoomDetailPage.tsx
│       ├── SolarGridView.tsx
│       └── EVChargingView.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env                                # VITE_HA_URL, VITE_HA_TOKEN
└── index.html
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `dashboard/` (entire scaffold)
- Create: `dashboard/.env`

- [ ] **Step 1: Scaffold the project**

```bash
cd /Users/benjaminteke/Developer/personal/workspace/claude-homeassistant
npm create hakit@latest dashboard
```

Follow the prompts: select TypeScript, accept defaults. This creates the Vite + React + hakit scaffold.

- [ ] **Step 2: Install additional dependencies**

```bash
cd dashboard
npm install recharts framer-motion react-router-dom
npm install -D @types/react-router-dom
```

- [ ] **Step 3: Create .env file**

Create `dashboard/.env`:

```env
VITE_HA_URL=http://homeassistant.local:8123
VITE_HA_TOKEN=your_long_lived_access_token_here
```

Add to `dashboard/.gitignore` (should already exist from scaffold, but verify):

```
.env
```

- [ ] **Step 4: Verify scaffold runs**

```bash
cd dashboard
npm run dev
```

Expected: Vite dev server starts, browser opens to hakit default page. Verify it connects to HA (you'll need to set the correct URL/token in .env first).

- [ ] **Step 5: Clean up scaffold files**

Remove the default demo content from `src/App.tsx` — keep only the `HassConnect` and `ThemeProvider` wrapper. Delete any demo components the scaffold created.

- [ ] **Step 6: Commit**

```bash
git add dashboard/
git commit -m "feat: scaffold React dashboard with ha-component-kit"
```

---

### Task 2: Theme & Color Palette

**Files:**
- Create: `dashboard/src/styles/theme.ts`

- [ ] **Step 1: Create theme file**

Create `dashboard/src/styles/theme.ts`:

```typescript
export const colors = {
  // Background gradient matching current HA dashboard
  bgGradientStart: '#2d5a3d',
  bgGradientEnd: '#1a3a2a',

  // Card colors
  cardBg: 'rgba(255, 255, 255, 0.08)',
  cardBgHover: 'rgba(255, 255, 255, 0.12)',
  cardBorder: 'rgba(255, 255, 255, 0.06)',

  // Room card warm tones
  roomWarmGold: 'rgba(200, 180, 100, 0.4)',
  roomCoolBlue: 'rgba(150, 180, 200, 0.4)',
  roomNeutralGray: 'rgba(180, 180, 180, 0.3)',

  // Text
  textPrimary: '#e0e0e0',
  textSecondary: '#999999',
  textMuted: '#666666',

  // Status
  statusOn: '#f0c040',
  statusOff: '#444444',
  statusAlert: '#e05050',
  statusGood: '#4CAF50',

  // Energy
  solarYellow: '#f0c040',
  gridImport: '#e05050',
  gridExport: '#7c4dff',
  phaseA: '#e05050',
  phaseB: '#4488ff',
  phaseC: '#4CAF50',

  // Sidebar
  sidebarBg: 'rgba(30, 50, 40, 0.85)',
  sidebarActive: 'rgba(255, 255, 255, 0.15)',
} as const

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
} as const

export const borderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  full: '9999px',
} as const
```

- [ ] **Step 2: Commit**

```bash
git add dashboard/src/styles/theme.ts
git commit -m "feat: add theme constants matching HA dashboard style"
```

---

### Task 3: Room Configuration

**Files:**
- Create: `dashboard/src/config/rooms.ts`

- [ ] **Step 1: Create rooms config**

Create `dashboard/src/config/rooms.ts`:

```typescript
export interface RoomConfig {
  id: string
  name: string
  icon: string
  color: 'warm' | 'cool' | 'neutral'
  temperatureEntity: string
  humidityEntity: string
  category: 'main' | 'home' | 'utility'
  lights: string[]
  switches: string[]
  appliances: ApplianceConfig[]
}

export interface ApplianceConfig {
  name: string
  icon: string
  entity: string
  statusEntity?: string
}

export const rooms: RoomConfig[] = [
  {
    id: 'kitchen',
    name: 'Kitchen',
    icon: 'mdi:silverware-fork-knife',
    color: 'warm',
    temperatureEntity: 'sensor.living_room_h_t_temperature',
    humidityEntity: 'sensor.living_room_h_t_humidity',
    category: 'main',
    lights: [
      'light.kitchen_main_light',
      'light.kitchen_handle_light',
    ],
    switches: [
      'switch.coffee_bar_light',
      'switch.kitchen_rear_cabinet_light',
    ],
    appliances: [
      { name: 'Dishwasher', icon: 'mdi:dishwasher', entity: 'switch.dishwasher_power' },
      { name: 'Oven', icon: 'mdi:stove', entity: 'switch.oven_power' },
      { name: 'Hob', icon: 'mdi:gas-burner', entity: 'switch.hob_power' },
      { name: 'Fridge', icon: 'mdi:fridge', entity: 'switch.fridge_freezer_power', statusEntity: 'sensor.fridge_freezer_temperature' },
    ],
  },
  {
    id: 'living-room',
    name: 'Living Room',
    icon: 'mdi:sofa',
    color: 'warm',
    temperatureEntity: 'sensor.living_room_h_t_temperature',
    humidityEntity: 'sensor.living_room_h_t_humidity',
    category: 'main',
    lights: [
      'light.living_room_main_light',
      'light.living_room_hallway_light',
    ],
    switches: [],
    appliances: [],
  },
  {
    id: 'dining-room',
    name: 'Dining Room',
    icon: 'mdi:silverware-variant',
    color: 'warm',
    temperatureEntity: 'sensor.living_room_h_t_temperature',
    humidityEntity: 'sensor.living_room_h_t_humidity',
    category: 'main',
    lights: [
      'light.dining_room_main_light',
      'light.dining_room_cabinet_light',
    ],
    switches: [],
    appliances: [],
  },
  {
    id: 'master-bedroom',
    name: 'Master Bed',
    icon: 'mdi:bed-king',
    color: 'neutral',
    temperatureEntity: 'sensor.master_bedroom_sensor_temperature',
    humidityEntity: 'sensor.master_bedroom_sensor_humidity',
    category: 'main',
    lights: [],
    switches: [],
    appliances: [],
  },
  {
    id: 'lillas-room',
    name: "Lilla's Room",
    icon: 'mdi:baby-face-outline',
    color: 'warm',
    temperatureEntity: 'sensor.lillas_bedroom_sensor_temperature',
    humidityEntity: 'sensor.lillas_bedroom_sensor_humidity',
    category: 'home',
    lights: [],
    switches: [],
    appliances: [],
  },
  {
    id: 'office',
    name: 'Office',
    icon: 'mdi:desk',
    color: 'cool',
    temperatureEntity: 'sensor.office_sensor_temperature',
    humidityEntity: 'sensor.office_sensor_humidity',
    category: 'home',
    lights: ['light.office_light'],
    switches: [],
    appliances: [],
  },
  {
    id: 'garage',
    name: 'Garage',
    icon: 'mdi:garage',
    color: 'neutral',
    temperatureEntity: 'sensor.garage_sensor_temperature',
    humidityEntity: 'sensor.garage_sensor_humidity',
    category: 'utility',
    lights: ['light.garage_main_light'],
    switches: [],
    appliances: [],
  },
  {
    id: 'basement',
    name: 'Basement',
    icon: 'mdi:stairs-down',
    color: 'neutral',
    temperatureEntity: 'sensor.basement_sensor_temperature',
    humidityEntity: 'sensor.basement_sensor_humidity',
    category: 'utility',
    lights: [],
    switches: [],
    appliances: [],
  },
  {
    id: 'front-bathroom',
    name: 'Front Bathroom',
    icon: 'mdi:shower-head',
    color: 'cool',
    temperatureEntity: 'sensor.front_bathroom_sensor_temperature',
    humidityEntity: 'sensor.front_bathroom_sensor_humidity',
    category: 'home',
    lights: [
      'light.front_bathroom_light',
      'light.front_bathroom_mirror_light',
    ],
    switches: [],
    appliances: [],
  },
  {
    id: 'rear-bathroom',
    name: 'Rear Bathroom',
    icon: 'mdi:shower',
    color: 'cool',
    temperatureEntity: 'sensor.rear_bathroom_sensor_temperature',
    humidityEntity: 'sensor.rear_bathroom_sensor_humidity',
    category: 'home',
    lights: ['light.rear_bathroom_mirror_light'],
    switches: [],
    appliances: [],
  },
  {
    id: 'hallway',
    name: 'Hallway',
    icon: 'mdi:door',
    color: 'neutral',
    temperatureEntity: 'sensor.hallway_sensor_temperature',
    humidityEntity: 'sensor.hallway_sensor_humidity',
    category: 'home',
    lights: ['light.hallway_spots'],
    switches: [],
    appliances: [],
  },
]

export const sceneActions = [
  { id: 'morning', name: 'Morning', icon: 'mdi:weather-sunset-up', entity: 'script.scene_good_morning' },
  { id: 'night', name: 'Night', icon: 'mdi:weather-night', entity: 'script.scene_good_night' },
  { id: 'away', name: 'Away', icon: 'mdi:home-export-outline', entity: 'script.scene_away' },
  { id: 'welcome', name: 'Welcome', icon: 'mdi:home-heart', entity: 'script.scene_welcome_home' },
  { id: 'all-off', name: 'All Off', icon: 'mdi:lightbulb-off', entity: 'script.all_lights_off' },
  { id: 'hot-water', name: 'Hot Water', icon: 'mdi:water-boiler', entity: 'input_boolean.dhw_pump_boost', isToggle: true },
] as const

export const energyEntities = {
  // Solar
  solarPower: 'sensor.solar_power_watts',
  homePower: 'sensor.home_power',
  energyFlowDirection: 'sensor.energy_flow_direction',
  selfConsumption: 'sensor.solar_self_consumption_ratio',
  coverage: 'sensor.solar_coverage_ratio',
  dailyProduction: 'sensor.daily_solar_production',
  monthlyProduction: 'sensor.monthly_solar_production',
  lifetimeProduction: 'sensor.solymar_total_lifetime_energy_output',
  forecastToday: 'sensor.energy_production_today',
  forecastTodayRemaining: 'sensor.energy_production_today_remaining',
  forecastTomorrow: 'sensor.energy_production_tomorrow',

  // Grid
  gridImport: 'sensor.grid_import_power',
  gridExport: 'sensor.grid_export_power',
  monthlyGridConsumption: 'sensor.monthly_grid_consumption',
  monthlyGridExport: 'sensor.monthly_grid_export',

  // Phases
  phaseA: 'sensor.shelly_main_em_phase_a_power',
  phaseB: 'sensor.shelly_main_em_phase_b_power',
  phaseC: 'sensor.shelly_main_em_phase_c_power',
  phaseImbalance: 'sensor.phase_imbalance',
  phaseImbalancePercent: 'sensor.phase_imbalance_percentage',

  // Net metering
  netMeteringImport: 'sensor.net_metering_total_import',
  netMeteringExport: 'sensor.net_metering_total_export',
  netMeteringBalance: 'sensor.net_metering_balance',
  netMeteringStatus: 'sensor.net_metering_status',
} as const

export const evEntities = {
  // Tesla Raikiri
  batteryLevel: 'sensor.raikiri_battery_level',
  batteryRange: 'sensor.raikiri_battery_range',
  chargingState: 'sensor.raikiri_charging',
  chargerPower: 'sensor.raikiri_charger_power',
  chargeLimit: 'number.raikiri_charge_limit',
  chargeCurrent: 'number.raikiri_charge_current',
  chargeSwitch: 'switch.raikiri_charge',
  sentryMode: 'switch.raikiri_sentry_mode',
  vehicleLock: 'lock.raikiri_lock',
  vehicleStatus: 'binary_sensor.raikiri_status',
  chargeCable: 'binary_sensor.raikiri_charge_cable',
  location: 'device_tracker.raikiri_location_tracker',

  // Go-e Charger
  goEStatus: 'sensor.goe_249593_car',
  goEEnergyTotal: 'sensor.goe_249593_eto',
} as const

export const securityEntities = {
  frontDoorLock: 'lock.smart_lock_pro',
  rightGarageDoor: 'cover.right_garage_door',
  garageDoor: 'cover.garage_door',
} as const
```

- [ ] **Step 2: Commit**

```bash
git add dashboard/src/config/rooms.ts
git commit -m "feat: add room and entity configuration"
```

---

### Task 4: App Shell & Routing

**Files:**
- Create: `dashboard/src/components/layout/AppShell.tsx`
- Create: `dashboard/src/components/layout/Sidebar.tsx`
- Modify: `dashboard/src/App.tsx`

- [ ] **Step 1: Create Sidebar component**

Create `dashboard/src/components/layout/Sidebar.tsx`:

```tsx
import { NavLink } from 'react-router-dom'
import { colors, borderRadius, spacing } from '../../styles/theme'

const navItems = [
  { to: '/', icon: 'mdi:home', label: 'Home' },
  { to: '/rooms', icon: 'mdi:floor-plan', label: 'Rooms' },
  { to: '/scenes', icon: 'mdi:palette', label: 'Scenes' },
  { to: '/energy/solar', icon: 'mdi:solar-power', label: 'Energy' },
  { to: '/energy/ev', icon: 'mdi:car-electric', label: 'EV' },
]

export function Sidebar() {
  return (
    <nav
      style={{
        position: 'fixed',
        left: spacing.md,
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.xs,
        background: colors.sidebarBg,
        backdropFilter: 'blur(20px)',
        borderRadius: borderRadius.xl,
        padding: `${spacing.md} ${spacing.sm}`,
        zIndex: 100,
      }}
    >
      {navItems.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            padding: `${spacing.sm} ${spacing.md}`,
            borderRadius: borderRadius.md,
            textDecoration: 'none',
            color: isActive ? colors.textPrimary : colors.textMuted,
            background: isActive ? colors.sidebarActive : 'transparent',
            fontSize: '11px',
            transition: 'all 0.2s ease',
          })}
        >
          <span className="mdi" style={{ fontSize: '22px' }}>{label === 'Home' ? '🏠' : label === 'Rooms' ? '🏘' : label === 'Scenes' ? '🎨' : label === 'Energy' ? '⚡' : '🚗'}</span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
```

Note: The icon rendering will be refined once we verify how @hakit/components renders MDI icons. For now, use emoji placeholders.

- [ ] **Step 2: Create AppShell component**

Create `dashboard/src/components/layout/AppShell.tsx`:

```tsx
import { Outlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { colors } from '../../styles/theme'

export function AppShell() {
  const location = useLocation()

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${colors.bgGradientStart}, ${colors.bgGradientEnd})`,
        color: colors.textPrimary,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <Sidebar />
      <main
        style={{
          marginLeft: '90px',
          padding: '32px 48px',
          maxWidth: '900px',
          margin: '0 auto',
          paddingLeft: '110px',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
```

- [ ] **Step 3: Update App.tsx with routing**

Replace the contents of `dashboard/src/App.tsx`:

```tsx
import { HassConnect } from '@hakit/core'
import { ThemeProvider } from '@hakit/components'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { HomeView } from './views/HomeView'
import { RoomsView } from './views/RoomsView'
import { RoomDetailPage } from './views/RoomDetailPage'
import { SolarGridView } from './views/SolarGridView'
import { EVChargingView } from './views/EVChargingView'

export default function App() {
  return (
    <HassConnect
      hassUrl={import.meta.env.VITE_HA_URL}
      hassToken={import.meta.env.VITE_HA_TOKEN}
      loading={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#ccc' }}>
          Connecting to Home Assistant...
        </div>
      }
    >
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<HomeView />} />
              <Route path="rooms" element={<RoomsView />} />
              <Route path="rooms/:roomId" element={<RoomDetailPage />} />
              <Route path="energy/solar" element={<SolarGridView />} />
              <Route path="energy/ev" element={<EVChargingView />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </HassConnect>
  )
}
```

- [ ] **Step 4: Create placeholder views**

Create stub views so the app compiles. Each file follows this pattern:

Create `dashboard/src/views/HomeView.tsx`:
```tsx
export function HomeView() {
  return <h1>Home</h1>
}
```

Create `dashboard/src/views/RoomsView.tsx`:
```tsx
export function RoomsView() {
  return <h1>Rooms</h1>
}
```

Create `dashboard/src/views/RoomDetailPage.tsx`:
```tsx
export function RoomDetailPage() {
  return <h1>Room Detail</h1>
}
```

Create `dashboard/src/views/SolarGridView.tsx`:
```tsx
export function SolarGridView() {
  return <h1>Solar & Grid</h1>
}
```

Create `dashboard/src/views/EVChargingView.tsx`:
```tsx
export function EVChargingView() {
  return <h1>EV Charging</h1>
}
```

- [ ] **Step 5: Verify the app runs**

```bash
cd dashboard && npm run dev
```

Expected: App loads with green gradient background, sidebar navigation, and "Home" text. Clicking sidebar items navigates between stub views with fade animation.

- [ ] **Step 6: Commit**

```bash
git add dashboard/src/
git commit -m "feat: add app shell with sidebar navigation and routing"
```

---

### Task 5: Shared Components

**Files:**
- Create: `dashboard/src/components/layout/TabBar.tsx`
- Create: `dashboard/src/components/shared/StatBadge.tsx`
- Create: `dashboard/src/components/shared/AnimatedCounter.tsx`
- Create: `dashboard/src/components/shared/DeviceCard.tsx`
- Create: `dashboard/src/components/shared/DeviceSection.tsx`

- [ ] **Step 1: Create TabBar**

Create `dashboard/src/components/layout/TabBar.tsx`:

```tsx
import { colors, borderRadius, spacing } from '../../styles/theme'

interface Tab {
  id: string
  label: string
  icon?: string
}

interface TabBarProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  return (
    <div style={{ display: 'flex', gap: spacing.sm, justifyContent: 'center', margin: `${spacing.md} 0` }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.xs,
            padding: `${spacing.sm} ${spacing.md}`,
            borderRadius: borderRadius.full,
            border: `1px solid ${tab.id === activeTab ? colors.textPrimary : colors.cardBorder}`,
            background: tab.id === activeTab ? colors.cardBgHover : 'transparent',
            color: tab.id === activeTab ? colors.textPrimary : colors.textSecondary,
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: tab.id === activeTab ? 600 : 400,
            transition: 'all 0.2s ease',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Create StatBadge**

Create `dashboard/src/components/shared/StatBadge.tsx`:

```tsx
import { colors, borderRadius, spacing } from '../../styles/theme'

interface StatBadgeProps {
  icon: string
  value: string
  label?: string
  color?: string
  onClick?: () => void
}

export function StatBadge({ icon, value, label, color, onClick }: StatBadgeProps) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.sm,
        padding: `${spacing.xs} ${spacing.md}`,
        borderRadius: borderRadius.full,
        background: colors.cardBg,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background 0.2s ease',
        fontSize: '13px',
      }}
      onMouseEnter={(e) => onClick && (e.currentTarget.style.background = colors.cardBgHover)}
      onMouseLeave={(e) => onClick && (e.currentTarget.style.background = colors.cardBg)}
    >
      <span style={{ color: color || colors.textSecondary }}>{icon}</span>
      <span style={{ fontWeight: 500 }}>{value}</span>
      {label && <span style={{ color: colors.textSecondary, fontSize: '12px' }}>{label}</span>}
    </div>
  )
}
```

- [ ] **Step 3: Create AnimatedCounter**

Create `dashboard/src/components/shared/AnimatedCounter.tsx`:

```tsx
import { useEffect, useRef, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  suffix?: string
  decimals?: number
  style?: React.CSSProperties
}

export function AnimatedCounter({ value, suffix = '', decimals = 0, style }: AnimatedCounterProps) {
  const spring = useSpring(0, { stiffness: 100, damping: 20 })
  const display = useTransform(spring, (v) => `${v.toFixed(decimals)}${suffix}`)
  const [displayValue, setDisplayValue] = useState(`${value.toFixed(decimals)}${suffix}`)

  useEffect(() => {
    spring.set(value)
  }, [value, spring])

  useEffect(() => {
    const unsubscribe = display.on('change', (v) => setDisplayValue(v))
    return unsubscribe
  }, [display])

  return <motion.span style={style}>{displayValue}</motion.span>
}
```

- [ ] **Step 4: Create DeviceCard**

Create `dashboard/src/components/shared/DeviceCard.tsx`:

```tsx
import { useEntity } from '@hakit/core'
import { colors, borderRadius, spacing } from '../../styles/theme'

interface DeviceCardProps {
  entity: string
  name?: string
}

export function DeviceCard({ entity, name }: DeviceCardProps) {
  const device = useEntity(entity as any)
  const isOn = device.state === 'on'
  const displayName = name || device.attributes.friendly_name || entity.split('.').pop()

  return (
    <button
      onClick={() => device.service.toggle()}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.md,
        padding: `${spacing.md} ${spacing.lg}`,
        borderRadius: borderRadius.lg,
        border: 'none',
        background: isOn ? 'rgba(240, 192, 64, 0.15)' : colors.cardBg,
        color: isOn ? colors.statusOn : colors.textSecondary,
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
        fontSize: '14px',
        transition: 'all 0.2s ease',
      }}
    >
      <span style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: isOn ? 'rgba(240, 192, 64, 0.3)' : 'rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
      }}>
        {isOn ? '💡' : '💡'}
      </span>
      <div>
        <div style={{ fontWeight: 500, color: colors.textPrimary }}>{displayName}</div>
        <div style={{ fontSize: '12px', color: colors.textSecondary }}>{isOn ? 'On' : 'Off'}</div>
      </div>
    </button>
  )
}
```

- [ ] **Step 5: Create DeviceSection**

Create `dashboard/src/components/shared/DeviceSection.tsx`:

```tsx
import { colors, spacing } from '../../styles/theme'
import { DeviceCard } from './DeviceCard'

interface DeviceSectionProps {
  title: string
  entities: string[]
}

export function DeviceSection({ title, entities }: DeviceSectionProps) {
  if (entities.length === 0) return null

  return (
    <div style={{ marginBottom: spacing.lg }}>
      <h3 style={{
        fontSize: '14px',
        fontWeight: 500,
        color: colors.textSecondary,
        marginBottom: spacing.md,
      }}>
        {title}
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: spacing.sm,
      }}>
        {entities.map((entity) => (
          <DeviceCard key={entity} entity={entity} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Verify shared components compile**

```bash
cd dashboard && npm run build
```

Expected: Build succeeds with no TypeScript errors. (Components won't be visible yet — they'll be used in subsequent tasks.)

- [ ] **Step 7: Commit**

```bash
git add dashboard/src/components/
git commit -m "feat: add shared components (TabBar, StatBadge, AnimatedCounter, DeviceCard)"
```

---

### Task 6: HomeView — Overview Page

**Files:**
- Create: `dashboard/src/components/home/WeatherBadge.tsx`
- Create: `dashboard/src/components/home/GreetingCard.tsx`
- Create: `dashboard/src/components/home/TemperatureDisplay.tsx`
- Create: `dashboard/src/components/home/ScenesGrid.tsx`
- Create: `dashboard/src/components/home/SecurityStatus.tsx`
- Modify: `dashboard/src/views/HomeView.tsx`

- [ ] **Step 1: Create WeatherBadge**

Create `dashboard/src/components/home/WeatherBadge.tsx`:

```tsx
import { useEntity } from '@hakit/core'
import { StatBadge } from '../shared/StatBadge'

export function WeatherBadge() {
  const weather = useEntity('weather.forecast_home' as any)
  const temp = weather.attributes.temperature
  const condition = weather.state
  const tempHigh = weather.attributes.forecast?.[0]?.temperature
  const tempLow = weather.attributes.forecast?.[0]?.templow

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <StatBadge
        icon="🌤"
        value={`${temp}°C, ${condition.charAt(0).toUpperCase() + condition.slice(1)}`}
      />
      {tempHigh != null && tempLow != null && (
        <StatBadge
          icon="📊"
          value={`${tempHigh}° Hi / ${tempLow}° Lo`}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create GreetingCard**

Create `dashboard/src/components/home/GreetingCard.tsx`:

```tsx
import { useEntity } from '@hakit/core'
import { colors, spacing } from '../../styles/theme'

export function GreetingCard() {
  const person = useEntity('person.benjamin' as any)
  const isHome = person.state === 'home'

  const hour = new Date().getHours()
  let greeting: string
  if (hour >= 22 || hour < 5) greeting = 'Good Night'
  else if (hour >= 18) greeting = 'Good Evening'
  else if (hour >= 12) greeting = 'Good Afternoon'
  else greeting = 'Good Morning'

  const name = person.attributes.friendly_name || 'Benjamin'

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: spacing.md,
      padding: `${spacing.md} 0`,
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: colors.cardBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        overflow: 'hidden',
      }}>
        {person.attributes.entity_picture
          ? <img src={person.attributes.entity_picture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : '👤'
        }
      </div>
      <div>
        <div style={{ fontSize: '18px', fontWeight: 600 }}>{greeting}, {name}!</div>
        <div style={{ fontSize: '13px', color: colors.textSecondary }}>{isHome ? 'Home' : 'Away'}</div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create TemperatureDisplay**

Create `dashboard/src/components/home/TemperatureDisplay.tsx`:

```tsx
import { useEntity } from '@hakit/core'
import { StatBadge } from '../shared/StatBadge'

export function TemperatureDisplay() {
  const indoor = useEntity('sensor.indoor_temperature_average' as any)
  const outdoor = useEntity('sensor.outdoor_sensor_temperature' as any)

  return (
    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
      <StatBadge
        icon="🌡"
        value={`${parseFloat(indoor.state).toFixed(1)}°C`}
        label="Indoor"
        color="#4CAF50"
      />
      <StatBadge
        icon="🌬"
        value={`${parseFloat(outdoor.state).toFixed(1)}°C`}
        label="Outdoor"
        color="#4488ff"
      />
    </div>
  )
}
```

- [ ] **Step 4: Create ScenesGrid**

Create `dashboard/src/components/home/ScenesGrid.tsx`:

```tsx
import { useEntity, useService } from '@hakit/core'
import { sceneActions } from '../../config/rooms'
import { colors, borderRadius, spacing } from '../../styles/theme'

export function ScenesGrid() {
  const scriptService = useService('script' as any)

  return (
    <div>
      <h3 style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: spacing.md }}>Scenes</h3>
      <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap', justifyContent: 'center' }}>
        {sceneActions.map((scene) => (
          <SceneButton key={scene.id} scene={scene} scriptService={scriptService} />
        ))}
      </div>
    </div>
  )
}

function SceneButton({ scene, scriptService }: { scene: typeof sceneActions[number], scriptService: any }) {
  const entity = useEntity(scene.entity as any, { returnNullIfNotFound: true })
  const isActive = entity?.state === 'on'

  const handleClick = () => {
    if ('isToggle' in scene && scene.isToggle) {
      entity?.service.toggle()
    } else {
      scriptService.turn_on({ target: { entity_id: scene.entity } })
    }
  }

  return (
    <button
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.sm,
        padding: `${spacing.sm} ${spacing.md}`,
        borderRadius: borderRadius.full,
        border: `1px solid ${colors.cardBorder}`,
        background: isActive ? 'rgba(240, 192, 64, 0.15)' : 'transparent',
        color: isActive ? colors.statusOn : colors.textPrimary,
        cursor: 'pointer',
        fontSize: '13px',
        transition: 'all 0.2s ease',
      }}
    >
      <span>{scene.icon.includes('sunset') ? '🌅' : scene.icon.includes('night') ? '🌙' : scene.icon.includes('export') ? '🏠' : scene.icon.includes('heart') ? '❤️' : scene.icon.includes('off') ? '💡' : '🔥'}</span>
      {scene.name}
    </button>
  )
}
```

- [ ] **Step 5: Create SecurityStatus**

Create `dashboard/src/components/home/SecurityStatus.tsx`:

```tsx
import { useEntity } from '@hakit/core'
import { securityEntities } from '../../config/rooms'
import { colors, spacing } from '../../styles/theme'

export function SecurityStatus() {
  const lock = useEntity(securityEntities.frontDoorLock as any)
  const rightGarage = useEntity(securityEntities.rightGarageDoor as any)
  const garage = useEntity(securityEntities.garageDoor as any)

  const isLocked = lock.state === 'locked'
  const rightClosed = rightGarage.state === 'closed'
  const leftClosed = garage.state === 'closed'

  return (
    <div>
      <h3 style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: spacing.md }}>Security</h3>
      <div style={{ display: 'flex', gap: spacing.sm, justifyContent: 'center' }}>
        <SecurityChip
          icon={isLocked ? '🔒' : '🔓'}
          label={isLocked ? 'Locked' : 'Unlocked'}
          ok={isLocked}
        />
        <SecurityChip
          icon={rightClosed ? '🚗' : '🚗'}
          label={`R: ${rightClosed ? 'Closed' : 'Open'}`}
          ok={rightClosed}
        />
        <SecurityChip
          icon={leftClosed ? '🚗' : '🚗'}
          label={`L: ${leftClosed ? 'Closed' : 'Open'}`}
          ok={leftClosed}
        />
      </div>
    </div>
  )
}

function SecurityChip({ icon, label, ok }: { icon: string; label: string; ok: boolean }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
      padding: '6px 14px',
      borderRadius: '9999px',
      background: ok ? 'rgba(76, 175, 80, 0.12)' : 'rgba(224, 80, 80, 0.12)',
      color: ok ? colors.statusGood : colors.statusAlert,
      fontSize: '13px',
    }}>
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  )
}
```

- [ ] **Step 6: Assemble HomeView**

Update `dashboard/src/views/HomeView.tsx`:

```tsx
import { useState } from 'react'
import { WeatherBadge } from '../components/home/WeatherBadge'
import { GreetingCard } from '../components/home/GreetingCard'
import { TemperatureDisplay } from '../components/home/TemperatureDisplay'
import { ScenesGrid } from '../components/home/ScenesGrid'
import { SecurityStatus } from '../components/home/SecurityStatus'
import { TabBar } from '../components/layout/TabBar'
import { spacing } from '../styles/theme'

const tabs = [
  { id: 'home', label: 'Home', icon: 'mdi:home' },
  { id: 'events', label: 'Events', icon: 'mdi:calendar' },
  { id: 'active', label: 'Active', icon: 'mdi:play' },
]

export function HomeView() {
  const [activeTab, setActiveTab] = useState('home')
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg, alignItems: 'center' }}>
      {/* Header */}
      <div style={{ fontSize: '14px', color: '#999', marginTop: spacing.md }}>
        {dateStr} - {timeStr}
      </div>

      <WeatherBadge />
      <GreetingCard />

      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'home' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl, width: '100%', maxWidth: '600px' }}>
          <TemperatureDisplay />
          <ScenesGrid />
          <SecurityStatus />
        </div>
      )}

      {activeTab === 'events' && (
        <div style={{ color: '#999', textAlign: 'center', padding: spacing.xl }}>
          Events view coming soon
        </div>
      )}

      {activeTab === 'active' && (
        <div style={{ color: '#999', textAlign: 'center', padding: spacing.xl }}>
          Active entities view coming soon
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 7: Verify HomeView renders**

```bash
cd dashboard && npm run dev
```

Expected: Home page shows date/time, weather badge, greeting, tab bar, temperature display, scenes grid, and security chips. Scenes are clickable. Security status reflects real HA state.

- [ ] **Step 8: Commit**

```bash
git add dashboard/src/
git commit -m "feat: implement HomeView with weather, greeting, scenes, security"
```

---

### Task 7: RoomsView — Room Grid

**Files:**
- Create: `dashboard/src/components/rooms/RoomCard.tsx`
- Modify: `dashboard/src/views/RoomsView.tsx`

- [ ] **Step 1: Create RoomCard**

Create `dashboard/src/components/rooms/RoomCard.tsx`:

```tsx
import { useNavigate } from 'react-router-dom'
import { useEntity } from '@hakit/core'
import { RoomConfig } from '../../config/rooms'
import { colors, borderRadius, spacing } from '../../styles/theme'

const colorMap = {
  warm: colors.roomWarmGold,
  cool: colors.roomCoolBlue,
  neutral: colors.roomNeutralGray,
}

interface RoomCardProps {
  room: RoomConfig
}

export function RoomCard({ room }: RoomCardProps) {
  const navigate = useNavigate()
  const temp = useEntity(room.temperatureEntity as any, { returnNullIfNotFound: true })
  const humidity = useEntity(room.humidityEntity as any, { returnNullIfNotFound: true })

  const tempVal = temp ? `${parseFloat(temp.state).toFixed(1)}°C` : '--'
  const humVal = humidity ? `${parseFloat(humidity.state).toFixed(0)}%` : '--'

  return (
    <button
      onClick={() => navigate(`/rooms/${room.id}`)}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: spacing.lg,
        borderRadius: borderRadius.xl,
        border: 'none',
        background: colorMap[room.color],
        color: colors.textPrimary,
        cursor: 'pointer',
        minHeight: '160px',
        textAlign: 'left',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div>
        <div style={{ fontSize: '15px', fontWeight: 600 }}>{room.name}</div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>
          {tempVal} / {humVal}
        </div>
      </div>
      <div style={{ fontSize: '48px', opacity: 0.4, alignSelf: 'center' }}>
        {room.icon.includes('fork') ? '🍴' : room.icon.includes('sofa') ? '🛋' : room.icon.includes('bed') ? '🛏' : room.icon.includes('desk') ? '💻' : room.icon.includes('garage') ? '🚗' : room.icon.includes('shower') ? '🚿' : room.icon.includes('door') ? '🚪' : '🏠'}
      </div>
    </button>
  )
}
```

- [ ] **Step 2: Implement RoomsView**

Update `dashboard/src/views/RoomsView.tsx`:

```tsx
import { useState } from 'react'
import { rooms } from '../config/rooms'
import { RoomCard } from '../components/rooms/RoomCard'
import { TabBar } from '../components/layout/TabBar'
import { spacing } from '../styles/theme'

const categoryTabs = [
  { id: 'main', label: 'Main' },
  { id: 'home', label: 'Home' },
  { id: 'utility', label: 'Utility' },
]

export function RoomsView() {
  const [category, setCategory] = useState('main')
  const filteredRooms = rooms.filter((r) => r.category === category)

  return (
    <div>
      <h1 style={{ textAlign: 'center', fontSize: '22px', fontWeight: 600, marginBottom: spacing.md }}>Rooms</h1>

      <TabBar tabs={categoryTabs} activeTab={category} onTabChange={setCategory} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: spacing.md,
        marginTop: spacing.lg,
        maxWidth: '600px',
        margin: `${spacing.lg} auto 0`,
      }}>
        {filteredRooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify rooms grid renders**

```bash
cd dashboard && npm run dev
```

Navigate to Rooms. Expected: Tab bar (Main/Home/Utility) filters rooms. Room cards show name, temp, humidity, and room icon. Clicking a card navigates to `/rooms/:roomId`.

- [ ] **Step 4: Commit**

```bash
git add dashboard/src/
git commit -m "feat: implement RoomsView with room cards and category tabs"
```

---

### Task 8: RoomDetailPage

**Files:**
- Create: `dashboard/src/components/rooms/RoomDetailView.tsx`
- Create: `dashboard/src/components/rooms/ActiveTab.tsx`
- Modify: `dashboard/src/views/RoomDetailPage.tsx`

- [ ] **Step 1: Create ActiveTab**

Create `dashboard/src/components/rooms/ActiveTab.tsx`:

```tsx
import { useEntity } from '@hakit/core'
import { RoomConfig } from '../../config/rooms'
import { colors, spacing } from '../../styles/theme'

interface ActiveTabProps {
  room: RoomConfig
}

export function ActiveTab({ room }: ActiveTabProps) {
  const allEntities = [...room.lights, ...room.switches, ...room.appliances.map(a => a.entity)]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
      {allEntities.map((entityId) => (
        <ActiveEntityRow key={entityId} entityId={entityId} />
      ))}
    </div>
  )
}

function ActiveEntityRow({ entityId }: { entityId: string }) {
  const entity = useEntity(entityId as any, { returnNullIfNotFound: true })
  if (!entity || entity.state === 'off' || entity.state === 'unavailable') return null

  const name = entity.attributes.friendly_name || entityId.split('.').pop()

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: spacing.md,
      padding: `${spacing.md}`,
    }}>
      <span style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: 'rgba(240, 192, 64, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        💡
      </span>
      <span style={{ color: colors.textPrimary, fontSize: '14px' }}>{name}</span>
    </div>
  )
}
```

- [ ] **Step 2: Create RoomDetailView**

Create `dashboard/src/components/rooms/RoomDetailView.tsx`:

```tsx
import { RoomConfig } from '../../config/rooms'
import { DeviceSection } from '../shared/DeviceSection'
import { colors, spacing } from '../../styles/theme'

interface RoomDetailViewProps {
  room: RoomConfig
}

export function RoomDetailView({ room }: RoomDetailViewProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
      <DeviceSection title="Lights" entities={room.lights} />
      <DeviceSection title="Switches" entities={room.switches} />

      {room.appliances.length > 0 && (
        <div>
          <h3 style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: spacing.md }}>Appliances</h3>
          <div style={{ display: 'flex', gap: spacing.lg, flexWrap: 'wrap', justifyContent: 'center' }}>
            {room.appliances.map((app) => (
              <ApplianceIcon key={app.entity} appliance={app} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ApplianceIcon({ appliance }: { appliance: RoomConfig['appliances'][number] }) {
  const { useEntity } = require('@hakit/core')
  const entity = useEntity(appliance.entity as any, { returnNullIfNotFound: true })
  const statusEntity = appliance.statusEntity
    ? useEntity(appliance.statusEntity as any, { returnNullIfNotFound: true })
    : null

  const isActive = entity?.state === 'on' || entity?.state === 'active'
  const status = statusEntity
    ? statusEntity.state
    : entity?.attributes.program_phase || (isActive ? 'Active' : 'Inactive')

  return (
    <button
      onClick={() => entity?.service.toggle?.()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: spacing.xs,
        background: 'none',
        border: 'none',
        color: isActive ? colors.textPrimary : colors.textSecondary,
        cursor: 'pointer',
        padding: spacing.sm,
      }}
    >
      <span style={{
        fontSize: '28px',
        color: isActive ? colors.statusOn : colors.textMuted,
      }}>
        {appliance.icon.includes('dish') ? '🍽' : appliance.icon.includes('stove') ? '🔥' : appliance.icon.includes('gas') ? '🔥' : '🧊'}
      </span>
      <span style={{ fontSize: '12px', fontWeight: 500 }}>{appliance.name}</span>
      <span style={{ fontSize: '11px', color: colors.textSecondary }}>{status}</span>
    </button>
  )
}
```

Note: The `ApplianceIcon` component uses `require` for conditional hook call — this needs to be refactored to avoid the Rules of Hooks violation. Fix by always calling `useEntity` and using `returnNullIfNotFound`:

Replace the `ApplianceIcon` function:

```tsx
import { useEntity } from '@hakit/core'

function ApplianceIcon({ appliance }: { appliance: RoomConfig['appliances'][number] }) {
  const entity = useEntity(appliance.entity as any, { returnNullIfNotFound: true })

  const isActive = entity?.state === 'on' || entity?.state === 'active'
  const status = entity?.attributes.program_phase || (isActive ? 'Active' : 'Inactive')

  return (
    <button
      onClick={() => entity?.service.toggle?.()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: spacing.xs,
        background: 'none',
        border: 'none',
        color: isActive ? colors.textPrimary : colors.textSecondary,
        cursor: 'pointer',
        padding: spacing.sm,
      }}
    >
      <span style={{
        fontSize: '28px',
        color: isActive ? colors.statusOn : colors.textMuted,
      }}>
        {appliance.icon.includes('dish') ? '🍽' : appliance.icon.includes('stove') ? '🔥' : appliance.icon.includes('gas') ? '🔥' : '🧊'}
      </span>
      <span style={{ fontSize: '12px', fontWeight: 500 }}>{appliance.name}</span>
      <span style={{ fontSize: '11px', color: colors.textSecondary }}>{status}</span>
    </button>
  )
}
```

- [ ] **Step 3: Implement RoomDetailPage**

Update `dashboard/src/views/RoomDetailPage.tsx`:

```tsx
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEntity } from '@hakit/core'
import { rooms } from '../config/rooms'
import { RoomDetailView } from '../components/rooms/RoomDetailView'
import { ActiveTab } from '../components/rooms/ActiveTab'
import { TabBar } from '../components/layout/TabBar'
import { StatBadge } from '../components/shared/StatBadge'
import { colors, spacing } from '../styles/theme'

const tabs = [
  { id: 'room', label: 'Room' },
  { id: 'active', label: 'Active' },
]

export function RoomDetailPage() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('room')

  const room = rooms.find((r) => r.id === roomId)
  if (!room) {
    return <div style={{ textAlign: 'center', padding: spacing.xl, color: colors.textSecondary }}>Room not found</div>
  }

  const temp = useEntity(room.temperatureEntity as any, { returnNullIfNotFound: true })
  const humidity = useEntity(room.humidityEntity as any, { returnNullIfNotFound: true })

  return (
    <div>
      <button
        onClick={() => navigate('/rooms')}
        style={{
          background: 'none',
          border: 'none',
          color: colors.textSecondary,
          cursor: 'pointer',
          fontSize: '14px',
          padding: 0,
          marginBottom: spacing.md,
        }}
      >
        ← Back
      </button>

      <h1 style={{ textAlign: 'center', fontSize: '22px', fontWeight: 600 }}>{room.name}</h1>

      <div style={{ display: 'flex', gap: spacing.sm, justifyContent: 'center', margin: `${spacing.md} 0` }}>
        {temp && <StatBadge icon="🌡" value={`${parseFloat(temp.state).toFixed(1)}°C`} />}
        {humidity && <StatBadge icon="💧" value={`${parseFloat(humidity.state).toFixed(0)}%`} />}
      </div>

      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div style={{ marginTop: spacing.lg, maxWidth: '600px', margin: `${spacing.lg} auto 0` }}>
        {activeTab === 'room' && <RoomDetailView room={room} />}
        {activeTab === 'active' && <ActiveTab room={room} />}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Verify room detail page**

```bash
cd dashboard && npm run dev
```

Navigate to Rooms → click Kitchen. Expected: Kitchen page shows temp/humidity badges, Room/Active tabs, Lights section with toggleable cards, Switches section, Appliances section with icons.

- [ ] **Step 5: Commit**

```bash
git add dashboard/src/
git commit -m "feat: implement RoomDetailPage with device sections and active tab"
```

---

### Task 9: SolarGridView — Energy Dashboard

**Files:**
- Create: `dashboard/src/components/energy/BalanceHeader.tsx`
- Create: `dashboard/src/components/energy/SolarChart.tsx`
- Create: `dashboard/src/components/energy/GridSection.tsx`
- Create: `dashboard/src/components/energy/AmperageSection.tsx`
- Create: `dashboard/src/components/energy/NetMeteringSection.tsx`
- Create: `dashboard/src/components/energy/ProductionStats.tsx`
- Modify: `dashboard/src/views/SolarGridView.tsx`

- [ ] **Step 1: Create BalanceHeader**

Create `dashboard/src/components/energy/BalanceHeader.tsx`:

```tsx
import { useEntity } from '@hakit/core'
import { energyEntities } from '../../config/rooms'
import { AnimatedCounter } from '../shared/AnimatedCounter'
import { colors, spacing } from '../../styles/theme'

export function BalanceHeader() {
  const direction = useEntity(energyEntities.energyFlowDirection as any, { returnNullIfNotFound: true })
  const solar = useEntity(energyEntities.solarPower as any, { returnNullIfNotFound: true })
  const home = useEntity(energyEntities.homePower as any, { returnNullIfNotFound: true })

  const solarW = solar ? parseFloat(solar.state) : 0
  const homeW = home ? parseFloat(home.state) : 0
  const status = direction?.state || 'Balanced'

  return (
    <div style={{ textAlign: 'center', marginBottom: spacing.lg }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, justifyContent: 'center' }}>
        <span style={{ fontSize: '20px' }}>⚡</span>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 600 }}>{status}</div>
          <div style={{ fontSize: '13px', color: colors.textSecondary }}>
            Solar <AnimatedCounter value={solarW} suffix="W" /> · Home <AnimatedCounter value={homeW} suffix="W" />
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create SolarChart**

Create `dashboard/src/components/energy/SolarChart.tsx`:

```tsx
import { useEntity, useHistory } from '@hakit/core'
import { energyEntities } from '../../config/rooms'
import { AnimatedCounter } from '../shared/AnimatedCounter'
import { StatBadge } from '../shared/StatBadge'
import { colors, spacing } from '../../styles/theme'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export function SolarChart() {
  const solar = useEntity(energyEntities.solarPower as any, { returnNullIfNotFound: true })
  const selfUse = useEntity(energyEntities.selfConsumption as any, { returnNullIfNotFound: true })
  const coverage = useEntity(energyEntities.coverage as any, { returnNullIfNotFound: true })

  const solarHistory = useHistory(energyEntities.solarPower as any, { hoursToShow: 24 })

  const solarW = solar ? parseFloat(solar.state) : 0
  const selfUseVal = selfUse ? `${parseFloat(selfUse.state).toFixed(1)}%` : '--'
  const coverageVal = coverage ? `${parseFloat(coverage.state).toFixed(1)}%` : '--'

  // Convert history coordinates to chart data
  const chartData = solarHistory.coordinates?.map(([x, y]) => ({
    time: x,
    actual: Math.max(0, y),
  })) || []

  return (
    <div>
      <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'center', marginBottom: spacing.lg }}>
        <StatBadge icon="☀️" value={`${solarW}W`} label="Producing" color={colors.solarYellow} />
        <StatBadge icon="🏠" value={selfUseVal} label="Self Use" color={colors.statusGood} />
        <StatBadge icon="🔋" value={coverageVal} label="Coverage" color={colors.statusGood} />
      </div>

      <div style={{ marginBottom: spacing.md }}>
        <h3 style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: spacing.xs }}>Actual</h3>
        <div style={{ fontSize: '32px', fontWeight: 300 }}>
          <AnimatedCounter value={solarW} suffix=" W" />
        </div>
      </div>

      {chartData.length > 0 && (
        <div style={{ width: '100%', height: 200, marginBottom: spacing.lg }}>
          <ResponsiveContainer>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.solarYellow} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors.solarYellow} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: 'none', borderRadius: '8px', color: '#e0e0e0' }}
                formatter={(value: number) => [`${value.toFixed(0)} W`, 'Solar']}
              />
              <Area
                type="monotone"
                dataKey="actual"
                stroke={colors.solarYellow}
                fill="url(#solarGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Create GridSection**

Create `dashboard/src/components/energy/GridSection.tsx`:

```tsx
import { useEntity, useHistory } from '@hakit/core'
import { energyEntities } from '../../config/rooms'
import { AnimatedCounter } from '../shared/AnimatedCounter'
import { colors, spacing } from '../../styles/theme'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export function GridSection() {
  const gridImport = useEntity(energyEntities.gridImport as any, { returnNullIfNotFound: true })
  const gridExport = useEntity(energyEntities.gridExport as any, { returnNullIfNotFound: true })
  const importHistory = useHistory(energyEntities.gridImport as any, { hoursToShow: 24 })

  const importW = gridImport ? parseFloat(gridImport.state) : 0
  const exportW = gridExport ? parseFloat(gridExport.state) : 0

  const chartData = importHistory.coordinates?.map(([x, y]) => ({
    time: x,
    import: Math.max(0, y),
  })) || []

  return (
    <div>
      <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: spacing.md }}>Grid</h3>

      <div style={{ display: 'flex', gap: spacing.lg, marginBottom: spacing.lg }}>
        <div>
          <div style={{ fontSize: '12px', color: colors.gridImport, marginBottom: spacing.xs }}>Import</div>
          <div style={{ fontSize: '18px', fontWeight: 500 }}>
            <AnimatedCounter value={importW} suffix=" W" />
          </div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: colors.gridExport, marginBottom: spacing.xs }}>Export</div>
          <div style={{ fontSize: '18px', fontWeight: 500 }}>
            <AnimatedCounter value={exportW} suffix=" W" />
          </div>
        </div>
      </div>

      {chartData.length > 0 && (
        <div>
          <h4 style={{ fontSize: '13px', color: colors.textSecondary, marginBottom: spacing.sm }}>Grid Power (24h)</h4>
          <div style={{ width: '100%', height: 180 }}>
            <ResponsiveContainer>
              <AreaChart data={chartData}>
                <XAxis dataKey="time" hide />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: 'none', borderRadius: '8px', color: '#e0e0e0' }}
                  formatter={(value: number) => [`${value.toFixed(0)} W`, 'Import']}
                />
                <Area type="monotone" dataKey="import" stroke={colors.gridImport} fill="rgba(224, 80, 80, 0.1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Create AmperageSection**

Create `dashboard/src/components/energy/AmperageSection.tsx`:

```tsx
import { useEntity } from '@hakit/core'
import { energyEntities } from '../../config/rooms'
import { colors, spacing, borderRadius } from '../../styles/theme'

export function AmperageSection() {
  const phaseA = useEntity(energyEntities.phaseA as any, { returnNullIfNotFound: true })
  const phaseB = useEntity(energyEntities.phaseB as any, { returnNullIfNotFound: true })
  const phaseC = useEntity(energyEntities.phaseC as any, { returnNullIfNotFound: true })
  const imbalance = useEntity(energyEntities.phaseImbalance as any, { returnNullIfNotFound: true })
  const imbalancePct = useEntity(energyEntities.phaseImbalancePercent as any, { returnNullIfNotFound: true })

  const phases = [
    { name: 'Phase A', value: phaseA ? parseFloat(phaseA.state) : 0, color: colors.phaseA },
    { name: 'Phase B', value: phaseB ? parseFloat(phaseB.state) : 0, color: colors.phaseB },
    { name: 'Phase C', value: phaseC ? parseFloat(phaseC.state) : 0, color: colors.phaseC },
  ]
  const maxPhase = Math.max(...phases.map(p => p.value), 1)
  const imbalanceW = imbalance ? parseFloat(imbalance.state) : 0
  const imbalancePctVal = imbalancePct ? parseFloat(imbalancePct.state) : 0
  const isSignificant = imbalancePctVal > 50

  return (
    <div>
      <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: spacing.md }}>Amperage</h3>

      <div style={{ display: 'flex', gap: spacing.lg, marginBottom: spacing.md }}>
        {phases.map((phase) => (
          <div key={phase.name} style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs }}>
              <span style={{
                width: '12px', height: '12px', borderRadius: '50%', background: phase.color,
              }} />
              <span style={{ fontSize: '13px' }}>{phase.name}</span>
            </div>
            <div style={{ fontSize: '16px', fontWeight: 500 }}>{phase.value.toFixed(0)} W</div>
            <div style={{
              height: '4px',
              borderRadius: '2px',
              background: 'rgba(255,255,255,0.05)',
              marginTop: spacing.xs,
            }}>
              <div style={{
                height: '100%',
                width: `${(phase.value / maxPhase) * 100}%`,
                borderRadius: '2px',
                background: phase.color,
                transition: 'width 0.5s ease',
              }} />
            </div>
          </div>
        ))}
      </div>

      {imbalanceW > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.sm,
          padding: `${spacing.sm} ${spacing.md}`,
          borderRadius: borderRadius.md,
          background: isSignificant ? 'rgba(224, 80, 80, 0.1)' : 'rgba(255, 193, 7, 0.1)',
          color: isSignificant ? colors.statusAlert : '#ffc107',
          fontSize: '13px',
        }}>
          <span>⚠️</span>
          Imbalance: {imbalanceW.toFixed(0)} W ({imbalancePctVal.toFixed(1)}%)
          {isSignificant && ' — Significant imbalance'}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 5: Create NetMeteringSection**

Create `dashboard/src/components/energy/NetMeteringSection.tsx`:

```tsx
import { useEntity } from '@hakit/core'
import { energyEntities } from '../../config/rooms'
import { StatBadge } from '../shared/StatBadge'
import { colors, spacing } from '../../styles/theme'

export function NetMeteringSection() {
  const status = useEntity(energyEntities.netMeteringStatus as any, { returnNullIfNotFound: true })
  const balance = useEntity(energyEntities.netMeteringBalance as any, { returnNullIfNotFound: true })
  const totalImport = useEntity(energyEntities.netMeteringImport as any, { returnNullIfNotFound: true })
  const totalExport = useEntity(energyEntities.netMeteringExport as any, { returnNullIfNotFound: true })
  const monthlyGrid = useEntity(energyEntities.monthlyGridConsumption as any, { returnNullIfNotFound: true })
  const monthlyExport = useEntity(energyEntities.monthlyGridExport as any, { returnNullIfNotFound: true })
  const lifetime = useEntity(energyEntities.lifetimeProduction as any, { returnNullIfNotFound: true })

  const statusVal = status?.state || '--'
  const balanceVal = balance ? `${parseFloat(balance.state).toFixed(1)} kWh` : '--'
  const isDeficit = statusVal.toLowerCase().includes('deficit')

  return (
    <div>
      <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: spacing.md }}>Net Metering</h3>

      <div style={{
        display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md,
        color: isDeficit ? colors.statusAlert : colors.statusGood,
      }}>
        <span>{isDeficit ? '🔴' : '🟢'}</span>
        <span style={{ fontWeight: 500 }}>{statusVal} ({balanceVal})</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md, marginBottom: spacing.lg }}>
        <div>
          <div style={{ fontSize: '12px', color: colors.textSecondary }}>Total Import</div>
          <div style={{ fontSize: '16px', fontWeight: 500 }}>{totalImport ? `${parseFloat(totalImport.state).toFixed(1)} kWh` : '--'}</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: colors.textSecondary }}>Total Export</div>
          <div style={{ fontSize: '16px', fontWeight: 500 }}>{totalExport ? `${parseFloat(totalExport.state).toFixed(1)} kWh` : '--'}</div>
        </div>
      </div>

      <h4 style={{ fontSize: '13px', color: colors.textSecondary, marginBottom: spacing.sm }}>Monthly</h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md, marginBottom: spacing.md }}>
        <div>
          <div style={{ fontSize: '12px', color: colors.textSecondary }}>Grid Used</div>
          <div style={{ fontSize: '14px' }}>{monthlyGrid ? `${parseFloat(monthlyGrid.state).toFixed(1)} kWh` : '--'}</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: colors.textSecondary }}>Grid Export</div>
          <div style={{ fontSize: '14px' }}>{monthlyExport ? `${parseFloat(monthlyExport.state).toFixed(1)} kWh` : '--'}</div>
        </div>
      </div>

      {lifetime && (
        <div>
          <div style={{ fontSize: '12px', color: colors.textSecondary }}>Lifetime Solar Production</div>
          <div style={{ fontSize: '14px' }}>{parseFloat(lifetime.state).toFixed(1)} kWh</div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 6: Create ProductionStats**

Create `dashboard/src/components/energy/ProductionStats.tsx`:

```tsx
import { useEntity } from '@hakit/core'
import { energyEntities } from '../../config/rooms'
import { colors, spacing } from '../../styles/theme'

export function ProductionStats() {
  const daily = useEntity(energyEntities.dailyProduction as any, { returnNullIfNotFound: true })
  const monthly = useEntity(energyEntities.monthlyProduction as any, { returnNullIfNotFound: true })
  const forecastToday = useEntity(energyEntities.forecastToday as any, { returnNullIfNotFound: true })
  const forecastTomorrow = useEntity(energyEntities.forecastTomorrow as any, { returnNullIfNotFound: true })

  return (
    <div>
      <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: spacing.md }}>Production</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md, marginBottom: spacing.lg }}>
        <div>
          <div style={{ fontSize: '12px', color: colors.textSecondary }}>Today</div>
          <div style={{ fontSize: '16px', fontWeight: 500 }}>{daily ? `${parseFloat(daily.state).toFixed(1)} kWh` : '--'}</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: colors.textSecondary }}>Monthly</div>
          <div style={{ fontSize: '16px', fontWeight: 500 }}>{monthly ? `${parseFloat(monthly.state).toFixed(1)} kWh` : '--'}</div>
        </div>
      </div>

      <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: spacing.md }}>Forecast</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
        <div>
          <div style={{ fontSize: '12px', color: colors.textSecondary }}>Today</div>
          <div style={{ fontSize: '16px', fontWeight: 500 }}>{forecastToday ? `${parseFloat(forecastToday.state).toFixed(1)} kWh` : '--'}</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: colors.textSecondary }}>Tomorrow</div>
          <div style={{ fontSize: '16px', fontWeight: 500 }}>{forecastTomorrow ? `${parseFloat(forecastTomorrow.state).toFixed(1)} kWh` : '--'}</div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 7: Assemble SolarGridView**

Update `dashboard/src/views/SolarGridView.tsx`:

```tsx
import { BalanceHeader } from '../components/energy/BalanceHeader'
import { SolarChart } from '../components/energy/SolarChart'
import { GridSection } from '../components/energy/GridSection'
import { AmperageSection } from '../components/energy/AmperageSection'
import { NetMeteringSection } from '../components/energy/NetMeteringSection'
import { ProductionStats } from '../components/energy/ProductionStats'
import { spacing, colors } from '../styles/theme'

export function SolarGridView() {
  const divider = { height: '1px', background: colors.cardBorder, margin: `${spacing.lg} 0` }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '22px', fontWeight: 600, marginBottom: spacing.lg }}>Energy</h1>

      <BalanceHeader />
      <SolarChart />
      <div style={divider} />
      <GridSection />
      <div style={divider} />
      <AmperageSection />
      <div style={divider} />
      <NetMeteringSection />
      <div style={divider} />
      <ProductionStats />
    </div>
  )
}
```

- [ ] **Step 8: Verify energy page**

```bash
cd dashboard && npm run dev
```

Navigate to Energy. Expected: Single scrollable page with balance header, solar chart with area fill, grid import/export with chart, phase bars with imbalance indicator, net metering stats, production and forecast numbers.

- [ ] **Step 9: Commit**

```bash
git add dashboard/src/
git commit -m "feat: implement SolarGridView with charts, phases, and net metering"
```

---

### Task 10: EVChargingView

**Files:**
- Create: `dashboard/src/components/ev/VehicleCard.tsx`
- Create: `dashboard/src/components/ev/ChargerMode.tsx`
- Create: `dashboard/src/components/ev/GoECharger.tsx`
- Modify: `dashboard/src/views/EVChargingView.tsx`

- [ ] **Step 1: Create VehicleCard**

Create `dashboard/src/components/ev/VehicleCard.tsx`:

```tsx
import { useEntity } from '@hakit/core'
import { evEntities } from '../../config/rooms'
import { colors, borderRadius, spacing } from '../../styles/theme'

export function VehicleCard() {
  const battery = useEntity(evEntities.batteryLevel as any, { returnNullIfNotFound: true })
  const range = useEntity(evEntities.batteryRange as any, { returnNullIfNotFound: true })
  const charging = useEntity(evEntities.chargingState as any, { returnNullIfNotFound: true })
  const chargeLimit = useEntity(evEntities.chargeLimit as any, { returnNullIfNotFound: true })
  const chargeCurrent = useEntity(evEntities.chargeCurrent as any, { returnNullIfNotFound: true })
  const sentry = useEntity(evEntities.sentryMode as any, { returnNullIfNotFound: true })
  const lock = useEntity(evEntities.vehicleLock as any, { returnNullIfNotFound: true })
  const cable = useEntity(evEntities.chargeCable as any, { returnNullIfNotFound: true })

  const batteryPct = battery ? parseFloat(battery.state) : 0
  const rangeKm = range ? `${parseFloat(range.state).toFixed(0)}km` : '--'
  const isConnected = cable?.state === 'on'
  const chargingState = charging?.state || 'unknown'
  const limitPct = chargeLimit ? `${parseFloat(chargeLimit.state).toFixed(0)}%` : '--'
  const currentA = chargeCurrent ? `${parseFloat(chargeCurrent.state).toFixed(0)} A` : '--'

  // Battery color: red → yellow → green
  const batteryColor = batteryPct < 20 ? colors.statusAlert : batteryPct < 50 ? '#f0c040' : colors.statusGood

  // SVG arc for battery gauge
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const arcLength = (batteryPct / 100) * circumference * 0.75 // 270 degrees

  return (
    <div>
      <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: spacing.md }}>Tesla Raikiri</h3>

      {/* Battery gauge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xl }}>
        <div style={{ position: 'relative', width: '140px', height: '140px' }}>
          <svg viewBox="0 0 140 140" style={{ transform: 'rotate(135deg)' }}>
            <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`} strokeLinecap="round" />
            <circle cx="70" cy="70" r={radius} fill="none" stroke={batteryColor} strokeWidth="8" strokeDasharray={`${arcLength} ${circumference - arcLength}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease, stroke 0.5s ease' }} />
          </svg>
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 600 }}>{batteryPct}%</div>
            <div style={{ fontSize: '11px', color: colors.textSecondary }}>{rangeKm}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
          <div style={{ fontSize: '13px', color: colors.textSecondary }}>
            {isConnected ? `Connected · ${chargingState}` : 'Disconnected'}
          </div>
          <div style={{ fontSize: '13px' }}>Charge limit: {limitPct}</div>
          <div style={{ fontSize: '13px' }}>Charge current: {currentA}</div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md, marginTop: spacing.lg }}>
        <ToggleRow label="Sentry Mode" entity={evEntities.sentryMode} state={sentry?.state || 'off'} />
        <div style={{ fontSize: '13px' }}>
          <span style={{ color: colors.textSecondary }}>Lock: </span>
          <span style={{ color: lock?.state === 'locked' ? colors.statusGood : colors.statusAlert }}>
            {lock?.state === 'locked' ? '🔒 Locked' : '🔓 Unlocked'}
          </span>
        </div>
      </div>
    </div>
  )
}

function ToggleRow({ label, entity, state }: { label: string; entity: string; state: string }) {
  const e = useEntity(entity as any, { returnNullIfNotFound: true })
  const isOn = state === 'on'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
      <span style={{ fontSize: '13px', color: colors.textSecondary }}>{label}:</span>
      <button
        onClick={() => e?.service.toggle()}
        style={{
          padding: '2px 10px',
          borderRadius: '9999px',
          border: `1px solid ${isOn ? colors.statusGood : colors.cardBorder}`,
          background: isOn ? 'rgba(76, 175, 80, 0.15)' : 'transparent',
          color: isOn ? colors.statusGood : colors.textSecondary,
          cursor: 'pointer',
          fontSize: '12px',
        }}
      >
        {isOn ? 'On' : 'Off'}
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Create ChargerMode**

Create `dashboard/src/components/ev/ChargerMode.tsx`:

```tsx
import { useEntity } from '@hakit/core'
import { colors, borderRadius, spacing } from '../../styles/theme'

export function ChargerMode() {
  // These entity IDs may need adjustment based on actual EV charger integration
  const chargerMode = useEntity('select.ev_charger_mode' as any, { returnNullIfNotFound: true })

  // Fallback if the exact entity doesn't exist
  if (!chargerMode) {
    return (
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: spacing.md }}>Charger Mode</h3>
        <p style={{ fontSize: '13px', color: colors.textSecondary }}>
          Charger mode entity not found. Check entity ID configuration.
        </p>
      </div>
    )
  }

  const options = chargerMode.attributes.options || ['Solar + Grid', 'Solar Only', 'Grid Only']
  const currentMode = chargerMode.state

  return (
    <div>
      <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: spacing.md }}>Charger Mode</h3>

      <div style={{ fontSize: '13px', color: colors.textSecondary, marginBottom: spacing.sm }}>
        EV Charger Mode
      </div>

      <select
        value={currentMode}
        onChange={(e) => chargerMode.service.select_option({ option: e.target.value })}
        style={{
          width: '100%',
          padding: `${spacing.sm} ${spacing.md}`,
          borderRadius: borderRadius.md,
          border: `1px solid ${colors.cardBorder}`,
          background: colors.cardBg,
          color: colors.textPrimary,
          fontSize: '14px',
          cursor: 'pointer',
        }}
      >
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  )
}
```

- [ ] **Step 3: Create GoECharger**

Create `dashboard/src/components/ev/GoECharger.tsx`:

```tsx
import { useEntity } from '@hakit/core'
import { evEntities } from '../../config/rooms'
import { colors, spacing } from '../../styles/theme'

export function GoECharger() {
  const status = useEntity(evEntities.goEStatus as any, { returnNullIfNotFound: true })
  const energyTotal = useEntity(evEntities.goEEnergyTotal as any, { returnNullIfNotFound: true })

  const statusText = status?.state || 'Unknown'
  const totalKwh = energyTotal ? `${parseFloat(energyTotal.state).toFixed(0)} kWh total` : ''

  return (
    <div>
      <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: spacing.md }}>Go-e Charger</h3>

      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md }}>
        <span style={{ fontSize: '20px' }}>🔌</span>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 500 }}>Go-e · {statusText}</div>
          {totalKwh && (
            <div style={{ fontSize: '12px', color: colors.textSecondary }}>{totalKwh}</div>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Assemble EVChargingView**

Update `dashboard/src/views/EVChargingView.tsx`:

```tsx
import { VehicleCard } from '../components/ev/VehicleCard'
import { ChargerMode } from '../components/ev/ChargerMode'
import { GoECharger } from '../components/ev/GoECharger'
import { spacing, colors } from '../styles/theme'

export function EVChargingView() {
  const divider = { height: '1px', background: colors.cardBorder, margin: `${spacing.lg} 0` }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '22px', fontWeight: 600, marginBottom: spacing.lg }}>EV Charging</h1>

      <VehicleCard />
      <div style={divider} />
      <ChargerMode />
      <div style={divider} />
      <GoECharger />
    </div>
  )
}
```

- [ ] **Step 5: Verify EV charging page**

```bash
cd dashboard && npm run dev
```

Navigate to EV. Expected: Tesla battery arc gauge with percentage and range, charge controls, sentry/lock status, charger mode selector, Go-e charger status.

- [ ] **Step 6: Commit**

```bash
git add dashboard/src/
git commit -m "feat: implement EVChargingView with Tesla gauge and Go-e charger"
```

---

### Task 11: Polish & Icon System

**Files:**
- Modify: `dashboard/src/components/layout/Sidebar.tsx`
- Modify: Various components using emoji placeholders

- [ ] **Step 1: Install MDI icon package**

```bash
cd dashboard
npm install @mdi/react @mdi/js
```

- [ ] **Step 2: Replace emoji icons in Sidebar**

Update `dashboard/src/components/layout/Sidebar.tsx` to use MDI icons:

```tsx
import Icon from '@mdi/react'
import { mdiHome, mdiFloorPlan, mdiSolarPower, mdiCarElectric, mdiDotsHorizontal } from '@mdi/js'
import { NavLink } from 'react-router-dom'
import { colors, borderRadius, spacing } from '../../styles/theme'

const navItems = [
  { to: '/', icon: mdiHome, label: 'Home' },
  { to: '/rooms', icon: mdiFloorPlan, label: 'Rooms' },
  { to: '/energy/solar', icon: mdiSolarPower, label: 'Energy' },
  { to: '/energy/ev', icon: mdiCarElectric, label: 'EV' },
  { to: '/more', icon: mdiDotsHorizontal, label: 'More' },
]

export function Sidebar() {
  return (
    <nav
      style={{
        position: 'fixed',
        left: spacing.md,
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.xs,
        background: colors.sidebarBg,
        backdropFilter: 'blur(20px)',
        borderRadius: borderRadius.xl,
        padding: `${spacing.md} ${spacing.sm}`,
        zIndex: 100,
      }}
    >
      {navItems.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            padding: `${spacing.sm} ${spacing.md}`,
            borderRadius: borderRadius.md,
            textDecoration: 'none',
            color: isActive ? colors.textPrimary : colors.textMuted,
            background: isActive ? colors.sidebarActive : 'transparent',
            fontSize: '11px',
            transition: 'all 0.2s ease',
          })}
        >
          <Icon path={icon} size={0.9} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
```

- [ ] **Step 3: Replace emoji placeholders in key components**

Update icon rendering in `DeviceCard.tsx`, `RoomCard.tsx`, `ScenesGrid.tsx`, and `SecurityStatus.tsx` to use `@mdi/react` + `@mdi/js` icons instead of emoji. Import the specific icons needed:

```tsx
// Common imports pattern:
import Icon from '@mdi/react'
import { mdiLightbulb, mdiLightbulbOff, mdiLock, mdiLockOpen, mdiGarage, mdiGarageOpen } from '@mdi/js'

// Usage:
<Icon path={isOn ? mdiLightbulb : mdiLightbulbOff} size={0.8} color={isOn ? colors.statusOn : colors.textMuted} />
```

Apply this pattern to each component that currently uses emoji. The specific MDI icon names for each component:

- **DeviceCard**: `mdiLightbulb` / `mdiLightbulbOff`
- **RoomCard**: `mdiSilverwareForkKnife`, `mdiSofa`, `mdiBedKing`, `mdiDesk`, `mdiGarage`, `mdiShowerHead`, `mdiDoor`
- **ScenesGrid**: `mdiWeatherSunsetUp`, `mdiWeatherNight`, `mdiHomeExportOutline`, `mdiHomeHeart`, `mdiLightbulbOff`, `mdiWaterBoiler`
- **SecurityStatus**: `mdiLock`, `mdiLockOpen`, `mdiGarage`, `mdiGarageOpen`
- **WeatherBadge**: `mdiWeatherCloudy` (or map weather conditions to icons)

- [ ] **Step 4: Verify icons render correctly**

```bash
cd dashboard && npm run dev
```

Expected: All emoji placeholders replaced with proper MDI vector icons that match the HA dashboard style.

- [ ] **Step 5: Commit**

```bash
git add dashboard/
git commit -m "feat: replace emoji placeholders with MDI icons"
```

---

### Task 12: Build & Verify

**Files:**
- None (verification only)

- [ ] **Step 1: Run production build**

```bash
cd dashboard
npm run build
```

Expected: Build succeeds with no errors. Output in `dashboard/dist/`.

- [ ] **Step 2: Preview production build**

```bash
cd dashboard
npm run preview
```

Expected: Production build serves correctly. Navigate through all views: Home, Rooms, Kitchen detail, Energy, EV. All data loads from HA.

- [ ] **Step 3: Test each view checklist**

Manually verify:
- [ ] Home: date/time, weather, greeting, temperature, scenes (click one), security status
- [ ] Rooms: category tabs filter correctly, room cards show temp/humidity
- [ ] Room detail: lights toggle on/off, active tab shows active entities
- [ ] Energy: balance header, solar chart renders, grid chart renders, phase bars, net metering stats
- [ ] EV: battery gauge renders with correct percentage, sentry toggle works

- [ ] **Step 4: Commit any fixes**

```bash
git add dashboard/
git commit -m "fix: address issues found during manual verification"
```

---

## Verification

1. `npm run build` in `dashboard/` completes without errors
2. All 4 views render with live HA data (requires .env configured with valid HA URL + token)
3. Sidebar navigation works with animated page transitions
4. Light/switch toggles in room detail actually control HA devices
5. Energy charts display historical data from Recharts
6. Battery gauge SVG animates correctly

## Notes

- **Entity IDs**: The `rooms.ts` config file centralizes all entity IDs. If any entity doesn't exist, `returnNullIfNotFound: true` prevents crashes — the component gracefully shows `--` or hides the section.
- **Icons**: Task 11 replaces emoji placeholders with MDI vector icons. The emoji versions are functional placeholders that work during development.
- **TypeScript `as any`**: The `useEntity` calls use `as any` for entity IDs because hakit's type system requires exact entity name literals from the HA connection. This is expected when entity IDs come from config files.
- **HA Add-on deployment**: Not included in this plan. After the experiment validates the approach, a separate task will create the add-on configuration for sidebar integration.
