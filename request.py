import requests
import validators
from bs4 import BeautifulSoup
import pandas as pd
from selenium import webdriver
import json
import urllib

from pytrends.request import TrendReq
try:
    from googlesearch import search
except ImportError:
    print("No module named 'google' found")


inputstr = "https://www.dataquest.io/blog/web-scraping-python-using-beautiful-soup/"
dotone = inputstr.find('.') + 1
inputstrsplit = inputstr[dotone:]
dottwo = inputstrsplit.find('.') + dotone
sitename = inputstr[dotone:dottwo]
print(sitename)

if not validators.url(inputstr):
    print("not a valid url")



def report(inputstr):

    url = 'https://transparencyreport.google.com/transparencyreport/api/v3/safebrowsing/status?site=' + inputstr

    response = requests.get(url)
    str = response.content

    #ascii
    #print(str.find(44))
    #print(str[17])

    # 0 = 48;  1 = 49.... 54 = 6

    if str[17] == 49:
        print("no unsafe content found")
        return "no unsafe content found"
    if str[17] == 50:
        print("this site is unsafe")
    if str[17] == 51:
        print("some pages on this site are unsafe")
    if str[17] == 52:
        print("check a specific url")
    if str[17] == 53:
        print("what is this code")
    if str[17] == 54:
        print("no available data")

    # 1 = no unsafe content found
    # 2 = this site is unsafe
    # 3 = some pages on this site are unsafe
    # 4 = check a specific url
    # 6 = no available data


def googletree(sitename):
    api_key = 'AIzaSyBM3q61Rf9LvPynrVJKGCX5c6i1Ks8G72U'  # add your API key
    query = sitename  # add your query
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


safety = report(inputstr)
googletree(sitename)





