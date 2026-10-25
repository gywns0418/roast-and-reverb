export function catalogAvailability(product,bean,today=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Seoul'}).format(new Date())){
 if(product?.saleEnd&&today>product.saleEnd)return 'ended';
 if(product?.saleStart&&today<product.saleStart)return 'upcoming';
 return bean.availability||'unknown';
}
