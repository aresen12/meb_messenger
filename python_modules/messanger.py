import os
from flask import (
    Blueprint, redirect, render_template, request,
)
from data import db_session
from data.user import User
from flask_login import current_user
from data.chat import Chat, get_chats
from data.File import File, get_files, get_unique_file_name
from data.black_list import Black
from flask_socketio import emit
from data.bot_db import BotDB
from data.my_orm.my_message import MyMessage, new_mess_my
from python_modules.keys import room_name, jwt
from data.my_orm.message import Message, new_mess
from data.my_orm.engine import SessionDB
import json
mg = Blueprint('messenger', __name__, url_prefix='/m')


def send_alert(id_, db_sess, text, html=""):
    chats = db_sess.query(Chat).filter(Chat.status == 1).all()
    id_chat = None
    for c in chats:
        c: Chat
        if f"0 {id_}" == c.members:
            id_chat = c.id
            break
    if id_chat is None:
        chat = Chat()
        chat.members = f"0 {id_}"
        chat.primary_chat = True
        db_sess.add(chat)
        db_sess.commit()
        id_chat = chat.id
        my_sess = SessionDB(f"db/chats/chat{id_chat}.db")
        my_sess.create_table(Message())
        emit("create_chat", {"chat_id": str(id_chat),
                             "name": "kazbek", "is_primary": True},
             to=f"u{id_}", namespace="/")
    else:
        my_sess = SessionDB(f"db/chats/chat{id_chat}.db")
    mess = new_mess(text, 0, "Kazbek", html)
    my_sess.add(mess)
    my_sess.commit()
    my_sess.close()
    emit('message', {"message": "", "time": mess.get_time(), "id_m": mess.id.value,
                     "file2": "", "html": mess.html_m.value, "name": "Kazbek",
                     "read": 0, "id_sender": current_user.id, "type": mess.type.value},
         to=f"u{id_}", namespace="/")


@mg.route("/<flag>")
@mg.route("/", methods=["GET", "POST"])
def m_st(flag=1):
    if request.method == 'GET':
        if current_user.is_authenticated:
            chats = get_chats()
            file___ = open("static/img/emoji/meta_data.json", mode="r")
            metadata = json.load(file___)
            file___.close()
            return render_template("messenger.html", device="", meta_data=metadata,
                                   title='Kazbek', chats=chats, my_bg=current_user.id, room_name=room_name, jwt_my=jwt,
                                   flag=flag)
        return redirect("/login")
    else:
        if not current_user.is_authenticated:
            return redirect("/login")

        f = request.files["img"]
        if request.form["about"].strip() == "" and f.filename == "" and request.form["html_m"] == "":
            return redirect('/m')
        db_sess = db_session.create_session()
        chat = db_sess.query(Chat).filter(Chat.id == request.form['chat_id']).first()
        if not (current_user.id in map(int, chat.members.split())):
            db_sess.close()
            return redirect("/")
        c_user = db_sess.query(User).filter(User.email == current_user.email).first()
        try:
            int(request.form["chat_id"])
            my_sess = SessionDB(f"db/chats/chat{request.form['chat_id']}.db")
            mess = new_mess(name_sender=c_user.name, message=request.form["about"], id_sender=c_user.id,
                            html=request.form["html_m"])
        except ValueError:
            my_sess = SessionDB(f"db/my/{request.form['chat_id']}.db")
            mess = new_mess_my(name_sender=c_user.name, message=request.form["about"], id_sender=c_user.id,
                               html=request.form["html_m"])
        path = ""
        name = ""
        if f.filename != "":
            file_db = File()
            file_db.name = f.filename
            path = f"data/{get_unique_file_name(f.filename, db_sess)}"
            file = open(f"static/img/{path}", mode="wb")
            file.write(f.read())
            file.close()
            file_db.path = path
            name = file_db.name
            db_sess.add(file_db)
            db_sess.commit()
            file_db.chat_id = request.form["chat_id"]
            mess.img.value = file_db.id
        my_sess.add(mess)
        my_sess.commit()
        my_sess.close()
        db_sess.commit()
        t_ = mess.get_time()
        db_sess.close()
        emit('message', {"message": mess.message.value, "time": t_, "id_m": mess.id.value,
                         "file2": [name, path], "html": request.form["html_m"], "name": mess.name_sender.value,
                         "read": 0, "id_sender": mess.id_sender.value}, to=request.form["chat_id"], namespace="/")
        return {"log": True}


