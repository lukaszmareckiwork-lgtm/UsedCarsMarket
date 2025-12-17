import { FiltersInput, type FiltersInputProps } from "./FiltersInput";

export function FiltersInputNumber(props: Omit<FiltersInputProps<number>, "type">) {
  return (
    <FiltersInput
      {...props}
      type="number"
    />
  );
}