import { coffeeApi } from "./coffeeApi.js";
import { adaptCoffeeLog } from "./adapters.js";
import { coffeeEditForm } from "../utils/coffeeEdit.js";
import { coffeePayload } from "../utils/brewDetails.js";

// Reads the stored record first so every other field is saved back unchanged.
export async function saveCoffeeVerdict(id, verdict) {
  const current = adaptCoffeeLog(await coffeeApi.detail(id));
  const form = coffeeEditForm(current);
  const brewDetails = { ...form.brewDetails };
  if (verdict) brewDetails.verdict = verdict;
  else delete brewDetails.verdict;
  const payload = coffeePayload({ ...form, brewDetails });
  const result = await coffeeApi.update(id, payload);
  return adaptCoffeeLog({ ...current.raw, ...payload, ...result, id });
}