@mg.route("/unblock_user", methods=["POST"])
def unblock_user():
    db_sess = db_session.create_session()
    black_list = db_sess.query(Black).filter(Black.id_user == current_user.id).first()
    if black_list is None:
        db_sess.close()
        return {"log": False}
    data = request.get_json()
    sp = black_list.list_b.split()
    del sp[sp.index(str(data["id_user"]))]
    black_list.list_b = "".join(sp)
    db_sess.commit()
    db_sess.close()
    return {"log": True}


@mg.route("/get_black_list")
def get_black():
    db_sess = db_session.create_session()
    black_list = db_sess.query(Black.list_b).filter(Black.id_user == current_user.id).first()
    json_response = {"black_list": []}
    if black_list is None:
        db_sess.close()
        return json_response
    for user_id in black_list[0].split():
        user = db_sess.query(User.id, User.email, User.name).filter(User.id == int(user_id)).first()
        json_response["black_list"].append(
          [user[0], user[1], user[2]]
        )
    db_sess.close()
    return json_response


@mg.route("/pinned", methods=["POST"])
def pinned():
    data = request.get_json()
    db_sess = db_session.create_session()
    chat = db_sess.query(Chat).filter(Chat.id == data["chat_id"]).first()
    tm = chat.pinned_messages.split()
    tm.insert(0, str(data['mess_id']))
    chat.pinned_messages = " ".join(tm)
    emit("pinned_message", {"id_mess": data["mess_id"]}, to=data["chat_id"], namespace="/")
    db_sess.commit()
    db_sess.close()
    return {"log": True}


@mg.route("/un_pinned", methods=["POST"])
def an_pinned():
    data = request.get_json()
    db_sess = db_session.create_session()
    chat = db_sess.query(Chat).filter(Chat.id == data["chat_id"]).first()
    p = chat.pinned_messages.split()
    del p[p.index(str(data["mess_id"]))]
    chat.pinned_messages = " ".join(p)
    db_sess.commit()
    db_sess.close()
    emit("un_pinned_message", {"id_mess": data["mess_id"]}, to=data["chat_id"], namespace="/")
    return {"log": True}


@mg.route("/last_m", methods=["POST"])
def last_m():
    # добавить socketio
    return {"log": True}


@mg.route("/get_files_menu", methods=["POST"])
def get_files_menu():
    data = request.get_json()
    db_sess = db_session.create_session()
    files = db_sess.query(File).filter(File.chat_id == data["chat_id"]).all()
    json_res = []
    if str(data["chat_id"])[0] != "m":
        sess = SessionDB(f"db/chats/chat{data['chat_id']}.db")
        for file in files:
            file: File
            mess = sess.query(MyMessage()).filter(f"message.img = {file.id}").first()
            if not (mess is None):
                json_res.append({"name": file.name, "mess_id": mess.id.value})
            else:
                pass
    else:
        sess = SessionDB(f"db/my/{data['chat_id']}.db")
        for file in files:
            file: File
            mess = sess.query(MyMessage()).filter(f"message.img = {file.id}").first()
            if not (mess is None):
                json_res.append({"name": file.name, "mess_id": mess.id.value})
            else:
                pass
        #     прописать удаление файла
    sess.close()
    db_sess.close()
    return json_res


@mg.route("/edit_message", methods=["POST"])
def edit_mess():
    data = request.get_json()
    db_sess = SessionDB(f"db/chats/chat{data['chat_id']}.db")
    mess = db_sess.query(Message()).filter(f"message.id = {data['id']}").first()
    if mess.id_sender.value == current_user.id:
        mess.message.value = data["new_text"]
        mess.read.value = 0
        db_sess.update(mess)
        db_sess.commit()
    emit("edit_message", {"id_mess": data["id"]}, to=data["chat_id"])
    db_sess.close()
    return {"log": True}


