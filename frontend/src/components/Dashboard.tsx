import React from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";

interface DashboardProps {
  extractedSkills?: string[];
  missingSkills?: string[];
  resumeName?: string;
  isDarkMode?: boolean;
  breakdown?: Record<string, number>;
}

const Dashboard: React.FC<DashboardProps> = ({
  extractedSkills = [],
  missingSkills = [],
  resumeName,
  breakdown = {},
  isDarkMode = false,
}) => {
  const primaryColor = isDarkMode ? "#fafafa" : "#18181b";
  const secondaryColor = isDarkMode ? "#f87171" : "#ef4444"; // Red color for gaps
  const gridColor = isDarkMode ? "#3f3f46" : "#e4e4e7";
  const axisTextColor = isDarkMode ? "#a1a1aa" : "#71717a";
  const COLORS = [primaryColor, secondaryColor];

  const skillData = [
    { name: "Matched Skills", value: extractedSkills.length },
    { name: "Missing Gaps", value: missingSkills.length },
  ];

  const radarData = Object.entries(breakdown).map(([key, val]) => ({
    subject: key,
    A: val,
    fullMark: 100,
  }));

  const ChartCard = ({ title, description, children, height = "h-[450px]" }: { title: string; description: string; children: React.ReactNode; height?: string }) => (
    <div className={`flex flex-col bg-white dark:bg-zinc-900/50 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm ${height} w-full relative group`}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="mb-8 flex flex-col items-start w-full">
        <h3 className="text-lg font-black tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-50"></div>
          {title}
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 ml-4 font-medium">{description}</p>
      </div>
      <div className="w-full flex-1 flex items-center justify-center">
        {children}
      </div>
    </div>
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{payload[0].name || payload[0].payload.subject}</p>
          <p className="text-lg font-black text-zinc-950 dark:text-zinc-50">{payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 sm:p-12 animate-fade-in transition-colors duration-300">
      <div className="mb-16">
        <h2 className="text-3xl font-black text-zinc-950 dark:text-zinc-50 tracking-tighter">Intelligence Breakdown</h2>
        {resumeName && <p className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-xs mt-2 opacity-70">{resumeName}</p>}
      </div>

      <div className="flex flex-col gap-10">
        {/* Radar Chart */}
        <ChartCard 
          title="Capability Profile" 
          description="Multi-dimensional breakdown of your resume against core job requirements."
          height="h-[450px]"
        >
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke={gridColor} strokeDasharray="4 4" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: axisTextColor, fontSize: 11, fontWeight: 900 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Accuracy"
                  dataKey="A"
                  stroke={primaryColor}
                  fill={primaryColor}
                  fillOpacity={0.15}
                  strokeWidth={3}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-[10px] uppercase font-black text-zinc-300">Data Missing</div>
          )}
        </ChartCard>

        {/* Bar Chart */}
        <ChartCard 
          title="Requirement Coverage" 
          description="Direct comparison of your extracted skills versus the missing gaps."
          height="h-[450px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={skillData} 
              layout="vertical" 
              margin={{ left: 60, right: 60, top: 40, bottom: 40 }}
            >
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke={axisTextColor} 
                fontSize={11} 
                fontWeight={900} 
                tickLine={false} 
                axisLine={false}
                width={100}
              />
              <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={50}>
                {skillData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Pie Chart */}
        <ChartCard 
          title="Skill Density Distribution" 
          description="Proportional analysis of your overall alignment with the job description."
          height="h-[450px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={skillData}
                cx="50%" cy="50%"
                innerRadius={75}
                outerRadius={110}
                paddingAngle={10}
                dataKey="value"
                stroke="none"
                animationBegin={200}
                animationDuration={1800}
              >
                {skillData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={50} 
                iconType="circle" 
                iconSize={10}
                wrapperStyle={{ 
                  fontSize: '11px', 
                  fontWeight: 900, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.2em', 
                  color: '#71717a',
                  paddingTop: '40px'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;
