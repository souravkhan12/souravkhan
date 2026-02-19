// TypeScript interfaces and types
export interface Project {
  slug?: string;
  title: string;
  description: string;
  image: string;
  link: string;
  code: string;
  technologies: string[];
}

export interface FormData {
  name: string;
  email: string;
  message: string;
}
