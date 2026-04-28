export type JobType = "Remote" | "Onsite" | "Hybrid";
export type JobSchedule = "Full-time" | "Part-time" | "Contract";
export type AppStatus = "Applied" | "In Review" | "Interview" | "Offered" | "Rejected";

export interface Job {
  id: string;
  title: string;
  company: string;
  companyColor: string;
  category: string;
  type: JobType;
  schedule: JobSchedule;
  location: string;
  salaryMin: number;
  salaryMax: number;
  postedAt: string;
  isNew?: boolean;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  benefits: string[];
  about: string;
  status: "active" | "closed" | "draft";
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  appliedAt: string;
  status: AppStatus;
  applicantName: string;
  applicantEmail: string;
  resume: string;
  coverNote?: string;
}

export const categories = [
  { name: "Design", color: "oklch(0.7 0.18 240)", count: 156 },
  { name: "Development", color: "oklch(0.7 0.18 150)", count: 312 },
  { name: "Marketing", color: "oklch(0.72 0.18 40)", count: 89 },
  { name: "Sales", color: "oklch(0.65 0.22 25)", count: 64 },
  { name: "Product", color: "oklch(0.58 0.22 280)", count: 47 },
  { name: "Finance", color: "oklch(0.78 0.16 75)", count: 38 },
];

export const initialJobs: Job[] = [
  {
    id: "1",
    title: "Senior UI/UX Designer",
    company: "TechNova Inc.",
    companyColor: "oklch(0.58 0.22 280)",
    category: "Design",
    type: "Remote",
    schedule: "Full-time",
    location: "Remote · Worldwide",
    salaryMin: 60000,
    salaryMax: 90000,
    postedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    isNew: true,
    description:
      "We're looking for a talented Senior UI/UX Designer to join our growing product team. You'll shape the experience of products used by millions, working closely with engineers and PMs to bring delightful interfaces to life.",
    responsibilities: [
      "Design intuitive interfaces for web and mobile apps",
      "Conduct user research and usability testing",
      "Build and maintain a scalable design system",
      "Collaborate with product and engineering teams",
    ],
    requirements: [
      "5+ years of product design experience",
      "Mastery of Figma and modern prototyping tools",
      "Strong portfolio with shipped work",
    ],
    skills: ["Figma", "Prototyping", "Design Systems", "User Research", "UI Design"],
    benefits: ["Remote-first culture", "Health & dental insurance", "Learning budget", "Flexible PTO"],
    about: "TechNova is a fast-growing SaaS company building productivity tools for modern teams.",
    status: "active",
  },
  {
    id: "2",
    title: "Frontend Engineer",
    company: "Lumen Labs",
    companyColor: "oklch(0.7 0.18 150)",
    category: "Development",
    type: "Hybrid",
    schedule: "Full-time",
    location: "Berlin, Germany",
    salaryMin: 75000,
    salaryMax: 110000,
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isNew: true,
    description:
      "Join Lumen Labs to build performant, accessible interfaces for our analytics platform.",
    responsibilities: [
      "Build features in React and TypeScript",
      "Optimize application performance",
      "Collaborate with design on new flows",
    ],
    requirements: [
      "3+ years with React + TypeScript",
      "Experience with modern build tools",
      "Eye for detail and motion",
    ],
    skills: ["React", "TypeScript", "Tailwind", "Vite", "Testing"],
    benefits: ["Hybrid work", "Stock options", "Conference budget"],
    about: "Lumen Labs builds analytics tools loved by data teams.",
    status: "active",
  },
  {
    id: "3",
    title: "Growth Marketing Manager",
    company: "Brandly",
    companyColor: "oklch(0.72 0.18 40)",
    category: "Marketing",
    type: "Onsite",
    schedule: "Full-time",
    location: "New York, NY",
    salaryMin: 85000,
    salaryMax: 120000,
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    description:
      "Own paid + organic acquisition for a fast-growing consumer brand.",
    responsibilities: ["Run growth experiments", "Manage paid channels", "Report on KPIs"],
    requirements: ["4+ years in growth", "Strong analytical mindset", "Hands-on with ads"],
    skills: ["SEO", "Paid Ads", "Analytics", "CRO"],
    benefits: ["NYC office", "Equity", "Wellness stipend"],
    about: "Brandly is reinventing how consumer brands grow.",
    status: "active",
  },
  {
    id: "4",
    title: "Account Executive",
    company: "Sellio",
    companyColor: "oklch(0.65 0.22 25)",
    category: "Sales",
    type: "Remote",
    schedule: "Full-time",
    location: "Remote · US",
    salaryMin: 70000,
    salaryMax: 140000,
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Close mid-market deals for our B2B SaaS platform.",
    responsibilities: ["Run discovery calls", "Manage pipeline", "Close enterprise deals"],
    requirements: ["3+ years AE experience", "SaaS background", "Strong communicator"],
    skills: ["Sales", "Negotiation", "CRM", "Outbound"],
    benefits: ["Uncapped commission", "Remote", "Health insurance"],
    about: "Sellio helps revenue teams ship faster.",
    status: "active",
  },
  {
    id: "5",
    title: "Product Designer",
    company: "Northwind",
    companyColor: "oklch(0.58 0.22 280)",
    category: "Design",
    type: "Hybrid",
    schedule: "Full-time",
    location: "London, UK",
    salaryMin: 55000,
    salaryMax: 80000,
    postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Design end-to-end experiences for our fintech app.",
    responsibilities: ["Own product flows", "Run user testing", "Ship weekly"],
    requirements: ["3+ years product design", "Fintech background a plus"],
    skills: ["Figma", "UX Research", "Prototyping"],
    benefits: ["Hybrid", "Pension", "Equity"],
    about: "Northwind makes banking simple.",
    status: "active",
  },
  {
    id: "6",
    title: "Backend Engineer (Go)",
    company: "Cloudpeak",
    companyColor: "oklch(0.7 0.18 150)",
    category: "Development",
    type: "Remote",
    schedule: "Full-time",
    location: "Remote · EU",
    salaryMin: 90000,
    salaryMax: 130000,
    postedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Build distributed services powering our infra platform.",
    responsibilities: ["Design APIs", "Scale services", "Mentor juniors"],
    requirements: ["5+ years Go", "Distributed systems experience"],
    skills: ["Go", "Postgres", "Kubernetes", "gRPC"],
    benefits: ["Remote", "Stock", "Sabbatical"],
    about: "Cloudpeak builds infrastructure for the modern web.",
    status: "active",
  },
  {
    id: "7",
    title: "Content Marketer",
    company: "Bloom",
    companyColor: "oklch(0.72 0.18 40)",
    category: "Marketing",
    type: "Remote",
    schedule: "Part-time",
    location: "Remote",
    salaryMin: 35000,
    salaryMax: 55000,
    postedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Write and edit long-form content for B2B audiences.",
    responsibilities: ["Write blog posts", "Edit guest posts", "Own newsletter"],
    requirements: ["2+ years writing", "SEO knowledge"],
    skills: ["Writing", "SEO", "Editing"],
    benefits: ["Flexible hours", "Remote"],
    about: "Bloom helps B2B teams tell better stories.",
    status: "active",
  },
  {
    id: "8",
    title: "Product Manager",
    company: "Vivid",
    companyColor: "oklch(0.58 0.22 280)",
    category: "Product",
    type: "Onsite",
    schedule: "Full-time",
    location: "San Francisco, CA",
    salaryMin: 130000,
    salaryMax: 180000,
    postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Lead product strategy for our consumer mobile app.",
    responsibilities: ["Set roadmap", "Run discovery", "Partner with design + eng"],
    requirements: ["5+ years PM", "Consumer experience"],
    skills: ["Roadmapping", "Discovery", "Analytics"],
    benefits: ["SF office", "Equity", "Health"],
    about: "Vivid is reimagining consumer photography.",
    status: "active",
  },
  {
    id: "9",
    title: "Finance Analyst",
    company: "Ledger Co.",
    companyColor: "oklch(0.78 0.16 75)",
    category: "Finance",
    type: "Hybrid",
    schedule: "Full-time",
    location: "Singapore",
    salaryMin: 65000,
    salaryMax: 95000,
    postedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Support FP&A function with modeling and reporting.",
    responsibilities: ["Build models", "Own monthly close inputs"],
    requirements: ["3+ years FP&A", "Strong Excel/SQL"],
    skills: ["Excel", "SQL", "Modeling"],
    benefits: ["Hybrid", "Bonus"],
    about: "Ledger Co. is a regional fintech leader.",
    status: "active",
  },
];

