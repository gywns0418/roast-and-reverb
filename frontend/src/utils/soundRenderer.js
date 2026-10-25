import {createScore,encodeWave,seededRandom} from './soundStudio.js';

export async function renderSound(settings,seed,version=1) {
  const Offline=globalThis.OfflineAudioContext||globalThis.webkitOfflineAudioContext;
  if(!Offline)throw new Error('이 브라우저에서는 음악을 만들 수 없습니다. 최신 Chrome, Edge 또는 Safari를 이용해 주세요.');
  const score=createScore(settings,seed,version), rate=32000;
  const context=new Offline(2,Math.ceil(score.duration*rate),rate);
  const master=context.createGain();master.gain.setValueAtTime(0,0);master.gain.linearRampToValueAtTime(.8,1);master.gain.setValueAtTime(.8,score.duration-4);master.gain.linearRampToValueAtTime(0,score.duration-.05);
  const compressor=context.createDynamicsCompressor();compressor.threshold.value=-14;compressor.ratio.value=4;master.connect(compressor);compressor.connect(context.destination);
  const delay=context.createDelay(1), wet=context.createGain(), feedback=context.createGain();
  delay.delayTime.value=60/score.settings.bpm*.75;wet.gain.value=score.settings.space*.35;feedback.gain.value=.28;delay.connect(feedback);feedback.connect(delay);delay.connect(wet);wet.connect(master);
  const random=seededRandom(seed+17), noise=context.createBuffer(1,rate*.1,rate), samples=noise.getChannelData(0);
  for(let i=0;i<samples.length;i++)samples[i]=random()*2-1;
  for(const note of score.notes) {
    const envelope=context.createGain();envelope.connect(master);if(note.kind==='piano')envelope.connect(delay);
    const t=note.time+.02, end=t+note.duration;
    envelope.gain.setValueAtTime(0,t);envelope.gain.linearRampToValueAtTime(note.gain,t+(note.kind==='pad'?.3:.008));envelope.gain.exponentialRampToValueAtTime(.0001,end);
    if(note.kind==='brush') {
      const source=context.createBufferSource(),filter=context.createBiquadFilter();source.buffer=noise;filter.type='highpass';filter.frequency.value=5500;source.connect(filter);filter.connect(envelope);source.start(t);source.stop(end);continue;
    }
    const frequency=440*Math.pow(2,(note.midi-69)/12);
    const partials=note.kind==='piano'?[[1,1],[2,.2],[3,.06]]:[[1,1]];
    for(const [multiple,volume] of partials) {
      const source=context.createOscillator(), level=context.createGain();source.type='sine';source.frequency.value=frequency*multiple;level.gain.value=volume;source.connect(level);level.connect(envelope);source.start(t);source.stop(end+.02);
    }
  }
  const rendered=await context.startRendering();
  return {blob:new Blob([encodeWave([rendered.getChannelData(0),rendered.getChannelData(1)],rate)],{type:'audio/wav'}),duration:rendered.duration};
}
