import base64
import glob
import json

array_of_questions = []

for file in glob.glob("*.png"):
    with open(file, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read())

    array_of_questions.append(encoded_string.decode('UTF-8'))

print(len(array_of_questions))
textFile = open("questions.json","w")
textFile.write(json.dumps(array_of_questions))
textFile.close()