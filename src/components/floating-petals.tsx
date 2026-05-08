import { CSSProperties } from "react";

const petals = [
  { left: "4%", delay: "0s", duration: "11.5s", size: "0.92rem", drift: "18px" },
  { left: "11%", delay: "1.2s", duration: "13.5s", size: "0.82rem", drift: "-14px" },
  { left: "18%", delay: "2.1s", duration: "12.4s", size: "1.12rem", drift: "16px" },
  { left: "26%", delay: "3.8s", duration: "14.1s", size: "0.88rem", drift: "-11px" },
  { left: "34%", delay: "0.8s", duration: "12.8s", size: "1rem", drift: "19px" },
  { left: "43%", delay: "2.7s", duration: "15.2s", size: "1.16rem", drift: "-17px" },
  { left: "51%", delay: "4.1s", duration: "11.9s", size: "0.86rem", drift: "13px" },
  { left: "59%", delay: "1.7s", duration: "13.9s", size: "0.96rem", drift: "-16px" },
  { left: "67%", delay: "3.4s", duration: "12.2s", size: "1.08rem", drift: "15px" },
  { left: "76%", delay: "5.1s", duration: "14.8s", size: "0.9rem", drift: "-18px" },
  { left: "85%", delay: "2.4s", duration: "13.1s", size: "1.03rem", drift: "12px" },
  { left: "92%", delay: "4.8s", duration: "12.6s", size: "0.84rem", drift: "-13px" },
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
