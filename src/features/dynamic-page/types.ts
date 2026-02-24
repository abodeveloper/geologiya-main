/** API dan keladigan ko‘p tilli maydonlar (title_uz, title_ru, ...) */
export interface Localizable {
  [key: string]: unknown;
}

export interface EmployeeImage {
  image?: string;
}

export interface Employee extends Localizable {
  id: number;
  image?: string | EmployeeImage[];
  phone?: string;
  email?: string;
}

export interface PageFile extends Localizable {
  id: number;
  file: string;
}

export interface PageImage {
  image?: string;
}

export interface PostItem extends Localizable {
  id: number;
  image?: string;
  type?: string;
  published_date?: string;
}

export interface LabItem extends Localizable {
  id: number;
  slug: string;
  image?: string | { image?: string };
}

export interface DepartmentItem extends Localizable {
  id: number;
  slug: string;
}

export interface PostgraduateItem extends Localizable {
  id: number;
  slug: string;
  logo?: string;
}

export interface ScientificDirectionItem extends Localizable {
  id: number;
  slug: string;
  logo?: string;
}

export type PageType =
  | "news"
  | "postgraduate_education"
  | "scientific_direction"
  | "lab"
  | "department"
  | "leadership";

export interface DynamicPageData extends Localizable {
  type: PageType;
  logo?: string;
  title?: string;
  sub_title?: string;
  description?: string;
  direction?: string;
  duration?: string;
  images?: (string | PageImage)[];
  employees?: Employee[];
  posts?: PostItem[];
  files?: PageFile[];
  postgraduate_educations?: PostgraduateItem[];
  scientific_directions?: ScientificDirectionItem[];
  labs?: LabItem[];
  departments?: DepartmentItem[];
}
