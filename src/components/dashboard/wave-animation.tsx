"use client";

export function WaveAnimation() {
  return (
    <div className="h-10 w-full mt-2">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop
              offset="0%"
              style={{ stopColor: "hsl(var(--primary))", stopOpacity: 0.7 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "hsl(var(--accent))", stopOpacity: 0.7 }}
            />
          </linearGradient>
        </defs>
        <path
          className="wave"
          fill="none"
          stroke="url(#waveGradient)"
          strokeWidth="1.5"
          d="M 0 10 Q 12.5 0, 25 10 T 50 10 T 75 10 T 100 10"
        />
        <path
          className="wave wave-delay-1"
          fill="none"
          stroke="url(#waveGradient)"
          strokeWidth="1"
          d="M 0 10 Q 12.5 20, 25 10 T 50 10 T 75 10 T 100 10"
        />
        <style jsx>{`
          .wave {
            animation: wave 2s cubic-bezier(0.45, 0, 0.55, 1) infinite;
          }
          .wave-delay-1 {
            animation-delay: -0.5s;
          }
          @keyframes wave {
            0% {
              d: path("M 0 10 Q 12.5 0, 25 10 T 50 10 T 75 10 T 100 10");
            }
            50% {
              d: path("M 0 10 Q 12.5 20, 25 10 T 50 10 T 75 10 T 100 10");
            }
            100% {
              d: path("M 0 10 Q 12.5 0, 25 10 T 50 10 T 75 10 T 100 10");
            }
          }
        `}</style>
      </svg>
    </div>
  );
}
