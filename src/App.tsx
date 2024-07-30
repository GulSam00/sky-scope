import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import ReactGA from 'react-ga4';
import router from '@src/router';
import store from '@src/Store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  useEffect(() => {
    ReactGA.send({ page: location.pathname, title: location.pathname, hitType: 'pageview' });
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
