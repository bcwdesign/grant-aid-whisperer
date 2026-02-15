import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface PipelineGrant {
  id: string;
  title: string;
  funder: string;
  amount: string;
  deadline: string;
  status: string;
  focus: string[];
}

interface PipelineContextType {
  pipelineGrants: PipelineGrant[];
  addToPipeline: (grant: PipelineGrant) => void;
  removeFromPipeline: (id: string) => void;
  isInPipeline: (id: string) => boolean;
  updateStatus: (id: string, status: string) => void;
}

const PipelineContext = createContext<PipelineContextType | undefined>(undefined);

const defaultPipelineGrants: PipelineGrant[] = [
  { id: "p1", title: "Community Development Block Grant", funder: "HUD", amount: "$500K", deadline: "Mar 15", status: "in_progress", focus: ["Community Development", "Housing"] },
  { id: "p2", title: "Youth Education Initiative", funder: "Google.org", amount: "$250K", deadline: "Mar 22", status: "researching", focus: ["Education", "Youth"] },
  { id: "p3", title: "Environmental Justice Small Grants", funder: "EPA", amount: "$100K", deadline: "Apr 1", status: "not_started", focus: ["Environment", "Justice"] },
  { id: "p4", title: "Arts in Education Grant", funder: "NEA", amount: "$75K", deadline: "Apr 10", status: "in_progress", focus: ["Arts", "Education"] },
  { id: "p5", title: "Rural Health Outreach", funder: "HRSA", amount: "$300K", deadline: "Feb 28", status: "submitted", focus: ["Health", "Rural"] },
  { id: "p6", title: "Digital Equity Grant", funder: "NTIA", amount: "$150K", deadline: "May 1", status: "not_started", focus: [] },
];

export const PipelineProvider = ({ children }: { children: ReactNode }) => {
  const [pipelineGrants, setPipelineGrants] = useState<PipelineGrant[]>(defaultPipelineGrants);

  const addToPipeline = useCallback((grant: PipelineGrant) => {
    setPipelineGrants((prev) => {
      if (prev.some((g) => g.id === grant.id)) return prev;
      return [...prev, { ...grant, status: "not_started" }];
    });
  }, []);

  const removeFromPipeline = useCallback((id: string) => {
    setPipelineGrants((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const isInPipeline = useCallback(
    (id: string) => pipelineGrants.some((g) => g.id === id),
    [pipelineGrants]
  );

  const updateStatus = useCallback((id: string, status: string) => {
    setPipelineGrants((prev) => prev.map((g) => (g.id === id ? { ...g, status } : g)));
  }, []);

  return (
    <PipelineContext.Provider value={{ pipelineGrants, addToPipeline, removeFromPipeline, isInPipeline, updateStatus }}>
      {children}
    </PipelineContext.Provider>
  );
};

export const usePipeline = () => {
  const ctx = useContext(PipelineContext);
  if (!ctx) throw new Error("usePipeline must be used within PipelineProvider");
  return ctx;
};
