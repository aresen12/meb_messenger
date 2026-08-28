from data.chat import Chat


def check_in_chat(chat_id, db_sess, c_user_id):
    if chat_id[0] != "m":
        chat = db_sess.query(Chat).filter(Chat.id == chat_id).first()
        if not (c_user_id in map(int, chat.members.split())):
            db_sess.close()
            return False
    else:
        if not (c_user_id == int(chat_id[2:])):
            return False
    return True