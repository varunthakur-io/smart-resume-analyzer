import React from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from "recharts";

interface DashboardProps {
  matchScore: number;
  extractedSkills?: string[];
  missingSkills?: string[];
  suggestions?: string;
  resumeName?: string;
  onBack?: () => void;
}

const COLORS = ["#10b981", "#f43f5e"];

const Dashboard: React.FC<DashboardProps> = ({
  matchScore,
  extractedSkills = [],
  missingSkills = [],
  suggestions,
  resumeName,
  onBack
}) => {
  const skillData = [
    { name: "Matched", value: extractedSkills.length },
    { name: "Missing", value: missingSkills.length },
  ];

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-10 animate-fade-in transition-colors duration-300">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Analytics Dashboard</h2>
          {resumeName && <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">{resumeName}</p>}
        </div>
        {onBack && (
          <button
            className="px-6 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 transition-all"
            onClick={onBack}
          >
            Close Dashboard
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Pie Chart */}
        <div className="flex flex-col items-center">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6">Skill Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={skillData}
                cx="50%" cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {skillData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="flex flex-col items-center">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6">Skill Readiness</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillData} layout="vertical" margin={{ left: 20, right: 40 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} fontWeight="bold" />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="value" fill="#6366f1" radius={[0, 10, 10, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {suggestions && (
        <div className="mt-12 p-8 rounded-3xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30">
          <h4 className="text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest text-xs mb-4">Strategic Advice</h4>
          <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{suggestions}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
