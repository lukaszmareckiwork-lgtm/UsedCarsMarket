import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./CarFilters.css";
import { useMakes, type MakeData, type ModelData } from "../../context/MakesContext";
import FiltersDropdown from "../FiltersDropdown/FiltersDropdown";


const CarFilters: React.FC = () => {
  const { makes, loading } = useMakes();
  const [selectedMakes, setSelectedMakes] = useState<MakeData[]>([]);
  const [selectedModels, setSelectedModels] = useState<ModelData[]>([]);
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  // Use URL search params
  useEffect(() => {
    if (makes.length === 0) return;

    const makesFromUrl = searchParams.get("make")?.split(",") || [];
    const modelsFromUrl = searchParams.get("model")?.split(",") || [];

    const makesToSelect = makesFromUrl
      .map(makeSlug => makes.find(make => make.make_slug === makeSlug))
      .filter((m): m is MakeData => m !== undefined);

    const availableModels = getAvailableModels(makesToSelect);

    const modelsToSelect = modelsFromUrl.flatMap(id =>
      availableModels.filter(m => m.model_id === Number.parseInt(id))
    );

    setSelectedMakes(makesToSelect);
    setSelectedModels(modelsToSelect);
  }, [searchParams, makes]);

  // Update URL dynamically
  const updateUrl = (updatedMakes: MakeData[], updatedModels: ModelData[]) => {
    const updMakesString = updatedMakes.map(make => make.make_slug)
    const updModelsString = updatedModels.map(model => model.model_id)
    
    const params = new URLSearchParams();
    if (updMakesString.length) params.set("make", updMakesString.join(","));
    if (updModelsString.length) params.set("model", updModelsString.join(","));
    navigate(`/passenger-cars${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const getAvailableModels = (selMakes: MakeData[] = selectedMakes) => {
    return selMakes
      .flatMap(makeData => Object.values(makeData?.models))
      .filter(Boolean)
  }

  const onMakesSelected = (selMakes: MakeData[]) => {
    setSelectedMakes(selMakes);

    // Keep only selected models that are still available
    const validModels = getAvailableModels(selMakes)
      .filter(model => selectedModels.includes(model));
    setSelectedModels(validModels);

    updateUrl(selMakes, validModels);
  };

  const onModelsSelected = (selModels: ModelData[]) => {
    setSelectedModels(selModels);
    updateUrl(selectedMakes, selModels);
  };

  return (
    <section className="car-filters">

      <FiltersDropdown
        items={makes}
        selectedItems={selectedMakes}
        handleItemSelected={onMakesSelected}

        getId={(make) => make.make_id}
        getDisplayName={(make) => make.make_name}
        getSimplifiedName={(make) => make.make_slug}

        loading={loading}
        forceDisable={false}
        headerText="Manufacturer"
        searchInputPlaceholder="Search manufacturer" />

      <FiltersDropdown
        items={getAvailableModels()}
        selectedItems={selectedModels}
        handleItemSelected={onModelsSelected}

        getId={(model) => model.model_id}
        getDisplayName={(model) => model.model_name}
        getSimplifiedName={(model) => model.model_name.toLocaleLowerCase()}

        loading={loading}
        forceDisable={selectedMakes.length === 0}
        headerText="Model"
        searchInputPlaceholder="Search model" />
        
    </section>
  );
};

export default CarFilters;
