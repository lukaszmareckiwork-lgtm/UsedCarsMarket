import Select from "react-select";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import "./ParamInput.css";
import { dropdownStyles } from "@helpers/dropdownStyles";

interface ParamInputProps<T extends FieldValues, G> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  type?: "text" | "password" | "number" | "tel" | "select" | "textarea" | "multiselect";
  options?: { value: G; label: string }[];
  placeholder?: string;
  rules?: {
    required?: string;
    min?: { value: number; message: string };
    max?: { value: number; message: string };
    minLength?: { value: number; message: string };
    maxLength?: { value: number; message: string };
    pattern?: { value: RegExp; message: string };
  };
  numeric?: boolean;
  maxLength?: number;
}

export function ParamInput<T extends FieldValues, G>({
  name,
  label,
  control,
  type = "text",
  options,
  placeholder,
  rules,
  numeric = false,
  maxLength,
}: ParamInputProps<T, G>) {
  const id = `param-${String(name)}`;
  const errorId = `${id}-error`;

  return (
    <div
      className={`param-input ${type === "textarea" ? "param-textarea" : ""}`}
    >
      <label className="param-label" htmlFor={id}>{label}</label>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => {
          const error = fieldState?.error;

          const handleChange = (value: any) =>
            numeric ? Number(value) : value;

          switch (type) {
            case "textarea":
              return (
                <>
                  <textarea
                    id={id}
                    {...field}
                    placeholder={placeholder}
                    className={`param-field param-textarea ${
                      error ? "param-field-error" : ""
                    }`}
                    aria-invalid={!!error}
                    aria-describedby={error ? errorId : undefined}
                  />
                  <div className="param-field-error-max-length">
                    <p id={errorId} className={`param-error ${error ? "visible" : ""}`}>
                      {error?.message || " "}
                    </p>
                    {maxLength && (
                      <p className="param-field-char-counter">
                        {field.value?.length || 0}/{maxLength}
                      </p>
                    )}
                  </div>
                </>
              );

            case "number":
              return (
                <>
                  <input
                    id={id}
                    type="number"
                    {...field }
                    placeholder={placeholder}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                    className={`param-field no-spin ${
                      error ? "param-field-error" : ""
                    }`}
                    aria-invalid={!!error}
                    aria-describedby={error ? errorId : undefined}
                  />
                  <p id={errorId} className={`param-error ${error ? "visible" : ""}`}>
                    {error?.message || " "}
                  </p>
                </>
              );

            case "tel":
              return (
                <>
                  <input
                    id={id}
                    type="tel"
                    {...field }
                    placeholder={placeholder}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    className={`param-field no-spin ${
                      error ? "param-field-error" : ""
                    }`}
                    aria-invalid={!!error}
                    aria-describedby={error ? errorId : undefined}
                  />
                  <div className="param-field-error-max-length">
                    <p id={errorId} className={`param-error ${error ? "visible" : ""}`}>
                      {error?.message || " "}
                    </p>
                    {maxLength && (
                      <p className="param-field-char-counter">
                        {field.value?.length || 0}/{maxLength}
                      </p>
                    )}
                  </div>
                </>
              );

            case "select":
              return (
                <>
                  <Select
                    {...field}
                    className="react-select"
                    // classNamePrefix="react-select"
                    options={options}
                    placeholder={placeholder}
                    onChange={(selected) =>
                      field.onChange(handleChange(selected?.value))
                    }
                    value={
                      options?.find((opt) => opt.value === field.value) || null
                    }
                    inputId={id}
                    aria-invalid={!!error}
                    aria-describedby={error ? errorId : undefined}
                    // styles={{
                    //   control: (base) => ({
                    //     ...base,
                    //     borderColor: error ? "var(--colorsErrorLight)" : base.borderColor,
                    //     boxShadow: error ? "0 0 0 1px var(--colorsErrorLight)" : base.boxShadow,
                    //   }),
                    // }}
                    // unstyled
                    styles={dropdownStyles<any>(false)}
                  />
                  <p id={errorId} className={`param-error ${error ? "visible" : ""}`}>
                    {error?.message || " "}
                  </p>
                </>
              );

            case "multiselect":
              // Ensure field.value is always an array
              const currentValues: G[] = Array.isArray(field.value)
                ? field.value
                : [];

              return (
                <>
                  <Select
                    className="react-select"
                    {...field}
                    isMulti
                    options={options}
                    placeholder={placeholder}
                    // classNamePrefix="react-select"
                    onChange={(selected) =>
                      field.onChange(
                        (selected?.map((opt) => handleChange(opt.value)) ||
                          []) as G[]
                      )
                    }
                    value={
                      options?.filter((opt) =>
                        currentValues.includes(opt.value as G)
                      ) || []
                    }
                    inputId={id}
                    aria-invalid={!!error}
                    aria-describedby={error ? errorId : undefined}
                    // styles={{
                    //   control: (base) => ({
                    //     ...base,
                    //     borderColor: error ? "var(--colorsErrorLight)" : base.borderColor,
                    //     boxShadow: error ? "0 0 0 1px var(--colorsErrorLight)" : base.boxShadow,
                    //   }),
                    // }}
                    // unstyled
                    styles={dropdownStyles<any, true>(false)}
                  />
                  <p id={errorId} className={`param-error ${error ? "visible" : ""}`}>
                    {error?.message || " "}
                  </p>
                </>
              );

            default:
              return (
                <>
                  <input
                    id={id}
                    type={type === "password" ? "password" : "text"}
                    {...field}
                    placeholder={placeholder}
                    className={`param-field ${
                      error ? "param-field-error" : ""
                    }`}
                    aria-invalid={!!error}
                    aria-describedby={error ? errorId : undefined}
                  />
                  <div className="param-field-error-max-length">
                    <p id={errorId} className={`param-error ${error ? "visible" : ""}`}>
                      {error?.message || " "}
                    </p>
                    {maxLength && (
                      <p className="param-field-char-counter">
                        {field.value?.length || 0}/{maxLength}
                      </p>
                    )}
                  </div>
                </>
              );
          }
        }}
      />
    </div>
  );
}
