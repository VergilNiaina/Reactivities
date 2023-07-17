import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import TestErrors from "../../features/errors/TestError";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";

export const routes :  RouteObject[] = [
    {
        // the top of the tree that will have childs routes
        path : '/',
        element : <App/>,
        
        children: [
            {path:'activities', element: <ActivityDashboard/>},
            {path:'activities/:id', element: <ActivityDetails/>},
            {path:'createActivity', element: <ActivityForm key='create'/>},
            {path:'manage/:id', element: <ActivityForm key='manage'/>},
            {path:'errors', element: <TestErrors/>},
            {path:'not-found', element: <NotFound/>},
            {path:'server-error', element: <ServerError/>},
            {path:'*', element: <Navigate replace to='/not-found'/>}
        ]
    }
]
// To pass some routes
export const router = createBrowserRouter(routes);


// next step is to provide the routes to the index

// next Use Outlet in the app components

// next set NavLink/Link in  components

// next set NavLink/Link in  components

// next add key if have same component with different route

// hooks : useParams, useNavigate, useLocation

