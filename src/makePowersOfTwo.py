import json

powersOfTwo=[0]*128
for i in range(128):
    powersOfTwo[i] = str(2**i)

powers={"powers":powersOfTwo}

with open("powersOfTwo.json","w") as file:
    json.dump(powers,file)