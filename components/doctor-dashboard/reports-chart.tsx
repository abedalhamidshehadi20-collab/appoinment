"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ReportsChartProps = {
  data: Array<{
    month: string;
    appointments: number;
    completed: number;
  }>;
};

export function ReportsChart({ data }: ReportsChartProps) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="appointmentsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2377e7" stopOpacity={0.32} />
              <stop offset="95%" stopColor="#2377e7" stopOpacity={0.03} />
            </linearGradient>
            <linearGradient id="completedFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.26} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#edf2f7" strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#7890ad", fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: "#7890ad", fontSize: 12 }} />
          <Tooltip />
          <Area type="monotone" dataKey="appointments" stroke="#2377e7" fill="url(#appointmentsFill)" strokeWidth={2} />
          <Area type="monotone" dataKey="completed" stroke="#22c55e" fill="url(#completedFill)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
