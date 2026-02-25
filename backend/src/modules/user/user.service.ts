import { User, UserRole } from "./user.model";
import bcrypt from 'bcrypt';


export default class UserService{
    static async createUser(email:string, password:string, role: UserRole){
        if(!email || !password){
            throw new Error("invalid email");
        }

        let existingUser = await User.findOne({where: {email}});
        if(existingUser){
            throw new Error("User already exist!")
        }

        let hashedPassword = await bcrypt.hash(password, 10)

        let user = await User.create({email,passwordHash: hashedPassword, role})
        return user
    }

    static async getUsers(){

    }

    static async getUser(){

    }

    static async deleteUser(){

    }

    static async updateUser(){

    }
}