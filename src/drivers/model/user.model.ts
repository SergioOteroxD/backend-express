import { Erole } from "../../common/enum/role.enum";

export interface User {
  id: string;
  email: string;
  password: string;
  role: Erole;
  createdAt: Date;
  updatedAt: Date;
}
