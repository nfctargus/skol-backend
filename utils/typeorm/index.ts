import { Chat } from "./entities/Chat";
import { Friend } from "./entities/Friend";
import { GroupChat } from "./entities/GroupChat";
import { GroupMessage } from "./entities/GroupMessage";
import { Message } from "./entities/Message";
import { PrivateMessage } from "./entities/PrivateMessage";
import { Session } from "./entities/Session";
import { User } from "./entities/User";


const entities = [User,Session,Friend,Chat,PrivateMessage,GroupChat,GroupMessage];

export { User,Session,Friend,Chat,PrivateMessage,GroupChat,GroupMessage };
export default entities;