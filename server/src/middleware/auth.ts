import {
  NextFunction,
  Request,
  Response,
} from "express";

import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "hireflow_super_secret_key";

export interface AuthRequest
  extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authorization =
    req.headers.authorization;

  if (
    !authorization ||
    !authorization.startsWith(
      "Bearer "
    )
  ) {
    return res.status(401).json({
      message:
        "Authentication required",
    });
  }

  const token =
    authorization.substring(7);

  try {
    const decoded =
      jwt.verify(
        token,
        JWT_SECRET
      ) as {
        id: number;
        email: string;
        role: string;
      };

    req.user = decoded;

    next();
  } catch (error) {
    console.error(
      "Authentication error:",
      error
    );

    return res.status(401).json({
      message:
        "Invalid or expired token",
    });
  }
}