import React, { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { LoadingState } from '@src/Component';

import { Layout } from '@src/Component';

const MapPage = lazy(() => import('@src/Page/MapPage'));
const ChartPage = lazy(() => import('@src/Page/ChartPage'));
const ErrorPage = lazy(() => import('@src/Page/ErrorPage'));

const LazyComponent = ({ children }: { children: React.ReactNode }) => {
  return <Suspense fallback={<LoadingState />}>{children}</Suspense>;
};
const BrowserRouter = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,

    children: [
      {
        path: '/',
        element: (
          <LazyComponent>
            <MapPage />
          </LazyComponent>
        ),
      },
      {
        path: '/chart',
        element: (
          <LazyComponent>
            <ChartPage />
          </LazyComponent>
        ),
      },

      {
        path: '/error',
        element: (
          <LazyComponent>
            <ErrorPage />
          </LazyComponent>
        ),
      },
    ],
  },
]);

export default BrowserRouter;
