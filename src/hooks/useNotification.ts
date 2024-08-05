import { useContext } from "react";
import { NotificationContext } from "../components/NotificationProvider";

export const useNotification = () => {
  return useContext(NotificationContext);
};
