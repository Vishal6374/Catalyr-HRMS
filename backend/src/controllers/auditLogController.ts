import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import AuditLog from '../models/AuditLog';
import { AppError } from '../middleware/errorHandler';

export const getAllLogs = async (req: AuthRequest, res: Response): Promise<void> => {
    // Audit logs should be visible to HR and Admin
    if (req.user?.role !== 'admin' && req.user?.role !== 'hr') {
        throw new AppError(403, 'Access denied. Only HR and Admin can view logs.');
    }

    const { module, action, performerId } = req.query;

    const where: any = {};
    if (module) where.module = module;
    if (action) where.action = action;
    if (performerId) where.performed_by = performerId;

    const logs = await AuditLog.findAll({
        where,
        include: [
            {
                association: 'performer',
                attributes: ['id', 'name', 'email', 'role', 'avatar_url']
            }
        ],
        order: [['created_at', 'DESC']],
        limit: 100,
    });

    res.json(logs);
};

export const getLogDetails = async (req: AuthRequest, res: Response): Promise<void> => {
    if (req.user?.role !== 'admin' && req.user?.role !== 'hr') {
        throw new AppError(403, 'Access denied.');
    }

    const { id } = req.params;
    const log = await AuditLog.findByPk(id as string, {
        include: [
            {
                association: 'performer',
                attributes: ['id', 'name', 'email', 'role', 'avatar_url']
            }
        ]
    });

    if (!log) {
        throw new AppError(404, 'Log not found');
    }

    res.json(log);
};
