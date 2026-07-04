type OptionGroupProps<T extends string> = {
  label?: string;
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
  size?: "default" | "compact";
};

export function OptionGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  size = "default",
}: OptionGroupProps<T>) {
  const isCompact = size === "compact";

  return (
    <fieldset
      className={
        isCompact
          ? "field field-compact m-0 min-w-0 border-0 p-0"
          : "field m-0 min-w-0 border-0 p-0"
      }
    >
      {label && (
        <legend className={isCompact ? "label label-compact" : "label"}>
          {label}
        </legend>
      )}
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
          const itemClass = isCompact ? "segmented-item-compact" : "segmented-item";

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => onChange(option.value)}
              className={
                isActive
                  ? `${itemClass} segmented-item-active`
                  : itemClass
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
