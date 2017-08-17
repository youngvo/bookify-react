import { Component } from 'react';

export class CrashReporter extends Component {
  constructor(props) {
    super(props);
    this.state = { hasCrash: false, error: null, info: null };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasCrash: true, error: error, info: info });
    // You can also log the error to an error reporting service
    //logErrorToMyService(error, info);
    console.log('componentDidCatch', error, info);
  }

  render() {
    if (this.state.hasCrash) {
      // You can render any custom fallback UI
      console.log('render', this.state.error, this.state.info);
      //return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
