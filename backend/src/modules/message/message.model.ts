import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    Default,
} from "sequelize-typescript";
import { User } from "../user/user.model";

@Table({
    tableName: "messages",
    underscored: true,
})
export class Message extends Model {
    @Default(DataType.UUIDV4)
    @Column({
        type: DataType.UUID,
        primaryKey: true,
    })
    id!: string;

    @ForeignKey(() => User)
    @Column({
        field: "sender_id",
        type: DataType.UUID,
        allowNull: false,
    })
    senderId!: string;

    @ForeignKey(() => User)
    @Column({
        field: "receiver_id",
        type: DataType.UUID,
        allowNull: false,
    })
    receiverId!: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    content!: string;

    @BelongsTo(() => User, { foreignKey: "sender_id", as: "sender" })
    sender!: User;

    @BelongsTo(() => User, { foreignKey: "receiver_id", as: "receiver" })
    receiver!: User;
}
