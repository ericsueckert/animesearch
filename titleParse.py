
import xmltodict
import web
from flask import Flask
app = Flask(__name__)

#api = Api(app)
urls = (
'/', 'index'
)

class index:

    def GET(self):
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

        return jsonify(returnData)

if __name__ == '__main__':
    app = web.application(urls, globals())
    app.run()


# @app.route('/autocomplete', methods=['GET'])
# def parse_request():
#     returnData = {}
#     data = request.data
#     raw = xmltodict.parse(data)
#     raw = raw['ann']
#     animeList = raw['anime']
#     for anime in animeList:
#         print anime['@id']
#         returnData[anime['@id']] = [anime['@name'], anime['@type']]
#         #.append(anime['@name'])
#
#     for anime in returnData:
#         print anime + " " + returnData[anime][0] + " " + returnData[anime][1]
#
#     return jsonify(returnData)
#
# if __name__ == '__main__':
#     app.run(debug=True)
