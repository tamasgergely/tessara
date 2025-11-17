import { useMemo } from 'react';
import { type Option } from '@/types';
import Select from 'react-select';
import { useAppearance, prefersDark } from '@/hooks/use-appearance';

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

    const schemeIsDark = appearance === 'dark' || (appearance === 'system' && prefersDark());

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
                            ? '#ff922c'
                            : schemeIsDark ? '#171717' : 'white',
                    color: state.isSelected || state.isFocused
                        ? 'white'
                        : schemeIsDark ? 'white' : 'black',
                }),
                control: (base, state) => ({
                    ...base,
                    fontSize: '.875rem',
                    minHeight: '2.75rem',
                    height: '2.75rem',
                    backgroundColor: isDisabled
                        ? (schemeIsDark ? '#3b3b3b' : '#e2e2e2')
                        : (schemeIsDark ? 'transparent' : 'white'),
                    borderColor: schemeIsDark ? '#717171' : '#e5e5e5',
                    boxShadow: 'none !important',
                    ...(state.isFocused && {
                        boxShadow: schemeIsDark ? '0 0 0 3px rgba(82, 82, 82, 0.5)' : '0 0 0 3px rgba(221, 220, 226, 0.5)',
                        borderColor: schemeIsDark ? '#717171' : '#e5e5e5',
                    }),
                    "&:hover": {
                        borderColor: schemeIsDark ? '#717171' : '#e5e5e5',
                    }
                }),
                singleValue: (base) => ({
                    ...base,
                    color: schemeIsDark ? 'white' : 'black',
                }),
                menu: (base) => ({
                    ...base,
                    backgroundColor: schemeIsDark ? 'transparent' : 'white',
                    borderRadius: 8,
                }),
                menuList: (base) => ({
                    ...base,
                    backgroundColor: schemeIsDark ? 'transparent' : 'white',
                    padding: 0,
                }),
                input: (base) => ({
                    ...base,
                    color: schemeIsDark ? 'white' : 'black',

                }),
                clearIndicator: (base, state) => ({
                    ...base,
                    color: '#717171',
                    cursor: "pointer",
                    "&:hover": {
                        color: schemeIsDark ? '#919191' : '#3b3b3b',
                    },
                }),
                dropdownIndicator: (base, state) => ({
                    ...base,
                    color: '#717171',
                    "&:hover": {
                        color: schemeIsDark ? '#919191' : '#3b3b3b',
                    },
                }),
                indicatorSeparator: (base, state) => ({
                    ...base,
                    backgroundColor: "#717171",
                }),
            }}
        />

    )
}


