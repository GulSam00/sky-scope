import { createContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { MainPage } from "@src/Page";

const contextData = {
  recentLoading: false,
};

export const Context = createContext(contextData);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <Context.Provider value={contextData}>
      <QueryClientProvider client={queryClient}>
        <MainPage />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </Context.Provider>
  );
}

export default App;
