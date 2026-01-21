import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface EmployeeDocumentAttributes {
    id: string;
    employee_id: string;
    document_type: string;
    file_name: string;
    file_url: string;
    file_size: number;
    uploaded_by: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface EmployeeDocumentCreationAttributes extends Optional<EmployeeDocumentAttributes, 'id' | 'created_at' | 'updated_at'> { }

class EmployeeDocument extends Model<EmployeeDocumentAttributes, EmployeeDocumentCreationAttributes> implements EmployeeDocumentAttributes {
    public id!: string;
    public employee_id!: string;
    public document_type!: string;
    public file_name!: string;
    public file_url!: string;
    public file_size!: number;
    public uploaded_by!: string;

    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

EmployeeDocument.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        employee_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        document_type: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        file_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        file_url: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        file_size: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        uploaded_by: {
            type: DataTypes.UUID,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'employee_documents',
        timestamps: true,
        underscored: true,
    }
);

export default EmployeeDocument;