export const initialApplications: Application[] = [
  {
    id: "app_001",
    jobId: "1",
    userId: "user_demo",
    appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "In Review",
    applicantName: "John Smith",
    applicantEmail: "john@example.com",
    resume: "John_Smith_Resume.pdf",
  },
  {
    id: "app_002",
    jobId: "3",
    userId: "user_demo",
    appliedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Interview",
    applicantName: "John Smith",
    applicantEmail: "john@example.com",
    resume: "John_Smith_Resume.pdf",
  },
  {
    id: "app_003",
    jobId: "5",
    userId: "user_demo",
    appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Applied",
    applicantName: "John Smith",
    applicantEmail: "john@example.com",
    resume: "John_Smith_Resume.pdf",
  },
  {
    id: "app_004",
    jobId: "2",
    userId: "user_demo",
    appliedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Offered",
    applicantName: "John Smith",
    applicantEmail: "john@example.com",
    resume: "John_Smith_Resume.pdf",
  },
  // admin view
  {
    id: "app_101",
    jobId: "1",
    userId: "user_a",
    appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Applied",
    applicantName: "Maya Chen",
    applicantEmail: "maya@example.com",
    resume: "Maya_Chen_Resume.pdf",
  },
  {
    id: "app_102",
    jobId: "1",
    userId: "user_b",
    appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "In Review",
    applicantName: "Diego Alvarez",
    applicantEmail: "diego@example.com",
    resume: "Diego_Alvarez_Resume.pdf",
  },
  {
    id: "app_103",
    jobId: "2",
    userId: "user_c",
    appliedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Interview",
    applicantName: "Priya Patel",
    applicantEmail: "priya@example.com",
    resume: "Priya_Patel_Resume.pdf",
  },
];

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export function formatSalary(min: number, max: number) {
  const fmt = (n: number) => `$${(n / 1000).toFixed(0)}k`;
  return `${fmt(min)} - ${fmt(max)}`;
}
