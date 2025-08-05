export interface Project {
  title: string;
  description: string;
  image: string;
  route?: string;
  externalUrl?: string;
  technologies: string[];
  isExternal?: boolean;
}
