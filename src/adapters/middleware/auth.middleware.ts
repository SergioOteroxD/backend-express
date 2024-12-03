import { Request, Response, NextFunction } from "express";
import { JwtManager } from "../../drivers/jwt-manager";
import { IauthPayload } from "../../common/types/auth-payload";

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return; // Asegúrate de no continuar después de responder
  }
  try {
    const jwtManager = JwtManager.getInstance();
    const decoded = jwtManager.verifyToken(token) as IauthPayload;
    req.user = decoded; // Inyectamos el usuario decodificado en la request
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
    return; // Detén la ejecución después de responder
  }
}
