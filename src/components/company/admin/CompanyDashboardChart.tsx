
import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", bookings: 40, revenue: 2400 },
  { name: "Fev", bookings: 30, revenue: 1398 },
  { name: "Mar", bookings: 20, revenue: 9800 },
  { name: "Abr", bookings: 27, revenue: 3908 },
  { name: "Mai", bookings: 18, revenue: 4800 },
  { name: "Jun", bookings: 23, revenue: 3800 },
  { name: "Jul", bookings: 34, revenue: 4300 },
];

export const CompanyDashboardChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="bookings"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorBookings)"
          name="Agendamentos"
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#82ca9d"
          fillOpacity={1}
          fill="url(#colorRevenue)"
          name="Receita (R$)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
