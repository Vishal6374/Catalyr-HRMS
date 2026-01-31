import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import LeaveType from '../models/LeaveType';
import { AppError } from '../middleware/errorHandler';
import { logAudit } from '../utils/auditLogger';

export const getLeaveTypes = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        const leaveTypes = await LeaveType.findAll({
            order: [['name', 'ASC']]
        });
        res.json(leaveTypes);
    } catch (error: any) {
        console.error('Error fetching leave types:', error);
        res.status(500).json({ message: 'Failed to fetch leave types', error: error.message });
    }
};

export const createLeaveType = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user?.role !== 'hr' && req.user?.role !== 'admin') {
            throw new AppError(403, 'Permission denied');
        }

        const { name, description, is_paid, default_days_per_year } = req.body;

        if (!name) {
            throw new AppError(400, 'Leave type name is required');
        }

        const existing = await LeaveType.findOne({ where: { name } });
        if (existing) {
            throw new AppError(400, 'Leave type with this name already exists');
        }

        const leaveType = await LeaveType.create({
            name,
            description,
            is_paid: is_paid !== undefined ? is_paid : true,
            default_days_per_year: default_days_per_year || 12,
            status: 'active'
        });

        await logAudit({
            action: 'CREATE',
            module: 'LEAVE_SETTINGS',
            entity_type: 'LEAVE_TYPE',
            entity_id: leaveType.id,
            performed_by: req.user!.id,
            new_value: leaveType.toJSON(),
            ip_address: req.ip,
            user_agent: req.get('user-agent') as string || 'unknown',
        });

        res.status(201).json({
            message: 'Leave type created successfully',
            leaveType
        });
    } catch (error: any) {
        console.error('Error creating leave type:', error);
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
};

export const updateLeaveType = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user?.role !== 'hr' && req.user?.role !== 'admin') {
            throw new AppError(403, 'Permission denied');
        }

        const { id } = req.params;
        const { name, description, is_paid, default_days_per_year, status } = req.body;

        const leaveType = await LeaveType.findByPk(id as string);
        if (!leaveType) {
            throw new AppError(404, 'Leave type not found');
        }

        const oldValues = leaveType.toJSON();

        await leaveType.update({
            name: name !== undefined ? name : leaveType.name,
            description: description !== undefined ? description : leaveType.description,
            is_paid: is_paid !== undefined ? is_paid : leaveType.is_paid,
            default_days_per_year: default_days_per_year !== undefined ? default_days_per_year : leaveType.default_days_per_year,
            status: status !== undefined ? status : leaveType.status
        });

        await logAudit({
            action: 'UPDATE',
            module: 'LEAVE_SETTINGS',
            entity_type: 'LEAVE_TYPE',
            entity_id: leaveType.id,
            performed_by: req.user!.id,
            old_value: oldValues,
            new_value: leaveType.toJSON(),
            ip_address: req.ip,
            user_agent: req.get('user-agent') as string || 'unknown',
        });

        res.json({
            message: 'Leave type updated successfully',
            leaveType
        });
    } catch (error: any) {
        console.error('Error updating leave type:', error);
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
};

export const deleteLeaveType = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user?.role !== 'hr' && req.user?.role !== 'admin') {
            throw new AppError(403, 'Permission denied');
        }

        const { id } = req.params;
        const leaveType = await LeaveType.findByPk(id as string);
        if (!leaveType) {
            throw new AppError(404, 'Leave type not found');
        }

        // Ideally we check if it's in use, but user asked for "manage" which usually includes delete.
        // We'll do a soft delete or just deactivate it if preferred, but user said "manage".
        // Let's just delete it for now.

        await leaveType.destroy();

        await logAudit({
            action: 'DELETE',
            module: 'LEAVE_SETTINGS',
            entity_type: 'LEAVE_TYPE',
            entity_id: id as string,
            performed_by: req.user!.id,
            old_value: leaveType.toJSON(),
            ip_address: req.ip,
            user_agent: req.get('user-agent') as string || 'unknown',
        });

        res.json({ message: 'Leave type deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting leave type:', error);
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
};
