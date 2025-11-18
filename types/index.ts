// TypeScript interfaces and types
export interface Project {
  title: string;
  description: string;
  image: string;
  link: string;
  code: string;
  technologies: string[];
}

export interface WorkExperience {
  company: string;
  position: string;
  duration: string;
  achievements: string[];
  technologies: string[];
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  resume: string;
}

export interface SocialLinks {
  linkedin: string;
  github: string;
  twitter: string;
}

export interface HeroContent {
  name: string;
  title: string;
  location: string;
  bio: string;
}

export interface NavLink {
  name: string;
  href: string;
}

export interface FormData {
  name: string;
  email: string;
  message: string;
}
