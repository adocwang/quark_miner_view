import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'element-react';

import 'element-theme-default';
class App extends Component {
  render() {
    return ReactDOM.render(<Button type="primary">Hello</Button>, document.getElementById('app'));
  }
}

export default App;
