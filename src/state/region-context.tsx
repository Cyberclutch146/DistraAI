"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Region } from "@/data/types";
import { findRegion, getDefaultRegion } from "@/data/regions";

interface RegionContextValue {
  region: Region;
  setRegion: (region: Region) => void;
}

const RegionContext = createContext<RegionContextValue | null>(null);

export function RegionProvider({
  defaultRegionId,
  children,
}: {
  defaultRegionId?: string;
  children: ReactNode;
}) {
  const [region, setRegion] = useState<Region>(
    () => findRegion(defaultRegionId) ?? getDefaultRegion()
  );
  const [prevDefaultRegionId, setPrevDefaultRegionId] = useState(defaultRegionId);

  if (prevDefaultRegionId !== defaultRegionId) {
    setPrevDefaultRegionId(defaultRegionId);
    setRegion(findRegion(defaultRegionId) ?? getDefaultRegion());
  }

  const value = useMemo(() => ({ region, setRegion }), [region]);

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>;
}

export function useRegion(): RegionContextValue {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error("useRegion must be used within a <RegionProvider>");
  }
  return context;
}