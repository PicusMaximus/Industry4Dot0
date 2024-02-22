import snap7
client = snap7.client.Client()
client.connect("192.168.0.1", 0, 1)
print(client.db_read(2,0,1))