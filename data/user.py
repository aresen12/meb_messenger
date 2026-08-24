import sqlalchemy
from flask_login import UserMixin
from data.db_session import SqlAlchemyBase
from sqlalchemy_serializer import SerializerMixin
import hashlib
from data.protected import protected_words, protected_symbols


class User(SqlAlchemyBase, UserMixin, SerializerMixin):
    __tablename__ = 'users'
    id = sqlalchemy.Column(sqlalchemy.Integer,
                           primary_key=True, autoincrement=True)
    name = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    password = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    admin = sqlalchemy.Column(sqlalchemy.Boolean, default=False)
    block = sqlalchemy.Column(sqlalchemy.Boolean, nullable=True)
    email = sqlalchemy.Column(sqlalchemy.String,
                              index=True, unique=True, nullable=True)
    list_message = sqlalchemy.Column(sqlalchemy.String, nullable=True, default="")

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
        return self.name, self.email


def check_username(username, db_sess):
    lower_u = username.lower()
    if len(lower_u) > 20:
        return False
    if lower_u in protected_words:
        return False
    for p_symbol in protected_symbols:
        if p_symbol in lower_u:
            return False
    users = db_sess.query(User).all()
    for user in users:
        if user.email.lower() == lower_u:
            return False
