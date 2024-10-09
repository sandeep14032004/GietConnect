import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Chatpage from "./pages/Chatpage";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" component={Homepage} exact />
          <Route path="/chats" component={Chatpage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
