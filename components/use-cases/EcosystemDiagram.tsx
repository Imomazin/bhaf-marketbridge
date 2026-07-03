/**
 * Animated SVG ecosystem diagram for the Use Cases hero. Four nodes
 * (Entrepreneur · Marketplace/RFP · Data Room · Funder/Buyer) connected
 * by flowing paths with travelling dots — communicates the platform's
 * value flow without screenshots. Pure CSS animation, no JS.
 */
export function EcosystemDiagram() {
  return (
    <div
      className="relative aspect-[4/5] w-full max-w-md overflow-visible md:aspect-[5/6]"
      role="img"
      aria-label="MarketBridge ecosystem diagram: entrepreneur to marketplace to data room to funder, with impact evidence flowing back."
    >
      <svg
        viewBox="0 0 400 480"
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="ec-path" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4a73a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#d4a73a" stopOpacity="0.2" />
          </linearGradient>
          <radialGradient id="ec-node-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(212,167,58,0.55)" />
            <stop offset="100%" stopColor="rgba(212,167,58,0)" />
          </radialGradient>
        </defs>

        {/* connecting paths */}
        <g fill="none" stroke="url(#ec-path)" strokeWidth="1.4" strokeLinecap="round">
          <path id="ec-p1" d="M90 90 C 180 110, 240 130, 310 150" strokeDasharray="3 5" />
          <path id="ec-p2" d="M310 150 C 290 220, 230 250, 200 290" strokeDasharray="3 5" />
          <path id="ec-p3" d="M200 290 C 170 340, 140 370, 90 400" strokeDasharray="3 5" />
          <path id="ec-p4" d="M90 400 C 160 420, 240 430, 310 410" strokeDasharray="3 5" />
          {/* return loop from funder back to entrepreneur (impact evidence) */}
          <path
            id="ec-p5"
            d="M310 410 C 360 320, 360 180, 310 150"
            strokeDasharray="2 6"
            opacity="0.5"
          />
        </g>

        {/* travelling dots — pure CSS via SMIL animateMotion */}
        {[
          { path: "#ec-p1", dur: "5s" },
          { path: "#ec-p2", dur: "4.5s" },
          { path: "#ec-p3", dur: "5.2s" },
          { path: "#ec-p4", dur: "4.8s" },
        ].map((p, i) => (
          <circle key={i} r="3" fill="#fff8ea" opacity="0.95">
            <animateMotion
              dur={p.dur}
              repeatCount="indefinite"
              rotate="auto"
              begin={`${i * 0.6}s`}
            >
              <mpath href={p.path} />
            </animateMotion>
          </circle>
        ))}

        {/* nodes */}
        <Node x={90} y={90} label="Entrepreneur" sub="Verified profile" dotColor="#5fa05a" />
        <Node x={310} y={150} label="Marketplace · RFP" sub="Visibility & demand" dotColor="#d4a73a" />
        <Node x={200} y={290} label="Data room" sub="Evidence shared" dotColor="#5b8def" />
        <Node x={90} y={400} label="Funder · Buyer" sub="Decision & trust" dotColor="#f0e3c1" />
        <Node
          x={310}
          y={410}
          label="Impact reporting"
          sub="Donor-ready"
          dotColor="#d4a73a"
          mini
        />
      </svg>
    </div>
  );
}

function Node({
  x,
  y,
  label,
  sub,
  dotColor,
  mini = false,
}: {
  x: number;
  y: number;
  label: string;
  sub: string;
  dotColor: string;
  mini?: boolean;
}) {
  const size = mini ? 7 : 10;
  return (
    <g>
      {/* soft glow */}
      <circle cx={x} cy={y} r={mini ? 22 : 30} fill="url(#ec-node-glow)" />
      {/* node ring */}
      <circle
        cx={x}
        cy={y}
        r={size + 4}
        fill="rgba(255,255,255,0.06)"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1"
      />
      <circle cx={x} cy={y} r={size} fill={dotColor}>
        <animate
          attributeName="opacity"
          values="0.7;1;0.7"
          dur="3.6s"
          repeatCount="indefinite"
        />
      </circle>
      <g transform={`translate(${x + 18}, ${y - 4})`}>
        <text
          fontSize={mini ? 10 : 12}
          fontWeight="600"
          fill="#fff8ea"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          {label}
        </text>
        <text
          y={mini ? 11 : 14}
          fontSize="9"
          fill="#d4a73a"
          letterSpacing="1.2"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          {sub.toUpperCase()}
        </text>
      </g>
    </g>
  );
}
