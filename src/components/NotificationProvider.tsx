import { createContext, useState, useCallback, ReactNode } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export interface NotificationContextType {
  showNotification: (message: string, severity: "success" | "info" | "warning" | "error") => void;
}

export const NotificationContext = createContext<NotificationContextType>({
  showNotification: () => {},
});

interface NotificationProviderProps {
  children: ReactNode;
}

const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notification, setNotification] = useState<{ message: string; severity: "success" | "info" | "warning" | "error" } | null>(null);

  const showNotification = useCallback((message: string, severity: "success" | "info" | "warning" | "error") => {
    setNotification({ message, severity });
  }, []);

  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Snackbar open={!!notification} autoHideDuration={6000} onClose={handleCloseNotification}>
        <Alert onClose={handleCloseNotification} severity={notification?.severity} sx={{ width: "100%" }}>
          {notification?.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
