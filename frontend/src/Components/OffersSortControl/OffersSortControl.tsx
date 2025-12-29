import "./OffersSortControl.css";
import type { OfferQueryObject } from "../../Data/OfferQueryObject";
import Select from "react-select";
import { dropdownStyles } from "../../Helpers/dropdownStyles";

interface SortOption {
  label: string;
  sortBy: string;
  sortDescending: boolean;
}

interface Props {
  query: OfferQueryObject;
  updateFilters: (updates: Partial<OfferQueryObject>) => void;
}

const options: SortOption[] = [
  { label: "Newest first", sortBy: "createdDate", sortDescending: true },
  { label: "Oldest first", sortBy: "createdDate", sortDescending: false },

  { label: "Price: high → low", sortBy: "price", sortDescending: true },
  { label: "Price: low → high", sortBy: "price", sortDescending: false },

  { label: "Year: newest", sortBy: "year", sortDescending: true },
  { label: "Year: oldest", sortBy: "year", sortDescending: false },

  { label: "Mileage: high → low", sortBy: "mileage", sortDescending: true },
  { label: "Mileage: low → high", sortBy: "mileage", sortDescending: false },
];

const OffersSortControl = ({ query, updateFilters }: Props) => {
  const effectiveSortBy = query.SortBy ?? "createdDate";
  const effectiveSortDescending = query.SortDescending ?? true;

  const selectedOption =
    options.find(
      (o) =>
        o.sortBy === effectiveSortBy &&
        o.sortDescending === effectiveSortDescending
    ) ?? null;

  return (
    <div className="osc">
        <Select<SortOption, false>
          className="osc-select"
          unstyled
          options={options}
          value={selectedOption}
          getOptionValue={(o) => `${o.sortBy}-${o.sortDescending}`}
          getOptionLabel={(o) => o.label}
          onChange={(selected) => {
            if (!selected) return;
            updateFilters({
              SortBy: selected.sortBy,
              SortDescending: selected.sortDescending,
            });
          }}
          blurInputOnSelect={false}
          closeMenuOnScroll={false}
          styles={dropdownStyles<SortOption>(false)}
          isSearchable={false}
        />
    </div>
  );
};

export default OffersSortControl;
