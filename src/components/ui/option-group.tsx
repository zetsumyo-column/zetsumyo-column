type OptionGroupProps<T extends string> = {
  label?: string;
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
    <fieldset className="field m-0 min-w-0 border-0 p-0">
      {label && <legend className="label">{label}</legend>}
      <div
        className="segmented-control"
        style={{
          gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
        }}
        role="radiogroup"
        aria-label={label}
      >
        {options.map((option) => {
          const isActive = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => onChange(option.value)}
              className={
                isActive
                  ? "segmented-item segmented-item-active"
                  : "segmented-item"
              }
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
