import Select from 'react-select';
import { TASK_STATUS_LABELS } from '../../../../types/task';

interface TaskStatusSelectProps {
  value: string;
  onChange: (value: string) => void;
  isDisabled?: boolean;
}

const statusOptions = Object.entries(TASK_STATUS_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  })
);

const TaskStatusSelect: React.FC<TaskStatusSelectProps> = ({
  value,
  onChange,
  isDisabled = false,
}) => {
  return (
    <Select
      value={statusOptions.find(opt => opt.value === value)}
      onChange={option => option && onChange(option.value)}
      options={statusOptions}
      isSearchable={false}
      isDisabled={isDisabled}
      components={{
        IndicatorSeparator: () => null,
      }}
      styles={{
        control: provided => ({
          ...provided,
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: 'none',
          padding: '4px 8px',
          borderRadius: '8px',
          cursor: 'pointer',
          minHeight: '36px',
        }),
        dropdownIndicator: provided => ({
          ...provided,
          color: 'inherit',
          padding: '0 4px',
        }),
        singleValue: provided => ({
          ...provided,
          margin: 0,
          color: 'inherit',
          fontWeight: 700,
          fontSize: '12px',
          textTransform: 'uppercase' as const,
        }),
        // Fix dropdown menu colors
        menu: provided => ({
          ...provided,
          backgroundColor: '#ffffff',
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isFocused ? '#f1f5f9' : '#ffffff',
          color: '#1e293b', // slate-dark color
          cursor: 'pointer',
          fontWeight: state.isSelected ? 700 : 400,
          fontSize: '14px',
          ':active': {
            backgroundColor: '#e2e8f0',
          },
        }),
      }}
    />
  );
};

export default TaskStatusSelect;
