import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotificationProvider from "./components/NotificationProvider";

const queryClient = new QueryClient();

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>{children}</NotificationProvider>
    </QueryClientProvider>
  );
};

export default Providers;
