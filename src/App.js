import logo from './logo.svg';
import './App.css';
import Users from './components/Users';
import {BrowserRouter as Router, Route, Link,Switch} from 'react-router-dom';
import CreateUser from './components/CreateUser';
import EditUser from './components/EditUser';
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
