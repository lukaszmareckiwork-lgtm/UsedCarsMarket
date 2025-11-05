import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./CarFilters.css";
import { useMakes } from "../../context/MakesContext";


const CarFilters: React.FC = () => {
  const { makes, loading } = useMakes();
  const [selectedMakes, setSelectedMakes] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [makeSearch, setMakeSearch] = useState("");
  const [modelSearch, setModelSearch] = useState("");
  const [searchParams] = useSearchParams();

  const [makeDropdownOpen, setMakeDropdownOpen] = useState(false);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);

  const makeRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (makeRef.current && !makeRef.current.contains(e.target as Node)) {
        setMakeDropdownOpen(false);
      }
      if (modelRef.current && !modelRef.current.contains(e.target as Node)) {
        setModelDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Use search params
  useEffect(() => {
    const makesFromUrl = searchParams.get("make")?.split(",") || [];
    const modelsFromUrl = searchParams.get("model")?.split(",") || [];

    setSelectedMakes(makesFromUrl);
    setSelectedModels(modelsFromUrl);
  }, [searchParams]);

  const filteredMakes = makes.filter(m =>
    m.make_name.toLowerCase().includes(makeSearch.toLowerCase())
  );

  const availableModels = selectedMakes
    .map(slug => makes.find(m => m.make_slug === slug))
    .filter(Boolean)
    .flatMap(m => Object.keys(m!.models));

  const filteredModels = availableModels.filter(modelName =>
    modelName.toLowerCase().includes(modelSearch.toLowerCase())
  );

  // --- Helper: update URL dynamically ---
  const updateUrl = (updatedMakes: string[], updatedModels: string[]) => {
    const params = new URLSearchParams();
    if (updatedMakes.length) params.set("make", updatedMakes.join(","));
    if (updatedModels.length) params.set("model", updatedModels.join(","));
    navigate(`/osobowe${params.toString() ? `?${params.toString()}` : ""}`);
  };

  // --- Toggle functions ---
  const toggleMake = (slug: string) => {
    if (loading) return;

    let updated: string[];
    if (selectedMakes.includes(slug)) {
      updated = selectedMakes.filter(s => s !== slug);
      // Remove associated models
      const modelsToRemove = Object.keys(
        makes.find(m => m.make_slug === slug)!.models
      );
      const newModels = selectedModels.filter(m => !modelsToRemove.includes(m));
      setSelectedModels(newModels);
      setSelectedMakes(updated);
      updateUrl(updated, newModels);
    } else {
      updated = [...selectedMakes, slug];
      setSelectedMakes(updated);
      setSelectedModels(selectedModels);
      updateUrl(updated, selectedModels);
    }
  };

  const toggleModel = (name: string) => {
    if (loading) return;

    let updated: string[];
    if (selectedModels.includes(name)) {
      updated = selectedModels.filter(m => m !== name);
    } else {
      updated = [...selectedModels, name];
    }
    setSelectedModels(updated);
    updateUrl(selectedMakes, updated);
  };

  const selectAllMakes = () => {
    if (selectedMakes.length === makes.length) {
      setSelectedMakes([]);
      setSelectedModels([]);
      updateUrl([], []);
    } else {
      const allMakes = makes.map(m => m.make_slug);
      setSelectedMakes(allMakes);
      setSelectedModels([]);
      updateUrl(allMakes, []);
    }
  };

  const selectAllModels = () => {
    if (selectedModels.length === availableModels.length) {
      setSelectedModels([]);
      updateUrl(selectedMakes, []);
    } else {
      setSelectedModels(availableModels);
      updateUrl(selectedMakes, availableModels);
    }
  };

  return (
    <div className="car-filters">
      {/* Make Dropdown */}
      <div className="car-filter-dropdown" ref={makeRef}>
        <div
          className={`car-filter-header ${loading ? "disabled" : ""}`}
          onClick={() => !loading && setMakeDropdownOpen(prev => !prev)}
        >
          Manufacturer {selectedMakes.length > 0 ? `(${selectedMakes.length})` : ""}
          {loading ? 
              <div className="loader small" /> : 
              <span>{makeDropdownOpen ? "▲" : "▼"}</span>
          }
        </div>

        {makeDropdownOpen && (
          <div className="car-filter-options">
            <input
              type="text"
              placeholder="Search manufacturer"
              value={makeSearch}
              onChange={e => setMakeSearch(e.target.value)}
            />

            {/* Select All */}
            <label className="select-all">
              <input
                type="checkbox"
                checked={selectedMakes.length === makes.length}
                onChange={selectAllMakes}
              />
              All
            </label>

            {filteredMakes.map(m => (
              <label key={m.make_id}>
                <input
                  type="checkbox"
                  checked={selectedMakes.includes(m.make_slug)}
                  onChange={() => toggleMake(m.make_slug)}
                />
                {m.make_name}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Model Dropdown */}
      <div className="car-filter-dropdown" ref={modelRef}>
        <div
          className={`car-filter-header ${loading || selectedMakes.length === 0 ? "disabled" : ""}`}
          onClick={() => !loading && selectedMakes.length > 0 && setModelDropdownOpen(prev => !prev)}
        >
          Model {selectedModels.length > 0 ? `(${selectedModels.length})` : ""}
          {loading ? 
              <div className="loader small" /> : 
              <span>{modelDropdownOpen ? "▲" : "▼"}</span>
          }
        </div>

        {modelDropdownOpen && selectedMakes.length > 0 && (
          <div className="car-filter-options">
            <input
              type="text"
              placeholder="Serach model"
              value={modelSearch}
              onChange={e => setModelSearch(e.target.value)}
            />

            {/* Select All */}
            <label className="select-all">
              <input
                type="checkbox"
                checked={selectedModels.length === availableModels.length}
                onChange={selectAllModels}
              />
              Wszystkie
            </label>

            {filteredModels.map(modelName => (
              <label key={modelName}>
                <input
                  type="checkbox"
                  checked={selectedModels.includes(modelName)}
                  onChange={() => toggleModel(modelName)}
                />
                {modelName}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarFilters;
