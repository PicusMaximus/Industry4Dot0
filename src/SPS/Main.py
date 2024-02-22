import snap7

dbnumber = 1
rack = 0
slot = 1


client = snap7.client.Client()
client.connect("192.168.0.1", rack, slot)
print(client.db_read(dbnumber,0,1))
client.db_write(dbnumber,0,bytearray(b'\x01'))