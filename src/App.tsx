import { HassConnect } from '@hakit/core'
import { ThemeProvider } from '@hakit/components'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { HomeView } from './views/HomeView'
import { RoomsView } from './views/RoomsView'
import { RoomDetailPage } from './views/RoomDetailPage'
import { SolarGridView } from './views/SolarGridView'
import { EVChargingView } from './views/EVChargingView'
import { SystemView } from './views/SystemView'

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
              <Route path="system" element={<SystemView />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </HassConnect>
  )
}
