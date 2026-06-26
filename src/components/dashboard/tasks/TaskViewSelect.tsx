import Select from 'react-select';
import BoardViewIcon from '../../../assets/icons/boardView.svg?react';
import ListViewIcon from '../../../assets/icons/listView.svg?react';

interface TaskViewSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const TaskViewSelect: React.FC<TaskViewSelectProps> = ({ value, onChange }) => {
  const options = [
    {
      label: 'Board View',
      value: 'board',
      icon: <BoardViewIcon className="w-4 h-4 text-slate-dark" />,
    },
    {
      label: 'List View',
      value: 'list',
      icon: <ListViewIcon className="w-4 h-4 text-slate-dark" />,
    },
  ];

  return (
    <Select
      options={options}
      className="w-44"
      isSearchable={false}
      value={options.find(option => option.value === value)}
      onChange={option => option && onChange(option.value)}
      components={{
        IndicatorSeparator: () => null,
      }}
      styles={{
        control: provided => ({
          ...provided,
          backgroundColor: 'white',
          border: '1px solid var(--color-border-light)',
          boxShadow: 'var(--shadow-sm)',
          padding: '4px 8px',
          borderRadius: '8px',
          cursor: 'pointer',
        }),
        indicatorsContainer: provided => ({
          ...provided,
          color: 'var(--color-slate-dark)',
        }),
      }}
      formatOptionLabel={({ label, icon }) => (
        <div className="flex items-center gap-2">
          <span>{icon}</span>
          <span className="text-body font-medium text-slate-dark leading-5">
            {label}
          </span>
        </div>
      )}
    />
  );
};

export default TaskViewSelect;
