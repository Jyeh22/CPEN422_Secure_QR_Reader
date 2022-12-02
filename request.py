import requests
from bs4 import BeautifulSoup
import pandas as pd
from selenium import webdriver

url = 'https://transparencyreport.google.com/transparencyreport/api/v3/safebrowsing/status?site=https://www.dataquest.io/blog/web-scraping-python-using-beautiful-soup/'

response = requests.get(url)
#print(response.status_code)
#print(response.text)
#print(response.content)

str = response.content

#ascii
#print(str.find(44))
#print(str[17])

# 0 = 48;  1 = 49.... 54 = 6

if str[17] == 49:
    print("no unsafe content found")
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