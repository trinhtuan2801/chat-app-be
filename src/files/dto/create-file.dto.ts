export class CreateFileDto {
  name: string | null;
  url: string;
  author_id: number;
  createdAt: Date;
  type: string
}
