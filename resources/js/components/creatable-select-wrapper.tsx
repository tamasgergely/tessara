import type { Option } from '@/types';
import type { SingleValue } from 'react-select';
import { components } from "react-select";
import { useMemo } from 'react';
import CreatableSelect from 'react-select/creatable';
import { useAppearance, prefersDark } from '@/hooks/use-appearance';

type CreatableSelectWrapperProps<T> = {
    options: T[];
    value: Option | null;
    onChange: (value: Option | null) => void;
    getOptionLabel: (option: T) => string;
    getOptionValue: (option: T) => string;
    getOptionSubLabel?: (option: T) => string;
    ref?: any;
};

const CustomOption = (props: any) => {
    const { data, isFocused, isSelected } = props;

    const subLabelColor = isSelected || isFocused ? "white" : "#777";

    return (
        <components.Option {...props}>
            <div className='flex flex-col'>
                <span className="text-sm">
                    {data.label}
                </span>
                {data.subLabel && (
                    <span style={{ fontSize: "12px", color: subLabelColor }}>
                        {data.subLabel}
                    </span>
                )}
            </div>
        </components.Option>
    );
};

export default function CreatableSelectWrapper<T>({
    options: rawOptions,
    value,
    onChange,
    getOptionLabel,
    getOptionValue,
    getOptionSubLabel,
    ref
}: CreatableSelectWrapperProps<T>) {

    const { appearance, updateAppearance } = useAppearance();

    const options = useMemo<Option[]>(
        () =>
            rawOptions.map(o => ({
                label: getOptionLabel(o),
                value: getOptionValue(o),
                subLabel: getOptionSubLabel ? getOptionSubLabel(o) : 'undefined',
            })),
        [rawOptions, getOptionLabel, getOptionValue]
    );

    const handleChange = (option: SingleValue<Option>) => {
        onChange(option);
    };

    const schemeIsDark = appearance === 'dark' || (appearance === 'system' && prefersDark());

    return (
        <CreatableSelect
            isClearable
            components={{ Option: CustomOption }}
            options={options}
            onChange={handleChange}
            value={value}
            filterOption={(option, search) => {
                const label = option.data.label?.toLowerCase() ?? "";
                const sub = option.data.subLabel?.toLowerCase() ?? "";
                const term = search.toLowerCase();

                return label.includes(term) || sub.includes(term);
            }}
            ref={ref}
            maxMenuHeight={500}
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
                container: (base) => ({
                    ...base,
                    width: '100%',
                    maxWidth: '100%',
                    minWidth: 0
                }),                
                option: (base, state) => ({
                    ...base,
                    fontSize: '.875rem',
                    backgroundColor: state.isSelected
                        ? '#f87805'
                        : state.isFocused
                            ? schemeIsDark ? '#da7400' : '#ff922c'
                            : schemeIsDark ? '#171717' : 'white',
                    color: state.isSelected || state.isFocused
                        ? 'white'
                        : schemeIsDark ? 'white' : 'black',

                    borderBottom: `1px solid ${schemeIsDark ? '#2b2b2b' : '#e5e5e5'}`,
                }),
                control: (base, state) => ({
                    ...base,
                    fontSize: '.875rem',
                    minHeight: '2.75rem',
                    height: '2.75rem',
                    backgroundColor: schemeIsDark ? 'transparent' : 'white',
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
                    backgroundColor: schemeIsDark ? '#171717' : 'white',
                    borderRadius: 8,
                    margin: 0
                }),
                menuList: (base) => ({
                    ...base,
                    backgroundColor: schemeIsDark ? '#171717' : 'white',
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
    );
}