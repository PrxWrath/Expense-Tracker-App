import React, { Suspense } from "react";
import { Route, Switch} from "react-router-dom";
import Header from "./components/Layout/NavHeader";
import Loader from "./components/Layout/Loader";
import { useSelector } from "react-redux";
import Expenses from "./components/Expenses/Expenses";

const UserForm = React.lazy(()=>import("./components/Auth/UserForm"));
const App = () => {
  const isLoggedIn = useSelector(state=>state.auth.isLoggedIn);

  return (
    <div className="app-interface">
      <Header/>
      <Suspense fallback={<Loader/>}>
        <Switch>
          <Route exact path='/auth'>
            {!isLoggedIn&&<UserForm/>}
            {isLoggedIn&& <Expenses/>}
          </Route>
          <Route exact path='/'>
            {!isLoggedIn&&<UserForm/>}
            {isLoggedIn&& <Expenses/>}
          </Route>
        </Switch>
      </Suspense>
    </div>
  );
};

export default App;
