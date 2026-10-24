// Project data

export const PROJECTS = [
  {
    title: "The Web Oasis",
    description:
      "This application emulates the management of a hotel, providing various functionalities needed for hotel operations. It is built with React and React-Query and connects to a Supabase API",
    image: "/projects/horizon.webp",
    link: "https://the-web-oasis.vercel.app/",
    code: "https://github.com/souravkhan12/HorizonStay",
    technologies: ["cpp", "react", "node", "html", "tailwind", "sql", "next"],
  },
  {
    title: "HorizonStay Client",
    description:
      "The HorizonStay is a user-friendly web application built with Next.js and React. It allows users to explore and book cabins in a serene, remote location. For a seamless experience, we've integrated NextAuth for secure Google logins.",
    image: "/projects/HorizonC.webp",
    link: "https://horizon-search-client.vercel.app/",
    code: "https://github.com/souravkhan12/horizonSearchFT",
    technologies: ["react", "redux", "css", "html"],
  },
  {
    title: "ReactSwigZo",
    description:
      "This app emulates a pizza ordering service where users can select and order pizzas. Developed using React and Redux, it showcases basic functionalities such as state management and user interaction. This app was created as part of a course to learn the fundamentals of React and Redux.",
    image: "/projects/pizzApp.webp",
    link: "https://react-swig-zo.vercel.app/",
    code: "https://github.com/souravkhan12/React-SwigZo",
    technologies: ["react", "cpp", "node", "mongodb", "sql"],
  },
];

// Work experience data — from the résumé. `summary` is the one-paragraph
// version the homepage shows; `achievements` are the full bullets /resume uses.
export const WORK_EXPERIENCE = [
  {
    company: "Inflection.io",
    position: "SDE - UI",
    via: "Thinkify Labs",
    duration: "Mar 2026 - Sep 2026",
    years: "2026",
    location: "Bangalore, India",
    summary:
      "Led the data-warehouse connection wizard end-to-end and owned the Amplitude integration, live across 7 organizations and 26,000+ events. Virtualized 10,000-row tables to eliminate UI freezes.",
    achievements: [
      "Virtualized 10,000-row data tables using React, TypeScript, and Redux Toolkit, eliminating UI freezes; added Playwright E2E tests for critical flows.",
      "Led the data-warehouse connection wizard end-to-end: a 6-stage flow with server-persisted drafts and feature-flag-gated rollout, eliminating race conditions across stages.",
      "Engineered API-driven wizard screens surfacing BigQuery schema inspection results, built on a versioned API contract co-designed with the backend team.",
      "Owned the Amplitude analytics integration (onboarding, property mapping, API keys, real-time sync monitor), live across 7 organizations and tracking 26,000+ events.",
      "Rebuilt the Journeys and Audience Management UI, improving usability for 30+ customers.",
    ],
    technologies: [
      "React",
      "TypeScript",
      "Redux Toolkit",
      "Playwright",
      "BigQuery",
    ],
  },
  {
    company: "The Unmarketing Agency",
    position: "Frontend Developer",
    duration: "Aug 2025 - Feb 2026",
    years: "2025 — 2026",
    location: "Goa, India",
    summary:
      "Reusable cross-platform components shared across 20+ modules. SSR/SSG and performance work that cut page load from 3.4s to 1s.",
    achievements: [
      "Designed reusable, cross-platform UI components shared across web and mobile, reused across 20+ modules.",
      "Implemented SSR/SSG and performance optimizations that cut page load time from 3.4s to 1s, improving SEO and Core Web Vitals.",
    ],
    technologies: ["Next.js", "React", "Redux", "Tailwind"],
  },
  {
    company: "Samsung R&D Institute",
    position: "Software Engineer",
    duration: "Sep 2023 - Sep 2024",
    years: "2023 — 2024",
    location: "Noida, India",
    summary:
      "Live React dashboard monitoring TV Token authentication across 197 countries for 2,000+ internal users. Migrated a legacy codebase to React 18, cutting load time by 40%.",
    achievements: [
      "Developed a live React.js dashboard for the TV Token service to monitor authentication requests from Samsung TVs across 197 countries, supporting 2,000+ internal users.",
      "Migrated a legacy JavaScript codebase to React 18 with Hooks and optimized rendering with lazy loading and code splitting, reducing load time by 40%.",
      "Collaborated with backend engineers to shape REST API payloads, simplifying frontend aggregation and dashboard rendering.",
    ],
    technologies: ["React", "JavaScript", "REST APIs"],
  },
  {
    company: "OriginCore Consulting",
    position: "Frontend Developer Intern",
    duration: "Feb 2023 - Jul 2023",
    years: "2023",
    location: "Remote",
    summary:
      "Reusable React components with hooks and state management for responsive, cross-device interfaces.",
    achievements: [
      "Created reusable React.js components with hooks and state management for responsive, cross-device interfaces.",
    ],
    technologies: ["React", "JavaScript"],
  },
];

