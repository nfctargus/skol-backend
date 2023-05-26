import { Chat } from "./entities/Chat";
import { Friend } from "./entities/Friend";
import { PrivateMessage } from "./entities/PrivateMessage";
import { Session } from "./entities/Session";
import { User } from "./entities/User";


const entities = [User,Session,Friend,Chat,PrivateMessage];

export { User,Session,Friend,Chat,PrivateMessage };
export default entities;