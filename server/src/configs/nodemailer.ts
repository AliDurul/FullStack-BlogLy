import nodemailer, { Transporter } from 'nodemailer';
import { ENV } from './env';

let transporter: Transporter | null = null;

export function getTransporter(): Transporter {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: ENV.emailUser,
                pass: ENV.emailPass,
            },
        });
    }

    return transporter;
}