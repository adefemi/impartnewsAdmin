import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import MainLayout from "./components/mainLayout/mainLayout";
import Login from "./pages/Auth/login";
import ForgotPassword from "./pages/Auth/forgotPassword";
import ResetPassword from "./pages/Auth/resetPassword";
import Home from "./pages/Home/home";
import NewBlog from "./pages/generic/newBlog";
import Tags from "./pages/generic/tags";
import Markettings from "./pages/generic/marketting";
import NewMarket from "./pages/generic/newMarket";

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/forgot-password" component={ForgotPassword} />
        <Route exact path="/reset-password" component={ResetPassword} />
        <Route
          path="/"
          render={(props) => (
            <MainLayout {...props}>
              <Route exact path="/" component={Home} />
              <Route exact path="/blog/new" component={NewBlog} />
              <Route
                exact
                path="/blog/edit/:uuid"
                component={(props) => <NewBlog {...props} edit />}
              />
              <Route exact path="/tags" component={Tags} />
              <Route exact path="/marketting" component={Markettings} />
              <Route exact path="/marketting/new" component={NewMarket} />
              <Route
                exact
                path="/marketting/edit/:uuid"
                component={(props) => <NewMarket {...props} edit />}
              />
            </MainLayout>
          )}
        />
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
