
export interface IUserConversation {
  id?: number;
  title: string;
  user_id?: number;
  conversation_id?: number;
  mute?: boolean;
  block?: boolean;
  updatedAt?: Date
  createdAt?: Date
}

export interface UpdateLastMessage {
  user_id: number;
  conversation_id: number;
  message_id: number;
}
