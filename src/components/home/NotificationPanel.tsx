import React from 'react'
import { useEntity } from '@hakit/core'
import type { EntityName } from '@hakit/core'
import { BottomSheet } from '../shared/BottomSheet'
import { Icon } from '@mdi/react'
import {
  mdiGarageOpen, mdiEvStation, mdiWaterBoiler, mdiPump, mdiDoorOpen,
  mdiDishwasher, mdiStove, mdiWindowOpenVariant, mdiMoleculeCo2,
  mdiServerOff, mdiCheckCircle, mdiClose
} from '@mdi/js'
import { colors, spacing } from '../../styles/theme'
import { securityEntities, goEEntities, evEntities, notificationEntities } from '../../config/rooms'

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
}

function StatusItem({ icon, iconColor, primary, secondary }: {
  icon: string; iconColor: string; primary: string; secondary?: string
}) {
  return (
    <div className="liquid-glass" style={{
      padding: spacing.md, display: 'flex', alignItems: 'center', gap: spacing.sm
    }}>
      <Icon path={icon} size={0.8} color={iconColor} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', color: colors.textPrimary, fontWeight: 500 }}>{primary}</div>
        {secondary && <div style={{ fontSize: '12px', color: colors.textMuted }}>{secondary}</div>}
      </div>
    </div>
  )
}

