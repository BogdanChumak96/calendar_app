import { Component, ErrorInfo, ReactNode } from "react";
import { Typography, Button } from "@mui/material";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });
  }

  handleResetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <Typography variant='h5' color='error'>
            Something went wrong.
          </Typography>
          <Typography>
            {this.state.error?.message || "An unexpected error occurred."}
          </Typography>
          <Button variant='contained' onClick={this.handleResetError}>
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
