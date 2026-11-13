import {hasColor,monthlyGroups} from './monthlyColors.js';
import {catalogAvailability} from './catalogAvailability.js';
import {parseTasteQuery,matchesTasteQuery} from './tasteQuery.js';
const searchText=bean=>[bean.name,bean.nameEnglish,bean.owner?.roastery,bean.origin,bean.process,bean.variety,bean.roast,...(bean.flavors||[])].filter(Boolean).join(' ').toLocaleLowerCase();
export function filterMonthlyBeans(items,{category='all',color='all',query='',available=false,hideDecaf=false}={}){
 const parsed=parseTasteQuery(query.trim());
 return items.filter(bean=>(category==='all'||bean.category===category)&&hasColor(bean,color)&&(!hideDecaf||!bean.decaf)&&(!available||catalogAvailability(bean.owner,bean)==='available')&&matchesTasteQuery(bean,parsed,searchText(bean)));
}
export function groupMonthlyBeans(items){
 const keys=[...Object.keys(monthlyGroups),'other'];
 return keys.map(key=>({key,group:monthlyGroups[key]||{label:'미분류',color:'#526849',tint:'#eaf0e3'},items:items.filter(bean=>key==='other'?!Object.hasOwn(monthlyGroups,bean.category):bean.category===key)})).filter(group=>group.items.length);
}
