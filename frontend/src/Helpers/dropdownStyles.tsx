import type {
  StylesConfig,
  GroupBase,
} from "react-select";

export const dropdownStyles =<T,>(): StylesConfig<T, false, GroupBase<T>> => ({
   menu: (base) => ({
    ...base,
    position: "absolute",
    top: "100%",
    left: 0,
    width: "100%",
    marginTop: 0,
    border: "1px solid #ccc",
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
        ? "#9bd2ffff"
        : "rgb(212, 235, 253)"
      : state.isFocused
      ? "#eee"
      : "white",
    color: "#000",
  }),

  control: (base) => ({
    ...base,
    background: "transparent",
    border: "none",
    boxShadow: "none",
    minHeight: "100%",
    height: "100%",
  }),

  valueContainer: (base) => ({
    ...base,
    padding: "0 12px",
    height: "100%",
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  dropdownIndicator: (base, state) => ({
    ...base,
    padding: 6,
    color: state.selectProps.menuIsOpen
      ? "#000000"      // open / active color
      : "#868686",        // closed color
    transition: "color 0.15s ease, transform 0.2s ease",
  }),
});