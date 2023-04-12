insert into users(name, email, password, phone, created_at, updated_at)
values
('hung','hung@gmail.com','$2b$10$jlpGUNqEBpMrfh9GqA55iuK3vfBw9F0v/peIp5WP/oFyEh2Q0Fpqq', '01234567891' ,'2022-11-29','2022-11-29'),
('hung1','hung1@gmail.com','$2b$10$THQC/rTttlth/UuaKH1c/O1u9qd3VCveA9airzPzoyKB7H4lgt0qi','01234567892','2022-11-29');
--username=hung, password=1234
--username=hung1, password=1234
insert into conversations(title, description, author_id, created_at, updated_at)
values
('Dev Team','Trao đổi', 1, '2022-11-29','2022-11-29'),
('FE Team','FE Team', 1, '2022-11-29','2022-11-29'),
('BE Team','BE Team', 2, '2022-11-29','2022-11-29');

insert into messages(conversation_id, user_id, status, message, created_at, updated_at)
values
(1,1, true,'Xin chào, mình tạo nhóm này','2022-11-29','2022-11-29'),
(1,2, true,'Xin chào, mình vừa được thêm vào nhóm này','2022-11-29','2022-11-29');

update conversations
SET last_message_id = 2
WHERE id = 1;

insert into user_conversation(user_id, conversation_id, mute, block, created_at, updated_at)
values
(1,1,false,false,'2022-11-29','2022-11-29'),
(2,1,false,false,'2022-11-29','2022-11-29'),
(1,2,false,false,'2022-11-29','2022-11-29'),
(2,3,false,false,'2022-11-29','2022-11-29');