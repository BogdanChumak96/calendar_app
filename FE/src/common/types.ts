export type Task = {
  _id: string;
  title: string;
  order: number;
  description?: string;
  dueDate: string;
  completed: boolean;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export enum CalendarView {
  Week = "week",
  Month = "month",
}

export type RegistrationFormValues = {
  email: string;
  password: string;
  name: string;
  country: string;
};

export type Holiday = {
  counties: string[] | null;
  countryCode: string;
  date: string;
  fixed: boolean;
  global: boolean;
  launchYear: number | null;
  localName: string;
  name: string;
  types: string[];
};
