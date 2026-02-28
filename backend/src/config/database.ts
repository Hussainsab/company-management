import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import { User } from "../modules/user/user.model";
import { Profile } from "../modules/profile/profile.model";
import { ClientCompany } from "../modules/company/company.model";
import { Service } from "../modules/service/service.model";
import { ServiceRequest } from "../modules/service-request/service-request.model";
import { Project } from "../modules/project/project.model";
import { ProjectEmployee } from "../modules/project/project-employee.model";
import { Message } from "../modules/message/message.model";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

let sequelize: Sequelize;

if (isProduction) {
  sequelize = new Sequelize(process.env.DATABASE_URL as string, {
    dialect: "postgres",
    logging: false,
  });
} else {
  sequelize = new Sequelize({
    database: process.env.DB_NAME as string,
    username: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    host: process.env.DB_HOST as string,
    dialect: "postgres",
    logging: false,
  });
}

sequelize.addModels([
  User,
  Profile,
  ClientCompany,
  Service,
  ServiceRequest,
  Project,
  ProjectEmployee,
  Message,
]);

export { sequelize };