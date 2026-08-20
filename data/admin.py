import sqlalchemy
from flask_login import UserMixin
from data.db_session import SqlAlchemyBase
from sqlalchemy_serializer import SerializerMixin
import datetime
import hashlib


class Admin(SqlAlchemyBase, UserMixin, SerializerMixin):
    __tablename__ = 'admins'
    id = sqlalchemy.Column(sqlalchemy.Integer,
                           primary_key=True, autoincrement=True)
    name = sqlalchemy.Column(sqlalchemy.String, nullable=True, default="")
    id_user = sqlalchemy.Column(sqlalchemy.Integer, nullable=True)
    permissions = sqlalchemy.Column(sqlalchemy.String, nullable=True, default="")
    time_activiti = sqlalchemy.Column(sqlalchemy.String, default=datetime.datetime.now)
    password = sqlalchemy.Column(sqlalchemy.String, nullable=True, default="")

    def set_password(self, password):
        salt = "5gz"
        data_base_password = password + salt
        hashed = hashlib.md5(data_base_password.encode())
        self.password = hashed.hexdigest()

    def check_password(self, password):
        salt = "5gz"
        data_base_password = password + salt
        hashed = hashlib.md5(data_base_password.encode())
        return self.password == hashed.hexdigest()

    def __repr__(self):
        return f"{self.name} {self.permissions}"

    def activiti(self):
        self.time_activiti = datetime.datetime.now()


permissions = {
    1: "удаление пользователя",
    2: "блокировка пользователя",
    3: "отправка новостей",
    4: "блокировка страниц сайта",
}
