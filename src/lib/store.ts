"use client";

import { Group } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GroupStore {
  groups: Group[];
  addGroup: (group: Group) => void;
  updateGroup: (id: string, group: Partial<Group>) => void;
  deleteGroup: (id: string) => void;
  getGroupById: (id: string) => Group | undefined;
  getGroupsByCategory: (category: string) => Group[];
  getActiveGroups: () => Group[];
  getFeaturedGroups: () => Group[];
  getRecentGroups: (limit?: number) => Group[];
}

export const useGroupStore = create<GroupStore>()(
  persist(
    (set, get) => ({
      groups: [],
      
      addGroup: (group) => set((state) => ({ 
        groups: [...state.groups, group] 
      })),
      
      updateGroup: (id, updatedGroup) => set((state) => ({
        groups: state.groups.map((g) => 
          g.id === id ? { ...g, ...updatedGroup } : g
        )
      })),
      
      deleteGroup: (id) => set((state) => ({
        groups: state.groups.filter((g) => g.id !== id)
      })),
      
      getGroupById: (id) => {
        return get().groups.find((g) => g.id === id);
      },
      
      getGroupsByCategory: (category) => {
        return get().groups.filter(
          (g) => g.categoria === category && g.status === "ativo"
        );
      },
      
      getActiveGroups: () => {
        return get().groups.filter((g) => g.status === "ativo");
      },
      
      getFeaturedGroups: () => {
        return get().groups
          .filter((g) => g.status === "ativo" && (g.plano === "destaque" || g.plano === "premium"))
          .sort((a, b) => {
            if (a.plano === "premium" && b.plano !== "premium") return -1;
            if (a.plano !== "premium" && b.plano === "premium") return 1;
            return 0;
          })
          .slice(0, 6);
      },
      
      getRecentGroups: (limit = 8) => {
        return get().groups
          .filter((g) => g.status === "ativo")
          .sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime())
          .slice(0, limit);
      }
    }),
    {
      name: "megalinks-groups-storage"
    }
  )
);
