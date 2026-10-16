import {Component} from 'react';
export default class AppErrorBoundary extends Component{
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?<main className="page cover-page"><section className="cover-card"><p className="eyebrow">ROAST & REVERB</p><h1>화면을 불러오지 못했어요.</h1><p>네트워크 연결을 확인하고 다시 열어 주세요. 저장된 자료는 지우지 않았습니다.</p><button className="primary-button" onClick={()=>window.location.reload()}>이 화면 다시 열기</button></section></main>:this.props.children;}
}
