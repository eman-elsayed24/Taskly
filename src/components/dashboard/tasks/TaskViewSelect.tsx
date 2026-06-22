import Select, { components } from 'react-select';
import BoardViewIcon from '../../../assets/icons/boardView.svg?react';
import ListViewIcon from '../../../assets/icons/listView.svg?react';

interface ViewOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface TaskViewSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const TaskViewSelect: React.FC<TaskViewSelectProps> = ({ value, onChange }) => {
  const options: ViewOption[] = [
    {
      value: 'board',
      label: 'Board View',
      icon: <BoardViewIcon className="w-4 h-4 text-slate-dark" />,
    },
    {
      value: 'list',
      label: 'List View',
      icon: <ListViewIcon className="w-4 h-4 text-slate-dark" />,
    },
  ];

  const selectedOption =
    options.find(option => option.value === value) || options[0];

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: 'white',
      border: '1px solid rgba(195, 198, 214, 0.2)',
      boxShadow: state.isFocused
        ? '0 0 0 2px rgba(0, 61, 182, 0.1)'
        : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      padding: '4px 8px',
      borderRadius: '8px',
      minWidth: '176px',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'rgba(241, 245, 255, 0.5)',
      },
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: '#04183c',
      padding: '0',
      transition: 'transform 0.2s',
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0)',
    }),
    menu: provided => ({
      ...provided,
      border: '1px solid rgba(195, 198, 214, 0.2)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      overflow: 'hidden',
      marginTop: '8px',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? 'rgba(241, 245, 255, 1)'
        : state.isFocused
          ? 'rgba(241, 245, 255, 0.5)'
          : 'white',
      color: '#04183c',
      cursor: 'pointer',
      padding: '12px 16px',
      fontWeight: 500,
      fontSize: '15px',
      lineHeight: '22.5px',
      '&:active': {
        backgroundColor: 'rgba(241, 245, 255, 1)',
      },
    }),
    valueContainer: provided => ({
      ...provided,
      padding: '0',
      gap: '8px',
    }),
    singleValue: provided => ({
      ...provided,
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }),
  };

  const formatOptionLabel = (option: ViewOption) => (
    <div className="flex items-center gap-2">
      {option.icon}
      <span className="text-body font-medium text-slate-dark leading-5">
        {option.label}
      </span>
    </div>
  );

  return (
    <Select
      value={selectedOption}
      onChange={option => option && onChange(option.value)}
      options={options}
      styles={customStyles}
      isSearchable={false}
      formatOptionLabel={formatOptionLabel}
      components={{
        DropdownIndicator: props => (
          <components.DropdownIndicator {...props}>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </components.DropdownIndicator>
        ),
      }}
    />
  );
};

export default TaskViewSelect;
