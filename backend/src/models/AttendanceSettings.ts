import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface AttendanceSettingsAttributes {
    id: string;
    standard_work_hours: number;
    half_day_threshold: number;
    allow_self_clock_in: boolean;
    auto_half_day_time: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface AttendanceSettingsCreationAttributes extends Optional<AttendanceSettingsAttributes, 'id' | 'allow_self_clock_in' | 'auto_half_day_time' | 'created_at' | 'updated_at'> { }

class AttendanceSettings extends Model<AttendanceSettingsAttributes, AttendanceSettingsCreationAttributes> implements AttendanceSettingsAttributes {
    public id!: string;
    public standard_work_hours!: number;
    public half_day_threshold!: number;
    public allow_self_clock_in!: boolean;
    public auto_half_day_time!: string;

    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

AttendanceSettings.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        standard_work_hours: {
            type: DataTypes.DECIMAL(4, 2),
            allowNull: false,
            defaultValue: 8.00,
            validate: {
                min: 0,
                max: 24,
            },
        },
        half_day_threshold: {
            type: DataTypes.DECIMAL(4, 2),
            allowNull: false,
            defaultValue: 4.00,
            validate: {
                min: 0,
                max: 24,
            },
        },
        allow_self_clock_in: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        auto_half_day_time: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: '19:00',
        },
    },
    {
        sequelize,
        tableName: 'attendance_settings',
        timestamps: true,
        underscored: true,
    }
);

export default AttendanceSettings;
