import React, { useEffect, useRef, useState } from 'react';
import "./FiltersDropdown.css";

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

    const toggleItem = (item: T) => {
        if (props.loading) return;

        const updated = props.selectedItems.includes(item)
            ? props.selectedItems.filter(s => s !== item)
            : [...props.selectedItems, item];

        props.handleItemSelected(updated);
    };

    const isAllSelected = () =>
        props.selectedItems.length === props.items.length

    const selectAllItems = () => {
        if (isAllSelected()) {
            props.handleItemSelected([]);
        } else {
            props.handleItemSelected([...props.items]);
        }
    };

    // Items filtered by search input
    const filteredItems = props.items.filter(item =>
        props.getSimplifiedName(item).toLowerCase().includes(searchInput.toLowerCase())
    );

    return (
        <div className="car-filter-dropdown" ref={ref}>
            <div
                className={`car-filter-header ${props.loading || props.forceDisable ? "disabled" : ""}`}
                onClick={() => !props.loading && !props.forceDisable && setDropdownOpen(prev => !prev)}
            >
                {props.headerText} {props.selectedItems.length > 0 ? `(${props.selectedItems.length})` : ""}
                {props.loading ? <div className="loader small" /> : <span>{dropdownOpen ? "▲" : "▼"}</span>}
            </div>

            {dropdownOpen && (
                <div className="car-filter-options">
                    <input
                        type="text"
                        placeholder={props.searchInputPlaceholder}
                        value={searchInput}
                        onChange={e => setSearch(e.target.value)}
                    />

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

                    {filteredItems.map(item => (
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
