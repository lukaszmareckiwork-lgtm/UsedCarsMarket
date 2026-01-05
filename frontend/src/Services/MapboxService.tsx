import axios from "axios";
import { handleError } from "@helpers/handleError";

export const getPlaceName = async (lng: number, lat: number) =>{
    try {
        const userLang = navigator.language.split("-")[0]; // "en", "fr", etc.
        const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN || "";

        const { data } = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`,
        {
            params: {
                types: "place",
                // types: "address,neighborhood,locality,place",
                language: userLang,
                access_token: mapboxToken,
            },
        });

        // console.log(data.features[0]);

        if (data?.features?.length > 0) 
            return data.features[0].place_name;
        else 
            return "";
    } catch (error) {
        handleError(error);
        return "";
    }
};