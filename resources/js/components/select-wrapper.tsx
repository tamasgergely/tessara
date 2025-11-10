import { useMemo } from 'react';
import { type Option } from '@/types';
import Select from 'react-select';
import { Appearance, useAppearance } from '@/hooks/use-appearance';

type SelectWrapperProps<T> = {
    options: T[];
    value: T | null;
    onChange: (value: T | null) => void;
    getOptionLabel: (option: T) => string;
    getOptionValue: (option: T) => string;
    isDisabled?: boolean
};

export default function SelectWrapper<T>({
    options: rawOptions,
    value,
    onChange,
    getOptionLabel,
    getOptionValue,
    isDisabled
}: SelectWrapperProps<T>) {

    const { appearance, updateAppearance } = useAppearance();

    const options = useMemo(() =>
        rawOptions.map(o => ({
            label: getOptionLabel(o),
            value: getOptionValue(o)
        })),
        [rawOptions, getOptionLabel, getOptionValue]
    );

    const selectedOption = value
        ? { label: getOptionLabel(value), value: getOptionValue(value) }
        : null;

    const handleChange = (option: { label: string; value: number | string } | null) => {
        if (!option) return onChange(null);
        const selected = rawOptions.find(o => getOptionValue(o) === option.value) ?? null;
        onChange(selected);
    };

    return (
        <Select<Option>
            isClearable
            isDisabled={isDisabled}
            options={options}
            onChange={handleChange}
            value={selectedOption}
            theme={(theme) => ({
                ...theme,
                borderRadius: 8,
                backgroundColor: '#000',
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

    )
}


