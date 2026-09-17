"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { ERROR_MESSAGES, ErrorCode } from "../consts";

export interface AppError {
  id: string;
  message: string;
}

interface ErrorContextType {
  errors: AppError[];
  addError: (message: string) => void;
  removeError: (id: string) => void;
  ifErrorCode: (code?: ErrorCode | string | void) => boolean;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider = ({ children }: { children: React.ReactNode }) => {
  const [errors, setErrors] = useState<AppError[]>([]);

  const removeError = useCallback((id: string) => {
    setErrors((prev) => prev.filter((error) => error.id !== id));
  }, []);

  const addError = useCallback(
    (message: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      setErrors((prev) => [...prev, { id, message }]);

      setTimeout(() => {
        removeError(id);
      }, 5000);
    },
    [removeError],
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
    <ErrorContext.Provider
      value={{ errors, addError, removeError, ifErrorCode }}
    >
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);

  if (!context) {
    throw new Error("useError должен использоваться внутри ErrorProvider");
  }
  return context;
};
