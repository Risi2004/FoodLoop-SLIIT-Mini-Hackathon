import { useEffect, useMemo, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'
import './FoodLoopMap.css'

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})
L.Marker.prototype.options.icon = DefaultIcon

export const DEMO_POINTS = {
  driver: { lat: 7.084, lng: 80.01, label: 'Driver' },
  pickup: { lat: 7.091, lng: 80.002, label: 'Pickup' },
  dropoff: { lat: 7.075, lng: 80.02, label: 'Drop-off' },
}

const driverIcon = L.divIcon({
  className: 'fl-map__driver-icon',
  html: `<div class="fl-map__driver-pin" aria-hidden="true">
    <svg viewBox="0 0 24 24" width="18" height="18"><path fill="#fff" d="M5 16a2 2 0 1 0 2 2 2 2 0 0 0-2-2Zm10 0a2 2 0 1 0 2 2 2 2 0 0 0-2-2ZM4 9h9l1.5 3H19v4h-1.1a3 3 0 0 0-5.8 0H9.9a3 3 0 0 0-5.8 0H3v-2.5A4.5 4.5 0 0 1 4 9Z"/></svg>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
})

function FitBounds({ points, routePositions, followPoint, followOnly }) {
  const map = useMap()

  useEffect(() => {
    if (followOnly && followPoint) {
      map.panTo([followPoint.lat, followPoint.lng], { animate: true })
      return
    }

    const coords = (
      routePositions?.length ? routePositions : points.map((p) => [p.lat, p.lng])
    ).filter(Boolean)
    if (!coords.length) return
    map.fitBounds(coords, { padding: [36, 36] })
  }, [map, points, routePositions, followPoint, followOnly])

  return null
}

export async function fetchOsrmRoute(points) {
  if (!points || points.length < 2) return null

  const coords = points.map((p) => `${p.lng},${p.lat}`).join(';')
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`

  const response = await fetch(url)
  if (!response.ok) return null

  const data = await response.json()
  const geometry = data?.routes?.[0]?.geometry?.coordinates
  if (!geometry?.length) return null

  return geometry.map(([lng, lat]) => [lat, lng])
}

function iconForPoint(point) {
  if ((point.label || '').toLowerCase().includes('driver')) {
    return driverIcon
  }
  return DefaultIcon
}

export default function FoodLoopMap({
  center = DEMO_POINTS.driver,
  zoom = 13,
  points = [DEMO_POINTS.pickup, DEMO_POINTS.driver, DEMO_POINTS.dropoff],
  showRoute = true,
  followDriver = false,
  mapId = 'foodloop-map',
}) {
  const safePoints = useMemo(
    () =>
      (points || []).filter(
        (point) =>
          point &&
          typeof point.lat === 'number' &&
          typeof point.lng === 'number' &&
          !Number.isNaN(point.lat) &&
          !Number.isNaN(point.lng)
      ),
    [points]
  )

  const driverPoint = useMemo(
    () =>
      safePoints.find((p) => (p.label || '').toLowerCase().includes('driver')) ||
      null,
    [safePoints]
  )

  const routeWaypoints = useMemo(() => {
    const pickup = safePoints.find((p) => (p.label || '').toLowerCase().includes('pickup'))
    const dropoff = safePoints.find((p) =>
      (p.label || '').toLowerCase().includes('drop')
    )
    if (pickup && dropoff) return [pickup, dropoff]
    return safePoints.filter((p) => !(p.label || '').toLowerCase().includes('driver'))
  }, [safePoints])

  const fallbackRoute = useMemo(
    () => routeWaypoints.map((point) => [point.lat, point.lng]),
    [routeWaypoints]
  )

  const [routePositions, setRoutePositions] = useState(fallbackRoute)
  const [fittedOnce, setFittedOnce] = useState(false)

  useEffect(() => {
    let active = true
    setRoutePositions(fallbackRoute)

    if (!showRoute || routeWaypoints.length < 2) return undefined

    fetchOsrmRoute(routeWaypoints)
      .then((positions) => {
        if (!active || !positions?.length) return
        setRoutePositions(positions)
      })
      .catch(() => {
        if (!active) return
        setRoutePositions(fallbackRoute)
      })

    return () => {
      active = false
    }
  }, [routeWaypoints, showRoute, fallbackRoute])

  useEffect(() => {
    setFittedOnce(false)
  }, [mapId])

  const mapCenter = center || driverPoint || safePoints[0] || DEMO_POINTS.driver

  return (
    <div className="fl-map">
      <MapContainer
        key={mapId}
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={zoom}
        scrollWheelZoom
        className="fl-map__canvas"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds
          points={safePoints}
          routePositions={routePositions}
          followPoint={driverPoint}
          followOnly={followDriver && fittedOnce}
        />

        {!fittedOnce && (
          <InitialFitDone
            onDone={() => setFittedOnce(true)}
            points={safePoints}
            routePositions={routePositions}
          />
        )}

        {showRoute && routePositions.length > 1 && (
          <Polyline
            positions={routePositions}
            pathOptions={{ color: '#2563eb', weight: 5, opacity: 0.85 }}
          />
        )}

        {safePoints.map((point) => (
          <Marker
            key={`${point.label || 'point'}-${point.lat.toFixed(5)}-${point.lng.toFixed(5)}`}
            position={[point.lat, point.lng]}
            icon={iconForPoint(point)}
          >
            <Popup>{point.label || 'Location'}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

function InitialFitDone({ onDone, points, routePositions }) {
  const map = useMap()
  useEffect(() => {
    const coords = (
      routePositions?.length ? routePositions : points.map((p) => [p.lat, p.lng])
    ).filter(Boolean)
    if (coords.length) {
      map.fitBounds(coords, { padding: [36, 36] })
    }
    const timer = setTimeout(onDone, 400)
    return () => clearTimeout(timer)
  }, [map, onDone, points, routePositions])
  return null
}
