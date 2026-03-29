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
    lights: ['light.kitchen_main_light', 'light.kitchen_handle_light'],
    switches: ['switch.coffee_bar_light', 'switch.kitchen_rear_cabinet_light'],
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
    lights: ['light.living_room_main_light', 'light.living_room_hallway_light'],
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
    lights: ['light.dining_room_main_light', 'light.dining_room_cabinet_light'],
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
    lights: ['light.front_bathroom_light', 'light.front_bathroom_mirror_light'],
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
  gridImport: 'sensor.grid_import_power',
  gridExport: 'sensor.grid_export_power',
  monthlyGridConsumption: 'sensor.monthly_grid_consumption',
  monthlyGridExport: 'sensor.monthly_grid_export',
  phaseA: 'sensor.shelly_main_em_phase_a_power',
  phaseB: 'sensor.shelly_main_em_phase_b_power',
  phaseC: 'sensor.shelly_main_em_phase_c_power',
  phaseImbalance: 'sensor.phase_imbalance',
  phaseImbalancePercent: 'sensor.phase_imbalance_percentage',
  netMeteringImport: 'sensor.net_metering_total_import',
  netMeteringExport: 'sensor.net_metering_total_export',
  netMeteringBalance: 'sensor.net_metering_balance',
  netMeteringStatus: 'sensor.net_metering_status',
} as const

export const evEntities = {
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
  location: 'device_tracker.raikiri_location',
  goEStatus: 'sensor.goe_249593_car_value',
  goEEnergyTotal: 'sensor.goe_249593_eto',
} as const

export const securityEntities = {
  frontDoorLock: 'lock.smart_lock_pro',
  rightGarageDoor: 'cover.right_garage_door',
  garageDoor: 'cover.garage_door',
} as const
