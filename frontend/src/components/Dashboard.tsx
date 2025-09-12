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
  suggestions?: string;
  resumeName?: string;
  onBack?: () => void;
  layout?: "standalone" | "inline";
  showBack?: boolean;
}

const COLORS = ["#34d399", "#f87171"];

const Dashboard: React.FC<DashboardProps> = ({
  matchScore,
  extractedSkills,
  missingSkills,
  suggestions,
  resumeName,
  onBack,
  layout = "standalone",
  showBack = true,
}) => {
  const safeExtractedSkills = Array.isArray(extractedSkills)
    ? extractedSkills
    : [];
  const safeMissingSkills = Array.isArray(missingSkills) ? missingSkills : [];
  const skillData = [
    { name: "Matched Skills", value: safeExtractedSkills.length },
    { name: "Missing Skills", value: safeMissingSkills.length },
  ];
  const noSkills =
    safeExtractedSkills.length === 0 && safeMissingSkills.length === 0;

  // Inline layout: no outer box; professional sectioned layout
  if (layout === "inline") {
    return (
      <div className="w-full max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <div className="text-sm text-gray-500">Resume Insights</div>
            {resumeName && (
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{resumeName}</h2>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Match Score</div>
            <div
              className={`text-5xl md:text-6xl font-extrabold ${
                matchScore >= 80
                  ? "text-green-600"
                  : matchScore >= 60
                  ? "text-yellow-600"
                  : "text-rose-600"
              }`}
            >
              {matchScore}%
            </div>
          </div>
        </div>

        <hr className="border-gray-200" />

        <div className="mt-8 grid md:grid-cols-2 gap-8">
          <section>
            <h3 className="text-base font-semibold text-gray-900">Highlights</h3>
            {suggestions ? (
              <p className="mt-3 text-gray-700 leading-relaxed">{suggestions}</p>
            ) : (
              <p className="mt-3 text-gray-500">No suggestions available.</p>
            )}
          </section>

          <section>
            <h3 className="text-base font-semibold text-gray-900">Skills Overview</h3>
            {noSkills ? (
              <p className="mt-3 text-gray-500">No skill data to display.</p>
            ) : (
              <div className="mt-3 grid sm:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm font-medium text-gray-700">Matched ({safeExtractedSkills.length})</div>
                  <ul className="mt-2 list-disc list-inside text-sm text-gray-700 space-y-1">
                    {safeExtractedSkills.map((s, i) => (
                      <li key={`m-${i}`}>{s}</li>
                    ))}
                    {safeExtractedSkills.length === 0 && (
                      <li className="text-gray-400">None</li>
                    )}
                  </ul>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">Missing ({safeMissingSkills.length})</div>
                  <ul className="mt-2 list-disc list-inside text-sm text-gray-700 space-y-1">
                    {safeMissingSkills.map((s, i) => (
                      <li key={`x-${i}`}>{s}</li>
                    ))}
                    {safeMissingSkills.length === 0 && (
                      <li className="text-gray-400">None</li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Optional charts below for visual summary */}
        {!noSkills && (
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div>
              <div className="text-base font-semibold text-gray-900 mb-2">Skill Match Overview</div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={skillData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => {
                      const percent = entry.percent ?? 0;
                      return `${entry.name}: ${(percent * 100).toFixed(0)}%`;
                    }}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {skillData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <div className="text-base font-semibold text-gray-900 mb-2">Skill Count</div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart
                  data={[
                    { name: "Matched", value: safeExtractedSkills.length },
                    { name: "Missing", value: safeMissingSkills.length },
                  ]}
                >
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#60a5fa" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Standalone layout (kept with outer box)
  const content = (
    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8 border border-blue-50">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-blue-700">Resume Insights</h2>
          {resumeName && <div className="text-sm text-gray-500">{resumeName}</div>}
        </div>
        {onBack && showBack && (
          <button
            className="px-4 py-2 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold transition-all"
            onClick={onBack}
          >
            ← Back
          </button>
        )}
      </div>
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
        <div className="text-center mt-2 text-xl font-bold">
          {matchScore}%
        </div>
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
                data={skillData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => {
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
          <div className="text-gray-400 italic py-8">
            No skill data to display.
          </div>
        ) : (
          <ResponsiveContainer width="95%" height={180}>
            <BarChart
              data={[
                { name: "Matched", value: safeExtractedSkills.length },
                { name: "Missing", value: safeMissingSkills.length },
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

      {!noSkills && (
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <div className="font-semibold text-gray-700 mb-2">Matched Skills</div>
            <div className="flex flex-wrap gap-2">
              {safeExtractedSkills.map((s, i) => (
                <span key={i} className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <div className="font-semibold text-gray-700 mb-2">Missing Skills</div>
            <div className="flex flex-wrap gap-2">
              {safeMissingSkills.map((s, i) => (
                <span key={i} className="px-2 py-1 rounded-full bg-rose-100 text-rose-700 text-xs">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {suggestions && (
        <div className="mt-8 p-5 rounded-xl bg-blue-50 border border-blue-100">
          <div className="font-semibold text-blue-800 mb-2">Tailored Suggestions</div>
          <p className="text-sm text-blue-900 leading-relaxed">{suggestions}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 animate-fade-in">
      {content}
    </div>
  );
};

export default Dashboard;
