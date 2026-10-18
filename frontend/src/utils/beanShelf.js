import {validateBeansFile} from './beanInventory.js';
export function shelfBeans(beans){return validateBeansFile({schemaVersion:1,beans}).map(x=>({...x,bean:x.name,date:x.purchaseDate||x.roastDate||'',brewDetails:{},memo:'',brew:''}));}
export function checkedBeanPhotos(rows){
 if(!Array.isArray(rows)||rows.length>12)throw Error('원두 사진은 최대 12장 보관할 수 있어요.');
 const ids=new Set();return rows.map(row=>{if(!row||typeof row.id!=='string'||!row.id||row.id.length>300||ids.has(row.id)||typeof row.data!=='string'||row.data.length>400000||!/^data:image\/webp;base64,UklGR[A-Za-z0-9+/]*={0,2}$/.test(row.data))throw Error('원두 사진 형식을 확인해 주세요.');ids.add(row.id);return {id:row.id,data:row.data};});
}
export async function beanPhoto(file){
 if(!file||!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>10000000)throw Error('10MB 이하의 JPG·PNG·WebP 사진을 골라주세요.');
 const bitmap=await createImageBitmap(file);try{const scale=Math.min(1,800/Math.max(bitmap.width,bitmap.height));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);const data=canvas.toDataURL('image/webp',.8);checkedBeanPhotos([{id:'check',data}]);return data;}finally{bitmap.close();}
}
