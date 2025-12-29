import React, { useEffect, useRef, useState } from "react";
import "./FiltersDropdown.css";
import Spinner from "../Spinner/Spinner";
import FiltersInputFrame from "../FiltersInputFrame/FiltersInputFrame";
import RedCrossButton from "../RedCrossButton/RedCrossButton";
import { IoIosArrowDown } from "react-icons/io";

interface FiltersDropdownProps<T> {
  items: T[];
  selectedItems: T[];
  handleItemSelected: (selectedItems: T[]) => void;
  loading: boolean;
  forceDisable: boolean;
  headerText: string;
  searchInputPlaceholder: string;

  /**
   * Function to extract the unique key from an item.
   * Used as the `key` prop when rendering dropdown options.
   */
  getId: (item: T) => React.Key;

  /**
   * Function to extract a simplified name for the item.
   * Used for filtering/searching in the dropdown input.
   */
  getSimplifiedName: (item: T) => string;

  /**
   * Function to extract the display name for the item.
   * Used as the visible text for dropdown options.
   */
  getDisplayName: (item: T) => string;
}

function FiltersDropdown<T>(props: FiltersDropdownProps<T>) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchInput, setSearch] = useState("");

  const ref = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (dropdownOpen) {
      searchInputRef.current?.focus();
    }
  }, [dropdownOpen]);

  const focusFirstInteractive = () => {
    // Prefer the search input (if present), otherwise the first option checkbox
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      return;
    }
    const first = optionsRef.current?.querySelector<HTMLInputElement>("input[type='checkbox']");
    first?.focus();
  };

  const handleHeaderKeyDown = (e: React.KeyboardEvent) => {
    if (props.loading || props.forceDisable) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setDropdownOpen((prev) => {
        const next = !prev;
        // if opening, focus the search input (after render)
        if (next) setTimeout(() => focusFirstInteractive(), 0);
        return next;
      });
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!dropdownOpen) {
        setDropdownOpen(true);
        setTimeout(() => focusFirstInteractive(), 0);
      } else {
        focusFirstInteractive();
      }
    }
  };

  const handleOptionsKeyDown = (e: React.KeyboardEvent) => {
    const container = optionsRef.current;
    if (!container) return;

    const focusable = Array.from(container.querySelectorAll<HTMLInputElement>("input[type='checkbox'], input[type='text']"));
    const active = document.activeElement as HTMLElement | null;
    const idx = focusable.findIndex((el) => el === active);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = idx < focusable.length - 1 ? focusable[idx + 1] : focusable[0];
      next?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = idx > 0 ? focusable[idx - 1] : focusable[focusable.length - 1];
      prev?.focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setDropdownOpen(false);
      setTimeout(() => headerRef.current?.focus(), 0);
    }
  };

  const toggleItem = (item: T) => {
    if (props.loading) return;

    const updated = props.selectedItems.includes(item)
      ? props.selectedItems.filter((s) => s !== item)
      : [...props.selectedItems, item];

    props.handleItemSelected(updated);
  };

  const isAllSelected = () => props.selectedItems.length === props.items.length;

  const selectAllItems = () => {
    if (isAllSelected()) {
      props.handleItemSelected([]);
    } else {
      props.handleItemSelected([...props.items]);
    }
  };

  // Items filtered by search input
  const filteredItems = props.items.filter((item) =>
    props
      .getSimplifiedName(item)
      .toLowerCase()
      .includes(searchInput.toLowerCase())
  );

  return (
    <div className="car-filter-dropdown" ref={ref}>
      <FiltersInputFrame className={`car-filter-dropdown-frame ${props.loading || props.forceDisable ? "disabled" : ""}`}>
        {!dropdownOpen && (
          <div
            ref={headerRef}
            tabIndex={props.loading || props.forceDisable ? -1 : 0}
            role="button"
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
            aria-controls="car-filter-options"
            className={`car-filter-header ${props.loading || props.forceDisable ? "disabled" : ""}`}
            onClick={() =>{
              !props.loading &&
              !props.forceDisable &&
              setDropdownOpen((prev) => !prev);
            }}
            onKeyDown={handleHeaderKeyDown}
          >
            <span>
              {props.headerText}{" "}
              {props.selectedItems.length > 0
                ? `(${props.selectedItems.length})`
                : ""}
            </span>
          </div>
        )}
        {dropdownOpen && (
          <input
            ref={searchInputRef}
            className="car-filter-search-input"
            type="text"
            placeholder={props.searchInputPlaceholder}
            value={searchInput}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}
        <div className="car-filters-dropdown-right">
          {props.loading ? (
                  <Spinner size={28} />
                ) : (
                  <div className="car-filters-dropdown-clear-and-arrow">
                    <RedCrossButton classname="car-filters-dropdown-clear-button" renderButton={props.selectedItems.length > 0} onClicked={() => props.handleItemSelected([])} />
                    <span className={`car-filters-dropdown-arrow ${dropdownOpen ? "opened" : ""}`}>
                      <IoIosArrowDown size={28} aria-hidden={true} focusable={false} />
                    </span>
                  </div>
                )}  
          </div>
      </FiltersInputFrame>

      {dropdownOpen && (
        <div id="car-filter-options" ref={optionsRef} className="car-filter-options" role="dialog" aria-modal="false" onKeyDown={handleOptionsKeyDown}>
            {!searchInput && (
              <label className="select-all">
                <input
                  type="checkbox"
                  checked={isAllSelected()}
                  onChange={selectAllItems}
                />
                All
              </label>
            )}

            {filteredItems.map((item) => (
              <label key={props.getId(item)}>
                <input
                  type="checkbox"
                  checked={props.selectedItems.includes(item)}
                  onChange={() => toggleItem(item)}
                />
                {props.getDisplayName(item)}
              </label>
            ))}
          </div>
        )}
    </div>
  );
}

export default FiltersDropdown;
