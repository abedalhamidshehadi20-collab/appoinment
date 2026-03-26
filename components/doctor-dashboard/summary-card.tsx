import type { LucideIcon } from "lucide-react";

type SummaryCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone: "blue" | "green" | "amber" | "rose";
};

const toneMap = {
  blue: {
    icon: "bg-[#e8f1ff] text-[#2f6fdf]",
    value: "text-[#17488a]",
  },
  green: {
    icon: "bg-[#eaf8ef] text-[#21824a]",
    value: "text-[#1d5a36]",
  },
  amber: {
    icon: "bg-[#fff3dc] text-[#c78818]",
    value: "text-[#9a6812]",
  },
  rose: {
    icon: "bg-[#ffe9ec] text-[#c2415b]",
    value: "text-[#9d2945]",
  },
} as const;

export function SummaryCard({
  label,
  value,
  hint,
  icon: Icon,
  tone,
}: SummaryCardProps) {
  const styles = toneMap[tone];

  return (
    <article className="rounded-[24px] border border-[#e7edf5] bg-white px-5 py-5 shadow-[0_12px_28px_-24px_rgba(15,23,42,0.22)]">
      <div className="flex items-center gap-4">
        <div className={`rounded-[18px] p-3 ${styles.icon}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-[#7a8799]">{label}</p>
          <p className={`mt-1 text-3xl font-extrabold ${styles.value}`}>{value}</p>
          {hint ? <p className="mt-1 text-xs text-[#94a0b0]">{hint}</p> : null}
        </div>
      </div>
    </article>
  );
}