@mg.route("/send_voice/<chat_id>", methods=["POST"])
def send_voice(chat_id):
    db_sess = db_session.create_session()
    if str(chat_id)[0] == "m":
        sess_my = SessionDB(f"db/my/{chat_id}.db")
    else:
        sess_my = SessionDB(f"db/chats/chat{chat_id}.db")
    f = request.files['voice']
    path = f"data/{get_unique_file_name('voice.mp3', db_sess)}"
    file = open(f"static/img/{path}", mode="wb")
    file.write(f.read())
    file.close()
    file_db = File()
    file_db.chat_id = chat_id
    file_db.path = path
    file_db.name = "voice.mp3"
    mess = new_mess("", current_user.id, current_user.name)
    db_sess.add(file_db)
    db_sess.commit()
    mess.img.value = file_db.id
    sess_my.add(mess)
    sess_my.commit()
    db_sess.commit()
    file_db.list_messages = mess.id.value
    sess_my.commit()
    t_ = mess.get_time()
    name = file_db.name
    db_sess.close()
    sess_my.close()
    emit('message', {"message": mess.message.value, "time": t_, "id_m": mess.id.value,
                     "file2": [name, path], "html": "", "name": mess.name_sender.value,
                     "read": 0, "id_sender": mess.id_sender.value}, to=chat_id, namespace="/")
    return {"log": True}


@mg.route("/get_users")
def get_users():
    if current_user.is_authenticated:
        db_sess = db_session.create_session()
        users = db_sess.query(User.email, User.name, User.id).all()
        db_sess.close()
        n = [list(_) for _ in users]
        return {"users": n, "c_user": current_user.id}
    return redirect("/login")


@mg.route("/get_user/<int:id_>")
def get_user(id_):
    db_sess = db_session.create_session()
    user = db_sess.query(User).filter(User.id == id_).first()
    db_sess.close()
    n = user.name
    e = user.email
    return {"user": n, "email": e}


@mg.route("/voting", methods=["POST"])
def voting_server():
    data = request.get_json()
    db_sess = db_session.create_session()
    chat = db_sess.query(Chat).filter(Chat.id == data['chat_id']).first()
    if not (current_user.id in map(int, chat.members.split())):
        return {"log": "not auth"}
    if str(data['chat_id'])[0] == "m":
        sess_my = SessionDB(f"db/my/{data['chat_id']}.db")
    else:
        sess_my = SessionDB(f"db/chats/chat{data['chat_id']}.db")
    message = sess_my.query(Message()).filter(f"message.id = {data['mess_id']}").first()
    json_voting = json.loads(message.html_m.value)
    json_voting["voting"][data["i"]]["cnt"].append(current_user.id)
    message.html_m.value = json.dumps(json_voting)
    sess_my.update(message)
    sess_my.commit()
    sess_my.close()
    db_sess.close()
    emit("voting", {"id_voting": data["mess_id"], "chat_id": data['chat_id'], 'voting': json_voting}, to=data["chat_id"], namespace="/")
    return {"log": 200}


@mg.route("/create_voting", methods=["POST"])
def create_voting_server():
    data = request.get_json()
    db_sess = db_session.create_session()
    chat = db_sess.query(Chat).filter(Chat.id == data['chat_id']).first()
    if not (current_user.id in map(int, chat.members.split())):
        return {"log": "not auth"}
    gener_json = {"voting": []}
    keys = data["voting"].keys()
    for key in keys:
        gener_json["voting"].append({"text": data["voting"][key], "cnt": []})
    if str(data['chat_id'])[0] == "m":
        sess_my = SessionDB(f"db/my/{data['chat_id']}.db")
    else:
        sess_my = SessionDB(f"db/chats/chat{data['chat_id']}.db")
    print(data)
    message = new_mess(data["title_voting"], current_user.id, current_user.name, json.dumps(gener_json), type=4)
    sess_my.add(message)
    sess_my.commit()
    emit("new_voting", {"id_mess": message.id.value, "text": data["title_voting"], "voting": gener_json,
                        "id_sender": current_user.id, "name_sender": current_user.name, "time": message.get_time()},
         to=data["chat_id"], namespace="/")
    sess_my.close()

    return {"log": 200}


