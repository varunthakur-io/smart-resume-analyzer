import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface DashboardProps {
  matchScore: number;
  extractedSkills?: string[];
  missingSkills?: string[];
  onBack?: () => void;
}

const COLORS = ["#34d399", "#f87171"];

const Dashboard: React.FC<DashboardProps> = ({
  matchScore,
  extractedSkills = [],
  missingSkills = [],
  onBack,
}) => {
  // Pie data for skills
  const skillData = [
    { name: "Matched Skills", value: extractedSkills.length },
    { name: "Missing Skills", value: missingSkills.length },
  ];

  const noSkills = extractedSkills.length === 0 && missingSkills.length === 0;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 animate-fade-in">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Visual Analytics Dashboard
        </h2>

        {onBack && (
          <button
            className="mb-6 px-4 py-2 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold transition-all"
            onClick={onBack}
          >
            ← Back to Result
          </button>
        )}

      {/* Match Score Gauge (Bar) */}
      <div className="mb-8">
        <div className="text-lg font-semibold mb-2">Match Score</div>
        <div className="w-full bg-gray-200 rounded-full h-6">
          <div
            className={`h-6 rounded-full ${
              matchScore >= 80
                ? "bg-green-400"
                : matchScore >= 60
                ? "bg-yellow-400"
                : "bg-red-400"
            }`}
            style={{ width: `${matchScore}%`, transition: "width 1s" }}
          ></div>
        </div>
        <div className="text-center mt-2 text-xl font-bold">{matchScore}%</div>
      </div>

      {/* Skills Pie Chart */}
      <div className="mb-8 flex flex-col items-center">
        <div className="text-lg font-semibold mb-2">Skill Match Overview</div>
        {noSkills ? (
          <div className="text-gray-400 italic py-8">
            No skill data to display.
          </div>
        ) : (
          <ResponsiveContainer width="95%" height={220}>
            <PieChart>
              <Pie
                  {/* Match Score Gauge (Bar) */}
                  <div className="mb-8">
                    <div className="text-lg font-semibold mb-2">Match Score</div>
                    <div className="w-full bg-gray-200 rounded-full h-6">
                      <div
                        className={`h-6 rounded-full ${
                          matchScore >= 80
                            ? "bg-green-400"
                            : matchScore >= 60
                            ? "bg-yellow-400"
                            : "bg-red-400"
                        }`}
                        style={{ width: `${matchScore}%`, transition: "width 1s" }}
                      ></div>
                    </div>
                    <div className="text-center mt-2 text-xl font-bold">{matchScore}%</div>
                  </div>

                  {/* Skills Pie Chart */}
                  <div className="mb-8 flex flex-col items-center">
                    <div className="text-lg font-semibold mb-2">Skill Match Overview</div>
                    {noSkills ? (
                      <div className="text-gray-400 italic py-8">No skill data to display.</div>
                    ) : (
                      <ResponsiveContainer width="95%" height={220}>
                        <PieChart>
                          <Pie
                            data={skillData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry) => {
                              // entry: { name, value, ... }, percent is not typed by default
                              // @ts-ignore
                              const percent = entry.percent ?? 0;
                              return `${entry.name}: ${(percent * 100).toFixed(0)}%`;
                            }}
                            outerRadius={80}
                            dataKey="value"
                          >
                            {skillData.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* Skills Bar Chart */}
                  <div className="mb-4">
                    <div className="text-lg font-semibold mb-2">Skill Count</div>
                    {noSkills ? (
                      <div className="text-gray-400 italic py-8">No skill data to display.</div>
                    ) : (
                      <ResponsiveContainer width="95%" height={180}>
                        <BarChart
                          data={[
                            { name: "Matched", value: extractedSkills.length },
                            { name: "Missing", value: missingSkills.length },
                          ]}
                        >
                          <XAxis dataKey="name" />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Bar dataKey="value" fill="#60a5fa" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>
            );
