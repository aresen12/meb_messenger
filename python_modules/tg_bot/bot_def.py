
from python_modules.keys import bot_key
from data import db_session
from data.reset_passwords import DCode

# def send_random_key(c_id, key):
#     bot2 = TeleBot(bot_key)
#     db_sess = db_session.create_session()
#     chat = db_sess.query(BotDB.chat_id_tg).filter(BotDB.id_user == str(c_id[0])).first()
#     if chat is None:
#         message = "У вас не подключены уведомления!"
#         code = 500
#     else:
#         message = "Код успешно отправлен"
#         code = 200
#         dcode = db_sess.query(DCode).filter(DCode.id_user == str(c_id[0])).first()
#         if dcode is None:
#             dcode2 = DCode()
#             dcode2.id_user = str(c_id[0])
#             dcode2.set_password(key)
#             db_sess.add(dcode2)
#         else:
#             dcode.set_password(key)
#         db_sess.commit()
#         try:
#             bot2.send_message(chat[0], f"Код для востановления пароля:\n{key}")
#         except Exception:
#             code = 500
#             message = "Что-то с тг ботом"
#     db_sess.close()
#     return [code, message]
