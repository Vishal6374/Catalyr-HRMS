import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Reimbursement from '../models/Reimbursement';
import { AppError } from '../middleware/errorHandler';
import { Op } from 'sequelize';
import { config } from '../config';
import { logAudit } from '../utils/auditLogger';
import User from '../models/User';

export const uploadReceipt = async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.file) {
        throw new AppError(400, 'No file uploaded');
    }

    const fileUrl = `${config.api.baseUrl}/uploads/documents/${req.file.filename}`;
    res.json({ url: fileUrl });
};

export const getReimbursements = async (req: AuthRequest, res: Response): Promise<void> => {
    const { status, employee_id } = req.query;

    const where: any = {};

    if (req.user?.role === 'admin') {
        // Admin sees all
    } else if (req.user?.role === 'hr') {
        // HR sees everyone except Admins (or based on company policy, usually they manage employees)
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

    const reimbursements = await Reimbursement.findAll({
        where,
        include: [
            {
                association: 'employee',
                attributes: ['id', 'name', 'email', 'employee_id', 'role'],
                where: req.user?.role === 'hr' ? { role: { [Op.ne]: 'admin' } } : undefined
            },
            { association: 'approver', attributes: ['id', 'name', 'email'] },
        ],
        order: [['created_at', 'DESC']],
    });

    res.json(reimbursements);
};

export const submitReimbursement = async (req: AuthRequest, res: Response): Promise<void> => {
    const { category, amount, description, receipt_url } = req.body;

    const reimbursement = await Reimbursement.create({
        employee_id: req.user!.id,
        category,
        amount,
        description,
        receipt_url,
        status: 'pending',
    });

    res.status(201).json({
        message: 'Reimbursement submitted successfully',
        reimbursement,
    });
};

export const approveReimbursement = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const { remarks } = req.body;

    if (req.user?.role !== 'hr' && req.user?.role !== 'admin') {
        throw new AppError(403, 'Permission denied');
    }

    const reimbursement = await Reimbursement.findByPk(id as string, {
        include: [{ association: 'employee', attributes: ['role'] }]
    });

    if (!reimbursement) {
        throw new AppError(404, 'Reimbursement not found');
    }

    // Apply restricted logic: Requests by HR can only be approved by Admin
    const applicant = reimbursement.get('employee') as any;
    if (applicant?.role === 'hr' && req.user.role !== 'admin') {
        throw new AppError(403, 'HR requests can only be approved by Admin');
    }

    // Prevent self-approval
    if (reimbursement.employee_id === req.user.id) {
        throw new AppError(400, 'You cannot approve your own request');
    }

    if (reimbursement.status !== 'pending') {
        throw new AppError(400, 'Reimbursement already processed');
    }

    reimbursement.status = 'approved';
    reimbursement.approved_by = req.user.id;
    reimbursement.approved_at = new Date();
    reimbursement.remarks = remarks;
    await reimbursement.save();

    const targetUser = await User.findByPk(reimbursement.employee_id, { attributes: ['name'] });
    await logAudit({
        action: `Approved reimbursement for ${targetUser?.name || 'Employee'}: $${reimbursement.amount}`,
        module: 'REIMBURSEMENTS',
        entity_type: 'REIMBURSEMENT',
        entity_id: reimbursement.id,
        performed_by: req.user.id,
        new_value: reimbursement.toJSON(),
        ip_address: req.ip,
        user_agent: req.get('user-agent'),
    });

    res.json({
        message: 'Reimbursement approved successfully',
        reimbursement,
    });
};

export const rejectReimbursement = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const { remarks } = req.body;

    if (req.user?.role !== 'hr' && req.user?.role !== 'admin') {
        throw new AppError(403, 'Permission denied');
    }

    const reimbursement = await Reimbursement.findByPk(id as string, {
        include: [{ association: 'employee', attributes: ['role'] }]
    });

    if (!reimbursement) {
        throw new AppError(404, 'Reimbursement not found');
    }

    // Apply restricted logic: Requests by HR can only be rejected by Admin
    const applicant = reimbursement.get('employee') as any;
    if (applicant?.role === 'hr' && req.user.role !== 'admin') {
        throw new AppError(403, 'HR requests can only be rejected by Admin');
    }

    // Prevent self-rejection
    if (reimbursement.employee_id === req.user.id) {
        throw new AppError(400, 'You cannot reject your own request');
    }

    if (reimbursement.status !== 'pending') {
        throw new AppError(400, 'Reimbursement already processed');
    }

    reimbursement.status = 'rejected';
    reimbursement.approved_by = req.user.id;
    reimbursement.approved_at = new Date();
    reimbursement.remarks = remarks;
    await reimbursement.save();

    const targetUser = await User.findByPk(reimbursement.employee_id, { attributes: ['name'] });
    await logAudit({
        action: `Rejected reimbursement for ${targetUser?.name || 'Employee'}: $${reimbursement.amount}`,
        module: 'REIMBURSEMENTS',
        entity_type: 'REIMBURSEMENT',
        entity_id: reimbursement.id,
        performed_by: req.user.id,
        new_value: reimbursement.toJSON(),
        ip_address: req.ip,
        user_agent: req.get('user-agent'),
    });

    res.json({
        message: 'Reimbursement rejected',
        reimbursement,
    });
};
