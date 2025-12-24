import ReactDOM from "react-dom/client";
import Select from "react-select";
import "./RangeControl.css";

interface Option {  
  label: string;
  value: string | number;
}

export class RangeControl implements mapboxgl.IControl {
  private container: HTMLDivElement;
  private root?: ReactDOM.Root;
  private onChange: (value: number) => void;

  private options: Option[] = [
    { value: 5, label: "+5 km" },
    { value: 10, label: "+10 km" },
    { value: 25, label: "+25 km" },
    { value: 50, label: "+50 km" },
    { value: 100, label: "+100 km" },
    { value: 200, label: "+200 km" },
    { value: 300, label: "+300 km" },
    { value: 500, label: "+500 km" },
  ];

  private selectedOption: Option | null = this.options[0];

  constructor(onChange: (value: number) => void) {
    this.onChange = onChange;
    this.container = document.createElement("div");
    this.container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
  }

  /** Centralized render */
  private render() {
    if (!this.root) return;

    this.root.render(
      <Select<Option, false>
        className="range-control-select"
        options={this.options}
        value={this.selectedOption}
        onChange={(selected) => {
          if (!selected) return;

          this.selectedOption = selected;
          this.onChange(selected.value as number);
          this.render();
        }}
        blurInputOnSelect={false}
        closeMenuOnScroll={false}
        styles={{
          control: (base, state) => ({
            ...base,
            pointerEvents: "auto",
            border: "none",
            boxShadow: state.isFocused
              ? "0 0 2px 2px var(--colorsPrimary)"
              : "none",
            ":hover": {
              boxShadow: state.isFocused
                ? "0 0 2px 2px var(--colorsPrimary)"
                : "0 0 2px 2px #999",
            },
          }),
          option: (base, { isSelected, isFocused }) => ({
            ...base,
            backgroundColor: isSelected
              ? "var(--colorsActionLight)"
              : isFocused
              ? "#eee"
              : "white",
            color: isSelected ? "white" : "black",
          }),
        }}
      />
    );
  }

  onAdd(map: mapboxgl.Map) {
    this.root = ReactDOM.createRoot(this.container);
    this.render();
    return this.container;
  }

  onRemove() {
    const root = this.root;
    this.root = undefined;

    // Defer unmount to next microtask
    queueMicrotask(() => {
      root?.unmount();
    });

    this.container.parentNode?.removeChild(this.container);
  }

  public setValue(value: number) {
    const option = this.options.find(o => o.value === value);
    if (!option) return;

    this.selectedOption = option;
    this.render();
  }
}
