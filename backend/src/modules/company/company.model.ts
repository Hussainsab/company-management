import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    HasMany,
    Default,
} from "sequelize-typescript";
import { User } from "../user/user.model";

@Table({
    tableName: "client_companies",
    underscored: true,
})
export class ClientCompany extends Model {
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
        type: DataType.STRING,
    })
    email!: string;

    @Column({
        type: DataType.STRING,
    })
    phone!: string;

    @Column({
        type: DataType.TEXT,
    })
    address!: string;

    @ForeignKey(() => User)
    @Column({
        field: "client_user_id",
        type: DataType.UUID,
        allowNull: false,
    })
    clientUserId!: string;

    @BelongsTo(() => User)
    clientUser!: User;
}
