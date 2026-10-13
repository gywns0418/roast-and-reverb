export function readBrewDetails(value) {
  if (!value) return {};
  if (typeof value === "object" && !Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : {};
  } catch {
    return {};
  }
}

export function optionalNumber(value) {
  if (value === "" || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function parsePours(text, mode = "individual") {
  if (!text?.trim()) return null;
  const clean = text.replace(/g/gi, "").trim();
  if (!/^[\d\s.,+→>-]+$/.test(clean)) return null;
  const values = clean
    .split(/[\s,+→>]+/)
    .filter(Boolean)
    .map(Number);
  if (
    !values.length ||
    values.some(
      (value) => !Number.isFinite(value) || value <= 0 || value > 5000,
    )
  )
    return null;
  if (
    mode === "cumulative" &&
    values.some((value, index) => index && value <= values[index - 1])
  )
    return null;
  const individual =
    mode === "cumulative"
      ? values.map((value, index) => value - (values[index - 1] || 0))
      : values;
  let total = 0;
  const cumulative = individual.map((value) => (total += value));
  return { individual, cumulative, total };
}

export function brewSummary(details) {
  const dose = optionalNumber(details.doseGrams);
  const water = optionalNumber(details.waterGrams);
  const beverage = optionalNumber(details.beverageGrams);
  return {
    ratio: dose > 0 && water > 0 ? `1:${(water / dose).toFixed(1)}` : null,
    waterDifference:
      water !== null && beverage !== null
        ? Math.round((water - beverage) * 10) / 10
        : null,
    pours: parsePours(details.pourText, details.pourMode),
  };
}

export function coffeePayload(coffee) {
  return {
    ...coffee,
    waterTemp: optionalNumber(coffee.waterTemp),
    brewTime: optionalNumber(coffee.brewTime),
    brewDetails: readBrewDetails(coffee.brewDetails),
  };
}
