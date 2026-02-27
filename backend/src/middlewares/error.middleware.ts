import { Request, Response, NextFunction } from "express";
import { ValidationError } from "express-validator";
import { AppError } from "../errors/AppError";

interface ValidationErrorBody {
    errors: { field: string; message: string }[];
}

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    // Centralized validation error body (set by validate middleware)
    if ((err as any).isValidationError) {
        res.status(422).json({
            success: false,
            error: {
                code: "VALIDATION_ERROR",
                message: "Validation failed",
                details: (err as any).errors,
            },
        });
        return;
    }

    // Known operational errors
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            error: {
                code: err.constructor.name.replace("Error", "").toUpperCase(),
                message: err.message,
            },
        });
        return;
    }

    // Sequelize UniqueConstraintError
    if ((err as any).name === "SequelizeUniqueConstraintError") {
        const fields = (err as any).fields;
        res.status(409).json({
            success: false,
            error: {
                code: "CONFLICT",
                message: `A record with this ${Object.keys(fields).join(", ")} already exists`,
            },
        });
        return;
    }

    // Sequelize Validation errors
    if ((err as any).name === "SequelizeValidationError") {
        const details = (err as any).errors.map((e: any) => ({
            field: e.path,
            message: e.message,
        }));
        res.status(400).json({
            success: false,
            error: {
                code: "VALIDATION_ERROR",
                message: "Validation failed",
                details,
            },
        });
        return;
    }

    // Unknown / unhandled errors — don't leak internals in production
    const isDev = process.env.NODE_ENV !== "production";
    console.error("❌ Unhandled error:", err);

    res.status(500).json({
        success: false,
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: isDev ? err.message : "An unexpected error occurred",
            ...(isDev && { stack: err.stack }),
        },
    });
}
