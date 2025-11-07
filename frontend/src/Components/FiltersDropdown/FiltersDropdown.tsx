import React, { useEffect, useRef, useState } from 'react'
import "./FiltersDropdown.css"

interface Props {
    items: DropdownItemData[];
    selectedItems: string[];//by simplified name
    handleItemSelected: (selectedItems: string[]) => void;
    loading: boolean;
    forceDisable: boolean;
    headerText: string;
    searchInputPlaceholder: string;
}

export interface DropdownItemData {
    id: React.Key;
    simplifiedName: string;
    displayName: string;
}

const FiltersDropdown = (props: Props) => {
 
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

    const toggleItem = (itemSimplifiedName: string) => {
        if (props.loading) return;

        let updated: string[];
        if (props.selectedItems.includes(itemSimplifiedName)) {
            updated = props.selectedItems.filter(s => s !== itemSimplifiedName);
            props.handleItemSelected(updated);
        } else {
            updated = [...props.selectedItems, itemSimplifiedName];
            props.handleItemSelected(updated);
        }
    };

    const selectAllItems = () => {
        if (props.selectedItems.length === props.items.length) {
            props.handleItemSelected([]);
        } else {
            const allItems = props.items.map(i => i.simplifiedName);
            props.handleItemSelected(allItems);
        }
    };

    const filteredItems = props.items.filter(itemName =>
        itemName.simplifiedName.includes(searchInput.toLowerCase())
    );

    return (
        <div className="car-filter-dropdown" ref={ref}>
            <div
                className={`car-filter-header ${props.loading || props.forceDisable ? "disabled" : ""}`}
                onClick={() => !props.loading && !props.forceDisable && setDropdownOpen(prev => !prev)}
            >
                {props.headerText} {props.selectedItems.length > 0 ? `(${props.selectedItems.length})` : ""}
                {props.loading ?
                    <div className="loader small" /> :
                    <span>{dropdownOpen ? "▲" : "▼"}</span>
                }
            </div>

            {dropdownOpen && (
                <div className="car-filter-options">
                    <input
                        type="text"
                        placeholder={props.searchInputPlaceholder}
                        value={searchInput}
                        onChange={e => setSearch(e.target.value)}
                    />

                    {/* Select All */}
                    {!searchInput && (<label className="select-all">
                        <input
                            type="checkbox"
                            checked={props.selectedItems.length === props.items.length}
                            onChange={selectAllItems}
                        />
                        All
                    </label>
                    )}

                    {filteredItems.map(i => (
                        <label key={i.id}>
                            <input
                                type="checkbox"
                                checked={props.selectedItems.includes(i.simplifiedName)}
                                onChange={() => toggleItem(i.simplifiedName)}
                            />
                            {i.displayName}
                        </label>
                    ))}
                </div>
            )}
        </div>
    )
}

export default FiltersDropdown