import React, { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { LoadingState } from '@src/Component';

import { Layout } from '@src/Component';

const MapPage = lazy(() => import('@src/Page/MapPage'));
const ErrorPage = lazy(() => import('@src/Page/ErrorPage'));
const NotFoundPage = lazy(() => import('@src/Page/NotFoundPage'));
const LoginPage = lazy(() => import('@src/Page/LoginPage'));
const OAuthPage = lazy(() => import('@src/Page/OAuthPage'));

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
        path: '/login',
        element: (
          <LazyComponent>
            <LoginPage />
          </LazyComponent>
        ),
      },

      {
        path: '/oauth/*',
        element: (
          <LazyComponent>
            <OAuthPage />
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
      {
        path: '*',
        element: (
          <LazyComponent>
            <NotFoundPage />
          </LazyComponent>
        ),
      },
    ],
  },
]);

export default BrowserRouter;
