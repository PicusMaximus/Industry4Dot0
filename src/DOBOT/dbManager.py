import sqlite3
import json
from types import SimpleNamespace

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
                    id TEXT PRIMARY KEY
                    ,name TEXT NOT NULL
                    ,subtasks TEXT NOT NULL
                )
                ''')
    
    cur.execute('''
        CREATE TABLE IF NOT EXISTS task_order (
                 jobId TEXT PRIMARY KEY
                ,name TEXT NOT NULL
                ,nextJobId TEXT NOT NULL
                ,nextDeviceIp TEXT NOT NULL
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
                SELECT id, name, subtasks
                FROM task
            ''')
    
    res = cur.fetchall()

    con.commit()
    con.close()

    return res

def get_order(id):
    con = sqlite3.connect('task.db')
    cur = con.cursor()

    # Select all the tasks ...
    # Used to show all existing tasks on the Homepage 
    cur.execute('''
                SELECT *
                FROM task_order
                WHERE jobId = ?
            ''', (id,))
    
    res = cur.fetchone()

    con.commit()
    con.close()

    return res

def get_subtasks(id):
    con = sqlite3.connect('task.db')
    cur = con.cursor()

    # Select subtasks by Task-ID ...
    # Funst noch nicht :(
        #=> mann müsste den JSON-String PArsen auf den Steps-Teil
    cur.execute('''
                SELECT json_extract(task.subtasks, '$') 
                FROM task
                WHERE id = ?
            ''', (id, ))

    res = cur.fetchone()

    con.commit()
    con.close()

    subtasks = json.loads(res[0])

    for h in range(len(subtasks)):
        subtasks[h] = SimpleNamespace(**dict(subtasks[h]))   

        for i in range(len(subtasks[h].steps)):
            subtasks[h].steps[i] = SimpleNamespace(**dict(subtasks[h].steps[i]))
            subtasks[h].steps[i].data = SimpleNamespace(**dict(subtasks[h].steps[i].data))
            if hasattr(subtasks[h].steps[i].data, 'pos'):
                subtasks[h].steps[i].data.pos = SimpleNamespace(**dict(subtasks[h].steps[i].data.pos))
            # if hasattr(subtasks[h].steps[i].data, 'wait'):
            #     subtasks[h].steps[i].data.settings = SimpleNamespace(**dict(subtasks[h].steps[i].data.settings))
            # if hasattr(subtasks[h].steps[i].data, 'settings'):
            #     subtasks[h].steps[i].data.wait = SimpleNamespace(**dict(subtasks[h].steps[i].data.wait))
    return subtasks

def get_task(id):
    con = sqlite3.connect('task.db')
    cur = con.cursor()

    # Select tasks by ID
    cur.execute('''
                SELECT *
                FROM task
                WHERE id = ?
            ''', (id,))
    
    row = cur.fetchone()

    con.commit()
    con.close()

    return row

def get_simple_tasks():
    con = sqlite3.connect('task.db')
    cur = con.cursor()

    # Select tasks by ID
    cur.execute('''
                SELECT id, name
                FROM task
            ''')
    
    rows = cur.fetchall()

    data = []

    for row in rows:
        data.append({'id':row[0], 'name':row[1]})

    con.commit()
    con.close()

    return {'jobs': data}

def create_task(data):
    con = sqlite3.connect('task.db')
    cur = con.cursor()

    # Create task ...
    cur.execute('''
                    INSERT INTO task (id, name, subtasks)
                    VALUES (?, ?, json(?))
                ''', (data['id'], data['name'], json.dumps(data['subtasks'])))
    
    con.commit()
    con.close()

def create_order(data):
    con = sqlite3.connect('task.db')
    cur = con.cursor()

    # Create task ...
    cur.execute('''
                    INSERT INTO task_order (jobId, name, nextJobId, nextDeviceIp)
                    VALUES (?, ?, ?, ?))
                    ON CONFLICT(jobId) DO UPDATE SET 
                        jobId = ?,
                        name = ?,
                        nextJobId = ?,
                        nextDeviceIp = ?
                ''', (data['jobId'], data['name'], data['nextJobId'], data['nextDeviceIp']))
    
    con.commit()
    con.close()

def update_task(data):
    con = sqlite3.connect('task.db')
    cur = con.cursor()

    # UPdate existing task
    cur.execute('''
                    UPDATE task 
                    SET name = ?,
                        subtasks = json(?)
                    WHERE id = ?
                ''', (data['name'], json.dumps(data['subtasks']), data['id'], )
                )
    
    con.commit()
    con.close()

def update_order(data):
    con = sqlite3.connect('task.db')
    cur = con.cursor()

    # UPdate existing task
    cur.execute('''
                    UPDATE task 
                    SET name = ?,
                        nextJobId = ?
                        nextDeviceIp = ?
                    WHERE jobId = ?
                ''', (data['name'], data['nextJobId'], data['nextDeviceIp'], data['jobId'])
                )
    
    con.commit()
    con.close()

def delete_order(id):
    con = sqlite3.connect('task.db')
    cur = con.cursor()

    # Delete existing task
    cur.execute('''
                    DELETE FROM task WHERE id = ?
                ''', (id, ))
    
    con.commit()
    con.close()

def delete_task(id):
    con = sqlite3.connect('task.db')
    cur = con.cursor()

    # Delete existing task
    cur.execute('''
                    DELETE FROM task_order WHERE id = ?
                ''', (id, ))
    
    con.commit()
    con.close()