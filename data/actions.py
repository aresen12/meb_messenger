import sqlalchemy
from flask_login import UserMixin
from data.db_session import SqlAlchemyBase
from sqlalchemy_serializer import SerializerMixin
import datetime


class Action(SqlAlchemyBase, UserMixin, SerializerMixin):
    __tablename__ = 'Actions'
    id = sqlalchemy.Column(sqlalchemy.Integer,
                           primary_key=True, autoincrement=True)
    id_user = sqlalchemy.Column(sqlalchemy.Integer, nullable=True)
    # кто совершил действие
    about = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    time = sqlalchemy.Column(sqlalchemy.String, default=datetime.datetime.now)
    list_of_read = sqlalchemy.Column(sqlalchemy.String, default="")

    def __repr__(self):
        return f"{self.id_user}, {self.about}"


def new_action(type_, id_action, user_id=0, comment=""):
    action = Action()
    action.id_user = id_action
    if type_ == 1:
        action.about = f"Удаление аккаунта: {user_id}"
    elif type_ == 2:
        action.about = "Создание новости"
    elif type_ == 3:
        action.about = "Добавление администратора"
    elif type_ == 4:
        action.about = "Голосование"
    elif type_ == 5:
        action.about = f"Блокировка пользователя {user_id}"
    elif type_ == 6:
        action.about = f"Разлокировка пользователя {user_id}"
    else:
        pass
    if comment != "":
        action.about += f"\n Коментарий:\n{comment}"
    return action
