//import modules
import './App.css';
import Users from './components/Users';
import {BrowserRouter as Router, Route,Switch} from 'react-router-dom';
import CreateUser from './components/CreateUser';
import EditUser from './components/EditUser';
//root component
function App() {
  return (
    <>
    <Router>
      <Switch>
        <Route exact={true} path ="/" component={Users}/>
        <Route path="/create" component={CreateUser}/>
        <Route path="/edit/:id" component={EditUser}/>
      </Switch>
    </Router>
     
    </>
  );
}

export default App;
