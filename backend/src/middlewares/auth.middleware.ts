import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET as string;

interface AuthRequest extends Request{
    user?:{
        userId:string,
        role:string
    }
}

const authenticate = async(req:AuthRequest, res: Response, next: NextFunction)=>{
    const authHeader = req.headers.authorization
    
    if(!authHeader || !authHeader?.startsWith('Bearer')){
        return res.status(401).json({message: "Unauthorise"})
    }

    let token = authHeader.split(" ")[1];

    try{
        let decoded = await jwt.verify(token, JWT_SECRET) as any;
        req.user = decoded
        next()
    }catch(error){
        return res.status(401).json({message: "Invalid token"})
    }
}

export {authenticate};