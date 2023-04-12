export class CreateMessageDto {
  user_id?: number | null
  user_name?: string
  conversation_id?: number
  status?: boolean
  message?: string
  parent_message_id?: number | null
  file_id?: number | null
}
