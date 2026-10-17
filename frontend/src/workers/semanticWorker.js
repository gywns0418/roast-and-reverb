import { pipeline, env } from "@huggingface/transformers";
import wasmFactory from "onnxruntime-web/ort-wasm-simd-threaded.mjs?url";
import wasmBinary from "onnxruntime-web/ort-wasm-simd-threaded.wasm?url";
env.allowLocalModels=false;
// Serve the lockfile-pinned runtime ourselves; do not execute CDN/blob factories.
env.useWasmCache=false;
env.backends.onnx.wasm.wasmPaths={mjs:wasmFactory,wasm:wasmBinary};
env.backends.onnx.wasm.numThreads=1;
let encoder=null;const cache=new Map();let chain=Promise.resolve();
self.onmessage=event=>{const {id,texts}=event.data;chain=chain.catch(()=>{}).then(async()=>{try{
  encoder ||= await pipeline("feature-extraction","Xenova/multilingual-e5-small",{revision:"761b726dd34fb83930e26aab4e9ac3899aa1fa78",dtype:"q8",device:"wasm",progress_callback:p=>self.postMessage({id,progress:{status:p.status,file:p.file,progress:p.progress}})});
  const results=[];
  for(let i=0;i<texts.length;i++) {const text=texts[i];if(!cache.has(text)){const output=await encoder(text,{pooling:"mean",normalize:true});cache.set(text,Array.from(output.data));}
    results.push(cache.get(text));self.postMessage({id,progress:{status:"encoding",progress:Math.round((i+1)/texts.length*100)}});
  }
  if(cache.size>400)cache.clear();self.postMessage({id,vectors:results});
}catch(error){encoder=null;self.postMessage({id,error:error.message || "모델 실행 실패"});}});};
