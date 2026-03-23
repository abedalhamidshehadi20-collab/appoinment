"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const appointmentData = [
  { month: "Jan", appointments: 65, revenue: 3200 },
  { month: "Feb", appointments: 78, revenue: 3900 },
  { month: "Mar", appointments: 90, revenue: 4500 },
  { month: "Apr", appointments: 81, revenue: 4050 },
  { month: "May", appointments: 95, revenue: 4750 },
  { month: "Jun", appointments: 110, revenue: 5500 },
  { month: "Jul", appointments: 102, revenue: 5100 },
  { month: "Aug", appointments: 120, revenue: 6000 },
  { month: "Sep", appointments: 115, revenue: 5750 },
  { month: "Oct", appointments: 130, revenue: 6500 },
  { month: "Nov", appointments: 125, revenue: 6250 },
  { month: "Dec", appointments: 140, revenue: 7000 },
];

const doctorData = [
  { name: "Dr. Smith", appointments: 45 },
  { name: "Dr. Johnson", appointments: 38 },
  { name: "Dr. Williams", appointments: 52 },
  { name: "Dr. Brown", appointments: 31 },
  { name: "Dr. Davis", appointments: 42 },
];

const statusData = [
  { name: "Completed", value: 65, color: "#22c55e" },
  { name: "Scheduled", value: 25, color: "#3b82f6" },
  { name: "Cancelled", value: 10, color: "#ef4444" },
];

export function AppointmentsLineChart() {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Appointments Overview</h3>
        <select className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 outline-none">
          <option>This Year</option>
          <option>Last Year</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={appointmentData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} />
          <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          <Line
            type="monotone"
            dataKey="appointments"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "#3b82f6" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DoctorBarChart() {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Appointments by Doctor</h3>
        <select className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 outline-none">
          <option>This Month</option>
          <option>Last Month</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={doctorData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={true} vertical={false} />
          <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 12 }} />
          <YAxis dataKey="name" type="category" tick={{ fill: "#6b7280", fontSize: 12 }} width={100} />
          <Tooltip
            contentStyle={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          <Bar dataKey="appointments" fill="#8b5cf6" radius={[0, 6, 6, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StatusPieChart() {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Appointments by Status</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={statusData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
          >
            {statusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 flex justify-center gap-6">
        {statusData.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></div>
            <span className="text-sm text-gray-600">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
