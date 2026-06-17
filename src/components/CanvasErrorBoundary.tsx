import { Component, type ReactNode } from 'react';

type Props = { fallback: ReactNode; children: ReactNode };
type State = { failed: boolean };

/**
 * Catches render-time failures from the R3F Canvas / postprocessing pipeline
 * (e.g. a GPU lacking ANGLE_instanced_arrays, a shader that won't validate, or a
 * lost context) and shows a static DOM fallback instead of white-screening the
 * entire app. Without this, an uncaught throw inside the Canvas tree unmounts the
 * whole React root — taking the nav and all page content with it.
 */
export class CanvasErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    // Genuine error path — log so a real failure isn't swallowed silently.
    console.error('[CanvasErrorBoundary] 3D scene failed; using DOM fallback:', error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
