
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";

export enum UserRole {
  ADMIN = "admin",
  EMPLOYEE = "employee",
  CLIENT = "client",
}

@Table({
  tableName: "users",
  underscored: true,
})
export class User extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    field: "password_hash",
    type: DataType.STRING,
    allowNull: false,
  })
  passwordHash!: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: false,
  })
  role!: string;

  @Column({
    field: "is_active",
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive!: boolean;
}