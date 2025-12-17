import { useEffect, useState } from "react";
import FiltersInputFrame from "../FiltersInputFrame/FiltersInputFrame";
import "./FiltersInput.css";
import { IoClose } from "react-icons/io5";
import RedCrossButton from "../RedCrossButton/RedCrossButton";

export interface FiltersInputProps<T extends string | number> {
  type: "text" | "number";
  placeholder: string;
  initialValue: T | null | undefined;
  onValueChanged: (value: T | null) => void;
  onClearClicked: () => void;
}

export function FiltersInput<T extends string | number>({
  type,
  placeholder,
  initialValue,
  onValueChanged,
  onClearClicked,
}: FiltersInputProps<T>) {
  const [val, setVal] = useState<T | null>(initialValue ?? null);

  const isNumberField = type === "number" && true;
  const renderedValue = isNumberField ? val ?? "" : val ?? "";

  useEffect(() => {
    setVal(initialValue ?? null);
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let next: T | null;

    if (isNumberField) {
      const numberValue = e.target.valueAsNumber;
      next = isNaN(numberValue) ? null : (numberValue as T);
    } else {
      next = e.target.value === "" ? null : (e.target.value as T);
    }

    // console.log(`OnChange [${placeholder}] val: ${next} valString: ${e.target.value}`);

    setVal(next);
    onValueChanged(next);
  };

  return (
    <div className="filters-input">
      <FiltersInputFrame>
          <input
            className="filters-input-input"
            type={isNumberField ? "number" : "text"}
            value={renderedValue}
            onChange={handleChange}
            placeholder={placeholder}
          />
          <RedCrossButton
            classname="filters-input-clear-button"
            renderButton={val !== null}
            onClicked={() => {
              setVal(null);
              onClearClicked();
            }}
          />
      </FiltersInputFrame>
    </div>
  );
}
