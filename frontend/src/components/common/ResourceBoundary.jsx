import { Component } from "react";
export default class ResourceBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error)
      return (
        <section className="page">
          <div className="resource-error" role="alert">
            <strong>기록을 불러오지 못했습니다.</strong>
            <p>{this.state.error.message}</p>
            <button
              className="ghost-button"
              onClick={() => window.location.reload()}
            >
              다시 시도
            </button>
          </div>
        </section>
      );
    return this.props.children;
  }
}
