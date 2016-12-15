import xmltodict
from collections import defaultdict

returnData = defaultdict(list)
#data = request.data
f = open("test.xml",'r')
data = f.read()
raw = xmltodict.parse(data)
raw = raw['ann']
animeList = raw['anime']
for anime in animeList:
    print anime['@id']
    returnData[anime['@id']] = [anime['@name'], anime['@type']]
    #.append(anime['@name'])

for anime in returnData:
    print anime + " " + returnData[anime][0] + " " + returnData[anime][1]