@mg.route("/get_chat_user/<int:id_>")  # chat id
def get_chat_user(id_):
    db_sess = db_session.create_session()
    chat = db_sess.query(Chat).filter(Chat.id == id_).first()
    db_sess.close()
    n = chat.members.split()
    is_pr = chat.primary_chat
    return {"user": n, 'primary_chat': is_pr}


@mg.route("/delete", methods=["DELETE"])
def delete_mess():
    data = request.get_json()
    if str(data["chat_id"])[0] == "m":
        db_sess = SessionDB(f"db/my/my{current_user.id}.db")
    else:
        db_sess = SessionDB(f'db/chats/chat{data["chat_id"]}.db')
    mes = db_sess.query(Message()).filter(f'message.id = {data["id"]}').first()
    mes: Message
    if mes is None:
        return {"log": "bad id", "delete_id": data["id"]}
    if mes.type != 2:
        emit('delete_message', {"message_id": mes.id.value}, to=str(data["chat_id"]), namespace="/")
    else:
        emit('delete_emoji', {"message_id_on_emoji": mes.html_m.value,
                              "id_emoji": mes.message.value, "id_sender": mes.id_sender.value,
                              "id_message_emoji": mes.id},
             to=str(data["chat_id"]),  namespace="/")
    list_emoji = db_sess.query(Message()).filter("message.type = 2").filter(f"message.html_m = {data['id']}").all()
    for _ in list_emoji:
        mess = Message()
        mess.id.value = _[0]
        db_sess.delete(mess)
    if mes.img.value != "" and not (mes.img.value is None):
        db_sess_2 = db_session.create_session()
        file = db_sess_2.query(File).filter(File.id == mes.img.value).first()
        if file.list_messages is None or file.list_messages.strip() == str(mes.img.value):
            db_sess_2.delete(file)
            try:
                os.remove("static/img/" + file.path)
            except FileNotFoundError:
                pass
        else:
            l_ = file.list_messages.split()
            del l_[l_.index(str(mes.img.value))]
            file.list_messages = " ".join(l_)
        db_sess_2.commit()
        db_sess_2.close()
    db_sess.delete(mes)
    db_sess.commit()
    db_sess.close()
    return {"log": "True"}


@mg.route("/c_get_user")
def c_get_user():
    if current_user.is_authenticated:
        db_sess = db_session.create_session()
        user = db_sess.query(User).filter(User.id == current_user.id).first()
        db_sess.close()
        u = {"id": user.id, "name": user.name, "email": user.email}
        return {"user": u}
    return {"user": None}


# @mg.route("/set_username_tg", methods=["POST"])
# def ser_username_tg():
#     if current_user.is_authenticated:
#         db_sess = db_session.create_session()
#         data = request.get_json()
#         user = db_sess.query(BotDB).filter(BotDB.id_user == current_user.id).first()
#         if user is None:
#             user = BotDB()
#             user.id_user = current_user.id
#             db_sess.add(user)
#             db_sess.commit()
#         user.user_name = data["username"]
#         db_sess.commit()
#         db_sess.close()
#         return {"log": True}
#     return {"log": False}


@mg.route("/get_part_messages")
def get_part_messages():
    # data = request.get_json()
    new = []
    return new


@mg.route("/get_json_mess_my", methods=["POST"])
def get_json_mess_my():
    if current_user.is_authenticated:
        data = request.get_json()
        db_sess = SessionDB(f"db/my/my{data['chat_id']}.db", factory=True)
        messages = db_sess.query(MyMessage()).all()
        sess = db_session.create_session()
        js = {"messages": [], "files": get_files("my" + data["chat_id"], sess), "pinned_message": []}
        messages.sort(key=lambda x: x[8])
        for m in messages:
            js["messages"].append({"id": m["id"], "read": m["read"], "html_m": m['html_m'], "text": m["message"],
                                   'time': m["time"], "file": m['img'], "id_sender": m["id_sender"],
                                   "name_sender": m["name_sender"],
                                   "type": m['type']})
        sess.close()
        db_sess.close()
        return js
    return {"log": "NOT auth"}


