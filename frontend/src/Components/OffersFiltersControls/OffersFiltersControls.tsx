import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./OffersFiltersControls.css";
import {
  useMakes,
  type MakeData,
  type ModelData,
} from "../../Context/MakesContext";
import FiltersDropdown from "../FiltersDropdown/FiltersDropdown";

export interface OffersFiltersControlsResult {
  onlyFavourites: boolean;
  createdById?: string;
  selMakes: MakeData[];
  selModels: ModelData[];
}

interface Props {
  handleFiltersResult: (filtersResult: OffersFiltersControlsResult) => void;
  handleLoadingTimeout: (loadingTimeout: boolean) => void;
}

const OffersFiltersControls = ({
  handleFiltersResult,
  handleLoadingTimeout,
}: Props) => {
  const { makes, loading } = useMakes();
  const [onlyFavourites, setOnlyFavourites] = useState<boolean>(false);
  const [createdById, setCreatedById] = useState<string>();
  const [selectedMakes, setSelectedMakes] = useState<MakeData[]>([]);
  const [selectedModels, setSelectedModels] = useState<ModelData[]>([]);
  const [searchParams] = useSearchParams();
  const [isInitialized, setIsInitialized] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    handleLoadingTimeout(true);
    if (!isInitialized) return;

    const filtersResult: OffersFiltersControlsResult = {
      onlyFavourites: onlyFavourites,
      createdById: createdById,
      selMakes: selectedMakes,
      selModels: selectedModels,
    };

    handleLoadingTimeout(true);

    const timer = setTimeout(() => {
      handleLoadingTimeout(false);

      handleFiltersResult(filtersResult);
    }, 500); // wait 500ms for more changes

    return () => clearTimeout(timer);
  }, [createdById, selectedModels, selectedMakes, isInitialized]);

  // Use URL search params
  useEffect(() => {
    if (makes.length === 0) return;// wait until makes and models will be available

    setOnlyFavouritesFromUrl();
    setCreatedByFromUrl();
    setMakesModelsFromUrl();

    setIsInitialized(true);
  }, [searchParams, makes]);

  const setOnlyFavouritesFromUrl = () => {
    const onlyFavouritesFromUrl = searchParams.get("onlyFavourites") === "true";
    setOnlyFavourites(onlyFavouritesFromUrl);
  }

  const setCreatedByFromUrl = () => {
    const createdByFromUrl = searchParams.get("createdById") || "";
    setCreatedById(createdByFromUrl);
  }

  const setMakesModelsFromUrl = () => {
    const makesFromUrl = searchParams.get("make")?.split(",") || [];
    const modelsFromUrl = searchParams.get("model")?.split(",") || [];

    const makesToSelect = makesFromUrl
      .map((makeSlug) => makes.find((make) => make.make_slug === makeSlug))
      .filter((m): m is MakeData => m !== undefined);

    const availableModels = getAvailableModels(makesToSelect);

    const modelsToSelect = modelsFromUrl.flatMap((id) =>
      availableModels.filter((m) => m.model_id === Number.parseInt(id))
    );

    setSelectedMakes(makesToSelect);
    setSelectedModels(modelsToSelect);
  };

  // Update URL dynamically
  const updateUrl = (updatedMakes: MakeData[], updatedModels: ModelData[]) => {
    const updMakesString = updatedMakes.map((make) => make.make_slug);
    const updModelsString = updatedModels.map((model) => model.model_id);

    const params = new URLSearchParams();
    if (updMakesString.length) params.set("make", updMakesString.join(","));
    if (updModelsString.length) params.set("model", updModelsString.join(","));
    navigate(
      `/passenger-cars${params.toString() ? `?${params.toString()}` : ""}`
    );
  };

  const getAvailableModels = (selMakes: MakeData[] = selectedMakes) => {
    return selMakes
      .flatMap((makeData) => Object.values(makeData?.models))
      .filter(Boolean);
  };

  const onMakesSelected = (selMakes: MakeData[]) => {
    setSelectedMakes(selMakes);

    // Keep only selected models that are still available
    const validModels = getAvailableModels(selMakes).filter((model) =>
      selectedModels.includes(model)
    );
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
        searchInputPlaceholder="Search manufacturer"
      />

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
        searchInputPlaceholder="Search model"
      />
    </section>
  );
};

export default OffersFiltersControls;
