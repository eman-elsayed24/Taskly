import { useState, useRef, useEffect } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import 'react-day-picker/style.css';
import Button from '../../ui/button';
import ArrowIcon from '../../../assets/icons/arrow.svg?react';
import toast from 'react-hot-toast';
import { getDaysDifference } from '../../../utils/dateUtils';

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onApply: (start: Date, end: Date) => void;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onApply,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>({
    from: startDate,
    to: endDate,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const formatDateRange = () => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    return `${months[startDate.getMonth()]} ${startDate.getDate()} - ${months[endDate.getMonth()]} ${endDate.getDate()}, ${endDate.getFullYear()}`;
  };

  const handleRangeSelect = (range: DateRange | undefined) => {
    if (!range) {
      setSelectedRange(undefined);
      return;
    }

    if (range.from && !range.to) {
      setSelectedRange(range);
      return;
    }

    if (range.from && range.to) {
      const daysDiff = getDaysDifference(range.from, range.to);

      if (daysDiff > 7) {
        toast.error('Date range cannot exceed 7 days');
        return;
      }

      setSelectedRange(range);
    }
  };

  const handleApply = () => {
    if (!selectedRange?.from || !selectedRange?.to) {
      toast.error('Please select both start and end dates');
      return;
    }

    onApply(selectedRange.from, selectedRange.to);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setSelectedRange({ from: startDate, to: endDate });
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        handleCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const disabledDays = (day: Date) => {
    if (!selectedRange?.from || selectedRange?.to) return false;

    const daysDiff = getDaysDifference(selectedRange.from, day);
    return daysDiff > 7;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-surface-low transition-colors"
      >
        <ArrowIcon className="w-4 h-4 text-slate-dark rotate-90" />
        <span className="text-lg font-semibold text-slate-dark">
          {formatDateRange()}
        </span>
        <ArrowIcon className="w-4 h-4 text-slate-dark -rotate-90" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-border-light p-6 z-50">
          <DayPicker
            mode="range"
            selected={selectedRange}
            onSelect={handleRangeSelect}
            disabled={disabledDays}
            numberOfMonths={1}
            showOutsideDays={false}
          />

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border-light">
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleApply}>
              Apply Range
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
