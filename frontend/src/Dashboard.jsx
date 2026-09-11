import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, TrendingUp, ShieldCheck } from 'lucide-react';

const branchData = [
  { name: 'Sci & Tech', placed: 85, total: 100 },
  { name: 'Comm & Mgmt', placed: 65, total: 90 },
  { name: 'Others', placed: 40, total: 60 },
];

const pieData = [
  { name: 'Placed', value: 190 },
  { name: 'Not Placed', value: 60 },
];
const COLORS = ['#10b981', '#ef4444'];

export default function Dashboard() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Placement Analytics Dashboard</h1>
        <p className="text-gray-400 mt-2">Real-time model insights and university placement trends.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex items-center gap-4">
          <div className="p-4 bg-blue-900/50 rounded-lg text-blue-400"><Users size={32} /></div>
          <div>
            <p className="text-gray-400 text-sm">Total Predictions</p>
            <p className="text-2xl font-bold text-white">250+</p>
          </div>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex items-center gap-4">
          <div className="p-4 bg-emerald-900/50 rounded-lg text-emerald-400"><TrendingUp size={32} /></div>
          <div>
            <p className="text-gray-400 text-sm">Overall Placement Rate</p>
            <p className="text-2xl font-bold text-white">76%</p>
          </div>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex items-center gap-4">
          <div className="p-4 bg-purple-900/50 rounded-lg text-purple-400"><ShieldCheck size={32} /></div>
          <div>
            <p className="text-gray-400 text-sm">Model Accuracy (CV)</p>
            <p className="text-2xl font-bold text-white">87.5%</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-6">Placement by Degree Type</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff'}} />
                <Bar dataKey="placed" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Placed Students" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-6">Model Prediction Ratio</h3>
          <div className="h-72 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}