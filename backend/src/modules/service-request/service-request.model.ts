import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    Default,
    BelongsToMany,
} from "sequelize-typescript";
import { User } from "../user/user.model";
import { Service } from "../service/service.model";
import { Project } from "../project/project.model";

export enum ServiceRequestStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
}

@Table({
    tableName: "service_requests",
    underscored: true,
})
export class ServiceRequest extends Model {
    @Default(DataType.UUIDV4)
    @Column({
        type: DataType.UUID,
        primaryKey: true,
    })
    id!: string;

    @ForeignKey(() => User)
    @Column({
        field: "client_id",
        type: DataType.UUID,
        allowNull: false,
    })
    clientId!: string;

    @ForeignKey(() => Service)
    @Column({
        field: "service_id",
        type: DataType.UUID,
        allowNull: true,
    })
    serviceId!: string | null;

    @Column({
        field: "custom_service_name",
        type: DataType.STRING,
        allowNull: true,
    })
    customServiceName!: string | null;

    @ForeignKey(() => Project)
    @Column({
        field: "project_id",
        type: DataType.UUID,
        allowNull: true,
    })
    projectId!: string;

    @ForeignKey(() => User)
    @Column({
        field: "created_by_id",
        type: DataType.UUID,
        allowNull: true,
    })
    createdById!: string;

    @Column({
        field: "requested_project_name",
        type: DataType.STRING,
        allowNull: true,
    })
    requestedProjectName!: string | null;

    @Column({
        field: "requested_employee_count",
        type: DataType.INTEGER,
        defaultValue: 1,
    })
    requestedEmployeeCount!: number;

    @Column({
        type: DataType.ENUM(...Object.values(ServiceRequestStatus)),
        defaultValue: ServiceRequestStatus.PENDING,
    })
    status!: string;

    @Column({
        type: DataType.TEXT,
    })
    note!: string;

    @BelongsTo(() => User, { foreignKey: "client_id", as: "client" })
    client!: User;

    @BelongsTo(() => Service)
    service!: Service;

    @BelongsTo(() => Project, { foreignKey: "project_id", as: "project" })
    project!: Project;

    @BelongsTo(() => User, { foreignKey: "created_by_id", as: "creator" })
    creator!: User;
}
