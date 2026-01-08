import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { makesGetApi, modelsGetApi } from "@services/MakesService";
import { toast } from "react-toastify";

export interface ModelData {
  modelId: number;
  modelName: string;
  offersCount: number;
}

export interface MakeData {
  makeId: number;
  makeName: string;
  makeSlug: string;
  models: Record<string, ModelData>;
  offersCount: number;
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
    refreshMakesAndModels();
  }, []);

  const refreshMakesAndModels = async () => {
    setLoading(true);
    try {
      const makesRes = await getMakes();
      const makesIds = makesRes!.map((x) => x.makeId);

      const modelsRes = await getModels(makesIds);

      const makesData: MakeData[] = makesRes!.map((makeDto) => ({
        makeId: makeDto.makeId,
        makeName: makeDto.makeName,
        makeSlug: makeDto.makeSlug,
        models: {},
        offersCount: makeDto.offersCount,
      }));

      modelsRes?.forEach((modelsResDto) => {
        modelsResDto.models.forEach((modelDto) => {
          const model: ModelData = {
            modelId: modelDto.modelId,
            modelName: modelDto.modelName,
            offersCount: modelDto.offersCount,
          };
          const make = makesData.find((m) => m.makeId === modelsResDto.makeId);
          if (make) make.models[model.modelId] = model;
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
