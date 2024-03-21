import sqlite3
import json

# JSON-Struktur für Tasks
# {
#     "id": "id",
#     "name": "Taskname",
#     "subtasks": [
#         {
#             "movementType": "movementType",
#             "steps": [
#                 {
#                     "command": "command_name",
#                     "data": {
#                         "j1": -6.45132587351327e-8,
#                         "j2": 69.71759796142578,
#                         "j3": 44.94383239746094,
#                         "j4": 0,
#                         "r": -6.45132587351327e-8,
#                         "x": 290.37591552734375,
#                         "y": -3.2695425034034997e-7,
#                         "z": -57.045326232910156
#                     }
#                 }
#             ]
#         }
#     ]
# }

def create_db():
    con = sqlite3.connect('task.db')
    cur = con.cursor()

    # Create the task table if it not allready exists...
    cur.execute('''
                CREATE TABLE IF NOT EXISTS task (
                    id text PRIMARY KEY
                    ,name text NOT NULL
                    ,subtasks JSONB NOT NULL
                )
                ''')
    con.commit()
    con.close()

def get_tasks():
    con = sqlite3.connect('task.db')
    cur = con.cursor()

    # Select all the tasks ...
    # Used to show all existing tasks on the Homepage 
    cur.execute('''
                SELECT *
                FROM task
            ''')
    
    con.commit()
    con.close()

def get_subtasks(id):
    con = sqlite3.connect('task.db')
    cur = con.cursor()

    # Select subtasks by Task-ID ...
    # Funst noch nicht :(
        #=> mann müsste den JSON-String PArsen auf den Steps-Teil
    cur.execute('''
                SELECT
                (SELECT json_extract(task.subtasks, '$')), 
                (SELECT json_extract(task.subtasks, '$.steps'))
                FROM task
                WHERE id={id}
            '''.format(id=id))

    subtasks = cur.fetchone()

    con.commit()
    con.close()

    return subtasks

def get_task(id):
    con = sqlite3.connect('task.db')
    cur = con.cursor()

    # Select tasks by ID
    cur.execute('''
                SELECT *
                FROM task
                WHERE id={id}
            '''.format(id=id))
    
    row = cur.fetchone()

    con.commit()
    con.close()

    return row

def create_task(data):
    con = sqlite3.connect('task.db')
    cur = con.cursor()

    # Create task ...
    cur.execute('''
                    INSERT INTO task (id, name, subtasks)
                    VALUES (?, ?, ?)
                ''', (data['id'], data['name'], json.dumps(data['subtasks'])))
    
    con.commit()
    con.close()

def update_task(data):
    con = sqlite3.connect('task.db')
    cur = con.cursor()

    sql = 'UPDATE task SET name = "{name2}", subtasks = "{subtasks}" WHERE id = {id}'.format(id=data['id'], name2=data['name'], subtasks=data['subtasks'])

    # UPdate existing task
    cur.execute(sql)
    
    con.commit()
    con.close()

def delete_task(id):
    con = sqlite3.connect('task.db')
    cur = con.cursor()

    # Delete existing task
    cur.execute('''
                    DELETE task WHERE id={id}
                '''.format(id=id))
    
    con.commit()
    con.close()