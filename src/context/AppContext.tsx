import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import { initialJobs, initialApplications, type Job, type Application, type AppStatus } from "@/data/mockData";

export type Role = "seeker" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  location?: string;
}

interface AppContextValue {
  // auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: Role) => void;
  signup: (data: { name: string; email: string; password: string; role: Role }) => void;
  logout: () => void;
  setRole: (role: Role) => void;

  // jobs
  jobs: Job[];
  getJobById: (id: string) => Job | undefined;
  addJob: (job: Job) => void;
  updateJob: (id: string, patch: Partial<Job>) => void;
  deleteJob: (id: string) => void;

  // bookmarks
  bookmarks: Set<string>;
  toggleBookmark: (id: string) => void;

  // applications
  applications: Application[];
  submitApplication: (data: Omit<Application, "id" | "appliedAt" | "status">) => Application;
  updateApplicationStatus: (id: string, status: AppStatus) => void;
  getUserApplications: (userId: string) => Application[];
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set(["2"]));

  const login = useCallback((email: string, _password: string, role: Role) => {
    const name = email.split("@")[0].replace(/[^a-z]/gi, " ").trim() || "Demo User";
    const display = name.split(" ").map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
    setUser({
      id: role === "admin" ? "admin_demo" : "user_demo",
      name: display,
      email,
      role,
      location: "San Francisco, CA",
    });
  }, []);

  const signup = useCallback((data: { name: string; email: string; password: string; role: Role }) => {
    setUser({
      id: data.role === "admin" ? "admin_demo" : "user_demo",
      name: data.name,
      email: data.email,
      role: data.role,
      location: "San Francisco, CA",
    });
  }, []);

  const logout = useCallback(() => setUser(null), []);
  const setRole = useCallback((role: Role) => {
    setUser(prev => prev ? { ...prev, role } : prev);
  }, []);

  const getJobById = useCallback((id: string) => jobs.find(j => j.id === id), [jobs]);

  const addJob = useCallback((job: Job) => setJobs(prev => [job, ...prev]), []);
  const updateJob = useCallback((id: string, patch: Partial<Job>) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...patch } : j));
  }, []);
  const deleteJob = useCallback((id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const submitApplication = useCallback((data: Omit<Application, "id" | "appliedAt" | "status">) => {
    const app: Application = {
      ...data,
      id: `app_${Date.now()}`,
      appliedAt: new Date().toISOString(),
      status: "Applied",
    };
    setApplications(prev => [app, ...prev]);
    return app;
  }, []);

  const updateApplicationStatus = useCallback((id: string, status: AppStatus) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }, []);

  const getUserApplications = useCallback(
    (userId: string) => applications.filter(a => a.userId === userId),
    [applications]
  );

  const value = useMemo<AppContextValue>(() => ({
    user,
    isAuthenticated: !!user,
    login, signup, logout, setRole,
    jobs, getJobById, addJob, updateJob, deleteJob,
    bookmarks, toggleBookmark,
    applications, submitApplication, updateApplicationStatus, getUserApplications,
  }), [user, login, signup, logout, setRole, jobs, getJobById, addJob, updateJob, deleteJob, bookmarks, toggleBookmark, applications, submitApplication, updateApplicationStatus, getUserApplications]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
