import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { makesGetApi, modelsGetApi } from "../Services/MakesService";
import { toast } from "react-toastify";

export interface ModelData {
  model_id: number;
  model_name: string;
  vehicle_type: string;
  years: number[];
  offers_count: number;
}

export interface MakeData {
  make_id: number;
  make_name: string;
  make_slug: string;
  models: Record<string, ModelData>;
  offers_count: number;
}

interface MakesContextType {
  makes: MakeData[];
  loading: boolean;
}

const MakesContext = createContext<MakesContextType>({
  makes: [],
  loading: true,
});

export const MakesProvider = ({ children }: { children: ReactNode }) => {
  const [makes, setMakes] = useState<MakeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // Simulate slow network (1 second)
    // setTimeout(() => {
    //     fetch("/data/cars_types_data/makes_and_models.json")
    //         .then(res => res.json())
    //         .then(data => {
    //             setMakes(data);
    //             setLoading(false);
    //         });
    // }, 1000);
    refreshMakesAndModels();
  }, []);

  const refreshMakesAndModels = async () => {
    setLoading(true);
    try {
      const makesRes = await getMakes();
      const makesIds = makesRes!.map((x) => x.makeId);

      const modelsRes = await getModels(makesIds);

      const makesData: MakeData[] = makesRes!.map((makeDto) => ({
        make_id: makeDto.makeId,
        make_name: makeDto.makeName,
        make_slug: makeDto.makeSlug,
        models: {},
        offers_count: makeDto.offersCount,
      }));

      modelsRes?.forEach((modelsResDto) => {
        modelsResDto.models.forEach((modelDto) => {
          const model: ModelData = {
            model_id: modelDto.modelId,
            model_name: modelDto.modelName,
            offers_count: modelDto.offersCount,
            years: [],
            vehicle_type: "",
          };
          const make = makesData.find((m) => m.make_id === modelsResDto.makeId);
          if (make) make.models[model.model_id] = model;
        });
      });

      setMakes(makesData);
    } catch (e) {
      console.error(e);
      toast.warning("Server error occurred");
    } finally {
      setLoading(false);
    }
  };

  // const refreshMakesAndModels = () =>{
  //     getMakes()?.then((res) => {
  //         console.log("getMakes res:", res);

  //         var makesData: MakeData[] = [];

  //         var makes = res!;
  //         var makesIds = makes.map(x => x.makeId);
  //         console.log(`getMakes makes `, makes);
  //         console.log(`getMakes makeIds `, makesIds);

  //         makes.forEach(makeDto => {
  //             const make: MakeData = {
  //                 make_id: makeDto.makeId,
  //                 make_name: makeDto.makeName,
  //                 make_slug: makeDto.makeSlug,
  //                 models: {},
  //                 offers_count: makeDto.offersCount,
  //             }
  //             makesData = [...makesData, make];
  //         });

  //         getModels(makesIds)?.then((res) => {
  //             console.log("getModels res:", res);

  //             const models = res!;

  //             models.forEach(modelsResDto => {
  //                 modelsResDto.models.forEach(modelDto => {
  //                     const model: ModelData = {
  //                         model_id: modelDto.modelId,
  //                         model_name: modelDto.modelName,
  //                         offers_count: modelDto.offersCount,

  //                         years: [],//not used
  //                         vehicle_type: "",//not used
  //                     }
  //                     const make = makesData.find(make => make.make_id == modelsResDto.makeId);
  //                     if(make)
  //                         make.models[model.model_name] = model;
  //                 });
  //             })

  //             console.log(`getModels makesData:`, makesData);
  //             setMakes(makesData);
  //         })
  //     });
  // }

  const getMakes = async () => {
    setLoading(true);

    var res = await makesGetApi()
      ?.then((res) => {
        // console.log("getMakes response:", res);

        return res?.data;
      })
      .catch((e) => {
        console.error("GET MAKES ERROR:", e);
        toast.warning("Server error occured");
        return undefined;
      })
      .finally(() => {
        setLoading(false);
      });

    return res;
  };

  const getModels = async (makesIds: number[]) => {
    setLoading(true);

    var res = await modelsGetApi(makesIds)
      ?.then((res) => {
        // console.log("getMakes response:", res);

        return res?.data;
      })
      .catch((e) => {
        console.error("GET MODELS ERROR:", e);
        toast.warning("Server error occured");
        return undefined;
      })
      .finally(() => {
        setLoading(false);
      });

    return res;
  };

  return (
    <MakesContext.Provider value={{ makes, loading }}>
      {children}
    </MakesContext.Provider>
  );
};

export const useMakes = () => useContext(MakesContext);
