import { FiltersInput, type FiltersInputProps } from "./FiltersInput";

export function FiltersInputString(props: Omit<FiltersInputProps<string>, "type">) {
  return (
    <FiltersInput
      {...props}
      type="text"
    />
  );
}