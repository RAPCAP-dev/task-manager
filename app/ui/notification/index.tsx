"use client";

import { useNotification } from "@/app/context/notification";

export const NotificationList = () => {
  const { notifications, removeNotification } = useNotification();

  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 w-full max-w-sm">
      {notifications.map((toast) => {
        const isSuccess = toast.type === "success";

        return (
          <div
            key={toast.id}
            className={`flex items-center justify-between p-4 text-white rounded-lg shadow-lg animate-fade-in transition-colors duration-200 ${
              isSuccess ? "bg-emerald-600" : "bg-red-600"
            }`}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {isSuccess ? (
                <svg
                  className="w-5 h-5 flex-shrink-0 text-emerald-100"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 flex-shrink-0 text-red-100"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              )}

              <span className="text-sm font-medium break-words">
                {toast.message}
              </span>
            </div>

            <button
              onClick={() => removeNotification(toast.id)}
              className={`ml-4 p-1 rounded transition-colors flex-shrink-0 ${
                isSuccess ? "hover:bg-emerald-700" : "hover:bg-red-700"
              }`}
              aria-label="Закрыть"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
};
