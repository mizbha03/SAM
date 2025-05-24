import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './login';
import StudentDashboard from './Student_Dashboard';
import AdminDashboard from './Admin_Dashboard';
import SuperAdminDashboard from './SuperAdmin_Dashboard';

function App() {

  global.url = "http://localhost:8080";
//  http://localhost:5007/api/Auth/login
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/Student_Dashboard" component={StudentDashboard} />
        <Route path="/Admin_Dashboard" component={AdminDashboard} />
        <Route path="/SuperAdmin_Dashboard" component={SuperAdminDashboard} />
      </Switch>
    </Router>
  );
}

export default App;
