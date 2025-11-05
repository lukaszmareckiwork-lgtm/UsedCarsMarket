import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface ModelData {
    model_name: string;
    vehicle_type: string;
    years: number[];
}

interface MakeData {
    make_id: number;
    make_name: string;
    make_slug: string;
    models: Record<string, ModelData>;
}

interface MakesContextType {
    makes: MakeData[];
    loading: boolean;
}

const MakesContext = createContext<MakesContextType>({ makes: [], loading: true });

export const MakesProvider = ({ children }: { children: ReactNode }) => {
    const [makes, setMakes] = useState<MakeData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        // Simulate slow network (2 seconds)
        setTimeout(() => {
            fetch("/data/cars_types_data/makes_and_models.json")
                .then(res => res.json())
                .then(data => {
                    setMakes(data);
                    setLoading(false);
                });
        }, 2000);
    }, []);

    return (
        <MakesContext.Provider value={{ makes, loading }}>
            {children}
        </MakesContext.Provider>
    );
};

export const useMakes = () => useContext(MakesContext);
