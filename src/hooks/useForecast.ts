import { useWeather } from '@hakit/core'
import type { EntityName } from '@hakit/core'
import { weatherEntity } from '../config/rooms'

export interface ForecastItem {
  condition: string
  datetime: string
  temperature: number
  templow?: number
  wind_speed: number
  wind_bearing: number
  precipitation: number
  humidity: number
  uv_index?: number
  cloud_coverage?: number
}

export interface ForecastData {
  daily: ForecastItem[]
  hourly: ForecastItem[]
}

export function useForecast(): ForecastData {
  const dailyWeather = useWeather(weatherEntity as EntityName & `weather.${string}`, { type: 'daily' })
  const hourlyWeather = useWeather(weatherEntity as EntityName & `weather.${string}`, { type: 'hourly' })

  const daily = (dailyWeather.forecast?.forecast ?? []) as unknown as ForecastItem[]
  const hourly = (hourlyWeather.forecast?.forecast ?? []) as unknown as ForecastItem[]

  return { daily, hourly }
}
