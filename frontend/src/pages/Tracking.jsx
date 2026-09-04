import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  completePickup,
  getTracking,
  updateDriverLocation,
} from '../api/pickups'
import { fetchOsrmRoute } from '../components/map/FoodLoopMap'
import TrackingMap from '../components/tracking/TrackingMap'
import LiveJourney from '../components/tracking/LiveJourney'
import ImpactProgress from '../components/pickups/ImpactProgress'
import './Tracking.css'

function interpolateRoute(route, progress) {
  if (!route?.length) return null
  if (progress <= 0) return { lat: route[0][0], lng: route[0][1] }
  if (progress >= 1) {
    const last = route[route.length - 1]
    return { lat: last[0], lng: last[1] }
  }

  const idx = progress * (route.length - 1)
  const i = Math.floor(idx)
  const t = idx - i
  const a = route[i]
  const b = route[Math.min(i + 1, route.length - 1)]
  return {
    lat: a[0] + (b[0] - a[0]) * t,
    lng: a[1] + (b[1] - a[1]) * t,
  }
}

function remainingKm(from, to) {
  if (!from || !to) return null
  const toRad = (d) => (d * Math.PI) / 180
  const R = 6371
  const dLat = toRad(to.lat - from.lat)
  const dLng = toRad(to.lng - from.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) *
      Math.cos(toRad(to.lat)) *
      Math.sin(dLng / 2) ** 2
  return Number((2 * R * Math.asin(Math.sqrt(h))).toFixed(2))
}

