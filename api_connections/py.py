from networktables import NetworkTables

# Initialize NetworkTables
NetworkTables.initialize(server='localhost:8080')

# Get a table
table = NetworkTables.getTable('datatable')

# Put a value
table.putNumber('x', 12345)
table.putNumber('y', 67890)

# Get a value
x = table.getNumber('x', 0)  # returns 0 if 'x' doesn't exist
y = table.getNumber('y', 0)  # returns 0 if 'y' doesn't exist
print(f"X: {x} Y: {y}")