// Contact information
export const CONTACT_INFO = {
  email: "souravkhan654@gmail.com",
  phone: "+91 8814028649",
  location: "Noida, India",
  city: "Noida",
  hometown: "Ambala",
  timezone: "Asia/Kolkata",
  linkedin: "https://www.linkedin.com/in/souravkhan1",
  resume: "/sourav_khan_resume.pdf",
};

// Social links
export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/in/souravkhan1",
  github: "https://github.com/souravkhan12",
};

// Hero section. The headline is split so the second half can sit in grey.
export const HERO = {
  name: "Sourav Khan",
  title: "Frontend Engineer",
  headline:
    "Frontend engineer building fast, data-heavy web apps for SaaS products.",
  headlineMuted: "React, TypeScript & Next.js. Previously Samsung.",
  bio: "Frontend Engineer with 2+ years of experience building web applications using React, TypeScript, Next.js, and Redux Toolkit. Shipped analytics and data-integration features for SaaS products and cut page load times by up to 70%.",
};

// Skills, grouped as on the résumé.
export const STACK = [
  {
    group: "Frontend",
    items:
      "React, Next.js, TypeScript, Redux Toolkit, TanStack Query, Tailwind, Recharts",
  },
  { group: "Testing", items: "Jest, React Testing Library, Playwright" },
  { group: "Backend", items: "Node.js, Express, REST, GraphQL, Supabase" },
  { group: "Cloud", items: "AWS, Docker, GitHub Actions, CI/CD" },
  { group: "Core CS", items: "DBMS, OS, Networking, Distributed Systems" },
];

export const ACHIEVEMENTS = [
  {
    metric: "1818",
    text: "peak rating on LeetCode, top 6.9% globally",
    href: "https://leetcode.com/u/souravkhan654/",
  },
  {
    metric: "3★",
    text: "on CodeChef (peak 1663)",
    href: "https://www.codechef.com/users/sourav_78",
  },
  {
    metric: "5★",
    text: "problem-solving badge on HackerRank",
    href: "https://www.hackerrank.com/profile/minezero",
  },
  {
    metric: "2,000+",
    text: "problems solved on Codeforces and GeeksforGeeks",
    href: "https://codeforces.com/profile/LetsTryOneMoreTime",
  },
  {
    metric: "AWS",
    text: "Certified Cloud Practitioner, May 2025",
    href: "https://drive.google.com/file/d/1OZrqm7Sag8wnzhnJfihX65hpfkZXBVy0/view?usp=sharing",
  },
];

// Daily tools. Kept to what the /setup guides actually document.
export const SETUP_TOOLS = [
  {
    name: "VS Code",
    note: "Prettier, ESLint, GitLens, Tailwind IntelliSense.",
  },
  { name: "Ghostty", note: "Fast, native terminal with a Nerd Font." },
  { name: "zsh + Starship", note: "Oh My Zsh plugins and a minimal prompt." },
  { name: "GitHub", note: "Actions for CI/CD, PRs and reviews." },
  { name: "Figma", note: "Inspect, prototyping and handoff." },
  { name: "Claude Code", note: "Pairing on refactors, reviews and tests." },
];

export const GITHUB_USERNAME = "souravkhan12";
