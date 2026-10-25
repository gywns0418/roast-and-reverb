export function coffeeEditForm(cup) {
  return {
    beanName: cup.bean || "",
    roastery: cup.roastery || "",
    originCountry:
      cup.raw?.originCountry || cup.raw?.origin_country || cup.origin || "",
    process: cup.process || "",
    brewMethod: cup.brew || "",
    roastLevel: cup.roast || "",
    memo: cup.memo || "",
    tasteNote: cup.raw?.tasteNote || cup.raw?.taste_note || "",
    drinkDate: (cup.date || "").replaceAll(".", "-"),
    waterTemp: cup.waterTemp,
    grindSize: cup.grindSize,
    brewTime: cup.brewTime,
    acidity: cup.acidity,
    sweetness: cup.sweetness,
    bitterness: cup.bitterness,
    body: cup.body,
    aroma: cup.aroma,
    brewDetails: cup.brewDetails || {},
  };
}
export function changeCoffeeNote(form, note) {
  return {
    ...form,
    memo: note,
    brewDetails: { ...form.brewDetails, momentNote: note },
  };
}
