import { Response } from 'express';
import type { AuthRequest } from '../middleware/auth';
import Complaint from '../models/Complaint';
import { AppError } from '../middleware/errorHandler';
import { Op } from 'sequelize';

/* -------------------------------------------------------------------------- */
/*                               GET COMPLAINTS                                */
/* -------------------------------------------------------------------------- */

export const getComplaints = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { status, employee_id } = req.query as {
            status?: string;
            employee_id?: string;
        };

        const where: Record<string, unknown> = {};

        if (req.user?.role === 'admin') {
            // Admin sees all
        } else if (req.user?.role === 'hr') {
            // HR sees everyone except Admins
            if (employee_id) {
                where.employee_id = employee_id;
            }
        } else {
            // Employees see only their own
            where.employee_id = req.user?.id;
        }

        if (status) {
            where.status = status;
        }

        const complaints = await Complaint.findAll({
            where,
            include: [
                {
                    association: 'employee',
                    attributes: ['id', 'name', 'email', 'employee_id', 'role'],
                    where: req.user?.role === 'hr' ? { role: { [Op.ne]: 'admin' } } : undefined
                },
                { association: 'responder', attributes: ['id', 'name', 'email'] },
            ],
            order: [['created_at', 'DESC']],
        });

        res.json(complaints);
    } catch (error) {
        console.error('Error in getComplaints:', error);
        res.status(500).json({ message: 'Internal server error fetching complaints' });
    }
};

/* -------------------------------------------------------------------------- */
/*                             SUBMIT COMPLAINT                                */
/* -------------------------------------------------------------------------- */

export const submitComplaint = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const {
            subject,
            description,
            category,
            priority,
            is_anonymous,
        } = req.body as {
            subject: string;
            description: string;
            category: string;
            priority?: 'low' | 'medium' | 'high';
            is_anonymous?: boolean;
        };

        if (!req.user?.id) {
            throw new AppError(401, 'User not authenticated');
        }

        const complaint = await Complaint.create({
            employee_id: req.user.id,
            subject,
            description,
            category,
            priority: priority ?? 'medium',
            is_anonymous: is_anonymous ?? false,
            status: 'open',
        });

        res.status(201).json({
            message: 'Complaint submitted successfully',
            complaint,
        });
    } catch (error) {
        console.error('Error in submitComplaint:', error);
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal server error submitting complaint' });
        }
    }
};

/* -------------------------------------------------------------------------- */
/*                           RESPOND TO COMPLAINT                              */
/* -------------------------------------------------------------------------- */

export const respondToComplaint = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const { response, status } = req.body as {
            response: string;
            status?: 'in_progress' | 'closed';
        };

        if (req.user?.role !== 'hr' && req.user?.role !== 'admin') {
            throw new AppError(403, 'Permission denied');
        }

        const complaint = await Complaint.findByPk(id as string, {
            include: [{ association: 'employee', attributes: ['role'] }]
        });

        if (!complaint) {
            throw new AppError(404, 'Complaint not found');
        }

        // Apply restricted logic: Complaints by HR can only be responded to by Admin
        const applicant = complaint.get('employee') as any;
        if (applicant?.role === 'hr' && req.user.role !== 'admin') {
            throw new AppError(403, 'HR complaints can only be responded to by Admin');
        }

        // Prevent self-response
        if (complaint.employee_id === req.user.id) {
            throw new AppError(400, 'You cannot respond to your own complaint');
        }

        complaint.response = response;
        complaint.status = status ?? 'in_progress';
        complaint.responded_by = req.user.id;
        complaint.responded_at = new Date();

        await complaint.save();

        res.json({
            message: 'Response submitted successfully',
            complaint,
        });
    } catch (error) {
        console.error('Error in respondToComplaint:', error);
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal server error responding to complaint' });
        }
    }
};

/* -------------------------------------------------------------------------- */
/*                              CLOSE COMPLAINT                                */
/* -------------------------------------------------------------------------- */

export const closeComplaint = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        if (req.user?.role !== 'hr' && req.user?.role !== 'admin') {
            throw new AppError(403, 'Permission denied');
        }

        const complaint = await Complaint.findByPk(id as string, {
            include: [{ association: 'employee', attributes: ['role'] }]
        });

        if (!complaint) {
            throw new AppError(404, 'Complaint not found');
        }

        // Apply restricted logic: Complaints by HR can only be closed by Admin
        const applicant = complaint.get('employee') as any;
        if (applicant?.role === 'hr' && req.user.role !== 'admin') {
            throw new AppError(403, 'HR complaints can only be closed by Admin');
        }

        // Prevent self-closing
        if (complaint.employee_id === req.user.id) {
            throw new AppError(400, 'You cannot close your own complaint');
        }

        complaint.status = 'closed';
        await complaint.save();

        res.json({
            message: 'Complaint closed successfully',
            complaint,
        });
    } catch (error) {
        console.error('Error in closeComplaint:', error);
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal server error closing complaint' });
        }
    }
};
