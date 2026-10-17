// Copy a recipe, never a previous drinking experience or record identity.
export function repeatBrew(coffee, today = new Date().toLocaleDateString('sv-SE')) {
  const details = coffee.brewDetails || {};
  const recipe = {};
  for (const key of ['doseGrams','waterGrams','grinder','dripper','filter','roastDate','openedDate','pourText','pourMode','recipeText']) {
    if (details[key] !== undefined) recipe[key] = details[key];
  }
  return {beanName:coffee.bean || '',roastery:coffee.roastery || '',originCountry:coffee.raw?.originCountry || coffee.raw?.origin_country || coffee.origin || '',process:coffee.process || '',roastLevel:coffee.roast || '',brewMethod:coffee.brew || '',waterTemp:coffee.waterTemp ?? '',grindSize:coffee.grindSize || '',brewTime:coffee.brewTime ?? '',drinkDate:today,tasteNote:'',memo:'',cupNotes:'',brewDetails:recipe};
}

export function recipeChanges(previous, current) {
  const fields = [['추출 방식','brewMethod'],['물 온도 (℃)','waterTemp'],['분쇄도','grindSize'],['추출 시간 (초)','brewTime'],['원두량 (g)','doseGrams',true],['물 총량 (g)','waterGrams',true],['드리퍼','dripper',true],['필터','filter',true],['그라인더','grinder',true],['푸어량','pourText',true],['푸어량 표기','pourMode',true]];
  const text = value => value === undefined || value === null || value === '' ? '' : String(value).trim();
  return fields.map(([label,key,detail])=>({label,before:text(detail?previous.brewDetails?.[key]:previous[key]),after:text(detail?current.brewDetails?.[key]:current[key])})).filter(row=>row.before!==row.after);
}
