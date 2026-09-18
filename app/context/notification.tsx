"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { ERROR_MESSAGES, ErrorCode } from "../consts";

export type NotificationType = "error" | "success";

export interface AppNotification {
  id: string;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  notifications: AppNotification[];
  addNotification: (message: string, type?: NotificationType) => void;
  addError: (message: string) => void;
  removeNotification: (id: string) => void;
  ifErrorCode: (code?: ErrorCode | string | void) => boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addNotification = useCallback(
    (message: string, type: NotificationType = "success") => {
      const id = Math.random().toString(36).substring(2, 9);
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        removeNotification(id);
      }, 1000);
    },
    [removeNotification],
  );

  const addError = useCallback(
    (message: string) => {
      addNotification(message, "error");
    },
    [addNotification],
  );

  const ifErrorCode = useCallback(
    (code?: ErrorCode | string | void) => {
      const isErrorCode =
        code && Object.values(ErrorCode).includes(code as ErrorCode);

      if (isErrorCode) {
        addError(ERROR_MESSAGES[code as ErrorCode]);
        return true;
      } else {
        return false;
      }
    },
    [addError],
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        addError,
        removeNotification,
        ifErrorCode,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotification должен использоваться внутри NotificationProvider",
    );
  }
  return context;
};
