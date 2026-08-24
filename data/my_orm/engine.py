import sqlite3
from data.my_orm.tables import Table


class SessionDB:
    def __init__(self, name_db, factory=False):
        self.connection = None
        self.connection: sqlite3.Connection
        self.cursor = None
        self.name_db = name_db
        self.connect(name_db, factory)
        self.current_table = None
        self.sql_text = ""
        self.factory = factory

    def connect(self, name_db="", row=False):
        if name_db == "":
            self.connection = sqlite3.connect(self.name_db)
        self.connection = sqlite3.connect(name_db)
        if row:
            self.connection.row_factory = sqlite3.Row
        self.cursor = self.connection.cursor()

    def close(self):
        self.connection.close()

    def commit(self):
        self.connection.commit()

    def query(self, args: Table):
        self.current_table = args
        self.sql_text = f'''SELECT * FROM {args.table_name}'''
        return self

    def filter(self, logical):
        if "WHERE" in self.sql_text:
            self.sql_text += f" AND {logical}"
        else:
            self.sql_text += f''' WHERE {logical}'''
        return self

    def all(self):
        try:
            return self.cursor.execute(self.sql_text).fetchall()
        except sqlite3.OperationalError:
            self.create_table(self.current_table)
            return self.cursor.execute(self.sql_text).fetchall()

    def first(self):
        try:
            value = self.cursor.execute(self.sql_text).fetchone()
            columns = self.cursor.execute(f"PRAGMA table_info({self.current_table.table_name})").fetchall()
            for i in range(len(columns)):
                try:
                    getattr(self.current_table, columns[i][1]).value = value[i]
                except Exception:
                    pass
            r = self.current_table
            self.current_table = None
            return r
        except sqlite3.OperationalError:
            self.create_table(self.current_table)
            value = self.cursor.execute(self.sql_text).fetchone()
            columns = self.cursor.execute(f"PRAGMA table_info({self.current_table.table_name})").fetchall()
            for i in range(len(columns)):
                try:
                    getattr(self.current_table, columns[i][1]).value = value[i]
                except Exception:
                    pass
            r = self.current_table
            self.current_table = None
            return r

    def add(self, new_data: Table):
        column = new_data.add()
        sql = ", ".join(["?" for _ in column])
        param = [_.value for _ in column]
        res = self.connection.execute(f'''INSERT INTO {new_data.table_name}
        ({", ".join([_.name for _ in column])}) VALUES ({sql})''', param)
        new_data.id.value = res.lastrowid

    def delete(self, object_: Table):
        self.connection.execute(
            f'''DELETE FROM {object_.table_name} WHERE {object_.table_name}.id = {object_.id.value}''')

    def create_table(self, table):
        self.connection.execute(table.create_table())

    def update(self, table: Table):
        k = table.update()
        self.connection.execute(k[0], k[1])
