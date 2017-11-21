#!/usr/bin/env python
# coding: utf-8
import json
import sys
from copy import deepcopy
f = open(sys.argv[1]+"0.json","r")
first = json.loads(f.read())
f.close()
f = open(sys.argv[1]+"1.json","r")
second = json.loads(f.read())
f.close()
third = deepcopy(first)



def findKey (dict, key,value):
	for i in dict:
		#print dict
		if i[key]==value:
			return i








for idx, val in enumerate(first["targets"]):

	sameName = findKey(second["targets"], "Name", val["Name"])
	if sameName and "Text" in sameName:
		third["targets"][idx]["Text"]=[val["Text"],sameName["Text"]]
	else:
		print val["Name"],sys.argv[1]
file=open(sys.argv[1]+".json","w")
out= json.dumps(third,encoding="utf-8", indent=2)
file.write(out)
file.close()
