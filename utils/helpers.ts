import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from "@nestjs/common";
import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";
import { extname } from "path";

export async function hashPassword(password:string) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password,salt);
    //return password;
}
export async function compareHash(rawPassword:string,hashedPassword:string) {
    //return rawPassword === hashedPassword ? true : false;
    return bcrypt.compare(rawPassword, hashedPassword);
}
export const multerConfig = {
    dest: 'D:/File Storage/Code/Web Dev/kierans-chat-app/skol-frontend/public/images'
};

export const multerOptions = {
    // Check the mimetypes to allow for upload
    fileFilter: (req: any, file: any, cb: any) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            // Allow storage of file
            cb(null, true);
        } else {
            // Reject file
            cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
        }
    },
    // Storage properties
    storage: diskStorage({
        // Destination storage path details
        destination: (req: any, file: any, cb: any) => {
            const uploadPath = multerConfig.dest;
            // Create folder if doesn't exist
            if (!existsSync(uploadPath)) {
                mkdirSync(uploadPath);
            }
            cb(null, uploadPath);
        },
        // File modification details
        filename: (req: any, file: any, cb: any) => {
            // Calling the callback passing the random name generated with the original extension name
            cb(null, `${Date.now()}${extname(file.originalname)}`);
        },
    }),
};