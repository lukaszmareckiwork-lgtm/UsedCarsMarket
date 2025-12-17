import { useEffect, useRef, useState } from "react";
import "./OffersFiltersControls.css";
import { useMakes, type MakeData, type ModelData } from "../../Context/MakesContext";
import FiltersDropdown from "../FiltersDropdown/FiltersDropdown";
import type { OfferQueryObject } from "../../Data/OfferQueryObject";
import { FiltersInputNumber } from "../FiltersInput/FiltersInputNumber";
import { FiltersInputString } from "../FiltersInput/FiltersInputString";
import { FuelTypeEnum, getReadableFuelType, getReadableTransmissionType, TransmissionTypeEnum } from "../../Data/OfferProps";
import FiltersInputFrame from "../FiltersInputFrame/FiltersInputFrame";
import FiltersLocationPicker from "../FiltersLocationPicker/FiltersLocationPicker";

interface Props {
  query: OfferQueryObject;
  updateFilters: (updates: Partial<OfferQueryObject>) => void;
  toggleFavouriteFilter: () => void;
  offersFound: number;
}

const OffersFiltersControls = ({
  query,
  updateFilters,
  offersFound,
}: Props) => {
  const { makes, loading } = useMakes();
  const [selectedMakes, setSelectedMakes] = useState<MakeData[]>([]);
  const [selectedModels, setSelectedModels] = useState<ModelData[]>([]);
  
  const [selectedTransmissionTypes, setSelectedTransmissionTypes] = useState<TransmissionTypeEnum[]>([]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<FuelTypeEnum[]>([]);

  const [locationName, setLocationName] = useState<string>("");
  const locationNameRef = useRef<string>(locationName);

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

  const transmissionOptions: TransmissionTypeEnum[] =
    Object.values(TransmissionTypeEnum).filter(v => typeof v === "number") as TransmissionTypeEnum[];

  const fuelTypeOptions: FuelTypeEnum[] =
    Object.values(FuelTypeEnum).filter(v => typeof v === "number") as FuelTypeEnum[];

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

      <FiltersInputString
        placeholder="Search"
        initialValue={query.Search}
        onValueChanged={x => updateFilters({ Search: x, PageNumber: 1 })}
        onClearClicked={() => updateFilters({ Search: null, PageNumber: 1})}
      />

      <div className="car-filters-min-max-field">
        <FiltersInputNumber
          placeholder="Price from"
          initialValue={query.MinPrice}
          onValueChanged={x => updateFilters({ MinPrice: x, PageNumber: 1 })}
          onClearClicked={() => updateFilters({ MinPrice: null, PageNumber: 1})}
        />
        <FiltersInputNumber
          placeholder="Price to"
          initialValue={query.MaxPrice}
          onValueChanged={x => updateFilters({ MaxPrice: x, PageNumber: 1 })}
          onClearClicked={() => updateFilters({ MaxPrice: null, PageNumber: 1})}
        />
      </div>

      <div className="car-filters-min-max-field">
        <FiltersInputNumber
          placeholder="Year from"
          initialValue={query.MinYear}
          onValueChanged={x => updateFilters({ MinYear: x, PageNumber: 1 })}
          onClearClicked={() => updateFilters({ MinYear: null, PageNumber: 1})}
        />
        <FiltersInputNumber
          placeholder="Year to"
          initialValue={query.MaxYear}
          onValueChanged={x => updateFilters({ MaxYear: x, PageNumber: 1 })}
          onClearClicked={() => updateFilters({ MaxYear: null, PageNumber: 1})}
        />
      </div>

      <div className="car-filters-min-max-field">
        <FiltersInputNumber
          placeholder="Mileage from"
          initialValue={query.MinMileage}
          onValueChanged={x => updateFilters({ MinMileage: x, PageNumber: 1 })}
          onClearClicked={() => updateFilters({ MinMileage: null, PageNumber: 1})}
        />
        <FiltersInputNumber
          placeholder="Mileage to"
          initialValue={query.MaxMileage}
          onValueChanged={x => updateFilters({ MaxMileage: x, PageNumber: 1 })}
          onClearClicked={() => updateFilters({ MaxMileage: null, PageNumber: 1})}
        />
      </div>

      <FiltersDropdown<FuelTypeEnum>
        items={fuelTypeOptions}
        selectedItems={selectedFuelTypes}
        handleItemSelected={(selected) =>{ 
            setSelectedFuelTypes(selected);
            updateFilters({ FuelTypes: selected });
          }
        }
        
        getId={(x) => x} // numbers are fine as keys
        getDisplayName={(x) => getReadableFuelType(x)}
        getSimplifiedName={(x) => getReadableFuelType(x).toLowerCase()}
        
        loading={false}
        forceDisable={false}
        headerText="Fuel type"
        searchInputPlaceholder="Search fuel type..."
      />

      <FiltersDropdown<TransmissionTypeEnum>
        items={transmissionOptions}
        selectedItems={selectedTransmissionTypes}
        handleItemSelected={(selected) =>{ 
            setSelectedTransmissionTypes(selected);
            updateFilters({ TransmissionTypes: selected });
          }
        }
        
        getId={(x) => x} // numbers are fine as keys
        getDisplayName={(x) => getReadableTransmissionType(x)}
        getSimplifiedName={(x) => getReadableTransmissionType(x).toLowerCase()}
        
        loading={false}
        forceDisable={false}
        headerText="Transmission"
        searchInputPlaceholder="Search transmission..."
      />
      <FiltersInputFrame>
        <FiltersLocationPicker
          // initialCoordinates={filters.InitialLocation ?? undefined}
          onLocationSelected={(lat, lng, name, range) => {
            console.log({ lat, lng, name, range });
            updateFilters({
              LocationLat: lat,
              LocationLong: lng,
              LocationRange: range,
            });
            setLocationName(name);
            // locationNameRef.current = name;
          }}
          targetCoordinates={
            typeof query?.LocationLat === "number"
              ? { lat: query.LocationLat!, lng: query.LocationLong! }
              : undefined
          }
          targetRange={
            typeof query?.LocationRange === "number"
              ? query.LocationRange
              : undefined
          }
          // targetName={locationNameRef.current}
          targetName={locationName}
          onLocationCleared={() =>{
            updateFilters({
              LocationLat: undefined,
              LocationLong: undefined,
              LocationRange: undefined
            });
            setLocationName("");
          }}
          offersFound={offersFound}
        />
      </FiltersInputFrame>
    </section>
  );
};

export default OffersFiltersControls;
