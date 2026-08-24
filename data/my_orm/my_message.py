from data.my_orm.message import Message
import datetime


class MyMessage(Message):
    def __init__(self):
        super().__init__()


def new_mess_my(message, id_sender, name_sender, html, file_id="", read=False, pinned_m=False):
    mess = MyMessage()
    mess.message.value = message
    mess.id_sender.value = id_sender
    mess.name_sender.value = name_sender
    mess.read.value = read
    mess.img.value = file_id
    mess.html_m.value = html
    mess.time.value = datetime.datetime.now()
    return mess


def new_emoji_my(text, id_mess, id_sender, name_sender):
    mess = MyMessage()
    mess.type.value = 2
    mess.message.value = text
    mess.html_m.value = id_mess
    mess.id_sender.value = id_sender
    mess.name_sender.value = name_sender
    mess.time.value = datetime.datetime.now()
    return mess
