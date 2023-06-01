declare namespace NodeJS {
    export interface ProcessEnv {
        MYSQL_DB_HOST?:string;
        MYSQL_DB_USERNAME?:string;
        MYSQL_DB_PASSWORD?:string;
        MYSQL_DB_PORT?:number;
        MYSQL_DB_NAME?:string;
        COOKIE_SECRET:string;
        PROFILE_PICTURE_PATH:string;
    }
}
declare namespace Express {
    import { User } from "utils/typeorm";
    export interface Request {
      user?: User;
      logout:Function;
    }
  }