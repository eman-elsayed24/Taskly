interface KPICardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
  bgColorClass: string;
}

export default function KPICard({
  title,
  value,
  icon,
  colorClass,
  bgColorClass,
}: KPICardProps) {
  return (
    <div className="bg-white rounded-lg p-6 border border-border-light">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-body-sm text-slate-medium mb-2 uppercase tracking-wide">
            {title}
          </p>
          <p className={`text-4xl font-bold ${colorClass}`}>{value}</p>
        </div>
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${bgColorClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
