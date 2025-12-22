import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useRef, useState } from "react";
import { LocationPicker, LocationPickerModeEnum } from "../LocationPicker/LocationPicker";
import "./FiltersLocationPicker.css";
import { FaMapMarkedAlt } from "react-icons/fa";
import { getPlaceName } from "../../Services/MapboxService";
import { PiLineVertical } from "react-icons/pi";
import RedCrossButton from "../RedCrossButton/RedCrossButton";

interface FiltersLocationPickerProps {
  initialCoordinates?: { lat: number; lng: number };
  onLocationSelected: (lat: number, lng: number, placeName: string, range: number) => void;
  targetCoordinates?: { lat: number; lng: number };
  targetRange?: number;
  targetName: string;
  onLocationCleared: () => void;
  offersFound: number;
}

export default function FiltersLocationPicker({
  initialCoordinates,
  onLocationSelected,
  targetCoordinates,
  targetRange,
  targetName,
  onLocationCleared,
  offersFound: totalCount,
}: FiltersLocationPickerProps) {
  const [open, setOpen] = useState(false);

  const [finalTargetName, setFinalTargetName] = useState("");
  const isActive = targetRange !== undefined && targetCoordinates !== undefined;

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!targetCoordinates || !targetRange) return;

    // If name provided by parent → use and skip fetch
    if (targetName) {
      setFinalTargetName(targetName);
      fetchedRef.current = true;
      return;
    }

    // If we already fetched for this set of coordinates → skip
    if (fetchedRef.current) return;

    const fetchName = async () => {
      const name = await getPlaceName(targetCoordinates!.lng, targetCoordinates!.lat);
      setFinalTargetName(name);
      fetchedRef.current = true;
      // console.log("Fetched name: " + name);
    };

    fetchName();
  }, [targetCoordinates?.lat, targetCoordinates?.lng, targetRange, targetName]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
        {/* Button that opens the dialog */}
        <Dialog.Trigger asChild>
          <button className="location-filter-trigger">
            {!targetCoordinates && <div className="location-filter-trigger-choose">
              Choose Location
            </div>}
            
            {isActive && <div className="location-filter-trigger-chosen">
              <span className="location-filter-trigger-chosen-name">{finalTargetName}</span>
            </div>}
            <div className="location-filter-trigger-right-side">
              {isActive && <PiLineVertical size={22} color="#ddddddff" />}
              {isActive && <span className="location-filter-trigger-chosen-range">{`+${targetRange}km`}</span>}
              <RedCrossButton renderButton={isActive} onClicked={() => onLocationCleared()} />
              <FaMapMarkedAlt className="location-filter-trigger-map-icon" size={22}/>
            </div>
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          {/* Overlay */}
          <Dialog.Overlay className="flp-overlay" />

          {/* Content */}
          <Dialog.Content className="flp-content">
            <Dialog.Title className="flp-title">Pick Location</Dialog.Title>
            <Dialog.Description className="sr-only">
              Select the location and range for filtering offers.
            </Dialog.Description>

            <div className="flp-map-wrapper">
              <LocationPicker
                mode={LocationPickerModeEnum.PickRange}
                initialCoordinates={initialCoordinates}
                onChange={(lat, lng, placeName, range) => {
                  onLocationSelected(lat, lng, placeName, range!);
                }}
                targetCoordinates={targetCoordinates}
                targetRange={targetRange}
              />
            </div>

            <div className="flp-actions">
              <p className="flp-offers-found">
                {`Offers found: ${totalCount.toLocaleString()}`}
              </p>
              <div className="flp-actions-buttons">
                <button className="flp-clear-btn main-button" onClick={() => 
                  {                  
                    onLocationCleared();
                  }}>
                  Clear
                </button>
                <Dialog.Close asChild>
                  <button className="flp-close-btn main-button">
                    Close
                  </button>
                </Dialog.Close>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
  );
}
