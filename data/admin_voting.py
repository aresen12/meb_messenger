import sqlalchemy
from flask_login import UserMixin
from data.db_session import SqlAlchemyBase
from sqlalchemy_serializer import SerializerMixin
from data.admin import Admin


class Voting(SqlAlchemyBase, UserMixin, SerializerMixin):
    __tablename__ = 'voting'
    id = sqlalchemy.Column(sqlalchemy.Integer,
                           primary_key=True, autoincrement=True)
    text = sqlalchemy.Column(sqlalchemy.String, nullable=True, default="Без описания")
    id_user = sqlalchemy.Column(sqlalchemy.Integer, nullable=True)
    permissions = sqlalchemy.Column(sqlalchemy.String, nullable=True, default="")
    voting_users = sqlalchemy.Column(sqlalchemy.String, default='')
    yes = sqlalchemy.Column(sqlalchemy.Integer, nullable=True, default=0)
    no = sqlalchemy.Column(sqlalchemy.Integer, nullable=True, default=0)
    cnt = sqlalchemy.Column(sqlalchemy.Integer, nullable=False, default=1)

    def voting(self, id_user, yer_or_no):
        voting = self.voting_users.split()
        if not (str(id_user) in voting) and id_user != self.id_user:
            voting.append(str(id_user))
            self.voting_users = " ".join(voting)
            if yer_or_no:
                self.yes += 1
            else:
                self.no += 1
            return True
        return False

    def __repr__(self):
        return f"{self.text} {self.permissions} {self.cnt} {self.yes}"

    def check_vote(self, db_sess):
        if self.cnt <= self.yes:
            admin = db_sess.query(Admin).filter(Admin.id_user == self.id_user).first()
            admin.permissions = self.permissions
            db_sess.delete(self)
            db_sess.commit()
            return True
        return False
