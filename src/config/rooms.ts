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
  media: string[]
  sensors: SensorConfig[]
}

export interface ApplianceConfig {
  name: string
  icon: string
  entity: string
  statusEntity?: string
  type?: 'dishwasher' | 'oven' | 'fridge' | 'hob' | 'printer' | 'generic'
  entities?: Record<string, string>
}

export interface SensorConfig {
  name: string
  entity: string
  icon: string
  unit?: string
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
      {
        name: 'Dishwasher', icon: 'mdi:dishwasher', entity: 'switch.dishwasher_power',
        type: 'dishwasher',
        entities: {
          door: 'sensor.dishwasher_door',
          status: 'sensor.dishwasher_operation_state',
          program: 'select.dishwasher_selected_program',
          activeProgram: 'select.dishwasher_active_program',
          progress: 'sensor.dishwasher_program_progress',
          finishTime: 'sensor.dishwasher_program_finish_time',
          delayStart: 'number.dishwasher_start_in_relative',
          stop: 'button.dishwasher_stop_program',
          intensive: 'switch.dishwasher_intensive_zone',
          varioSpeed: 'switch.dishwasher_vario_speed',
          halfLoad: 'switch.dishwasher_half_load',
          extraDry: 'switch.dishwasher_extra_dry',
          hygiene: 'switch.dishwasher_hygiene',
          silence: 'switch.dishwasher_silence_on_demand',
          remoteControl: 'binary_sensor.dishwasher_remote_control',
          connectivity: 'binary_sensor.dishwasher_connectivity',
        },
      },
      {
        name: 'Oven', icon: 'mdi:stove', entity: 'switch.oven_power',
        type: 'oven',
        entities: {
          door: 'sensor.oven_door',
          status: 'sensor.oven_operation_state',
          cavityTemp: 'sensor.oven_current_oven_cavity_temperature',
          targetTemp: 'number.oven_setpoint_temperature',
          program: 'select.oven_selected_program',
          activeProgram: 'select.oven_active_program',
          progress: 'sensor.oven_program_progress',
          finishTime: 'sensor.oven_program_finish_time',
          duration: 'number.oven_duration',
          delayStart: 'number.oven_start_in_relative',
          alarm: 'number.oven_alarm_clock',
          childLock: 'switch.oven_child_lock',
          stop: 'button.oven_stop_program',
          pause: 'button.oven_pause_program',
          resume: 'button.oven_resume_program',
          remoteControl: 'binary_sensor.oven_remote_control',
          connectivity: 'binary_sensor.oven_connectivity',
        },
      },
      {
        name: 'Hob', icon: 'mdi:gas-burner', entity: 'switch.hob_power',
        type: 'hob',
        entities: {
          status: 'sensor.hob_operation_state',
          childLock: 'switch.hob_child_lock',
          alarm: 'number.hob_alarm_clock',
          connectivity: 'binary_sensor.hob_connectivity',
        },
      },
      {
        name: 'Fridge', icon: 'mdi:fridge', entity: 'switch.fridge_freezer_power',
        type: 'fridge',
        statusEntity: 'number.fridge_freezer_refrigerator_temperature',
        entities: {
          fridgeTemp: 'number.fridge_freezer_refrigerator_temperature',
          freezerTemp: 'number.fridge_freezer_freezer_temperature',
          fridgeDoor: 'binary_sensor.fridge_freezer_refrigerator_door',
          freezerDoor: 'binary_sensor.fridge_freezer_freezer_door',
          door: 'sensor.fridge_freezer_door',
          ecoMode: 'switch.fridge_freezer_eco_mode',
          freshMode: 'switch.fridge_freezer_fresh_mode',
          superCool: 'switch.fridge_freezer_refrigerator_super_mode',
          superFreeze: 'switch.fridge_freezer_freezer_super_mode',
          sabbathMode: 'switch.fridge_freezer_sabbath_mode',
          vacationMode: 'switch.fridge_freezer_vacation_mode',
          internalLight: 'light.fridge_freezer_internal_light',
          connectivity: 'binary_sensor.fridge_freezer_connectivity',
        },
      },
    ],
    media: [],
    sensors: [],
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
    media: ['media_player.living_room_sonos', 'media_player.living_room_tv'],
    sensors: [],
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
    media: [],
    sensors: [],
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
    media: [],
    sensors: [
      { name: 'Air Quality', entity: 'sensor.master_bedroom_air_quality_monitor_air_quality', icon: 'mdi:air-filter' },
      { name: 'CO\u2082', entity: 'sensor.master_bedroom_air_quality_monitor_carbon_dioxide', icon: 'mdi:molecule-co2' },
      { name: 'PM2.5', entity: 'sensor.master_bedroom_air_quality_monitor_pm2_5', icon: 'mdi:blur' },
    ],
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
    media: [],
    sensors: [],
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
    media: [],
    sensors: [],
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
    media: [],
    sensors: [],
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
    media: [],
    sensors: [],
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
    media: [],
    sensors: [],
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
    media: [],
    sensors: [],
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
    media: [],
    sensors: [],
  },
  {
    id: 'workshop',
    name: 'Workshop',
    icon: 'mdi:hammer-wrench',
    color: 'neutral',
    temperatureEntity: 'sensor.garage_sensor_temperature',
    humidityEntity: 'sensor.garage_sensor_humidity',
    category: 'utility',
    lights: [],
    switches: [],
    appliances: [
      {
        name: '3D Printer', icon: 'mdi:printer-3d', entity: 'input_select.printer_3d_status',
        type: 'printer',
        entities: {
          status: 'input_select.printer_3d_status',
          progress: 'sensor.x1c_00m00a2b0805242_print_progress',
          camera: 'camera.x1c_00m00a2b0805242_camera',
        },
      },
    ],
    media: [],
    sensors: [],
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

export const calendarNames: Record<typeof calendarEntities[number], string> = {
  'calendar.benjamin_s_calendar': "Benjamin's Calendar",
  'calendar.birthdays': 'Birthdays',
  'calendar.privat': 'Private',
  'calendar.bteke_cloudera_com': 'Work',
  'calendar.holidays_in_hungary': 'Holidays',
  'calendar.mvm_next': 'MVM Next',
}

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

export const mediaEntities = {
  livingRoomSonos: 'media_player.living_room_sonos',
  livingRoomTV: 'media_player.living_room_tv',
} as const

/** Entity ID substrings to exclude from the media player bar (e.g., vehicle media players) */
export const excludedMediaPlayerPatterns = ['raikiri', 'tesla'] as const

export const weatherEntity = 'weather.forecast_home' as const

export const printerEntities = {
  status: 'input_select.printer_3d_status',
  printProgress: 'sensor.x1c_00m00a2b0805242_print_progress',
  camera: 'camera.x1c_00m00a2b0805242_camera',
} as const

export const notificationEntities = {
  dishwasherState: 'sensor.dishwasher_operation_state',
  dishwasherProgress: 'sensor.dishwasher_program_progress',
  ovenState: 'sensor.oven_operation_state',
  ovenTemp: 'sensor.oven_current_oven_cavity_temperature',
  openWindows: 'sensor.open_windows_count',
  openDoors: 'sensor.open_doors_count',
  co2Bedroom: 'sensor.master_bedroom_air_quality_monitor_carbon_dioxide',
  serverIssues: 'sensor.server_issues_count',
  dhwHeaterPower: 'sensor.dhw_aux_heater_switch_power',
  dhwPumpBoost: 'input_boolean.dhw_pump_boost',
  leftGarageDoorSensor: 'binary_sensor.left_garage_door_sensor_door',
  rightGarageDoorSensor: 'binary_sensor.myggbett_door_window_sensor_door',
} as const

export const systemEntities = {
  coreUpdate: 'update.home_assistant_core_update',
  osUpdate: 'update.home_assistant_operating_system_update',
  supervisorUpdate: 'update.home_assistant_supervisor_update',
  trackedUpdates: [
    'update.tailscale_update',
    'update.mosquitto_broker_update',
    'update.studio_code_server_update',
    'update.matter_server_update',
    'update.advanced_ssh_web_terminal_update',
    'update.openthread_border_router_update',
    'update.get_hacs_update',
    'update.browser_mod_update',
    'update.adaptive_lighting_update',
  ],
} as const

export const glanceEntities = {
  personBenjamin: 'person.benjamin',
  personDia: 'person.dia',
  insideTemp: 'sensor.raikiri_inside_temperature',
  outsideTemp: 'sensor.raikiri_outside_temperature',
  serverPower: 'sensor.server_plug_power',
} as const
