import { useEffect, useState } from "react";
import "./OffersFiltersControls.css";
import { useMakes, type MakeData, type ModelData } from "../../Context/MakesContext";
import FiltersDropdown from "../FiltersDropdown/FiltersDropdown";
import type { OfferQueryObject } from "../../Data/OfferQueryObject";

interface Props {
  query: OfferQueryObject;
  updateFilters: (updates: Partial<OfferQueryObject>) => void;
  toggleFavouriteFilter: () => void;
}

const OffersFiltersControls = ({
  query,
  updateFilters,
}: Props) => {
  const { makes, loading } = useMakes();
  const [selectedMakes, setSelectedMakes] = useState<MakeData[]>([]);
  const [selectedModels, setSelectedModels] = useState<ModelData[]>([]);

  // -------------------------------
  // Initialize selected makes/models from query
  // -------------------------------
  useEffect(() => {
    if (makes.length === 0) return;

    const makesToSelect = (query.MakeIds || [])
      .map((id) => makes.find((m) => m.make_id === id))
      .filter((m): m is MakeData => m !== undefined);

    const modelsToSelect = (query.ModelIds || []).flatMap((id) =>
      getAvailableModels(makesToSelect).filter((m) => m.model_id === id)
    );

    setSelectedMakes(makesToSelect);
    setSelectedModels(modelsToSelect);
  }, [makes, query.MakeIds, query.ModelIds]);

  const getAvailableModels = (selMakes: MakeData[] = selectedMakes) => {
    return selMakes.flatMap((make) => Object.values(make.models)).filter(Boolean);
  };

  const onMakesSelected = (selMakes: MakeData[]) => {
    setSelectedMakes(selMakes);
    const validModels = getAvailableModels(selMakes).filter((model) =>
      selectedModels.includes(model)
    );
    setSelectedModels(validModels);

    updateFilters({
      MakeIds: selMakes.map((m) => m.make_id),
      ModelIds: validModels.map((m) => m.model_id),
      PageNumber: 1,
    });
  };

  const onModelsSelected = (selModels: ModelData[]) => {
    setSelectedModels(selModels);

    updateFilters({
      ModelIds: selModels.map((m) => m.model_id),
      PageNumber: 1,
    });
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
        searchInputPlaceholder="Search manufacturer"
      />

      <FiltersDropdown
        items={getAvailableModels()}
        selectedItems={selectedModels}
        handleItemSelected={onModelsSelected}
        getId={(model) => model.model_id}
        getDisplayName={(model) => model.model_name}
        getSimplifiedName={(model) => model.model_name.toLowerCase()}
        loading={loading}
        forceDisable={selectedMakes.length === 0}
        headerText="Model"
        searchInputPlaceholder="Search model"
      />
    </section>
  );
};

export default OffersFiltersControls;
