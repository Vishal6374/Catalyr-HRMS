import AuditLog from '../models/AuditLog';

interface AuditParams {
    action: string;
    module: string;
    entity_type: string;
    entity_id: string;
    performed_by: string;
    old_value?: any;
    new_value?: any;
    ip_address?: string;
    user_agent?: string;
}

export const logAudit = async (params: AuditParams) => {
    try {
        await AuditLog.create(params);
    } catch (error) {
        console.error('Audit Log Error:', error);
    }
};
