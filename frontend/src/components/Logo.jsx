import './Logo.css'

export default function Logo({ compact = false }) {
  return (
    <div className={`fl-logo${compact ? ' fl-logo--compact' : ''}`}>
      <svg
        className="fl-logo__mark"
        viewBox="0 0 48 48"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="24" cy="24" r="22" fill="currentColor" opacity="0.15" />
        <path
          d="M24 8c-6.2 0-11.2 4.4-12.5 10.2 2.1-1.6 4.7-2.5 7.5-2.5 6.6 0 12 5.4 12 12 0 2.8-.9 5.4-2.5 7.5C34.6 33.9 40 28.6 40 22c0-7.7-6.3-14-16-14Z"
          fill="currentColor"
        />
        <path
          d="M18 20h12v2.2c0 2.4-1.2 4.5-3.1 5.7l1.3 4.1h-8.4l1.3-4.1A6.7 6.7 0 0 1 18 22.2V20Zm2.2 1.8v.4c0 1.7.9 3.2 2.3 4l.5.3.5-.3a4.5 4.5 0 0 0 2.3-4v-.4h-5.6Z"
          fill="currentColor"
        />
        <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="2.5" />
      </svg>
      <div className="fl-logo__text">
        <span className="fl-logo__name">FoodLoop</span>
        {!compact && (
          <span className="fl-logo__tagline">Zero Waste. Infinite Impact.</span>
        )}
      </div>
    </div>
  )
}
