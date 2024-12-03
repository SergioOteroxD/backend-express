import { User } from "../model/user.model";

export interface UserRepository {
  create(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(id: string, data: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<void>;
}
