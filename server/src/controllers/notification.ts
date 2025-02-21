import { Request, Response } from 'express-serve-static-core';
import Notification from '../models/notification';

export const listNotification = async (req: Request, res: Response) => {

    const userId = req.user._id;

    const isNewNotification = await Notification.exists({ notification_for: userId, seen: false, user: { $ne: userId } });
    
    res.status(200).send({
        success: true,
        isNewNotification: !!isNewNotification
    });



}