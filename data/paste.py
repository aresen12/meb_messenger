import sqlalchemy
from flask_login import UserMixin
from data.db_session import SqlAlchemyBase
from sqlalchemy_serializer import SerializerMixin
import datetime
import hashlib


class Paste(SqlAlchemyBase, UserMixin, SerializerMixin):
    __tablename__ = 'paste'
    id = sqlalchemy.Column(sqlalchemy.Integer,
                           primary_key=True, autoincrement=True)
    name_sender = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    secret = sqlalchemy.Column(sqlalchemy.Boolean, default=False)
    password = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    message = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    read = sqlalchemy.Column(sqlalchemy.Boolean, default=False,)
    time = sqlalchemy.Column(sqlalchemy.String, nullable=True, default=datetime.datetime.now)
    #email_recipient = sqlalchemy.Column(sqlalchemy.Integer, nullable=True)
    #img = sqlalchemy.Column(sqlalchemy.String, nullable=True)

    def __repr__(self):
        return f"{self.message} {self.time}"

    def get_time(self):
        return str(self.time).split()[1]

    def get_date(self):
        date = str(self.time).split()[0].split("-")
        return f"{date[2]}.{date[1]}.{date[0]}"
        
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

