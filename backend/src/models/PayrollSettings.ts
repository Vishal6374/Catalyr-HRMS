import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface PayrollSettingsAttributes {
    id: string;
    default_pf_percentage: number;
    default_esi_percentage: number;
    default_absent_deduction_type: 'percentage' | 'amount';
    default_absent_deduction_value: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface PayrollSettingsCreationAttributes extends Optional<PayrollSettingsAttributes, 'id' | 'default_pf_percentage' | 'default_esi_percentage' | 'default_absent_deduction_type' | 'default_absent_deduction_value' | 'created_at' | 'updated_at'> { }

class PayrollSettings extends Model<PayrollSettingsAttributes, PayrollSettingsCreationAttributes> implements PayrollSettingsAttributes {
    public id!: string;
    public default_pf_percentage!: number;
    public default_esi_percentage!: number;
    public default_absent_deduction_type!: 'percentage' | 'amount';
    public default_absent_deduction_value!: number;

    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

PayrollSettings.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        default_pf_percentage: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 12.00,
        },
        default_esi_percentage: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0.75,
        },
        default_absent_deduction_type: {
            type: DataTypes.ENUM('percentage', 'amount'),
            allowNull: false,
            defaultValue: 'percentage',
        },
        default_absent_deduction_value: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 3.33, // Approximately 1 day's salary (100/30)
        },
    },
    {
        sequelize,
        tableName: 'payroll_settings',
        timestamps: true,
        underscored: true,
    }
);

export default PayrollSettings;