@mg.route("/get_json_mess", methods=["POST"])
def get_json_message():
    if current_user.is_authenticated:
        data = request.get_json()
        db_sess = db_session.create_session()
        chat = db_sess.query(Chat).filter(Chat.id == data["chat_id"]).first()
        if not (str(current_user.id) in chat.members.split()):
            db_sess.close()
            return {"log": "Permission error"}
        db_sess.close()
        my_orm = SessionDB(f"db/chats/chat{data['chat_id']}.db", factory=True)
        messages = my_orm.query(Message()).all()
        js = {"messages": [], "files": get_files(data["chat_id"], db_sess), "current_user": current_user.id,
              "pinned_message": chat.pinned_messages.split()}
        messages.sort(key=lambda x: x["time"])
        for m in messages:
            js["messages"].append({"id": m["id"], "read": m["read"], "html_m": m["html_m"], "text": m["message"],
                                   'time': m["time"], "file": m["img"], "id_sender": m["id_sender"],
                                   "name_sender": m["name_sender"], "type": m["type"]})
        my_orm.close()
        return js
    return {"log": "NOT auth"}


@mg.route("/get_not_read", methods=["POST"])
def get_not_read():
    data = request.get_json()
    if current_user.is_authenticated:
        db_sess = SessionDB(f"db/chats/chat{data['chat_id']}.db")
        m = db_sess.query(Message()).all()
        db_sess.close()
        le = 0
        for i in range(len(m) - 1, -1, -1):
            if not m[i][1] and current_user.id != m[i][7]:
                le += 1
            else:
                break
        return {"r": le}
    return {"log": "error"}


@mg.route("/mail", methods=["POST"])
def mail():
    if current_user.is_authenticated:
        data = request.get_json()
        db_sess = db_session.create_session()
        if not (str(current_user.id) in db_sess.query(Chat).filter(
                Chat.id == data["mail_id_chat"]).first().members.split()):
            db_sess.close()
            return {"log": 'PermissionError'}
        if str(data["chat_id"])[0] != "m":
            sess_my_chat = SessionDB(f"db/chats/chat{data['chat_id']}.db")
        else:
            sess_my_chat = SessionDB(f"db/my/{data['chat_id']}.db")
        sess_other_chat = SessionDB(f"db/chats/chat{data['mail_id_chat']}.db")
        message = sess_my_chat.query(Message()).filter(f"message.id = {data['mess_id']}").first()
        new_mail = new_mess(message.message.value, message.id_sender.value, message.name_sender.value,
                            message.html_m.value, message.img.value, type=message.type.value)
        sess_other_chat.add(new_mail)
        sess_other_chat.commit()
        if message.img != "":
            file = db_sess.query(File).filter(File.id == message.id.value).first()
            if not (file is None):
                file.list_messages += f" {new_mail.id}"
                db_sess.commit()
        sess_my_chat.close()
        sess_other_chat.close()
        db_sess.close()
        return {"log": True}
    return {'log'}


@mg.route("/my_mail", methods=["POST"])
def my_mail():
    if current_user.is_authenticated:
        data = request.get_json()
        db_sess = db_session.create_session()
        sess_my_chat = SessionDB(f"db/chats/chat{data['chat_id']}.db")
        # mail_id_chat id в формате my{number}
        sess_other_chat = SessionDB(f"db/my/{data['mail_id_chat']}.db")
        message = sess_my_chat.query(Message()).filter(f"message.id = {data['mess_id']}").first()
        new_mail = new_mess_my(message.message.value, message.id_sender.value, message.name_sender.value,
                               message.html_m.value, message.img.value)
        sess_other_chat.add(new_mail)
        sess_other_chat.commit()
        sess_my_chat.close()
        sess_other_chat.close()
        db_sess.close()
        return {"log": True}
    return {'log': "Not Auth"}


