import { Router } from "express";
import { Request, Response } from "express";
import { generateUploadUrl } from "../utils/aws.upload";
import { CustomError } from "../utils/common";

const router = Router();

// URL: /upload-url

router.get('/', async (req: Request, res: Response) => {

    const url = await generateUploadUrl();

    if (!url) throw new CustomError('Error while generating upload URL.', 500, true)

    res.status(200).json({ uploadURL: url })


});

export default router;