import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Resignation from '../models/Resignation';
import { AppError } from '../middleware/errorHandler';
import { logAudit } from '../utils/auditLogger';
import { Op } from 'sequelize';
import User from '../models/User';

export const getResignations = async (req: AuthRequest, res: Response): Promise<void> => {
    const { status, employee_id } = req.query;

    const where: any = {};

    // If Admin, show everything
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

    const resignations = await Resignation.findAll({
        where,
        include: [
            {
                association: 'employee',
                attributes: ['id', 'name', 'email', 'employee_id', 'role'],
                where: req.user?.role === 'hr' ? { role: { [Op.ne]: 'admin' } } : undefined
            },
        ],
        order: [['created_at', 'DESC']],
    });

    res.json(resignations);
};

export const applyResignation = async (req: AuthRequest, res: Response): Promise<void> => {
    const { reason, preferred_last_working_day } = req.body;
    const employee_id = req.user?.id;

    if (!employee_id) {
        throw new AppError(401, 'Authentication required');
    }

    // Check if there's already a pending resignation
    const existing = await Resignation.findOne({
        where: {
            employee_id,
            status: 'pending',
        },
    });

    if (existing) {
        throw new AppError(400, 'You already have a pending resignation request');
    }

    const resignation = await Resignation.create({
        employee_id,
        reason,
        preferred_last_working_day: new Date(preferred_last_working_day),
        status: 'pending',
    });

    await logAudit({
        action: 'APPLY',
        module: 'RESIGNATION',
        entity_type: 'RESIGNATION',
        entity_id: resignation.id,
        performed_by: req.user!.id,
        new_value: resignation.toJSON(),
        ip_address: req.ip,
        user_agent: req.get('user-agent'),
    });

    res.status(201).json({
        message: 'Resignation request submitted successfully',
        resignation,
    });

};

export const approveResignation = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const { approved_last_working_day, hr_remarks } = req.body;

    if (req.user?.role !== 'hr' && req.user?.role !== 'admin') {
        throw new AppError(403, 'Permission denied');
    }

    const resignation = await Resignation.findByPk(id as string, {
        include: [{ association: 'employee', attributes: ['role'] }]
    });

    if (!resignation) {
        throw new AppError(404, 'Resignation request not found');
    }

    // Apply restricted logic: Requests by HR can only be approved by Admin
    const applicant = resignation.get('employee') as any;
    if (applicant?.role === 'hr' && req.user.role !== 'admin') {
        throw new AppError(403, 'HR requests can only be approved by Admin');
    }

    // Prevent self-approval
    if (resignation.employee_id === req.user.id) {
        throw new AppError(400, 'You cannot approve your own request');
    }

    if (resignation.status !== 'pending') {
        throw new AppError(400, `Cannot approve a resignation that is already ${resignation.status}`);
    }

    resignation.status = 'approved';
    resignation.approved_last_working_day = approved_last_working_day ? new Date(approved_last_working_day) : resignation.preferred_last_working_day;
    resignation.hr_remarks = hr_remarks;

    const oldValues = resignation.toJSON();
    await resignation.save();

    // Update Employee Status and delete sensitive details
    const employee = await User.findByPk(resignation.employee_id);
    if (employee) {
        const oldEmployeeValues = employee.toJSON();

        // Update status and termination info
        employee.status = 'terminated';
        employee.termination_date = resignation.approved_last_working_day;
        employee.termination_reason = resignation.reason;

        // Clear sensitive employee details (Personal & Payroll)
        employee.phone = undefined;
        employee.address = undefined;
        employee.date_of_birth = undefined;
        employee.bank_name = undefined;
        employee.account_number = undefined;
        employee.ifsc_code = undefined;
        employee.branch_name = undefined;
        employee.salary = 0;
        employee.avatar_url = undefined;
        employee.pf_percentage = undefined;
        employee.esi_percentage = undefined;
        employee.absent_deduction_type = undefined;
        employee.absent_deduction_value = undefined;

        await employee.save();

        await logAudit({
            action: 'TERMINATE',
            module: 'EMPLOYEE',
            entity_type: 'USER',
            entity_id: employee.id,
            performed_by: req.user!.id,
            old_value: oldEmployeeValues,
            new_value: employee.toJSON(),
            ip_address: req.ip,
            user_agent: req.get('user-agent'),
        });
    }

    await logAudit({
        action: 'APPROVE',
        module: 'RESIGNATION',
        entity_type: 'RESIGNATION',
        entity_id: resignation.id,
        performed_by: req.user!.id,
        old_value: oldValues,
        new_value: resignation.toJSON(),
        ip_address: req.ip,
        user_agent: req.get('user-agent'),
    });

    res.json({
        message: 'Resignation request approved',
        resignation,
    });

};

export const rejectResignation = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const { hr_remarks } = req.body;

    if (req.user?.role !== 'hr' && req.user?.role !== 'admin') {
        throw new AppError(403, 'Permission denied');
    }

    const resignation = await Resignation.findByPk(id as string, {
        include: [{ association: 'employee', attributes: ['role'] }]
    });

    if (!resignation) {
        throw new AppError(404, 'Resignation request not found');
    }

    // Apply restricted logic: Requests by HR can only be rejected by Admin
    const applicant = resignation.get('employee') as any;
    if (applicant?.role === 'hr' && req.user.role !== 'admin') {
        throw new AppError(403, 'HR requests can only be rejected by Admin');
    }

    // Prevent self-rejection
    if (resignation.employee_id === req.user.id) {
        throw new AppError(400, 'You cannot reject your own request');
    }

    if (resignation.status !== 'pending') {
        throw new AppError(400, `Cannot reject a resignation that is already ${resignation.status}`);
    }

    resignation.status = 'rejected';
    resignation.hr_remarks = hr_remarks;

    const oldValues = resignation.toJSON();
    await resignation.save();

    await logAudit({
        action: 'REJECT',
        module: 'RESIGNATION',
        entity_type: 'RESIGNATION',
        entity_id: resignation.id,
        performed_by: req.user!.id,
        old_value: oldValues,
        new_value: resignation.toJSON(),
        ip_address: req.ip,
        user_agent: req.get('user-agent'),
    });

    res.json({
        message: 'Resignation request rejected',
        resignation,
    });

};

export const withdrawResignation = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const employee_id = req.user?.id;

    const resignation = await Resignation.findByPk(id as string);

    if (!resignation) {
        throw new AppError(404, 'Resignation request not found');
    }

    if (resignation.employee_id !== employee_id && req.user?.role !== 'admin' && req.user?.role !== 'hr') {
        throw new AppError(403, 'Permission denied');
    }

    if (resignation.status !== 'pending') {
        throw new AppError(400, 'Only pending resignations can be withdrawn');
    }

    resignation.status = 'withdrawn';
    const oldValues = resignation.toJSON();
    await resignation.save();

    await logAudit({
        action: 'WITHDRAW',
        module: 'RESIGNATION',
        entity_type: 'RESIGNATION',
        entity_id: resignation.id,
        performed_by: req.user!.id,
        old_value: oldValues,
        new_value: resignation.toJSON(),
        ip_address: req.ip,
        user_agent: req.get('user-agent'),
    });

    res.json({
        message: 'Resignation request withdrawn successfully',
        resignation,
    });

};
