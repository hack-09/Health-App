import React, { useState } from "react";
import axios from "axios";
import { parseLabReport } from "../parseLabReport";
import TrendsChart from "../components/TrendsChart";
import { dummyReports } from "../data/dummyReports";
import { useAuth } from "../context/AuthContext";
import ErrorHandle from "../components/ErrorHandle";


export default function Dashboard() {
  const { user, logout } = useAuth();

  const [file, setFile] = useState(null);
  const [rawText, setRawText] = useState('');
  const [parsedData, setParsedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("")

  const apiUrl = process.env.REACT_APP_API_URL;

  const handleUpload = async () => {
    setError("");
    if (!file) return alert("Please select an image file");
    const formData = new FormData();
    formData.append("report", file);

    setLoading(true);

    try {
      const res = await axios.post(`${apiUrl}/upload`, formData);
      setRawText(res.data.text);
      const structured = parseLabReport(res.data.text);
      setParsedData(structured);
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-4 text-right text-sm text-gray-500">
        Logged in as: <strong>{user?.email}</strong> ({user?.role}) |
        <button onClick={logout} className="ml-2 text-blue-600 underline">Logout</button>
      </div>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-xl transition-all duration-500">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">Korai Health Lab Report Analyzer</h1>

        {error && ErrorHandle(error)}
        <div className="flex items-center gap-4 mb-6">
          <input
            type="file"
            accept="image/*"
            onChange={e => setFile(e.target.files[0])}
            className="w-full border border-gray-300 p-2 rounded"
          />

          <button
            onClick={handleUpload}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            Analyze
          </button>
        </div>

        {loading && (
          <div className="text-center text-blue-600 font-semibold my-4">
            ⏳ Analyzing Report...
          </div>
        )}

        {!loading && parsedData.length === 0 && rawText && (
          <div className="text-center text-gray-500 italic mt-4">
            ⚠️ No health data was extracted from the report.
          </div>
        )}

        {rawText && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Extracted Text:</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto mt-2">{rawText}</pre>
          </div>
        )}

        {parsedData.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Parsed Lab Report</h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse border border-gray-300 rounded">
                <thead>
                  <tr className="bg-blue-100 text-left">
                    <th className="p-2 border">Parameter</th>
                    <th className="p-2 border">Value</th>
                    <th className="p-2 border">Unit</th>
                    <th className="p-2 border">Normal Range</th>
                    <th className="p-2 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-2 border">{item.parameter}</td>
                      <td className="p-2 border">{item.value}</td>
                      <td className="p-2 border">{item.unit}</td>
                      <td className="p-2 border">{item.range}</td>
                      <td className={`p-2 border font-semibold ${item.status.includes("Needs") ? 'text-red-600' : 'text-green-600'}`}>
                        {item.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <TrendsChart data={dummyReports} />

            </div>

          </div>
        )}
      </div>
    </div>
  );
}
