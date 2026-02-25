import { Request, Response } from "express";
import UserService from "./user.service";


export default class UserController{
    static async createUser(req: Request, res: Response){
        try{
            const {email, password, role} = req.body;
            const result = await UserService.createUser(email, password, role)
            res.status(201).json(result)
        }catch(error: any){
            res.status(400).json({ message: error.message });
        }
    }

    static async getUsers(req: Request, res: Response){

    }

    static async getUser(req: Request, res: Response){

    }

    static async deleteUser(req: Request, res: Response){

    }

    static async updateUser(req: Request, res: Response){

    }
}