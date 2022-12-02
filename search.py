import json
import urllib

from pytrends.request import TrendReq
try:
    from googlesearch import search
except ImportError:
    print("No module named 'google' found")

#key = AIzaSyBM3q61Rf9LvPynrVJKGCX5c6i1Ks8G72U

# get url from qr code and crop website name
# search on Google Knowledge Graph Search API


api_key = 'AIzaSyBM3q61Rf9LvPynrVJKGCX5c6i1Ks8G72U' #add your API key
query = 'royalbank1' #add your query
service_url = 'https://kgsearch.googleapis.com/v1/entities:search'
params = {
'query': query,
'limit': 10,
'indent': True,
'key': api_key,
}
url = service_url + '?' + urllib.parse.urlencode(params)
response = json.loads(urllib.request.urlopen(url).read())
for element in response['itemListElement']:
    print(element['result']['name'] + ' (' + str(element['resultScore']) + ')')