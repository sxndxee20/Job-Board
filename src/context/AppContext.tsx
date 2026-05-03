import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from "react";
import { initialJobs, initialApplications, initialMessages, type Job, type Application, type AppStatus, type Message } from "@/data/mockData";
import { toast } from "sonner";

export type Role = "seeker" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  location?: string;
  avatarUrl?: string;
  skills?: string[];
  experienceYears?: number;
  badges?: string[];
}

interface AppContextValue {
  // auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: Role) => void;
  signup: (data: { name: string; email: string; password: string; role: Role }) => void;
  logout: () => void;
  setRole: (role: Role) => void;
  updateUser: (patch: Partial<User>) => void;

  // jobs
  jobs: Job[];
  getJobById: (id: string) => Job | undefined;
  addJob: (job: Job) => void;
  updateJob: (id: string, patch: Partial<Job>) => void;
  deleteJob: (id: string) => void;

  // bookmarks
  bookmarks: Set<string>;
  toggleBookmark: (id: string) => void;
  recentlyViewedJobIds: string[];
  markJobViewed: (id: string) => void;

  // applications
  applications: Application[];
  submitApplication: (data: Omit<Application, "id" | "appliedAt" | "status">) => Application;
  updateApplicationStatus: (id: string, status: AppStatus) => void;
  withdrawApplication: (id: string) => void;
  setApplicationInterview: (id: string, isoDate: string) => void;
  setOfferDecision: (id: string, decision: "accepted" | "declined") => void;
  setApplicationAdminNote: (id: string, note: string) => void;
  updateApplication: (id: string, patch: Partial<Application>) => void;
  deleteApplication: (id: string) => void;
  getUserApplications: (userId: string) => Application[];

  // messages
  messages: Message[];
  sendMessage: (applicationId: string, text: string) => void;
  getMessagesByApplicationId: (id: string) => Message[];
}

const AppContext = createContext<AppContextValue | null>(null);
const LS_KEY = "talent_hub_state_v1";

function loadState() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      user: User | null;
      jobs: Job[];
      applications: Application[];
      bookmarks: string[];
      recentlyViewedJobIds: string[];
      messages: Message[];
    };
    return parsed;
  } catch {
    return null;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const hydrated = loadState();
  const [user, setUser] = useState<User | null>(hydrated?.user ?? null);
  const [jobs, setJobs] = useState<Job[]>(hydrated?.jobs ?? initialJobs);
  const [applications, setApplications] = useState<Application[]>(hydrated?.applications ?? initialApplications);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set(hydrated?.bookmarks ?? ["2"]));
  const [recentlyViewedJobIds, setRecentlyViewedJobIds] = useState<string[]>(hydrated?.recentlyViewedJobIds ?? []);
  const [messages, setMessages] = useState<Message[]>(hydrated?.messages ?? initialMessages);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(LS_KEY, JSON.stringify({
      user,
      jobs,
      applications,
      bookmarks: Array.from(bookmarks),
      recentlyViewedJobIds,
      messages,
    }));
  }, [user, jobs, applications, bookmarks, recentlyViewedJobIds, messages]);

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
    toast.success(`Welcome back, ${display}!`);
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

  const logout = useCallback(() => {
    setUser(null);
    toast.info("You have been logged out");
  }, []);
  const setRole = useCallback((role: Role) => {
    setUser(prev => prev ? { ...prev, role } : prev);
  }, []);
  const updateUser = useCallback((patch: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...patch } : prev);
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
      if (next.has(id)) {
        next.delete(id);
        toast.info("Job removed from saved list");
      } else {
        next.add(id);
        toast.success("Job saved successfully!");
      }
      return next;
    });
  }, []);

  const markJobViewed = useCallback((id: string) => {
    setRecentlyViewedJobIds(prev => [id, ...prev.filter(x => x !== id)].slice(0, 10));
  }, []);

  const submitApplication = useCallback((data: Omit<Application, "id" | "appliedAt" | "status">) => {
    const app: Application = {
      ...data,
      id: `app_${Date.now()}`,
      appliedAt: new Date().toISOString(),
      status: "Applied",
    };
    setApplications(prev => [app, ...prev]);
    toast.success("Application submitted successfully!");
    return app;
  }, []);

  const updateApplicationStatus = useCallback((id: string, status: AppStatus) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }, []);

  const withdrawApplication = useCallback((id: string) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: "Withdrawn" } : a));
    toast.info("Application withdrawn");
  }, []);

  const setApplicationInterview = useCallback((id: string, isoDate: string) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, interviewAt: isoDate, status: "Interview" } : a));
  }, []);

  const setOfferDecision = useCallback((id: string, decision: "accepted" | "declined") => {
    setApplications(prev => prev.map(a => a.id === id ? {
      ...a,
      offerDecision: decision,
      status: decision === "accepted" ? "Offered" : "Rejected",
    } : a));
  }, []);

  const setApplicationAdminNote = useCallback((id: string, note: string) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, adminNote: note } : a));
  }, []);
  const updateApplication = useCallback((id: string, patch: Partial<Application>) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a));
  }, []);
  const deleteApplication = useCallback((id: string) => {
    setApplications(prev => prev.filter(a => a.id !== id));
  }, []);

  const getUserApplications = useCallback(
    (userId: string) => applications.filter(a => a.userId === userId),
    [applications]
  );

  const sendMessage = useCallback((applicationId: string, text: string) => {
    if (!user) return;
    const msg: Message = {
      id: `msg_${Date.now()}`,
      applicationId,
      senderId: user.id,
      text,
      sentAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, msg]);
  }, [user]);

  const getMessagesByApplicationId = useCallback((applicationId: string) => {
    return messages.filter(m => m.applicationId === applicationId);
  }, [messages]);

  const value = useMemo<AppContextValue>(() => ({
    user,
    isAuthenticated: !!user,
    login, signup, logout, setRole, updateUser,
    jobs, getJobById, addJob, updateJob, deleteJob,
    bookmarks, toggleBookmark, recentlyViewedJobIds, markJobViewed,
    applications,
    submitApplication,
    updateApplicationStatus,
    withdrawApplication,
    setApplicationInterview,
    setOfferDecision,
    setApplicationAdminNote,
    updateApplication,
    deleteApplication,
    getUserApplications,
    messages,
    sendMessage,
    getMessagesByApplicationId,
  }), [
    user, login, signup, logout, setRole, updateUser,
    jobs, getJobById, addJob, updateJob, deleteJob,
    bookmarks, toggleBookmark, recentlyViewedJobIds, markJobViewed,
    applications, submitApplication, updateApplicationStatus, withdrawApplication, setApplicationInterview, setOfferDecision, setApplicationAdminNote, updateApplication, deleteApplication, getUserApplications,
    messages, sendMessage, getMessagesByApplicationId
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
