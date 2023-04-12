export interface INewMessage {
  conversation_id: number,
  message: string,
  user_id: number,
  user_name: string,
  parent_message_id: number | null,
  file_id: number | null,
}