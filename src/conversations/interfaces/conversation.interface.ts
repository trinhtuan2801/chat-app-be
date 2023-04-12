import { ConversationType } from "../enum/UserConversation.enum";

export interface IConversation {
  id?: number;
  title?: string;
  description?: string;
  last_message_id?: number | null;
  author_id?: number
  createdAt?: Date;
  updatedAt?: Date;
  type?: ConversationType
}
