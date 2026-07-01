type OptionGroupProps<T extends string> = {
  label: string;
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
};

export function OptionGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: OptionGroupProps<T>) {
  return (
    <div className="field">
      <p className="label">{label}</p>
      <div className="options">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={value === option.value ? "option option-active" : "option"}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
