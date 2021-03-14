import React, {lazy, Suspense} from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {render} from "react-dom";
import "./index.css";
import Spinner from "./components/Spinner/spinner";
import * as serviceWorker from "./serviceWorker";
import ScrollToTop from "./utils/scrollToTop";
import {createBrowserHistory} from "history";
import {Provider} from 'react-redux';
import store from './config/store';

const ProjectListing = lazy(() => import("./pages/Projects/Listing"));
const ProjectDetail = lazy(() => import("./pages/Projects/Detail"));
const TaskDetail = lazy(() => import("./pages/Tasks/Detail"));
const Login = lazy(() => import("./pages/Login/Login"));
const Signup = lazy(() => import("./pages/Signup/Signup"));
const history = createBrowserHistory();

function App() {
    return (
        <Provider store={store}>
            <Suspense fallback={<Spinner/>}>
                <Switch history={history}>
                    <Route exact path={`${process.env.PUBLIC_URL}/projects`} component={ProjectListing}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/project/:id`} component={ProjectDetail}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/project/:pid/task/:tid`} component={TaskDetail}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/`} component={Login}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/signup`} component={Signup}/>
                </Switch>
            </Suspense>
        </Provider>
    );
}

render(
    <Router>
        <ScrollToTop/>
        <App/>
    </Router>,
    document.getElementById("root")
);

serviceWorker.unregister();