export default function Tracking() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pickup, setPickup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [completing, setCompleting] = useState(false)
  const [liveDriver, setLiveDriver] = useState(null)
  const [liveMode, setLiveMode] = useState('simulating')
  const pickupIdRef = useRef(null)
  const liveModeRef = useRef('simulating')
  const postingRef = useRef(false)
  const progressRef = useRef(0)

  useEffect(() => {
    liveModeRef.current = liveMode
  }, [liveMode])

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setError('')
      try {
        const data = await getTracking(id)
        if (!active) return
        setPickup(data)
        pickupIdRef.current = data._id
        if (data?.driverLocation) setLiveDriver(data.driverLocation)
      } catch (err) {
        if (!active) return
        setError(err.message || 'Failed to load tracking')
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    const poll = setInterval(async () => {
      try {
        const data = await getTracking(id)
        if (!active) return
        setPickup(data)
        pickupIdRef.current = data._id
        if (data.status === 'completed') {
          setLiveDriver(data.driverLocation || data.dropoffLocation || null)
        }
      } catch {
        /* keep last good state */
      }
    }, 5000)

    return () => {
      active = false
      clearInterval(poll)
    }
  }, [id])

  useEffect(() => {
    if (!pickup || pickup.status !== 'in_transit') return undefined
    if (!pickup.pickupLocation || !pickup.dropoffLocation) return undefined

    let cancelled = false
    let tickId = null
    let watchId = null

    async function pushLocation(next) {
      const pickupId = pickupIdRef.current
      if (!pickupId || postingRef.current) return
      postingRef.current = true
      try {
        const updated = await updateDriverLocation(pickupId, next)
        if (cancelled) return
        setPickup((prev) => ({
          ...prev,
          ...updated,
          driver: updated.driver || prev?.driver,
        }))
      } catch {
        /* transient */
      } finally {
        postingRef.current = false
      }
    }

    async function boot() {
      const route =
        (await fetchOsrmRoute([pickup.pickupLocation, pickup.dropoffLocation])) ||
        [
          [pickup.pickupLocation.lat, pickup.pickupLocation.lng],
          [pickup.dropoffLocation.lat, pickup.dropoffLocation.lng],
        ]
      if (cancelled) return

      if (pickup.driverLocation) {
        let best = 0
        let bestDist = Infinity
        route.forEach(([lat, lng], index) => {
          const d =
            (lat - pickup.driverLocation.lat) ** 2 +
            (lng - pickup.driverLocation.lng) ** 2
          if (d < bestDist) {
            bestDist = d
            best = index
          }
        })
        progressRef.current = best / Math.max(1, route.length - 1)
      } else {
        progressRef.current = 0.08
      }

      if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
          (pos) => {
            liveModeRef.current = 'gps'
            setLiveMode('gps')
            const next = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            }
            setLiveDriver(next)
            pushLocation(next)
          },
          () => {
            liveModeRef.current = 'simulating'
            setLiveMode('simulating')
          },
          { enableHighAccuracy: true, maximumAge: 4000, timeout: 7000 }
        )
      }

      tickId = setInterval(() => {
        if (liveModeRef.current === 'gps') return
        progressRef.current = Math.min(0.97, progressRef.current + 0.04)
        const next = interpolateRoute(route, progressRef.current)
        if (!next) return
        setLiveDriver(next)
        pushLocation(next)
      }, 2500)
    }

    boot()

    return () => {
      cancelled = true
      if (tickId) clearInterval(tickId)
      if (watchId != null) navigator.geolocation.clearWatch(watchId)
    }
  }, [pickup?._id, pickup?.status])

  const driver = pickup?.driver || {}
  const stats = driver.stats || {}
  const journey = (pickup?.journey || []).map((step, index) => ({
    id: `step-${index}`,
    title: step.title,
    detail: step.detail,
    time: step.timeLabel,
    status: step.status,
    tone: step.tone,
    badge: step.badge,
  }))

  const distanceLabel = useMemo(() => {
    if (pickup?.status === 'completed') {
      return `Arrived at ${pickup.recipientLabel || 'destination'}`
    }
    const km =
      remainingKm(liveDriver || pickup?.driverLocation, pickup?.dropoffLocation) ??
      pickup?.distanceKm
    return `${km ?? '—'}km to recipient (${pickup?.recipientLabel || 'Destination'})`
  }, [liveDriver, pickup])

  async function handleComplete() {
    if (!pickup?._id || completing) return
    setCompleting(true)
    setError('')
    try {
      await completePickup(pickup._id)
      navigate(`/receipt/${pickup.trackingId}`, { replace: true })
    } catch (err) {
      setError(err.message || 'Failed to complete delivery')
      setCompleting(false)
    }
  }

  return (
    <div className="tracking-page">
      <div className="page tracking-page__inner">
        <div className="tracking-shell">
          <div className="tracking-shell__top">
            <div>
              <Link to="/my-pickups" className="tracking-shell__back">
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M14.7 6.3 9 12l5.7 5.7 1.4-1.4L11.8 12l4.3-4.3Z"
                  />
                </svg>
                Back to My pickups
              </Link>
              <p className="tracking-shell__id">
                Tracking ID: <strong>#{pickup?.trackingId || id}</strong>
              </p>
            </div>

            <div className="tracking-shell__actions">
              {pickup?.status === 'in_transit' && (
                <span className="tracking-shell__live-mode">
                  {liveMode === 'gps' ? 'GPS live' : 'Simulated live route'}
                </span>
              )}
              <button type="button" className="tracking-shell__help">
                Get Help
              </button>
            </div>
          </div>

          {error && <p className="tracking-shell__error">{error}</p>}
          {loading && <p className="tracking-shell__status">Loading tracking...</p>}

          {!loading && pickup && (
            <div className="tracking-shell__body">
              <TrackingMap pickup={pickup} liveDriver={liveDriver} />

              <aside className="tracking-panel">
                <article className="tracking-card">
                  <div className="tracking-card__row">
                    <div>
                      <p className="tracking-card__label">Current Location</p>
                      <p className="tracking-card__value">{distanceLabel}</p>
                      {pickup.status === 'in_transit' && (
                        <p className="tracking-card__eta">
                          ETA ~ {pickup.etaMinutes || '—'} min
                        </p>
                      )}
                    </div>
                    <div className="tracking-card__driver">
                      <span className="tracking-card__avatar" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="18" height="18">
                          <path
                            fill="currentColor"
                            d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2.25c-4 0-7.5 2-7.5 4.5V21h15v-2.25c0-2.5-3.5-4.5-7.5-4.5Z"
                          />
                        </svg>
                      </span>
                      <div>
                        <strong>{driver.name || 'Driver'}</strong>
                        <span>({driver.role || 'Volunteer'})</span>
                      </div>
                    </div>
                  </div>

                  <div className="tracking-card__meta-grid">
                    <p>
                      <span>Vehicle Type</span>
                      <strong>{driver.vehicleType || 'scooter'}</strong>
                    </p>
                    <p>
                      <span>Vehicle Number</span>
                      <strong>{driver.vehicleNumber || '—'}</strong>
                    </p>
                  </div>
                </article>

                <article className="tracking-card tracking-card--item">
                  <div className="tracking-card__item-media" aria-hidden="true" />
                  <div>
                    <h3>
                      {pickup.itemLabel} ({pickup.weightKg} kg)
                    </h3>
                    <p>From {pickup.donorName}</p>
                    <span className="tracking-card__chip">Status: {pickup.status}</span>
                  </div>
                </article>

                <LiveJourney steps={journey} />

                <section className="tracking-next">
                  <h3>What&apos;s Next?</h3>
                  <p>
                    Once you reach the destination, mark the delivery complete to issue a
                    digital receipt and update your impact score.
                  </p>
                  {pickup.status === 'in_transit' ? (
                    <button
                      type="button"
                      className="tracking-next__btn"
                      onClick={handleComplete}
                      disabled={completing}
                    >
                      {completing ? 'Completing...' : 'Mark as Delivered'}
                    </button>
                  ) : (
                    <Link
                      to={`/receipt/${pickup.trackingId}`}
                      className="tracking-next__btn"
                    >
                      View digital receipt
                    </Link>
                  )}
                </section>

                <ImpactProgress
                  current={stats.impactCurrent ?? 0}
                  goal={stats.impactGoal ?? 15}
                  badge={stats.impactBadge ?? 'Community Hero'}
                />
              </aside>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
