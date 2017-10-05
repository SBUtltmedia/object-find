import json
import sys
f = open(sys.argv[1]+"0.json")
first = f.read()
f.close()
f = open(sys.argv[1]+"1.json")
second = f.read()
f.close()
print json.loads(first)

