import { coffeeApi } from "../api/coffeeApi.js";
import { adaptCoffeeLog } from "../api/adapters.js";
import { coffeeLogs as fallbackLogs } from "../data/sampleData.js";
import { useApiResource } from "./useApiResource.js";

export function useCoffeeLog(params = {}) {
  const fallback = fallbackLogs.map(adaptCoffeeLog);
  const resource = useApiResource(
    () => coffeeApi.list(params).then((items) => items.map(adaptCoffeeLog)),
    fallback,
    [JSON.stringify(params)]
  );

  return { coffeeLogs: resource.data, ...resource };
}
