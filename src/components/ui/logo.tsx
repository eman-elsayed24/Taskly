export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <img src="/favicon.svg" alt="Taskly Logo" className="w-6 h-6" />
      <span className="text-xl font-bold text-slate-dark tracking-tight">
        TASKLY
      </span>
    </div>
  );
}
