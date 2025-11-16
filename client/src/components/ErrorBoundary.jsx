import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state = { hasError:false }; }
  static getDerivedStateFromError(){ return { hasError:true }; }
  componentDidCatch(err, info){ console.error('ErrorBoundary caught', err, info); }
  render(){ return this.state.hasError ? <div className="center">Something went wrong.</div> : this.props.children; }
}
