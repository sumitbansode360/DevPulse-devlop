// Barchart.tsx
"use client";
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type WeeklyActivity = {
  name: string;
  push: number;
  pr: number;
  issues: number;
};
interface BarChartProps {
  weeklyActivity: WeeklyActivity[];
}
const Example = ({ weeklyActivity }: BarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={weeklyActivity}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="push" fill="#8884d8" />
        <Bar dataKey="pr" fill="#82ca9d" />
        <Bar dataKey="issues" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Example;
