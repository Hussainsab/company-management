import {
    Table,
    Column,
    Model,
    DataType,
    Default,
    HasMany,
} from "sequelize-typescript";

@Table({
    tableName: "services",
    underscored: true,
})
export class Service extends Model {
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

    @Column({
        type: DataType.DECIMAL(10, 2),
    })
    price!: number;
}
