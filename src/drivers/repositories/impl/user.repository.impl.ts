// src/infrastructure/repositories/TypeORMUserRepository.ts
import { Repository } from "typeorm";
import { AppDataSource } from "../../database/data-source";
import { UserEntity } from "../../entities/user.entity";
import { UserRepository } from "../user.repository";
import { CustomError } from "../../../common/types/custom-error";

export class IuserRepository implements UserRepository {
  private repository: Repository<UserEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserEntity);
  }

  async create(
    user: Omit<UserEntity, "id" | "createdAt" | "updatedAt">
  ): Promise<UserEntity> {
    try {
      const newUser = this.repository.create(user);
      return await this.repository.save(newUser);
    } catch (error) {
      console.log("🚀 - IuserRepository - error:", error);

      throw new CustomError(
        { message: "ERROR", code: 500 },
        "IuserRepository.create",
        "Business"
      );
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    try {
      return await this.repository.findOneBy({ email });
    } catch (error) {
      console.log("🚀 - IuserRepository - findByEmail - error:", error);
      throw new CustomError(
        { message: "ERROR", code: 500 },
        "IuserRepository.findByEmail",
        "Business"
      );
    }
  }

  async findById(id: string): Promise<UserEntity | null> {
    return await this.repository.findOneBy({ id });
  }

  async update(
    id: string,
    data: Partial<UserEntity>
  ): Promise<UserEntity | null> {
    await this.repository.update(id, data);
    return await this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
