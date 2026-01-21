import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import EmployeeDocument from '../models/EmployeeDocument';
import { AppError } from '../middleware/errorHandler';
import { config } from '../config';
import path from 'path';

export const getEmployeeDocuments = async (req: AuthRequest, res: Response): Promise<void> => {
    const employeeId = Array.isArray(req.params.employeeId) ? req.params.employeeId[0] : req.params.employeeId;

    const documents = await EmployeeDocument.findAll({
        where: { employee_id: employeeId },
        order: [['created_at', 'DESC']],
    });

    res.json(documents);
};

export const uploadDocument = async (req: AuthRequest, res: Response): Promise<void> => {
    const employeeId = Array.isArray(req.params.employeeId) ? req.params.employeeId[0] : req.params.employeeId;
    const { documentType } = req.body;

    if (!documentType) {
        throw new AppError(400, 'Missing required field: documentType');
    }

    if (!req.file) {
        throw new AppError(400, 'No file uploaded');
    }

    // Generate full file URL
    const fileUrl = `${config.api.baseUrl}/uploads/documents/${req.file.filename}`;

    const document = await EmployeeDocument.create({
        employee_id: employeeId,
        document_type: documentType,
        file_name: req.file.originalname,
        file_url: fileUrl,
        file_size: req.file.size,
        uploaded_by: req.user!.id,
    });

    res.status(201).json({
        message: 'Document uploaded successfully',
        document,
    });
};

export const deleteDocument = async (req: AuthRequest, res: Response): Promise<void> => {
    const documentId = Array.isArray(req.params.documentId) ? req.params.documentId[0] : req.params.documentId;

    const document = await EmployeeDocument.findByPk(documentId as string);

    if (!document) {
        throw new AppError(404, 'Document not found');
    }

    // Only allow deletion by document uploader or HR
    if (document.uploaded_by !== req.user!.id && req.user!.role !== 'hr') {
        throw new AppError(403, 'You do not have permission to delete this document');
    }

    // Delete file from disk
    try {
        const filePath = path.join(process.cwd(), 'uploads/documents', path.basename(document.file_url));
        const fs = await import('fs');
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (error) {
        console.error('Error deleting file:', error);
        // Continue with DB deletion even if file deletion fails
    }

    await document.destroy();

    res.json({ message: 'Document deleted successfully' });
};

export const getDocument = async (req: AuthRequest, res: Response): Promise<void> => {
    const documentId = Array.isArray(req.params.documentId) ? req.params.documentId[0] : req.params.documentId;

    const document = await EmployeeDocument.findByPk(documentId as string);

    if (!document) {
        throw new AppError(404, 'Document not found');
    }

    res.json(document);
};
