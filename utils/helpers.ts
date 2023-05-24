//import * as bcrypt from 'bcrypt';

export async function hashPassword(password:string) {
    /* const salt = await bcrypt.genSalt();
    return bcrypt.hash(password,salt); */
    return password;
}
export async function compareHash(rawPassword:string,hashedPassword:string) {
    return rawPassword === hashedPassword ? true : false;
    //return bcrypt.compare(rawPassword, hashedPassword);
}