// Barchart.tsx
"use client";
import React from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', push: 4, pr: 2, issues: 1 },
  { name: 'Tue', push: 3, pr: 1, issues: 0 },
  { name: 'Wed', push: 5, pr: 0, issues: 2 },
  { name: 'Thu', push: 2, pr: 1, issues: 1 },
  { name: 'Fri', push: 6, pr: 3, issues: 2 },
  { name: 'Sat', push: 1, pr: 0, issues: 0 },
  { name: 'Sun', push: 0, pr: 1, issues: 1 },
];

const Example = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="push" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
        <Bar dataKey="pr" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
        <Bar dataKey="issues" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Example;
