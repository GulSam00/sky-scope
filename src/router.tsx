import {
    createBrowserRouter,
} from "react-router-dom";

import { MainPage } from "@src/Page";
import { Layout } from "@src/Component";

const BrowserRouter = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <MainPage />,
            },
            {
                path: "/map",
                element: <MainPage />,
            }
        ],
    },
]);

export default BrowserRouter;