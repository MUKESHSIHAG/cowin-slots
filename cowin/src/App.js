import { BrowserRouter as Router, Route } from 'react-router-dom'
import Home from './components/Home';
import Notify from './components/Notify'

function App() {
  return (
    <Router>
      <div className="App">
        <switch>
          <Route exact path="/" component={Home} />
          <Route path="/home" component={Home} />
          <Route path="/notify" component={Notify} />
        </switch>
      </div>
    </Router>
  );
}

export default App;
