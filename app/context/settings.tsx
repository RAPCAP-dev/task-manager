"use client";

import React, { createContext, useContext, useState } from "react";

export type SortOption =
  "newest" | "oldest" | "priority-desc" | "priority-asc" | "none";

export type FilterOption = "all" | "my";

export type SettingsContextType = {
  setSort: (sort: SortOption) => void;
  setFilter: (filter: FilterOption) => void;
  params: {
    sort: SortOption;
    filter: FilterOption;
  };
};

export const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [sort, setSortState] = useState<SortOption>(() => {
    //TODO: fix localstorage use
    // if (typeof window !== "undefined") {
    //   const savedSort = localStorage.getItem("settings_sort");
    //   if (savedSort) return savedSort as SortOption;
    // }
    return "none";
  });

  const [filter, setFilterState] = useState<FilterOption>(() => {
    //TODO: fix localstorage use
    // if (typeof window !== "undefined") {
    //   const savedFilter = localStorage.getItem("settings_filter");
    //   if (savedFilter) return savedFilter as FilterOption;
    // }
    return "all";
  });

  const setSort = (newSort: SortOption) => {
    setSortState(newSort);
    //TODO: fix localstorage use

    // localStorage.setItem("settings_sort", newSort);
  };

  const setFilter = (newFilter: FilterOption) => {
    setFilterState(newFilter);
    //TODO: fix localstorage use
    // localStorage.setItem("settings_filter", newFilter);
  };

  return (
    <SettingsContext.Provider
      value={{ setSort, setFilter, params: { sort, filter } }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error(
      "useSettings должен использоваться строго внутри SettingsProvider",
    );
  }
  return context;
};
