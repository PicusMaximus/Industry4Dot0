import sqlite3

def create_db():
    con = sqlite3.connect('task.db')
    cur = con.cursor()

    # Create the Task table if it not allready exists...
    cur.execute('''
                CREATE TABLE IF NOT EXISTS task (
                    id text PRIMARY KEY
                    ,name text NOT NULL
                    ,subtasks text NOT NULL
                )
                ''')
    con.commit()
    con.close()

def get_tasks():
    con = sqlite3.connect('task.db')
    cur = con.cursor()

    # Create the Task table if it not allready exists...
    cur.execute('''
                SELECT *
                FROM task
            ''')
    
    con.commit()
    con.close()

def get_subtasks(id):
    con = sqlite3.connect('task.db')
    cur = con.cursor()

    # Create the Task table if it not allready exists...
    cur.execute('''
                SELECT subtasks
                FROM task
                WHERE id={id}
            '''.format(id=id))

    con.commit()
    con.close()

def get_task(id):
    con = sqlite3.connect('task.db')
    cur = con.cursor()

    # Create the Task table if it not allready exists...
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

    # Create the Task table if it not allready exists...
    cur.execute('''
                    INSERT INTO task (id, name, subtasks)
                    VALUES (?, ?, ?)
                ''', (data['id'], data['name'], data['subtasks']))
    
    con.commit()
    con.close()

def update_task(data):
    con = sqlite3.connect('task.db')
    cur = con.cursor()

    sql = 'UPDATE task SET name = "{name2}", subtasks = "{subtasks}" WHERE id = {id}'.format(id=data['id'], name2=data['name'], subtasks=data['subtasks'])

    # Create the Task table if it not allready exists...
    cur.execute(sql)
    
    con.commit()
    con.close()

def delete_task(id):
    con = sqlite3.connect('task.db')
    cur = con.cursor()

    # Create the Task table if it not allready exists...
    cur.execute('''
                    DELETE task WHERE id={id}
                '''.format(id=id))
    
    con.commit()
    con.close()


