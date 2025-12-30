import type {
  StylesConfig,
  GroupBase,
} from "react-select";

export const dropdownStyles = <T, isMulti extends boolean = false>(
  hideFrame: boolean = true
): StylesConfig<T, isMulti, GroupBase<T>> => ({
  menu: (base) => ({
    ...base,
    position: "absolute",
    top: "100%",
    left: 0,
    width: "100%",
    marginTop: 0,
    border: "1px solid var(--colorsBorderSubtle)",
    // border: "none",
    borderTop: "none",
    borderRadius: "0px 0px 4px 4px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
    zIndex: 1000,
    overflow: "hidden",

    fontFamily: "var(--fontFamilyPrimary)",
    fontSize: "14px",
    fontWeight: 400,
  }),

  menuList: (base) => ({
    ...base,
    padding: 0,
    maxHeight: 280,
    overflowY: "auto",
  }),

  option: (base, state) => ({
    ...base,
    display: "flex",
    alignItems: "center",
    padding: "6px 12px",
    cursor: "pointer",
    userSelect: "none",
    transition: "background-color 0.15s",
    borderRadius: "0",
    backgroundColor: state.isSelected
      ? state.isFocused
        ? "var(--colorsActionLight)"
        : "var(--colorsActionLight)"
      : state.isFocused
      ? "var(--colorsSurface)"
      : "var(--colorsBackgroundPrimary)",
    color: "var(--colorsForegroundPrimary)",
  }),

  control: (base, state) => ({
    ...base,
    background: "transparent",
    borderRadius: "4px",

    border: hideFrame
      ? "1px solid transparent"
      : state.isFocused
      ? "1px solid transparent"
      : "1px solid var(--colorsBorderSubtle)",

    boxShadow:
      state.isFocused && !state.isDisabled
        ? "0 0 0 1px var(--colorsPrimary), 0 0 0 3px rgba(0, 113, 206, 0.25)"
        : "none",

    "&:hover": {
      borderColor: !state.isDisabled && !state.isFocused
        ? "var(--colorsForegroundPrimary)"
        : undefined,
    },

    minHeight: "100%",
    height: "100%",
    cursor: "pointer",

    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  }),

  input: (base) => ({
    ...base,
    border: "none",
    boxShadow: "none",
    outline: "none",
    background: "transparent",
  }),

  valueContainer: (base) => ({
    ...base,
    padding: hideFrame ? "0 12px" : "5.6px 12px",
    height: "100%",
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  dropdownIndicator: (base, state) => ({
    ...base,
    padding: 6,
    color: state.selectProps.menuIsOpen
      ? "var(--colorsForegroundPrimary)" // open / active color
      : "var(--colorsMuted)", // closed color
    transition: "color 0.15s ease, transform 0.2s ease",
  }),
});