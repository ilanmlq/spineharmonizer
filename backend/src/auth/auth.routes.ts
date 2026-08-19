import { Router, Request, Response } from "express";
import { validateBody } from "../middlewares/schema-validator.js";
import { LoginDTO, loginSchema, RefreshTokenDTO, refreshTokenSchema, RegisterDTO, registerSchema } from "./auth.validator.js";
import { login, refresh, register } from "./auth.service.js";
import { createUser } from "../users/user.database.js";



export const authRoutes = Router();

authRoutes.post(
    "/login",
    validateBody(loginSchema),
    async (request: Request, response: Response) => {
        const { username, password } = request.parsedBody as LoginDTO;
        const { token, refreshToken } = await login(username, password);
        if (token) {
            response.status(200).json({ token, refreshToken });
        } else {
            response.status(401).json({ message: "Invalid credentials" });
        }
    },
);

authRoutes.post(
    "/register",
    validateBody(registerSchema),
    async (request: Request, response: Response) => {
        const userData = request.parsedBody as RegisterDTO;
        const { token, refreshToken } = await register(userData);
        response.status(201).json({ token, refreshToken });
    },
);

authRoutes.post(
    "/refresh",
    validateBody(refreshTokenSchema),
    async (request: Request, response: Response) => {
        const { refreshToken } = request.parsedBody as RefreshTokenDTO;
        const { token, refreshToken: newRefreshToken } = await refresh(refreshToken);
        response.status(200).json({ token, refreshToken: newRefreshToken });
    }
);
