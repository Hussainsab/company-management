import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    BelongsToMany,
    Default,
} from "sequelize-typescript";
import { User } from "../user/user.model";
import { ProjectEmployee } from "./project-employee.model";

export enum ProjectStatus {
    PLANNED = "planned",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    ON_HOLD = "on_hold",
}

@Table({
    tableName: "projects",
    underscored: true,
})
export class Project extends Model {
    @Default(DataType.UUIDV4)
    @Column({
        type: DataType.UUID,
        primaryKey: true,
    })
    id!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name!: string;

    @Column({
        type: DataType.TEXT,
    })
    description!: string;

    @ForeignKey(() => User)
    @Column({
        field: "client_id",
        type: DataType.UUID,
        allowNull: false,
    })
    clientId!: string;

    @Column({
        type: DataType.ENUM(...Object.values(ProjectStatus)),
        defaultValue: ProjectStatus.PLANNED,
    })
    status!: string;

    @BelongsTo(() => User, { foreignKey: "client_id", as: "client" })
    client!: User;

    @BelongsToMany(() => User, () => ProjectEmployee)
    employees!: User[];
}
