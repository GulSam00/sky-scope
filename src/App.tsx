import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

import { MainPage } from "@src/Page";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainPage />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
