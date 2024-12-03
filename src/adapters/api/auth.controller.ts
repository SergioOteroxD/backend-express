import { Request, Response } from "express";
import { ResponseUtil } from "../../common/util/response.util";
import { LoginUseCase } from "../../core/auth/login.uc";
import { LogoutUseCase } from "../../core/auth/logout.uc";
import { JwtManager } from "../../drivers/jwt-manager";
import { IuserRepository } from "../../drivers/repositories/impl/user.repository.impl";
import { RegisterUseCase } from "../../core/auth/register.uc";
import { CustomError } from "../../common/types/custom-error";
import { Roles } from "../decorator/roles.decorator";
import { Erole } from "../../common/enum/role.enum";

export class AuthController {
  private loginUseCase: LoginUseCase;
  private logoutUseCase: LogoutUseCase;
  private registerUseCase: RegisterUseCase;

  constructor() {
    const userRepository = new IuserRepository();
    const jwtService = JwtManager.getInstance();
    this.loginUseCase = new LoginUseCase(userRepository, jwtService);
    this.logoutUseCase = new LogoutUseCase();
    this.registerUseCase = new RegisterUseCase(userRepository);
  }

  async login(req: any, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      // Ejecutar el caso de uso de login
      const response = await this.loginUseCase.execute(email, password);
      return ResponseUtil.success(res, response);
    } catch (error) {
      if (error instanceof CustomError) {
        return res
          .status(error.error.code)
          .json({ error: error.error.message });
      }
      console.log("🚀 - AuthController - login - error:", error);
      return res.status(500).json({ message: error });
    }
  }

  async register(req: any, res: Response): Promise<Response> {
    try {
      // Ejecutar el caso de uso de login
      const response = await this.registerUseCase.execute(req.body);
      return ResponseUtil.success(res, response);
    } catch (error) {
      if (error instanceof CustomError) {
        return res
          .status(error.error.code)
          .json({ error: error.error.message });
      }
      console.log("🚀 - AuthController - login - error:", error);
      return res.status(500).json({ message: error });
    }
  }

  async logout(req: Request, res: Response): Promise<Response> {
    try {
      // Ejecutar el caso de uso de logout
      await this.logoutUseCase.execute();
      return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  @Roles(Erole.ADMIN, Erole.SUPER_ADMIN)
  public static async protected(req: Request, res: Response) {
    try {
      // Ejecutar el caso de uso de logout
      ResponseUtil.success(res, {
        code: "OK",
        message: "La consulta se ejecuto correctamente",
        status: 200,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
}
