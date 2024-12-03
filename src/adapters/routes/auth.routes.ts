import express, { NextFunction, Response, Request } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { AuthController } from "../api/auth.controller";
import { body, validationResult } from "express-validator";
import { Erole } from "../../common/enum/role.enum";
import { ResponseUtil } from "../../common/util/response.util";
import { checkRolesFromMetadata } from "../middleware/role.middleware";

const authRouter = express.Router();
// Instancia del controlador de autenticación
const authController = new AuthController();

// Middleware para establecer el controlador y método
const setControllerMetadata = (controller: any, method: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    req.controller = controller;
    req.method = method;
    next();
  };
};

authRouter.post(
  "/login",
  body("email").isEmail().withMessage("Debe ser un correo electrónico válido"),
  body("password").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      ResponseUtil.success(res, {
        code: "VALIDATION_ERROR",
        message: "Asegúrate que lo valores estén bien",
        status: 400,
        data: { errors: errors.array() },
      });
      return;
    }
    await authController.login(req, res);
  }
);

authRouter.post(
  "/register",
  body("email").isEmail().withMessage("Debe ser un correo electrónico válido"),
  body("password").notEmpty(),
  body("role").isIn(Object.values(Erole)),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      ResponseUtil.success(res, {
        code: "VALIDATION_ERROR",
        message: "Asegúrate que lo valores estén bien",
        status: 400,
        data: { errors: errors.array() },
      });
      return;
    }
    await authController.register(req, res);
  }
);

authRouter.post("/logout", authenticateToken, async (req, res) => {
  await authController.logout(req, res);
});
authRouter.get(
  "/protected",
  authenticateToken,
  setControllerMetadata(AuthController, "protected"),
  checkRolesFromMetadata,
  AuthController.protected
);

export default authRouter;
