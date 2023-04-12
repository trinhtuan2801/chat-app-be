export interface IMessage {
  id: number;
  conversation_id: number;
  status: boolean;
  message: string;
  createdAt: Date;
  updatedAt: Date
  file_id?: number | null
}
