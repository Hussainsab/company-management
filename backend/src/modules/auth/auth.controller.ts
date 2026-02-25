import { Request, Response } from "express";
import AuthService from "./auth.service";


export default class AuthController{
    static async login(req: Request, res: Response){
        try{
            const {email, password} = req.body;
            const result = await AuthService.login(email, password);
            res.cookie('token', result)
            res.json(result)
        }catch(error: any){
            res.status(401).json({ message: error.message });
        }      
    }
}