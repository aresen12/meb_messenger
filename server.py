import datetime
import random
from flask import Flask, request, render_template, redirect
from python_modules.forms.login_form import LoginForm
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from data import db_session
from data.user import User
from python_modules.forms.register_form import RegisterForm
from python_modules.api import api
from data.reset_passwords import DCode
from flask_cors import CORS
from python_modules.messanger import mg, send_alert
from python_modules.admin_panel import panel
from python_modules.events_io import socketio
from python_modules.chats_action import chats_server
from python_modules.keys import block_pages
# from python_modules.tg_bot.bot_def import send_random_key
from data.alerts import Alert

application = Flask(__name__)
application.config['SECRET_KEY'] = 'certificate'
login_manager = LoginManager()
login_manager.init_app(application)


@login_manager.user_loader
def load_user(user_id):
    db_sess = db_session.create_session()
    rs = db_sess.get(User, user_id)
    db_sess.close()
    return rs
    
    
@application.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect("/")


db_session.global_init('db/master_paste.db')
application.register_blueprint(mg)
application.register_blueprint(api)
application.register_blueprint(panel)
application.register_blueprint(chats_server)
socketio.init_app(application)
CORS(application, supports_credentials=True)


@application.route("/login_device", methods=["POST", "GET"])
def login_device():
    if current_user.is_authenticated:
        return redirect("/api/android")
    form = LoginForm()
    if form.validate_on_submit():
        db_sess = db_session.create_session()
        user = db_sess.query(User).filter(User.email == form.username.data).first()
        if user and user.check_password(form.password.data):
            login_user(user, remember=form.remember_me.data, duration=datetime.timedelta(hours=24 * 90))
            return redirect("/api/android")
        return render_template('login_android.html',
                               message="Неправильный логин или пароль",
                               form=form)
    return render_template('login_android.html', title='Авторизация', form=form)


@application.route('/login', methods=['GET', 'POST'])
def login():
    if "login" in block_pages:
        return redirect("/")
    if current_user.is_authenticated:
        return redirect("/m")
    form = LoginForm()
    if form.validate_on_submit():
        db_sess = db_session.create_session()
        user = db_sess.query(User).filter(User.email== form.username.data).first()
        if user and user.check_password(form.password.data):
            login_user(user, remember=form.remember_me.data, duration=datetime.timedelta(hours=24*90))
            send_alert(user.id, db_sess, "Внимание!!!", f"""<b>В ваш аккаунт выполнен вход!</b
                <p>
                Информация о входе:
                {request.headers.get('User-Agent')}\n<b> ip</b> {request.remote_addr}</p>""")
            db_sess.close()
            return redirect("/m")
        db_sess.close()
        return render_template('login.html',
                               message="Неправильный логин или пароль",
                               form=form)
    return render_template('login.html', title='Авторизация', form=form)   
    
    
@application.route('/register', methods=['GET', 'POST'])
def reqister():
    if "register" in block_pages:
        return redirect("/")
    form = RegisterForm()
    if form.validate_on_submit():
        if form.password.data != form.password_again.data:
            return render_template('register.html', title='Регистрация',
                                   form=form,
                                   message="Пароли не совпадают")
        db_sess = db_session.create_session()
        if db_sess.query(User).filter(User.email == form.email.data).first():
            db_sess.close()
            return render_template('register.html', title='Регистрация',
                                   form=form,
                                   message="Такой пользователь уже есть")
        user = User()
        user.name = form.name.data
        user.email = form.email.data
        user.set_password(form.password.data)
        db_sess.add(user)
        db_sess.commit()
        # 1 - пользователь с id 1 тех поддежка
        send_alert(1, db_sess, text=f"Новая регистрация: username: {user.email}, name:{user.name}")
        login_user(user, remember=True, duration=datetime.timedelta(hours=24 * 90))
        db_sess.close()
        return redirect('/m')
    return render_template('register.html', title='Регистрация', form=form)


# @application.route("/reset_password")
# def reset_pass_def():
#     return render_template("reset_password.html")


# @application.route("/send_code_tg", methods=["POST"])
# def send_code_tg_server():
#     data = request.get_json()
#     code = random.randint(100000, 999999)
#     db_sess = db_session.create_session()
#     user_id = db_sess.query(User.id).filter(User.email == data["login"]).first()
#     test = send_random_key(user_id, code)
#     code_status, message = test[0], test[1]
#     db_sess.close()
#     return {"status": code_status, "message": message}


@application.route("/check_code_and_login", methods=["POST"])
def check_code_and_login():
    data = request.get_json()
    code = data["dcode"]
    new_password = data["new_password"]
    db_sess = db_session.create_session()
    user = db_sess.query(User).filter(User.email == data["login"]).first()
    dcode = db_sess.query(DCode).filter(DCode.id_user == user.id).first()
    if dcode.check_password(code):
        user.set_password(new_password)
        db_sess.delete(dcode)
        db_sess.commit()
        db_sess.close()
        return {"status": 200}
    db_sess.close()
    return {"status": 500}


# потом дописать и код возврата!!!!


@application.route("/main", methods=["GET"])
@application.route("/", methods=["GET"])
def main():
    db_sess = db_session.create_session()
    alerts = db_sess.query(Alert).all()
    db_sess.close()
    return render_template("main.html", title='главная', alerts=alerts)


@application.route("/test")
def test():
    return render_template("test.html")


if __name__ == "__main__":
    socketio.run(application, host='0.0.0.0', debug=True, allow_unsafe_werkzeug=True)

