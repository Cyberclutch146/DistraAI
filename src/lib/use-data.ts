"use client";

import { useEffect, useState } from "react";

export interface DataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseDataState<T> {
  data: T | null;
  error: string | null;
  key: string;
}

function depsKey(deps: unknown[]) {
  return JSON.stringify(deps);
}

export function useData<T>(loader: () => Promise<T>, deps: unknown[]): DataState<T> {
  const [state, setState] = useState<UseDataState<T>>(() => ({ data: null, error: null, key: "" }));

  useEffect(() => {
    let cancelled = false;
    const currentKey = depsKey(deps);

    loader()
      .then((data) => {
        if (!cancelled) setState({ data, error: null, key: currentKey });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            data: null,
            error: err instanceof Error ? err.message : "Something went wrong",
            key: currentKey,
          });
        }
      });

    return () => {
      cancelled = true;
    };
    // The caller controls the dependency list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const loading = state.key !== depsKey(deps);

  return { data: state.data, loading, error: state.error };
}