"use client";

import AnimatedCounter from "@/components/AnimatedCounter";

export default function HeroStatCard() {
  const stats = [
    { value: <AnimatedCounter target={3} />, label: "Subjects" },
    { value: <AnimatedCounter target={2} />, label: "Languages" },
    { value: <AnimatedCounter target={8} />, label: "Grades" },
    { value: <span>Beta</span>, label: "Always Free" },
  ];

  return (
    <div className="animate-float rounded-2xl border border-white/15 bg-white/10 p-7 backdrop-blur-md w-60">
      <div className="grid grid-cols-2 gap-5">
        {stats.map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center text-center">
            <span className="text-3xl font-bold text-white">{value}</span>
            <span className="mt-1 text-xs font-medium text-white/65">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
