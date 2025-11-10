import type { Option } from '@/types';
import type { SingleValue } from 'react-select';
import { useMemo } from 'react';
import CreatableSelect from 'react-select/creatable';
import { Appearance, useAppearance } from '@/hooks/use-appearance';

type CreatableSelectWrapperProps<T> = {
    options: T[];
    value: Option | null;
    onChange: (value: Option | null) => void;
    getOptionLabel: (option: T) => string;
    getOptionValue: (option: T) => string;
    ref?: any;
};

export default function CreatableSelectWrapper<T>({ options: rawOptions, value, onChange, getOptionLabel, getOptionValue, ref }: CreatableSelectWrapperProps<T>) {

    const { appearance, updateAppearance } = useAppearance();

    const options = useMemo<Option[]>(
        () =>
            rawOptions.map(o => ({
                label: getOptionLabel(o),
                value: getOptionValue(o),
            })),
        [rawOptions, getOptionLabel, getOptionValue]
    );

    const handleChange = (option: SingleValue<Option>) => {
        onChange(option);
    };

    return (
        <CreatableSelect
            isClearable
            options={options}
            onChange={handleChange}
            value={value}
            ref={ref}
            placeholder="Create or select a task..."
            theme={(theme) => ({
                ...theme,
                borderRadius: 8,
                colors: {
                    ...theme.colors,
                    primary25: '#f87805',
                    primary: '#dedde3',
                },
            })}
            styles={{
                option: (base, state) => ({
                    ...base,
                    fontSize: '.875rem',
                    backgroundColor: state.isSelected
                        ? '#f87805'
                        : state.isFocused
                            ? '#f87805'
                            : appearance === 'dark' ? '#171717' : 'white',
                    color: state.isSelected || state.isFocused ? 'white' :
                        appearance === 'dark' ? 'white' : 'black',
                }),
                control: (base) => ({
                    ...base,
                    fontSize: '.875rem',
                    minHeight: '2.75rem',
                    height: '2.75rem',
                    backgroundColor: appearance === 'dark' ? 'transparent' : 'white',
                    borderColor: appearance === 'dark' ? '#717171' : '#e5e5e5',
                }),
                singleValue: (base) => ({
                    ...base,
                    color: appearance === 'dark' ? 'white' : 'black',
                }),
                menu: (base) => ({
                    ...base,
                    backgroundColor: appearance === 'dark' ? 'transparent' : 'white',
                    borderRadius: 8,
                }),
                menuList: (base) => ({
                    ...base,
                    backgroundColor: appearance === 'dark' ? 'transparent' : 'white',
                    padding: 0,
                }),
            }}
        />
    );
}