import React from "react";
import Select from "react-select";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";

interface ParamInputProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  type?: "text" | "number" | "select" | "textarea" | "multiselect";
  options?: { value: string; label: string }[];
  placeholder?: string;
  rules?: {
    required?: string;
    min?: { value: number; message: string };
    max?: { value: number; message: string };
    minLength?: { value: number; message: string };
    maxLength?: { value: number; message: string };
    pattern?: { value: RegExp; message: string };
  };
}

export function ParamInput<T extends FieldValues>({
  name,
  label,
  control,
  type = "text",
  options,
  placeholder,
  rules,
}: ParamInputProps<T>) {
  return (
    <div className={`param-input ${type === "textarea" ? "param-textarea" : ""}`}>
      <label className="param-label">{label}</label>

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => {
          const error = fieldState?.error;

          switch (type) {
            case "textarea":
              return (
                <>
                  <textarea
                    {...field}
                    placeholder={placeholder}
                    className={`param-field param-textarea ${error ? "param-field-error" : ""}`}
                  />
                  <p className={`param-error ${error ? "visible" : ""}`}>
                    {error?.message || " "}
                  </p>
                </>
              );

            case "number":
              return (
                <>
                  <input
                    type="number"
                    {...field}
                    placeholder={placeholder}
                    value={field.value ?? ""}
                    className={`param-field no-spin ${error ? "param-field-error" : ""}`}
                  />
                  <p className={`param-error ${error ? "visible" : ""}`}>
                    {error?.message || " "}
                  </p>
                </>
              );

            case "select":
              return (
                <>
                  <Select
                    {...field}
                    className="param-field"
                    options={options}
                    placeholder={placeholder}
                    onChange={(selected) => field.onChange(selected?.value)}
                    value={
                      options?.find((opt) => opt.value === field.value) || null
                    }
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: error ? "#d9534f" : base.borderColor,
                        boxShadow: error
                          ? "0 0 0 1px #d9534f"
                          : base.boxShadow,
                      }),
                    }}
                  />
                  <p className={`param-error ${error ? "visible" : ""}`}>
                    {error?.message || " "}
                  </p>
                </>
              );

            case "multiselect":
              return (
                <>
                  <Select
                    {...field}
                    isMulti
                    options={options}
                    placeholder={placeholder}
                    classNamePrefix="react-select"
                    onChange={(selected) =>
                      field.onChange(selected?.map((opt) => opt.value) || [])
                    }
                    value={
                      options?.filter((opt) =>
                        (field.value as string[] | undefined)?.includes(opt.value)
                      ) || []
                    }
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: error ? "#d9534f" : base.borderColor,
                        boxShadow: error
                          ? "0 0 0 1px #d9534f"
                          : base.boxShadow,
                      }),
                    }}
                  />
                  <p className={`param-error ${error ? "visible" : ""}`}>
                    {error?.message || " "}
                  </p>
                </>
              );

            default:
              return (
                <>
                  <input
                    type="text"
                    {...field}
                    placeholder={placeholder}
                    className={`param-field ${error ? "param-field-error" : ""}`}
                  />
                  <p className={`param-error ${error ? "visible" : ""}`}>
                    {error?.message || " "}
                  </p>
                </>
              );
          }
        }}
      />
    </div>
  );
}
