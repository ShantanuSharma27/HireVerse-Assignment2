
import HomePage from "./components/pages/HomePage";
import Dashboard from "./components/pages/Dashboard";
import { Routes,Route } from "react-router-dom";
import "./App.css";
function App() {
 return<div className="App">
  <Routes>
    <Route path="/" Component={HomePage}/>
    <Route path="/Dashboard" Component={Dashboard}/>
  </Routes>
 </div>
}

export default App;
