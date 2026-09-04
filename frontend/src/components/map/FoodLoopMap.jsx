import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'
import './FoodLoopMap.css'

// Fix default marker icons broken by Vite bundling
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

export default function FoodLoopMap({
  center = DEMO_POINTS.driver,
  zoom = 13,
  points = [DEMO_POINTS.pickup, DEMO_POINTS.driver, DEMO_POINTS.dropoff],
  showRoute = true,
}) {
  const routePositions = points.map((point) => [point.lat, point.lng])

  return (
    <div className="fl-map">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        scrollWheelZoom
        className="fl-map__canvas"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {showRoute && (
          <Polyline
            positions={routePositions}
            pathOptions={{ color: '#2563eb', weight: 5, opacity: 0.85 }}
          />
        )}

        {points.map((point) => (
          <Marker key={`${point.label}-${point.lat}-${point.lng}`} position={[point.lat, point.lng]}>
            <Popup>{point.label}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
