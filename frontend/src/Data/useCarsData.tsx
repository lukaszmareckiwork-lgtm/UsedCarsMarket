import { useEffect, useState } from "react";

interface CarModel {
  model_id: number;
  model_name: string;
  years: number[];
}

interface CarMake {
  make_id: number;
  make_name: string;
  make_slug: string;
  models: Record<string, CarModel>;
}

interface CarStyles {
  [modelName: string]: {
    [styleName: string]: {
      years: number[];
    };
  };
}

export function useCarsData() {
  const [makes, setMakes] = useState<CarMake[]>([]);
  const [styles, setStyles] = useState<Record<string, CarStyles>>({});

  useEffect(() => {
    fetch("/data/cars_types_data/makes_and_models.json")
      .then(res => res.json())
      .then(setMakes);
  }, []);

  const loadStyles = async (makeSlug: string) => {
    const res = await fetch(`/data/cars_types_data/styles/${makeSlug}.json`);
    const data = await res.json();
    setStyles(prev => ({ ...prev, [makeSlug]: data }));
  };

  return { makes, styles, loadStyles };
}