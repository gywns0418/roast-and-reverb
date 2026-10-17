export function createLoadingController({minimum=2000,now=Date.now,schedule=setTimeout,cancel=clearTimeout}={}) {
  const requests=new Map(),listeners=new Set();
  let snapshot={visible:false},started=0,timer=null;
  const emit=value=>{snapshot=value;listeners.forEach(listener=>listener());};
  return {
    getSnapshot:()=>snapshot,
    subscribe:listener=>{listeners.add(listener);return ()=>listeners.delete(listener);},
    acquire(message){
      const id=Symbol();requests.set(id,message);
      if(timer!==null){cancel(timer);timer=null;}
      if(!snapshot.visible)started=now();
      emit({visible:true,...message});
      return ()=>{
        if(!requests.delete(id))return;
        if(requests.size){emit({visible:true,...[...requests.values()].at(-1)});return;}
        const remaining=Math.max(0,minimum-(now()-started));
        if(remaining===0)emit({visible:false});
        else timer=schedule(()=>{timer=null;if(!requests.size)emit({visible:false});},remaining);
      };
    }
  };
}
export const loadingController=createLoadingController();
