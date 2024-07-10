import { createBrowserRouter } from 'react-router-dom';

import { MainPage, MapPage } from '@src/Page';
import { Layout } from '@src/Component';

const TempPage = () => {
  return (
    <div>
      <h1>Temp Page</h1>
    </div>
  );
};

const BrowserRouter = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <TempPage />,
      },
      {
        path: '/short',
        element: <MainPage />,
      },
      {
        path: '/live',
        element: <MapPage />,
      },
    ],
  },
]);

export default BrowserRouter;
