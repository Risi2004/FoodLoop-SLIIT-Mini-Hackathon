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

function FitBounds({ points, routePositions }) {
  const map = useMap()

  useEffect(() => {
    const coords = (routePositions?.length ? routePositions : points.map((p) => [p.lat, p.lng])).filter(
      Boolean
    )
    if (!coords.length) return
    map.fitBounds(coords, { padding: [36, 36] })
  }, [map, points, routePositions])

  return null
}

async function fetchOsrmRoute(points) {
  if (!points || points.length < 2) return null

  const coords = points.map((p) => `${p.lng},${p.lat}`).join(';')
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`

  const response = await fetch(url)
  if (!response.ok) return null

  const data = await response.json()
  const geometry = data?.routes?.[0]?.geometry?.coordinates
  if (!geometry?.length) return null

  // OSRM returns [lng, lat]
  return geometry.map(([lng, lat]) => [lat, lng])
}

export default function FoodLoopMap({
  center = DEMO_POINTS.driver,
  zoom = 13,
  points = [DEMO_POINTS.pickup, DEMO_POINTS.driver, DEMO_POINTS.dropoff],
  showRoute = true,
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

  const fallbackRoute = useMemo(
    () => safePoints.map((point) => [point.lat, point.lng]),
    [safePoints]
  )

  const [routePositions, setRoutePositions] = useState(fallbackRoute)

  useEffect(() => {
    let active = true
    setRoutePositions(fallbackRoute)

    if (!showRoute || safePoints.length < 2) return undefined

    fetchOsrmRoute(safePoints)
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
  }, [safePoints, showRoute, fallbackRoute])

  const mapCenter = safePoints[0] || center

  return (
    <div className="fl-map">
      <MapContainer
        key={`${mapCenter.lat}-${mapCenter.lng}-${safePoints.length}`}
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={zoom}
        scrollWheelZoom
        className="fl-map__canvas"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds points={safePoints} routePositions={routePositions} />

        {showRoute && routePositions.length > 1 && (
          <Polyline
            positions={routePositions}
            pathOptions={{ color: '#2563eb', weight: 5, opacity: 0.85 }}
          />
        )}

        {safePoints.map((point) => (
          <Marker
            key={`${point.label || 'point'}-${point.lat}-${point.lng}`}
            position={[point.lat, point.lng]}
          >
            <Popup>{point.label || 'Location'}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
