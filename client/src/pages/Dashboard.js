import React, { useState, useRef } from "react";
import axios from "axios";
import { parseLabReport } from "../parseLabReport";
import TrendsChart from "../components/TrendsChart";
import { dummyReports } from "../data/dummyReports";
import { useAuth } from "../context/AuthContext";
import { FiUpload, FiLogOut, FiFileText, FiUser, FiBarChart2, FiInfo, FiCheck, FiAlertTriangle } from "react-icons/fi";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [rawText, setRawText] = useState('');
  const [parsedData, setParsedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("results");
  const fileInputRef = useRef(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleUpload = async () => {
    setError("");
    if (!file) {
      setError("Please select an image file");
      return;
    }
    
    const formData = new FormData();
    formData.append("report", file);

    setLoading(true);
    setParsedData([]);
    setRawText("");

    try {
      const res = await axios.post(`${apiUrl}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setRawText(res.data.text);
      const structured = parseLabReport(res.data.text);
      setParsedData(structured);
      setActiveTab("results");
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again with a clear image.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
      setError("");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const StatusBadge = ({ status }) => {
    if (status.includes("Normal")) {
      return (
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
          <FiCheck className="mr-1" /> Normal
        </span>
      );
    } else if (status.includes("Needs")) {
      return (
        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
          <FiAlertTriangle className="mr-1" /> Needs Attention
        </span>
      );
    }
    return (
      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6 bg-white rounded-2xl shadow-sm p-4">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <FiBarChart2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Korai Health Lab Report Analyzer</h1>
              <p className="text-sm text-gray-500">Transform your lab reports into actionable insights</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="hidden md:block text-right mr-4">
              <div className="text-sm font-medium text-gray-700">{user?.email}</div>
              <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
            </div>
            <button 
              onClick={logout}
              className="flex items-center text-sm bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg transition-all"
            >
              <FiLogOut className="mr-1" /> Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 h-full">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FiUpload className="mr-2 text-blue-600" /> Upload Lab Report
              </h2>
              
              <div 
                onClick={triggerFileInput}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                  ${error ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"}`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  ref={fileInputRef}
                />
                
                <div className="mx-auto bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                  <FiFileText className="h-6 w-6 text-blue-600" />
                </div>
                
                <p className="text-sm text-gray-600 mb-1">
                  {fileName || "Click to select an image file"}
                </p>
                <p className="text-xs text-gray-500">
                  {fileName ? "Click to change file" : "Supports JPG, PNG formats"}
                </p>
                
                {fileName && (
                  <div className="mt-4 flex justify-center">
                    <div className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full flex items-center">
                      <FiCheck className="mr-1" /> File selected
                    </div>
                  </div>
                )}
              </div>
              
              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center text-sm">
                  <FiAlertTriangle className="mr-2 flex-shrink-0" /> {error}
                </div>
              )}
              
              <button
                onClick={handleUpload}
                disabled={loading || !file}
                className={`w-full mt-6 py-3.5 rounded-xl font-medium transition-all flex items-center justify-center
                  ${loading || !file 
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                    : "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-800"
                  }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <FiUpload className="mr-2" /> Analyze Report
                  </>
                )}
              </button>
              
              <div className="mt-6 bg-blue-50 rounded-xl p-4">
                <h3 className="flex items-center text-sm font-medium text-blue-800 mb-2">
                  <FiInfo className="mr-1" /> How to get the best results
                </h3>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Use clear, well-lit images of your report</li>
                  <li>• Ensure all text is visible and not cropped</li>
                  <li>• Reports should be in English for best accuracy</li>
                  <li>• Avoid blurry or distorted images</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Results Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 h-full">
              {!rawText && !loading && (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <FiFileText className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Upload a Lab Report</h3>
                  <p className="text-gray-500 max-w-md">
                    Analyze your lab reports to extract health metrics, track trends, and get insights about your health status.
                  </p>
                </div>
              )}
              
              {loading && (
                <div className="flex flex-col items-center justify-center h-full py-12">
                  <div className="animate-pulse bg-blue-100 rounded-full p-4 mb-6">
                    <FiFileText className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Processing your report...</h3>
                  <p className="text-gray-500">This may take a few moments</p>
                  <div className="w-48 h-2 bg-gray-200 rounded-full mt-6 overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full animate-progress"></div>
                  </div>
                </div>
              )}
              
              {(rawText || parsedData.length > 0) && !loading && (
                <>
                  <div className="flex border-b border-gray-200 mb-6">
                    <button
                      className={`py-2 px-4 font-medium text-sm border-b-2 transition-all ${
                        activeTab === "results"
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setActiveTab("results")}
                    >
                      Results
                    </button>
                    <button
                      className={`py-2 px-4 font-medium text-sm border-b-2 transition-all ${
                        activeTab === "rawText"
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setActiveTab("rawText")}
                    >
                      Raw Text
                    </button>
                    <button
                      className={`py-2 px-4 font-medium text-sm border-b-2 transition-all ${
                        activeTab === "trends"
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setActiveTab("trends")}
                    >
                      Trends
                    </button>
                  </div>
                  
                  {activeTab === "results" && (
                    <>
                      {parsedData.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="bg-yellow-50 inline-block p-3 rounded-full mb-4">
                            <FiAlertTriangle className="h-8 w-8 text-yellow-600" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-700 mb-2">No Data Extracted</h3>
                          <p className="text-gray-500 max-w-md mx-auto">
                            We couldn't extract any health metrics from your report. Try with a clearer image or different report format.
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Report Summary</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="bg-blue-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-blue-700">{parsedData.length}</div>
                                <div className="text-xs text-blue-600">Parameters</div>
                              </div>
                              <div className="bg-green-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-green-700">
                                  {parsedData.filter(item => item.status.includes("Normal")).length}
                                </div>
                                <div className="text-xs text-green-600">Normal Values</div>
                              </div>
                              <div className="bg-red-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-red-700">
                                  {parsedData.filter(item => item.status.includes("Needs")).length}
                                </div>
                                <div className="text-xs text-red-600">Needs Attention</div>
                              </div>
                              <div className="bg-purple-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-purple-700">
                                  {new Date().toLocaleDateString()}
                                </div>
                                <div className="text-xs text-purple-600">Report Date</div>
                              </div>
                            </div>
                          </div>
                          
                          <h2 className="text-lg font-semibold text-gray-800 mb-4">Detailed Analysis</h2>
                          <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="w-full">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameter</th>
                                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Range</th>
                                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {parsedData.map((item, index) => (
                                  <tr key={index} className="hover:bg-gray-50">
                                    <td className="p-3 text-sm font-medium text-gray-900">{item.parameter}</td>
                                    <td className="p-3 text-sm text-gray-700">
                                      <span className="font-semibold">{item.value}</span> 
                                      <span className="text-gray-500 ml-1">{item.unit}</span>
                                    </td>
                                    <td className="p-3 text-sm text-gray-500">{item.range}</td>
                                    <td className="p-3">
                                      <StatusBadge status={item.status} />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}
                    </>
                  )}
                  
                  {activeTab === "rawText" && rawText && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800 mb-4">Extracted Text</h2>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto max-h-96">
                          {rawText}
                        </pre>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === "trends" && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800 mb-4">Health Trends</h2>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <TrendsChart data={dummyReports} />
                      </div>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h3 className="font-medium text-blue-800 mb-2">Key Observations</h3>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li className="flex">
                              <FiCheck className="mr-2 mt-0.5 text-green-600 flex-shrink-0" /> 
                              Hemoglobin levels have improved 12% over the last 6 months
                            </li>
                            <li className="flex">
                              <FiCheck className="mr-2 mt-0.5 text-green-600 flex-shrink-0" /> 
                              Consistent blood sugar control
                            </li>
                            <li className="flex">
                              <FiAlertTriangle className="mr-2 mt-0.5 text-yellow-600 flex-shrink-0" /> 
                              Vitamin D levels need improvement
                            </li>
                          </ul>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                          <h3 className="font-medium text-purple-800 mb-2">Recommendations</h3>
                          <ul className="text-sm text-purple-700 space-y-1">
                            <li>• Increase Vitamin D rich foods or supplements</li>
                            <li>• Continue current exercise regimen</li>
                            <li>• Schedule follow-up in 3 months</li>
                            <li>• Monitor blood pressure weekly</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}