import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";

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

if(sequelize) sequelize.addModels([]);

export { sequelize };