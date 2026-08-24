import sqlalchemy
from flask_login import UserMixin
from data.db_session import SqlAlchemyBase
from sqlalchemy_serializer import SerializerMixin
from data import db_session
from flask_login import current_user
from data.user import User
from data.my_chat import get_my_chat
from data.admin import Admin
from data.my_orm.message import Message
from data.my_orm.engine import SessionDB
# from .my_orm.my_message import MyMessage


class Chat(SqlAlchemyBase, UserMixin, SerializerMixin):
    __tablename__ = 'chats'
    id = sqlalchemy.Column(sqlalchemy.Integer,
                           primary_key=True, autoincrement=True)
    members = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    name = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    primary_chat = sqlalchemy.Column(sqlalchemy.Boolean, nullable=True)
    status = sqlalchemy.Column(sqlalchemy.Integer, nullable=True, default=1)  # 1 - current 2 - deleted 3 - blocked
    pinned = sqlalchemy.Column(sqlalchemy.Boolean, default=False)
    pinned_messages = sqlalchemy.Column(sqlalchemy.String, default="")

    def __repr__(self):
        return f"{self.members} {self.name}"


def get_chats():
    db_sess = db_session.create_session()
    chats = db_sess.query(Chat).filter(Chat.status == 1).all()
    my_chat = get_my_chat()
    new = []
    if my_chat["id"]:
        new.append(my_chat)
    admins = [_[0] for _ in db_sess.query(Admin.id_user).all()]
    for i in chats:
        admin_flag = False
        if current_user.id in list(map(int, i.members.split())):
            name = i.name
            if i.primary_chat:
                id_user = i.members.split()
                del id_user[id_user.index(str(current_user.id))]
                id_user = id_user[0]
                name = db_sess.query(User.name).filter(User.id == int(id_user)).first()
                if name is None:
                    name = "DELETED"
                else:
                    name = name[0]
                if int(id_user) in admins:
                    admin_flag = True
            my_sess = SessionDB(f"db/chats/chat{i.id}.db", factory=True)
            mess2 = my_sess.query(Message()).all()
            if len(mess2) != 0:
                mess = mess2[-1]
                new.append({"id": i.id, "name": name, "primary_chat": i.primary_chat, "pinned": int(i.pinned),
                            "status": i.status, "admin": admin_flag,
                            "last_message": {"text": mess["message"], "time": mess['time'],
                                             "name_sender": mess['name_sender'], "type": mess['type']
                                             }})
            else:
                mess: Message
                new.append({"id": i.id, "name": name, "pinned": int(i.pinned),
                            "primary_chat": i.primary_chat, "status": i.status,
                            "admin": admin_flag,
                            "last_message": {"text": "", "time": "2023-01-01 00:00:00.0",
                                             "name_sender": "", "type": ''
                                             }})
    new.sort(key=lambda x: x["last_message"]["time"], reverse=True)
    new.sort(key=lambda x: x["pinned"], reverse=True)
    db_sess.close()
    return new
