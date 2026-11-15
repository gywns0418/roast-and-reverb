import { useEffect, useState } from "react";
import { monthlyCatalog } from "../api/monthlyCatalog.js";
import { readDevice } from "../store/discoveryStore.js";
import { buildPaletteIndex } from "../utils/cupColor.js";

// Loads the vendor catalog and the drinker's bean inventory once and returns
// the colour index used by cupPalette / spectrumOf.
export function useCupPalette() {
  const [index, setIndex] = useState(() => new Map());
  useEffect(() => {
    let live = true;
    let beans = [];
    try {
      beans = readDevice("beans");
    } catch {
      beans = [];
    }
    setIndex(buildPaletteIndex({ beans }));
    monthlyCatalog()
      .then((catalog) => live && setIndex(buildPaletteIndex({ catalog, beans })))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);
  return index;
}
