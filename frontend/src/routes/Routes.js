import { createBrowserRouter } from "react-router-dom";
import PrivateResource from "./PrivateResources";
import { Login, SignUp, Task } from "../pages";


const routes = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/signup",
        element: <SignUp />,
    },
    {
        path: "/",
        element: <PrivateResource component={<Task />} />,
    },
    {
        path: "*",
        element: <PrivateResource component={<p>The page you're looking doesn't exists</p>} />,
    },

]);

export default routes;