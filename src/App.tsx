import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";

import { MainPage } from "@src/Page";
import store from "@src/Store";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const setScreenHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};

function App() {
  useEffect(() => {
    setScreenHeight();
    window.addEventListener("resize", setScreenHeight);
    return () => {
      window.removeEventListener("resize", setScreenHeight);
    };
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MainPage />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
