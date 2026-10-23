type ArkaMarkProps = {
  animated?: boolean
  className?: string
}

export function ArkaMark({ animated = false, className = '' }: ArkaMarkProps) {
  return (
    <svg
      className={`arka-mark ${animated ? 'arka-mark--animated' : ''} ${className}`.trim()}
      viewBox="0 0 400 470"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="arka-mark__outline"
        d="M19 450V201C19 100 100 19 200 19s181 81 181 182v249H19"
        fill="none"
        stroke="currentColor"
        strokeWidth="27"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <g className="arka-mark__digits" fill="currentColor" fontFamily="Arial, Helvetica, sans-serif" fontSize="269" fontWeight="700">
        <text className="arka-mark__digit arka-mark__digit--1" x="50" y="426" textLength="76" lengthAdjust="spacingAndGlyphs">1</text>
        <text className="arka-mark__digit arka-mark__digit--2" x="125" y="426" textLength="112" lengthAdjust="spacingAndGlyphs">2</text>
        <text className="arka-mark__digit arka-mark__digit--3" x="235" y="426" textLength="113" lengthAdjust="spacingAndGlyphs">3</text>
      </g>
    </svg>
  )
}
