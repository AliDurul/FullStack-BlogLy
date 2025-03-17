import { pbkdf2Sync } from 'node:crypto';
import { config } from 'dotenv';

config();

const keyCode = process.env.SECRET_KEY,
    loopCount = 1000,
    charCount = 32,
    encType = 'sha512';

const passwordEncrypt = (password: string): string => {
    if (!keyCode) {
        throw new Error('SECRET_KEY is not defined in the environment variables');
    }
    return pbkdf2Sync(password, keyCode, loopCount, charCount, encType).toString('hex');
};

export default passwordEncrypt;