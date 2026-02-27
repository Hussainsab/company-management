import {
  Table,
  Column,
  Model,
  DataType,
  HasOne,
  Default,
  BelongsToMany,
} from "sequelize-typescript";
import { Profile } from "../profile/profile.model";
import { ProjectEmployee } from "../project/project-employee.model";
import { Project } from "../project/project.model";

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
  @Default(DataType.UUIDV4)
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

  @HasOne(() => Profile)
  profile!: Profile;

  @BelongsToMany(() => Project, () => ProjectEmployee)
  projects!: Project[];
}