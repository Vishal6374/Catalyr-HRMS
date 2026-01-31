import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface LeaveTypeAttributes {
    id: string;
    name: string;
    description?: string;
    is_paid: boolean;
    default_days_per_year: number;
    status: 'active' | 'inactive';
    created_at?: Date;
    updated_at?: Date;
}

export interface LeaveTypeCreationAttributes extends Optional<LeaveTypeAttributes, 'id' | 'status' | 'created_at' | 'updated_at'> { }

class LeaveType extends Model<LeaveTypeAttributes, LeaveTypeCreationAttributes> implements LeaveTypeAttributes {
    public id!: string;
    public name!: string;
    public description?: string;
    public is_paid!: boolean;
    public default_days_per_year!: number;
    public status!: 'active' | 'inactive';

    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

LeaveType.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        is_paid: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        default_days_per_year: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 12,
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            allowNull: false,
            defaultValue: 'active',
        },
    },
    {
        sequelize,
        tableName: 'leave_types',
        timestamps: true,
        underscored: true,
    }
);

export default LeaveType;
