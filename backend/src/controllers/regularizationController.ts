import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { RegularizationRequest, AttendanceLog, User } from '../models';
import { AppError } from '../middleware/errorHandler';
import { Op } from 'sequelize';

export const requestRegularization = async (req: AuthRequest, res: Response): Promise<void> => {
    const { attendance_date, type, new_check_in, new_check_out, new_status, reason } = req.body;

    const request = await RegularizationRequest.create({
        employee_id: req.user!.id,
        attendance_date,
        type,
        new_check_in,
        new_check_out,
        new_status,
        reason,
    });

    res.status(201).json({
        message: 'Regularization request submitted successfully',
        request,
    });
};

export const getMyRequests = async (req: AuthRequest, res: Response): Promise<void> => {
    const requests = await RegularizationRequest.findAll({
        where: { employee_id: req.user!.id },
        order: [['created_at', 'DESC']],
    });
    res.json(requests);
};

export const getAllRequests = async (req: AuthRequest, res: Response): Promise<void> => {
    const requests = await RegularizationRequest.findAll({
        include: [{
            model: User,
            as: 'employee',
            attributes: ['name', 'employee_id', 'role'],
            where: req.user?.role === 'hr' ? { role: { [Op.ne]: 'admin' } } : undefined
        }],
        order: [['created_at', 'DESC']],
    });
    res.json(requests);
};

export const processRequest = async (req: AuthRequest, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const { status, remarks } = req.body;

    if (req.user?.role !== 'hr' && req.user?.role !== 'admin') {
        throw new AppError(403, 'Permission denied');
    }

    const request = await RegularizationRequest.findByPk(id, {
        include: [{ model: User, as: 'employee', attributes: ['role'] }]
    });

    if (!request) throw new AppError(404, 'Request not found');

    // Apply restricted logic: Requests by HR can only be processed by Admin
    const applicant = request.get('employee') as any;
    if (applicant?.role === 'hr' && req.user.role !== 'admin') {
        throw new AppError(403, 'HR requests can only be processed by Admin');
    }

    // Prevent self-processing
    if (request.employee_id === req.user.id) {
        throw new AppError(400, 'You cannot process your own request');
    }

    if (request.status !== 'pending') {
        throw new AppError(400, 'Request already processed');
    }

    request.status = status;
    request.remarks = remarks;
    request.approved_by = req.user!.id;
    await request.save();

    if (status === 'approved') {
        // Update the actual attendance log
        let log = await AttendanceLog.findOne({
            where: { employee_id: request.employee_id, date: request.attendance_date }
        });

        const updateData: any = {
            edited_by: req.user!.id,
            edit_reason: `Regularization: ${request.reason}`,
        };

        if (request.type === 'check_in' || request.type === 'both') {
            updateData.check_in = request.new_check_in;
        }
        if (request.type === 'check_out' || request.type === 'both') {
            updateData.check_out = request.new_check_out;
        }
        if (request.type === 'status_change') {
            updateData.status = request.new_status;
        }

        if (log) {
            await log.update(updateData);
        } else {
            await AttendanceLog.create({
                employee_id: request.employee_id,
                date: request.attendance_date,
                ...updateData
            });
        }
    }

    res.json({
        message: `Regularization request ${status}`,
        request,
    });
};
