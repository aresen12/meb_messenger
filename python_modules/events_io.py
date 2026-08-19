from flask_login import current_user
from flask_socketio import emit, SocketIO, join_room, leave_room, rooms
from data import db_session
from data.chat import Chat
from data.my_orm.message import new_emoji, new_mess
from data.user import User
from data.my_orm.my_message import new_mess_my, new_emoji_my
from data.my_orm.engine import SessionDB
socketio = SocketIO(cors_allowed_origins="*")


@socketio.on('join')
def on_join(data):
    room = data['room']
    users = rooms()
    db_sess = db_session.create_session()
    chat_members = db_sess.query(Chat.members).filter(Chat.id == data["room"]).first()
    db_sess.close()
    print(room)
    if (current_user.is_authenticated
            and (room == f"u{current_user.id}" or (room == f"my{current_user.id}") or (not (chat_members is None) and str(current_user.id) in chat_members[0].split()))):
        join_room(room)
        emit('join_event', {"id_user": current_user.id, "users": users}, to=room)


@socketio.on('leave')
def on_leave(data):
    room = data['room']
    leave_room(room)
    if current_user.is_authenticated:
        emit('leave_event', {"id_user": current_user.id}, to=room)


@socketio.on('edit_mess')
def edit_event(data):
    room = data['room']
    emit("edit_mess", {"new_text": data["new_text"], "id_mess": data["id_m"], }, to=room)


@socketio.on("send_sticker")
def send_sticker(data):
    if str(data["chat_id"])[0] != "m":
        sess = SessionDB(f"db/chats/chat{data['chat_id']}.db")
    else:
        sess = SessionDB(f"db/my/{data['chat_id']}.db")
    mess = new_mess("", current_user.id, current_user.name, type=3, html=data["html"])
    sess.add(mess)
    sess.commit()
    sess.close()
    emit('message', {"message": "", "time": mess.get_time(), "id_m": mess.id.value,
                     "file2": "", "html": data["html"], "name": current_user.name,
                     "read": 0, "id_sender": current_user.id, "pinned": mess.pinned.value, "type": mess.type.value}, to=data['chat_id'])


def send_all2(db_sess, chat_members, text, c_id, name, prim, chat_id, time):
    db_sess: db_session
    if prim:
        chat_members: str
        a = chat_members.split()
        del a[not (a.index(str(c_id)))]
        user_name = db_sess.query(User.name).filter(User.id == a[0]).first()
        text2 = f"{user_name[0]}\n" + text
    else:
        text2 = f"{name}\n" + text
    if text == "":
        text = "Возможно у вас новыее сообщения"
    for user_id in chat_members.split():
        if not (str(c_id) == user_id):
            if prim:
                name_chat = name
            else:
                name_chat = name
            emit("message_other", {"text": text, "chat_id": chat_id, "user_name": name, "time": time, "chat_name": name_chat}, to="u" + user_id)


@socketio.on('room_message')
def room_message(data):
    db_sess = db_session.create_session()
    chat = db_sess.query(Chat).filter(Chat.id == data["room"]).first()
    chat: Chat
    if current_user.is_authenticated:
        if str(current_user.id) in chat.members.split():
            my_sess = SessionDB(f"db/chats/chat{data['room']}.db")
            mess = new_mess(data['message'], current_user.id, current_user.name, data["html"])
            my_sess.add(mess)
            my_sess.commit()
            my_sess.close()
            chat_info = db_sess.query(Chat.members, Chat.name,
                                      Chat.primary_chat).filter(Chat.id == data["room"]).first()
            # send_all(db_sess, chat_info[0], data['message'], current_user.id, chat_info[1], chat_info[2])
            send_all2(db_sess, chat_info[0], data['message'], current_user.id, chat_info[1], chat_info[2], data["room"],
                      mess.get_time())
            emit('message', {"message": data['message'], "time": mess.get_time(), "id_m": mess.id.value,
                             "file2": mess.img.value, "html": data["html"], "name": current_user.name,
                             "read": 0, "id_sender": current_user.id, "pinned": mess.pinned.value,
                             "type": mess.type.value}, to=data['room'])
    db_sess.close()


@socketio.on('connect')
def handle_connect():
    if current_user.is_authenticated:
        join_room(f'u{current_user.id}')


@socketio.on('disconnect')
def handle_disconnect():
    if current_user.is_authenticated:
        leave_room(f'u{current_user.id}')


@socketio.on("emoji")
def send_emoji(data):
    if str(data["chat_id"])[0] == "m":
        db_sess = SessionDB(f"db/my/{data['chat_id']}.db")
        mess = new_emoji_my(data["value"], data["id_mess"], current_user.id, current_user.name)
    else:
        db_sess = SessionDB(f"db/chats/chat{data['chat_id']}.db")
        mess = new_emoji(data["value"], data["id_mess"], current_user.id, current_user.name)
    db_sess.add(mess)
    db_sess.commit()
    emit('emoji_client', {"id_emoji": mess.id.value, "id_mess": data["id_mess"], "name": mess.name_sender.value,
                          "id_sender": current_user.id, "value": data["value"]}, to=data["chat_id"])
    db_sess.close()


@socketio.on("send_call_to_user")
def send_call(data):
    db_sess = db_session.create_session()
    chat = db_sess.query(Chat).filter(Chat.id == data["chat_id"]).first()
    data["name_call"] = current_user.name
    for member in chat.members.split():
        if member != current_user.id:
            emit("send_call", data, to="u" + member)
    db_sess.close()


@socketio.on("send_number")
def send_number(data):
    db_sess = db_session.create_session()
    chat = db_sess.query(Chat).filter(Chat.id == data["chat_id"]).first()
    for member in chat.members.split():
        if member != str(current_user.id):
            emit("send_call_by_number", {"data": data, "current_user": current_user.id}, to="u" + member)
    db_sess.close()


@socketio.on("my_message")
def send_my_message(data):
    if current_user.is_authenticated:
        db_sess = SessionDB(f"db/my/my{current_user.id}.db")
        mess = new_mess_my(data['message'], current_user.id, current_user.name, data["html"])
        db_sess.add(mess)
        db_sess.commit()
        emit('message', {"message": data['message'], "time": mess.get_time(), "id_m": mess.id.value,
                         "file2": mess.img.value, "html": data["html"], "name": current_user.name,
                         "read": 0, "id_sender": current_user.id, "pinned": 0}, to=f"my{data['room']}")
        db_sess.close()
