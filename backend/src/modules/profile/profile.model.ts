import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    AllowNull,
    Default,
} from "sequelize-typescript";
import { User } from "../user/user.model";

@Table({
    tableName: "profiles",
    underscored: true,
})
export class Profile extends Model {
    @Default(DataType.UUIDV4)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
    })
    id!: string;

    @ForeignKey(() => User)
    @Column({
        field: "user_id",
        type: DataType.UUID,
        allowNull: false,
    })
    userId!: string;

    @Column({
        type: DataType.STRING,
        field: "first_name",
    })
    firstName!: string;

    @Column({
        type: DataType.STRING,
        field: "last_name",
    })
    lastName!: string;

    @Column({
        type: DataType.STRING,
    })
    phone!: string;

    @Column({
        type: DataType.STRING,
    })
    avatar!: string;

    @BelongsTo(() => User)
    user!: User;
}