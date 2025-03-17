import { Request, Response } from 'express-serve-static-core';
import Notification from '../models/notification';

export const isExistNotification = async (req: Request, res: Response) => {

    const userId = req.user._id;
    const { category } = req.query;

    interface IFilter { notification_for: any; seen: boolean, user: { $ne: any }; type?: string }
    let filter: IFilter = { notification_for: userId, seen: false, user: { $ne: userId } };

    if (typeof category === 'string' && category !== 'all') filter.type = category;

    // const isNewNotification = await Notification.exists(filter);
    const totalNotification = await Notification.countDocuments(filter);

    res.status(200).send({
        success: true,
        isNewNotification: !!totalNotification,
        totalNotification: totalNotification
    });
};

export const listNotifications = async (req: Request, res: Response) => {

    const userId = req.user._id;

    const { type } = req.query;
    const deletedDocCount = req.query?.deletedDocCount;

    // pagination
    const maxLimit = 10;
    let page = Number(req.query.page)
    page = page > 0 ? (page - 1) : 0
    let skip = page * maxLimit;

    // Custom Filter
    interface IFilter { notification_for: any; user: { $ne: any }; type?: string }
    const filter: IFilter = { notification_for: userId, user: { $ne: userId } };

    if (typeof type === 'string' && type !== 'all') filter.type = type;

    if (deletedDocCount) skip -= Number(deletedDocCount);

    const result = await Notification.find(filter)
        .skip(skip)
        .limit(maxLimit)
        .populate('blog', 'title blog_id')
        .populate('user', 'personal_info.profile_img personal_info.username personal_info.fullname')
        .populate('comment', 'comment')
        .populate('replied_on_comment', 'comment')
        .populate('reply', 'comment')
        .sort({ createdAt: -1 })
        .select('createdAt type seen reply');


    Notification.updateMany(filter, { seen: true })
    .skip(skip)
        .limit(maxLimit)
    .then(()=>console.log('notification seen'))


    res.status(200).send({
        success: true,
        details: await res.getModelListDetails(Notification, filter).then((details: any) => details.pages),
        result
    });
}