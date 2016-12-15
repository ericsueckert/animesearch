
import xmltodict
from flask import Flask
app = Flask(__name__)

@app.route('/', methods=['POST', 'GET'])
def parse_request():
    returnData = {}
    data = request.data
    raw = xmltodict.parse(data)
    raw = raw['ann']
    animeList = raw['anime']
    for anime in animeList:
        print anime['@id']
        returnData[anime['@id']] = [anime['@name'], anime['@type']]
        #.append(anime['@name'])

    for anime in returnData:
        print anime + " " + returnData[anime][0] + " " + returnData[anime][1]

    return json.dumps(returnData)
