import { CSSProperties } from "react";

const petals = [
  { left: "5%", delay: "0s", duration: "15s", size: "0.95rem", drift: "16px" },
  { left: "18%", delay: "2.5s", duration: "18s", size: "1.15rem", drift: "-12px" },
  { left: "31%", delay: "5s", duration: "16s", size: "0.85rem", drift: "14px" },
  { left: "47%", delay: "1.2s", duration: "19s", size: "1.2rem", drift: "-16px" },
  { left: "61%", delay: "4.4s", duration: "17s", size: "0.9rem", drift: "11px" },
  { left: "74%", delay: "6.6s", duration: "20s", size: "1.05rem", drift: "-18px" },
  { left: "88%", delay: "3.5s", duration: "18.5s", size: "0.8rem", drift: "13px" },
];

export function FloatingPetals() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((petal, index) => (
        <span
          key={`${petal.left}-${index}`}
          className="wedly-petal"
          style={
            {
              "--petal-left": petal.left,
              "--petal-delay": petal.delay,
              "--petal-duration": petal.duration,
              "--petal-size": petal.size,
              "--petal-drift": petal.drift,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