# Эту проверить потом на устаревание или поясеить что такое
@mg.route("/get_cnt_m", methods=["POST"])
def get_cnt_m():
    data = request.get_json()
    db_sess = db_session.create_session()
    chat = db_sess.query(Chat).filter(Chat.id == data["chat_id"]).first()
    ch_mem = chat.members.split()
    if str(current_user.id) in ch_mem:
        # c = db_sess.query(Message.id).filter(Message.chat_id == data["chat_id"]).all()
        # return {"len": len(c)}
        # при необходимости переписать для my session
        pass
    db_sess.close()
    return {"log": "PermissionError"}


@mg.route("/get_json_mess_cast", methods=["POST"])
def get_json_mess():
    if current_user.is_authenticated:
        data = request.get_json()
        db_sess = db_session.create_session()
        mem = db_sess.query(Chat.members).filter(Chat.id == data["chat_id"]).first()
        if not (str(current_user.id) in mem[0].split()):
            db_sess.close()
            return {"log": "Permission error"}
        messages = db_sess.query(Message).filter(Message.chat_id == data["chat_id"]).all()
        js = {"messages": [], "files": get_files(data["chat_id"], db_sess), "current_user": current_user.id}
        f = False
        messages.sort(key=lambda x: x.time)
        for m in range(0, data["cnt"], -1):
            if messages[m].id_sender != js["current_user"] and not m.read:
                m.read = 1
                f = True
            js["messages"].append({"id": messages[m].id, "read": messages[m].read, "html_m": messages[m].html_m,
                                   "text": messages[m].message, 'time': messages[m].time,
                                   "file": messages[m].img, "id_sender": messages[m].id_sender,
                                   "name_sender": messages[m].name_sender})
        if f:
            db_sess.commit()
        db_sess.close()
        return js


@mg.route("/get_cnt_m_cast", methods=["POST"])
def get_cnt_m_cast():
    data = request.get_json()
    db_sess = db_session.create_session()
    chat = db_sess.query(Chat).filter(Chat.id == data["chat_id"]).first()
    ch_mem = chat.members.split()
    if str(current_user.id) in ch_mem:
        # c = db_sess.query(Message.id).filter(Message.chat_id == data["chat_id"]).all()
        # return {"len": len(c[-20:])}
        # при необходимости переписать для my session
        pass
    db_sess.close()
    return {"log": "PermissionError"}


@mg.route("/users_bg", methods=["POST"])
def users_bg():
    file = request.files["file"]
    file2 = open(f"static/img/bg_users/{current_user.id}.jpg", mode="wb+")
    file2.write(file.read())
    file2.close()
    return {"log": True}


@mg.route("/set_read", methods=["POST"])
def set_raed():
    data = request.get_json()
    db_sess = SessionDB(f"db/chats/chat{data['chat_id']}.db", factory=True)
    mess = db_sess.query(Message()).filter("message.read = 0").all()
    try:
        for m in mess:
            if current_user.id != m["id_sender"]:
                mess = new_mess(m['message'], m["id_sender"], m["name_sender"], m["html_m"], m['img'], 1, m["type"])
                mess.id.value = m["id"]
                mess.time.value = m["time"]
                db_sess.update(mess)
                db_sess.commit()
                emit("set_read", {"id_mess": m['id']}, to=str(data["chat_id"]),  namespace="/")
    except Exception:
        print("error")
    db_sess.close()
    return {"log": 200}


@mg.route("/get_new_message_id/<id_mess>/<chat_id>")
def get_new_message_id(id_mess, chat_id):
    if current_user.is_authenticated:
        db_sess = SessionDB(f"db/chats/chat{chat_id}.db", factory=True)
        messages = db_sess.query(Message()).filter(f"message.id > {id_mess}").all()
        js = {"message": []}
        for message in messages:
            js["message"].append({"id": message["id"], "id_sender": message['id_sender'],
                                  "html": message["html_m"], "read": message["read"], "text": message['message'],
                                  "time": message['time'], "name_sender": message["name_sender"],
                                  "type": message["type"]})
        db_sess.close()
        return js
