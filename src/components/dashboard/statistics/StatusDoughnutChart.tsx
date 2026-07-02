import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import type { StatusTotals } from '../../../types/statistics';
import { TASK_STATUS_LABELS, TaskStatus } from '../../../types/task';

interface StatusDoughnutChartProps {
  totals: StatusTotals;
  totalTasks: number;
}

const STATUS_COLORS: Record<string, string> = {
  TO_DO: '#64748B',
  IN_PROGRESS: '#3B82F6',
  BLOCKED: '#EF4444',
  IN_REVIEW: '#EAB308',
  REOPENED: '#F97316',
  READY_FOR_QA: '#A855F7',
  READY_FOR_PRODUCTION: '#14B8A6',
  DONE: '#10B981',
};

export default function StatusDoughnutChart({
  totals,
  totalTasks,
}: StatusDoughnutChartProps) {
  const chartData = Object.entries(totals).map(([status, count]) => ({
    name: TASK_STATUS_LABELS[status as TaskStatus] || status,
    value: count,
    color: STATUS_COLORS[status] || '#94A3B8',
  }));

  return (
    <div className="bg-white rounded-lg p-6 border border-border-light">
      <h3 className="text-heading-md text-slate-dark mb-6">Tasks by Status</h3>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-body-md text-slate-medium">No data available</p>
        </div>
      ) : (
        <div className="relative">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry: any) => (
                  <span className="text-body-sm text-slate-dark">
                    {value}: {entry.payload.value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <p className="text-3xl font-bold text-slate-dark">{totalTasks}</p>
            <p className="text-body-sm text-slate-medium">Total Tasks</p>
          </div>
        </div>
      )}
    </div>
  );
}
