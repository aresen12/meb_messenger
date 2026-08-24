from flask import (
    Blueprint, request,
)
from data import db_session
from data.user import User
from flask_login import current_user
from data.chat import Chat, get_chats
from data.black_list import Black
from flask_socketio import emit
from data.admin import Admin
from data.my_orm.message import Message
from data.my_orm.engine import SessionDB
from data.my_chat import MYChat

chats_server = Blueprint('chat_sever', __name__, url_prefix='/chats')


@chats_server.route("/delete_chat", methods=["DELETE"])
def del_chat():
    try:
        data = request.get_json()
        db_sess = db_session.create_session()
        chat = db_sess.query(Chat).filter(Chat.id == data["id_chat"]).first()
        memebers = chat.members.split()
        if str(current_user.id) in memebers:
            chat.status = 2
            for member in memebers:
                if str(current_user.id) != member:
                    emit("delete_chat", {"chat_id": data["id_chat"]}, to=f"u{member}", namespace="/")
        else:
            db_sess.close()
            raise PermissionError
        db_sess.commit()
        db_sess.close()
        return {"log": True}
    except PermissionError:
        return {"log": False, "error": "Permission error"}


@chats_server.route("/get_chats")
def mg_get_chats():
    return {"chats": get_chats()}


@chats_server.route("/edit_name_chat", methods=["POST"])
def edit_name_chat():
    data = request.get_json()
    db_sess = db_session.create_session()
    chat = db_sess.query(Chat).filter(Chat.id == data["chat_id"]).first()
    if str(current_user.id) in chat.members.split():
        chat.name = data["new_name"]
    db_sess.commit()
    db_sess.close()
    return {'log': True}


@chats_server.route("/block_chat", methods=["POST"])
def block_chat():
    data = request.get_json()  # нужно добавить в чёрный список у пользователя
    db_sess = db_session.create_session()
    chat = db_sess.query(Chat).filter(Chat.id == data["id_chat"]).first()
    mem = chat.members.split()
    if str(current_user.id) in chat.members.split():
        chat.status = 3
        if chat.primary_chat:
            bl_list = db_sess.query(Black).filter(Black.id_user == current_user.id).first()
            del mem[mem.index(str(current_user.id))]
            if bl_list is None:
                bl_list = Black()
                bl_list.id_user = current_user.id
                bl_list.list_b = mem[0]
                db_sess.add(bl_list)
            else:
                bl_list.list_b += mem[0]
        db_sess.commit()
    db_sess.close()
    return {"log": True}


@chats_server.route("/sing_out_chat", methods=["POST"])
def sing_out_chat():
    data = request.get_json()
    db_sess = db_session.create_session()
    chat = db_sess.query(Chat).filter(Chat.id == data["chat_id"]).first()
    ch_mem = chat.members.split()
    if str(current_user.id) in ch_mem:
        del ch_mem[ch_mem.index(str(current_user.id))]
    chat.members = " ".join(ch_mem)
    db_sess.commit()
    db_sess.close()
    return {"log": True}


@chats_server.route("/add_in_chat", methods=["POST"])
def add_in_chat():
    data = request.get_json()
    db_sess = db_session.create_session()
    chat = db_sess.query(Chat).filter(Chat.id == data["chat_id"]).first()
    ch_mem = chat.members.split()
    if str(current_user.id) in ch_mem:
        chat.members += data["list_members"]
    db_sess.commit()
    db_sess.close()
    return {"log": True}


@chats_server.route("/pin_chat", methods=["POST"])
def chat_pinned():
    data = request.get_json()
    db_sess = db_session.create_session()
    if str(data["chat_id"])[0] != "m":
        chat = db_sess.query(Chat).filter(Chat.id == data["chat_id"]).first()
    else:
        chat = db_sess.query(MYChat).filter(MYChat.id == current_user.id).first()
    chat.pinned = True
    db_sess.commit()
    db_sess.close()
    # добавить socketio
    return {"log": True}


@chats_server.route("/unpin_chat", methods=["POST"])
def chat_unpinned():
    data = request.get_json()
    db_sess = db_session.create_session()
    if str(data["chat_id"])[0] != "m":
        chat = db_sess.query(Chat).filter(Chat.id == data["chat_id"]).first()
    else:
        chat = db_sess.query(MYChat).filter(MYChat.id == current_user.id).first()
    chat.pinned = False
    db_sess.commit()
    db_sess.close()
    # добавить socketio
    return {"log": True}


@chats_server.route("/create_chat", methods=["POST"])
def create_chat():
    data = request.get_json()
    db_sess = db_session.create_session()
    if data["primary"]:
        mem = data["list_members"].split()
        mem1 = db_sess.query(Black.list_b).filter(Black.id_user == mem[0]).first()
        mem2 = db_sess.query(Black.list_b).filter(Black.id_user == mem[1]).first()
        if (not (mem2 is None) and (mem[1] in mem2[0].split() or mem[0] in mem2[0].split())) or (
                not (mem1 is None) and (mem[0] in mem1[0].split() or mem[1] in mem1[0].split())):
            db_sess.close()
            return {"log": 'PermissionError'}
    chat = Chat()
    chat.name = data["name"]
    chat.members = data["list_members"]  # list of id users
    chat.primary_chat = data["primary"]
    db_sess.add(chat)
    db_sess.commit()
    chat_id = chat.id
    my_sess = SessionDB(f"db/chats/chat{chat_id}.db")
    my_sess.create_table(Message())
    my_sess.commit()
    my_sess.close()
    admin_flag = False
    name_user = data["name"]
    if chat.primary_chat:
        members = chat.members.split()
        del members[members.index(str(current_user.id))]
        if len(members) != 0:
            admins = [_[0] for _ in db_sess.query(Admin.id_user).all()]
            if int(members[0]) in admins:
                admin_flag = True
            name_user = db_sess.query(User.name).filter(User.id == members[0]).first()[0]
            emit("create_chat", {"chat_id": str(chat_id),
                                 "name": current_user.name, "is_primary": data["primary"]},
                 to=f"u{members[0]}", namespace="/")

    else:
        members = chat.members.split()
        for member in members:
            if str(current_user.id) != member:
                emit("create_chat", {"chat_id": str(chat_id),
                                         "name": chat.name, "is_primary": data["primary"]},
                         to=f"u{member}", namespace="/")

        db_sess.close()
    return {"chat_id": str(chat_id), "name": name_user, "is_primary": data["primary"], "admin": admin_flag}
