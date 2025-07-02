import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

export default function TrendsChart({ data }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">📈 Health Trends</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["Hemoglobin", "WBC", "Platelets"].map(param => (
          <div key={param} className="bg-gray-50 p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2 text-blue-600">{param}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey={param} stroke="#1D4ED8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
}
