import datetime

from data.my_orm.tables import Table
from data.my_orm.column import BoolColumn, TextColumn, INEGERColumn, DataTime


class Message(Table):
    def __init__(self):
        super().__init__("message")
        # self.id = IDColumn("id"),
        self.read = BoolColumn("read")  # 1
        self.message = TextColumn("message")    # 2
        self.img = TextColumn("img")  # 3
        self.html_m = TextColumn("html_m")  # 4
        # self.pinned = BoolColumn("pinned")  # 5
        self.name_sender = TextColumn("name_sender")  # 6 5
        self.id_sender = INEGERColumn("id_sender")  # 7 6
        self.time = DataTime("time")  # 8 7
        self.type = INEGERColumn("type")  # 9 8

    def get_date(self):
        date = str(self.time.value).split()[0].split("-")
        return f"{date[2]}.{date[1]}.{date[0]}"

    def get_time(self):
        return str(self.time.value).split()[1]


def new_mess(message, id_sender, name_sender, html="", file_id="", read=False, type=1):
    mess = Message()
    mess.message.value = message    
    mess.id_sender.value = id_sender
    mess.name_sender.value = name_sender
    mess.read.value = read
    mess.img.value = file_id
    mess.html_m.value = html
    mess.type.value = type
    mess.time.value = datetime.datetime.now()
    return mess


def new_emoji(text, id_mess, id_sender, name_sender):
    mess = Message()
    mess.type.value = 2
    mess.message.value = text
    mess.html_m.value = id_mess
    mess.id_sender.value = id_sender
    mess.name_sender.value = name_sender
    mess.time.value = datetime.datetime.now()
    return mess
