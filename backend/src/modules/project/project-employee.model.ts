import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    Default,
    BelongsTo,
} from "sequelize-typescript";
import { User } from "../user/user.model";
import { Project } from "./project.model";

@Table({
    tableName: "project_employees",
    underscored: true,
})
export class ProjectEmployee extends Model {
    @Default(DataType.UUIDV4)
    @Column({
        type: DataType.UUID,
        primaryKey: true,
    })
    id!: string;

    @ForeignKey(() => Project)
    @Column({
        field: "project_id",
        type: DataType.UUID,
        allowNull: false,
    })
    projectId!: string;

    @ForeignKey(() => User)
    @Column({
        field: "employee_id",
        type: DataType.UUID,
        allowNull: false,
    })
    employeeId!: string;

    @BelongsTo(() => Project)
    project!: Project;

    @BelongsTo(() => User)
    employee!: User;
}
