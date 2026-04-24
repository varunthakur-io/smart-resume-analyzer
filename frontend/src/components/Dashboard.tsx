import React from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";

interface DashboardProps {
  matchScore: number;
  extractedSkills?: string[];
  missingSkills?: string[];
  suggestions?: string;
  resumeName?: string;
  onBack?: () => void;
  breakdown?: Record<string, number>;
}

const COLORS = ["#10b981", "#f43f5e"];

const Dashboard: React.FC<DashboardProps> = ({
  matchScore,
  extractedSkills = [],
  missingSkills = [],
  suggestions,
  resumeName,
  onBack,
  breakdown = {}
}) => {
  const skillData = [
    { name: "Matched", value: extractedSkills.length },
    { name: "Missing", value: missingSkills.length },
  ];

  // Map breakdown object to RadarChart format: [{ subject: 'Semantic', A: 85, fullMark: 100 }]
  const radarData = Object.entries(breakdown).map(([key, val]) => ({
    subject: key,
    A: val,
    fullMark: 100,
  }));

  // Reusable card wrapper component (DRY)
  const ChartCard = ({ title, children, subtitle }: { title: string; children: React.ReactNode; subtitle?: string }) => (
    <div className="flex flex-col items-center bg-slate-50/50 dark:bg-slate-800/30 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-inner h-full">
      <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-2">{title}</h3>
      {subtitle && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-6">{subtitle}</p>}
      <div className="w-full h-[300px]">
        {children}
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800">
          <p className="font-black text-slate-900 dark:text-white mb-1">{payload[0].name || payload[0].payload.subject}</p>
          <p className="font-bold text-indigo-600 dark:text-indigo-400">{payload[0].value}% Accuracy</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-10 animate-fade-in transition-colors duration-300">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Next-Gen Analytics</h2>
          {resumeName && <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">{resumeName}</p>}
        </div>
        {onBack && (
          <button
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black text-sm hover:bg-slate-200 transition-all active:scale-95"
            onClick={onBack}
          >
            Hide Intelligence View
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Radar Chart: Match Profile */}
        <ChartCard title="Intelligence Profile" subtitle="Multidimensional Match Analysis">
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#94a3b8" strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 12, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Match"
                  dataKey="A"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.4}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 italic">No breakdown data available.</div>
          )}
        </ChartCard>

        {/* Bar Chart: Distribution */}
        <ChartCard title="Skill Readiness" subtitle="Matched vs Missing Requirements">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={skillData} layout="vertical" margin={{ left: 20, right: 40 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} fontWeight="bold" />
              <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#6366f1" radius={[0, 10, 10, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Pie Chart: Skill Mix */}
        <div className="lg:col-span-2">
          <ChartCard title="Skill Gap Density" subtitle="Overall keyword coverage">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={skillData}
                  cx="50%" cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {skillData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)' }} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {suggestions && (
        <div className="mt-12 p-8 rounded-[2rem] bg-indigo-600 shadow-2xl shadow-indigo-500/30 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:rotate-12 transition-transform">
            <svg className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h4 className="text-white/80 font-black uppercase tracking-[0.3em] text-xs mb-4">Strategic AI Intelligence</h4>
          <p className="text-xl font-medium leading-relaxed relative z-10">{suggestions}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
