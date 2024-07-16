import { createBrowserRouter } from 'react-router-dom';

import { MainPage, MapPage, ErrorPage } from '@src/Page';
import { Layout } from '@src/Component';

const BrowserRouter = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <MainPage />,
      },
      {
        path: '/live',
        element: <MapPage />,
      },
      {
        path: '/error',
        element: <ErrorPage />,
      },
    ],
  },
]);

export default BrowserRouter;
