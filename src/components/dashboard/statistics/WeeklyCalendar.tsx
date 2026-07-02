import type { DailyStats } from '../../../types/statistics';
import { formatDayMonth } from '../../../utils/dateUtils';
import { getStatusBadgeStyle } from '../../../constants/taskStyles';
import { TASK_STATUS_LABELS, TaskStatus } from '../../../types/task';
import EmptyTasksIcon from '../../../assets/icons/emptyTasks.svg?react';

interface WeeklyCalendarProps {
  dailyStats: DailyStats[];
}

export default function WeeklyCalendar({ dailyStats }: WeeklyCalendarProps) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-lg p-6 border border-border-light">
      <h3 className="text-heading-md text-slate-dark mb-6">Weekly Planner</h3>

      <div className="grid grid-cols-7 gap-3">
        {dailyStats.map(day => {
          const hasNoTasks =
            !day.statuses || Object.keys(day.statuses).length === 0;
          const isToday = day.day === today;
          const dayParts = formatDayMonth(day.day).split(',');
          const dayName = dayParts[0].trim().toUpperCase();
          const dateStr = dayParts[1]?.trim();

          return (
            <div key={day.day} className="flex flex-col items-center">
              <div className="text-center mb-3">
                <p className="text-xs font-medium text-slate-medium mb-1">
                  {dayName}
                </p>
                <p className="text-lg font-bold text-slate-dark">{dateStr}</p>
              </div>

              <div
                className={`w-full min-h-[400px] rounded-lg p-3 border-2 ${
                  isToday
                    ? 'border-primary bg-primary/5'
                    : 'border-border-light bg-white'
                } transition-all`}
              >
                {isToday && (
                  <div className="mb-3 flex justify-center">
                    <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase">
                      Today
                    </span>
                  </div>
                )}

                <div className="space-y-2">
                  {hasNoTasks ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <EmptyTasksIcon className="w-12 h-12 text-slate-light mb-2" />
                      <p className="text-xs text-slate-medium uppercase tracking-wide">
                        No Tasks
                      </p>
                    </div>
                  ) : (
                    Object.entries(day.statuses).map(([status, count]) => (
                      <div
                        key={status}
                        className={`px-3 py-2 rounded text-xs font-medium ${getStatusBadgeStyle(status)}`}
                      >
                        <div className="flex flex-col">
                          <span className="truncate uppercase tracking-wide">
                            {TASK_STATUS_LABELS[status as TaskStatus]
                              ?.replace(/\s+/g, ' ')
                              .trim() || status}
                          </span>
                          <span className="text-base font-bold mt-1">
                            {count}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
