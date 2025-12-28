export interface User {
  id: string | number;
  name: string;
  email: string;
  [key: string]: any; // Allow additional properties
}
