import { Request, Response } from 'express';
import Notification from '../models/notification.model';
import { CustomError } from '../utils/common';

export const isExistNotification = async (req: Request, res: Response) => {

    const userId = req.user._id;
    const { category } = req.query;

    const filter: {
        notification_for: any;
        seen: boolean;
        user: { $ne: any };
        type?: string;
    } = {
        notification_for: userId,
        seen: false,
        user: { $ne: userId },
    };

    if (typeof category === 'string' && category !== 'all') filter.type = category;


    const totalNotification = await Notification.countDocuments(filter);

    res.status(200).json({
        success: true,
        isNewNotification: totalNotification > 0,
        totalNotification,
    });

};

export const listNotifications = async (req: Request, res: Response) => {

    const userId = req.user._id;
    const { type, deletedDocCount } = req.query;

    const maxLimit: number = 10;
    const page = Math.max(0, Number(req.query.page) - 1 || 0);
    let skip = page * maxLimit;

    if (deletedDocCount) skip -= Number(deletedDocCount);


    const filter: {
        notification_for: any;
        user: { $ne: any };
        type?: string;
    } = {
        notification_for: userId,
        user: { $ne: userId },
    };

    if (typeof type === 'string' && type !== 'all') filter.type = type;


    const notifications = await Notification.find(filter)
        .skip(skip)
        .limit(maxLimit)
        .populate('blog', 'title blog_id')
        .populate('user', 'personal_info.profile_img personal_info.username personal_info.fullname')
        .populate('comment', 'comment')
        .populate('replied_on_comment', 'comment')
        .populate('reply', 'comment')
        .sort({ createdAt: -1 })
        .select('createdAt type seen reply');

    if (!notifications) throw new CustomError('No notifications found', 404, true);

    await Notification.updateMany(filter, { seen: true }).skip(skip).limit(maxLimit);

    const pages = await res.getModelListDetails(Notification, filter).then((details: any) => details.pages);

    res.status(200).json({
        success: true,
        details: pages,
        result: notifications,
    });
};