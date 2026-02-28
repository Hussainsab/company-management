import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain } from "express-validator";

/**
 * Runs an array of express-validator chains and passes a structured
 * validation error to the centralized error handler if any fail.
 */
export const validate = (chains: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Run all chains sequentially
        for (const chain of chains) {
            await chain.run(req);
        }

        const result = validationResult(req);
        if (result.isEmpty()) {
            return next();
        }

        const errors = result.array().map((err: any) => ({
            field: err.path ?? err.param,
            message: err.msg,
            value: err.value,
        }));

        const validationErr: any = new Error("Validation failed");
        validationErr.isValidationError = true;
        validationErr.errors = errors;

        next(validationErr);
    };
};