function NotificationPanelContent({ onClose }: { onClose: () => void }) {
  // Security entities
  const garageDoor = useEntity(securityEntities.garageDoor as EntityName, { returnNullIfNotFound: true })
  const rightGarage = useEntity(notificationEntities.rightGarageDoorSensor as EntityName, { returnNullIfNotFound: true })
  const leftGarage = useEntity(notificationEntities.leftGarageDoorSensor as EntityName, { returnNullIfNotFound: true })
  const frontDoorLock = useEntity(securityEntities.frontDoorLock as EntityName, { returnNullIfNotFound: true })

  // EV / Charger entities
  const carConnected = useEntity(goEEntities.carConnected as EntityName, { returnNullIfNotFound: true })
  const batteryLevel = useEntity(evEntities.batteryLevel as EntityName, { returnNullIfNotFound: true })
  const chargerPower = useEntity(goEEntities.powerTotal as EntityName, { returnNullIfNotFound: true })

  // DHW entities
  const dhwHeaterPower = useEntity(notificationEntities.dhwHeaterPower as EntityName, { returnNullIfNotFound: true })
  const dhwPumpBoost = useEntity(notificationEntities.dhwPumpBoost as EntityName, { returnNullIfNotFound: true })

  // Appliance entities
  const dishwasherState = useEntity(notificationEntities.dishwasherState as EntityName, { returnNullIfNotFound: true })
  const dishwasherProgress = useEntity(notificationEntities.dishwasherProgress as EntityName, { returnNullIfNotFound: true })
  const ovenState = useEntity(notificationEntities.ovenState as EntityName, { returnNullIfNotFound: true })
  const ovenTemp = useEntity(notificationEntities.ovenTemp as EntityName, { returnNullIfNotFound: true })

  // Environment entities
  const openWindows = useEntity(notificationEntities.openWindows as EntityName, { returnNullIfNotFound: true })
  const openDoors = useEntity(notificationEntities.openDoors as EntityName, { returnNullIfNotFound: true })
  const co2Bedroom = useEntity(notificationEntities.co2Bedroom as EntityName, { returnNullIfNotFound: true })

  // System entities
  const serverIssues = useEntity(notificationEntities.serverIssues as EntityName, { returnNullIfNotFound: true })

  // Build list of active notifications
  const items: React.ReactElement[] = []

  if (garageDoor && garageDoor.state === 'open') {
    items.push(<StatusItem key="garage" icon={mdiGarageOpen} iconColor={colors.accentRed} primary="Garage Door Open" />)
  }
  if (rightGarage && rightGarage.state === 'on') {
    items.push(<StatusItem key="right-garage" icon={mdiGarageOpen} iconColor={colors.accentRed} primary="Right Garage Open" />)
  }
  if (leftGarage && leftGarage.state === 'on') {
    items.push(<StatusItem key="left-garage" icon={mdiGarageOpen} iconColor={colors.accentRed} primary="Left Garage Open" />)
  }
  if (carConnected && carConnected.state === 'on') {
    const battery = batteryLevel ? batteryLevel.state : '?'
    const power = chargerPower ? chargerPower.state : '0'
    items.push(
      <StatusItem
        key="ev-charging"
        icon={mdiEvStation}
        iconColor={colors.accentGreen}
        primary={`Raikiri \u00b7 ${battery}%`}
        secondary={`${power}W`}
      />
    )
  }
  if (dhwHeaterPower && Number(dhwHeaterPower.state) > 50) {
    items.push(
      <StatusItem
        key="dhw-heater"
        icon={mdiWaterBoiler}
        iconColor={colors.accentAmber}
        primary="DHW Booster Heater"
        secondary={`${dhwHeaterPower.state}W`}
      />
    )
  }
  if (dhwPumpBoost && dhwPumpBoost.state === 'on') {
    items.push(
      <StatusItem
        key="dhw-pump"
        icon={mdiPump}
        iconColor={colors.accentBlue}
        primary="DHW Pump Boost"
        secondary="Manual boost active"
      />
    )
  }
  if (frontDoorLock && frontDoorLock.state === 'unlocked') {
    items.push(<StatusItem key="front-door" icon={mdiDoorOpen} iconColor={colors.accentRed} primary="Front Door Unlocked" />)
  }
  if (dishwasherState && dishwasherState.state === 'run') {
    const progress = dishwasherProgress ? dishwasherProgress.state : '?'
    items.push(
      <StatusItem
        key="dishwasher-run"
        icon={mdiDishwasher}
        iconColor={colors.accentBlue}
        primary="Dishwasher Running"
        secondary={`${progress}% complete`}
      />
    )
  }
  if (dishwasherState && (dishwasherState.state === 'ready' || dishwasherState.state === 'finished')) {
    items.push(
      <StatusItem
        key="dishwasher-done"
        icon={mdiDishwasher}
        iconColor={colors.accentGreen}
        primary="Dishwasher Finished"
        secondary="Ready to unload"
      />
    )
  }
  if (ovenState && ovenState.state !== 'inactive' && ovenState.state !== 'unavailable') {
    const temp = ovenTemp ? ovenTemp.state : '?'
    items.push(
      <StatusItem
        key="oven"
        icon={mdiStove}
        iconColor={colors.accentAmber}
        primary="Oven Active"
        secondary={`${temp}\u00b0C`}
      />
    )
  }
  if (openWindows && Number(openWindows.state) > 0) {
    const count = openWindows.state
    items.push(
      <StatusItem
        key="windows"
        icon={mdiWindowOpenVariant}
        iconColor={colors.accentAmber}
        primary="Open Windows"
        secondary={`${count} window(s) open`}
      />
    )
  }
  if (openDoors && Number(openDoors.state) > 0) {
    const count = openDoors.state
    items.push(
      <StatusItem
        key="doors"
        icon={mdiDoorOpen}
        iconColor={colors.accentAmber}
        primary="Open Doors"
        secondary={`${count} door(s) open`}
      />
    )
  }
  if (co2Bedroom && Number(co2Bedroom.state) > 1000) {
    items.push(
      <StatusItem
        key="co2"
        icon={mdiMoleculeCo2}
        iconColor={colors.accentRed}
        primary="High CO2 \u2014 Bedroom"
        secondary={`${co2Bedroom.state} ppm`}
      />
    )
  }
  if (serverIssues && Number(serverIssues.state) > 0) {
    items.push(
      <StatusItem
        key="server"
        icon={mdiServerOff}
        iconColor={colors.accentRed}
        primary="Server Issues"
        secondary={`${serverIssues.state} service(s) offline`}
      />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: spacing.sm
      }}>
        <div style={{ fontSize: '18px', fontWeight: 700, color: colors.textPrimary }}>
          Notifications
        </div>
        <div
          onClick={onClose}
          style={{ cursor: 'pointer', padding: spacing.xs }}
        >
          <Icon path={mdiClose} size={0.9} color={colors.textSecondary} />
        </div>
      </div>

      {/* Status items or all clear */}
      {items.length > 0 ? items : (
        <div style={{ textAlign: 'center', padding: spacing.xl, color: colors.textMuted }}>
          <Icon path={mdiCheckCircle} size={2} color={colors.accentGreen} />
          <div style={{ fontSize: '16px', fontWeight: 600, color: colors.textPrimary, marginTop: spacing.md }}>
            All Clear
          </div>
          <div style={{ fontSize: '13px', marginTop: spacing.xs }}>No active notifications</div>
        </div>
      )}
    </div>
  )
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} maxHeight="70vh">
      <NotificationPanelContent onClose={onClose} />
    </BottomSheet>
  )
}
