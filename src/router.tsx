import React, { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { LoadingState } from '@src/Component';

// import { MainPage, MapPage, ErrorPage } from '@src/Page';
import { Layout } from '@src/Component';

const MainPage = lazy(() => import('@src/Page/MainPage'));
const MapPage = lazy(() => import('@src/Page/MapPage'));
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
            <MainPage />
          </LazyComponent>
        ),
      },
      {
        path: '/live',
        element: (
          <LazyComponent>
            <MapPage />
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
