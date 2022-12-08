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


values = {
    "date": "unknown",
    "domDetected": "unknown",
    "trustScore": "unknown",
    "certFound": "unknown",
    "certValid": "unknown",
    "transparencyRep": "unknown",
    "googleTree": "unknown",
}

inputstr = input()

if "www" in inputstr:
    dotone = inputstr.find('.') + 1
    inputstrsplit = inputstr[dotone:]
    dottwo = inputstrsplit.find('.') + dotone
    sitename = inputstr[dotone:dottwo]
    endslash = inputstrsplit.find('/') + dotone
    # if there are no slashes after the .com
    if endslash <= dotone:
        url = inputstr[dotone:len(inputstr)]
    else:
        url = inputstr[dotone:endslash]
    #url = inputstr[dotone:endslash]
else:
    firstslash = inputstr.find('/') + 2
    inputstrsplit = inputstr[firstslash:]
    dottwo = inputstrsplit.find('.') + firstslash
    sitename = inputstr[firstslash:dottwo]
    endslash = inputstrsplit.find('/') + firstslash
    if endslash <= firstslash:
        url = inputstr[firstslash:len(inputstr)]
    else:
        url = inputstr[firstslash:endslash]


if not validators.url(inputstr):
    print("not a valid url")


# Param: inputstr - entire url as inputted
# search url on Transparency Report
# return what the transparency tells you
# updates json object value transparencyRep
def report(inputstr):

    url = 'https://transparencyreport.google.com/transparencyreport/api/v3/safebrowsing/status?site=' + inputstr

    response = requests.get(url)
    str = response.content
    # ascii
    # print(str.find(44))
    # print(str[17])

    # 0 = 48;  1 = 49.... 54 = 6

    if str[17] == 49:
        values.update({"transparencyRep": "no unsafe content found"})
    if str[17] == 50:
        values.update({"transparencyRep": "this site is unsafe"})
    if str[17] == 51:
        values.update({"transparencyRep": "some pages on this site are unsafe"})
    if str[17] == 52:
        values.update({"transparencyRep": "check a specific url"})
    if str[17] == 53:
        values.update({"transparencyRep": "unknown"})
    if str[17] == 54:
        values.update({"transparencyRep": "no available data"})

    # 1 = no unsafe content found
    # 2 = this site is unsafe
    # 3 = some pages on this site are unsafe
    # 4 = check a specific url
    # 6 = no available data


# Param: sitename - website name without domain code (ex. amazon)
# googleTree api returns related searches
# a well known search should return more hits
# updates json object value googleTree
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
    try:
        response = json.loads(urllib.request.urlopen(url).read())
        x = len(response['itemListElement'])
        values.update({"googleTree": x})
    except:
        values.update({"googleTree": "Error"})

    # for element in response['itemListElement']:
        # print(element['result']['name'] + ' (' + str(element['resultScore']) + ')')


# Param: url - website name with domain code (ex. amazon.com)
# APIvoid to find the domain creation date
# updates json object value Date
def ageCheck(url):
    APIkey = 'db1ec466f4fe2f87bb914d65ded54ebd73fd7151'
    age = 'https://endpoint.apivoid.com/domainage/v1/pay-as-you-go/?key=' + APIkey + '&host=' + url

    response = requests.get(age)
    parsed = json.loads(response.content)
    #parsed = {'host': 'google.com', 'debug_message': '', 'domain_age_found': True, 'domain_registered': 'yes',
    #          'domain_creation_date': '1997-09-15', 'domain_age_in_days': 9214, 'domain_age_in_months': 297,
    #          'domain_age_in_years': 25}

    #print(parsed)

    # Parse through items to find date created
    for key, value in parsed["data"].items():
        # print(key, ":", value)
        if key == "domain_creation_date":
            values.update({"date": value})
            #print("Domain created on", value)
            return value


# APIvoid to determine reputation of domain
# check if url is in blacklists and return percentage of blacklists website appears in
# updates json object value domDetected with percentage
def domRep(url):
    APIkey = 'db1ec466f4fe2f87bb914d65ded54ebd73fd7151'
    rep = 'https://endpoint.apivoid.com/domainbl/v1/pay-as-you-go/?key=' + APIkey + '&host=' + url

    response = requests.get(rep)
    parsed = json.loads(response.content)

    #print(parsed["data"]["report"]["blacklists"])
    parsed = (parsed["data"]["report"]["blacklists"])

    # parse through items
    # detected can be either False or True
    # there is a confidence value which can also be accounted for
    for key, value in parsed.items():

        if key == "detections":
            numDetected = value
        elif key == "engines_count":
            enginesChecked = value
        elif key == "detection_rate":
            detectionRate = value
            values.update({"domDetected": value})


def siteTrust(url):
    APIkey = 'db1ec466f4fe2f87bb914d65ded54ebd73fd7151'
    trust = 'https://endpoint.apivoid.com/sitetrust/v1/pay-as-you-go/?key=' + APIkey + '&host=' + url
    # parsed = {'data': {'report': {'dns_records': {'ns': {'records': [{'target': 'pdns1.ultradns.net', 'ip': '204.74.108.1', 'country_code': 'US', 'country_name': 'United States of America', 'isp': 'Neustar Security Services'}, {'target': 'ns4.p31.dynect.net', 'ip': '108.59.164.31', 'country_code': 'US', 'country_name': 'United States of America', 'isp': 'Dynamic Network Services Inc.'}, {'target': 'ns1.p31.dynect.net', 'ip': '108.59.161.31', 'country_code': 'US', 'country_name': 'United States of America', 'isp': 'Dynamic Network Services Inc.'}, {'target': 'pdns6.ultradns.co.uk', 'ip': '204.74.115.1', 'country_code': 'US', 'country_name': 'United States of America', 'isp': 'Neustar Security Services'}, {'target': 'ns2.p31.dynect.net', 'ip': '108.59.162.31', 'country_code': 'US', 'country_name': 'United States of America', 'isp': 'Dynamic Network Services Inc.'}, {'target': 'ns3.p31.dynect.net', 'ip': '108.59.163.31', 'country_code': 'US', 'country_name': 'United States of America', 'isp': 'Dynamic Network Services Inc.'}]}, 'mx': {'records': [{'target': 'amazon-smtp.amazon.com', 'ip': '54.220.183.70', 'country_code': 'IE', 'country_name': 'Ireland', 'isp': 'Amazon.com Inc.'}]}}, 'domain_age': {'found': True, 'domain_creation_date': '1994-11-01', 'domain_age_in_days': 10263, 'domain_age_in_months': 331, 'domain_age_in_years': 28}, 'domain_blacklist': {'engines': [{'name': 'ThreatLog', 'reference': 'https://www.threatlog.com/', 'detected': False}, {'name': 'OpenPhish', 'reference': 'https://openphish.com/', 'detected': False}, {'name': 'PhishTank', 'reference': 'https://www.phishtank.com/', 'detected': False}, {'name': 'Phishing.Database', 'reference': 'https://github.com/mitchellkrogza/Phishing.Database', 'detected': False}, {'name': 'PhishStats', 'reference': 'https://phishstats.info/', 'detected': False}, {'name': 'URLhaus', 'reference': 'https://urlhaus.abuse.ch/', 'detected': False}, {'name': 'RPiList Not Serious', 'reference': 'https://github.com/RPiList/specials', 'detected': False}, {'name': 'AntiSocial Blacklist', 'reference': 'https://theantisocialengineer.com/', 'detected': False}, {'name': 'PhishFeed', 'reference': 'https://phishfeed.com/', 'detected': False}, {'name': 'NABP Not Recommended Sites', 'reference': 'https://safe.pharmacy/buy-safely/', 'detected': False}, {'name': 'Spam404', 'reference': 'https://www.spam404.com/', 'detected': False}, {'name': 'CRDF', 'reference': 'https://threatcenter.crdf.fr/check.html', 'detected': False}, {'name': 'Artists Against 419', 'reference': 'http://wiki.aa419.org/index.php/Main_Page', 'detected': False}, {'name': 'CERT Polska', 'reference': 'https://www.cert.pl/', 'detected': False}, {'name': 'PetScams', 'reference': 'https://petscams.com/', 'detected': False}, {'name': 'Suspicious Hosting IP', 'reference': 'https://www.novirusthanks.org/', 'detected': False}, {'name': 'Phishunt', 'reference': 'https://phishunt.io/', 'detected': False}, {'name': 'CoinBlockerLists', 'reference': 'https://gitlab.com/ZeroDot1/CoinBlockerLists/', 'detected': False}, {'name': 'MetaMask EthPhishing', 'reference': 'https://github.com/MetaMask/eth-phishing-detect/', 'detected': False}, {'name': 'EtherScamDB', 'reference': 'https://etherscamdb.info/', 'detected': False}, {'name': 'EtherAddressLookup', 'reference': 'https://github.com/409H/EtherAddressLookup/', 'detected': False}, {'name': 'ViriBack C2 Tracker', 'reference': 'http://tracker.viriback.com/', 'detected': False}, {'name': 'Bambenek Consulting', 'reference': 'http://www.bambenekconsulting.com/', 'detected': False}, {'name': 'Badbitcoin', 'reference': 'https://badbitcoin.org/', 'detected': False}, {'name': 'SecureReload Phishing List', 'reference': 'https://securereload.tech/', 'detected': False}, {'name': 'Fake Website Buster', 'reference': 'https://fakewebsitebuster.com/', 'detected': False}, {'name': 'TweetFeed', 'reference': 'https://github.com/0xDanielLopez/TweetFeed', 'detected': False}, {'name': 'CryptoScamDB', 'reference': 'https://cryptoscamdb.org/', 'detected': False}, {'name': 'StopGunScams', 'reference': 'https://stopgunscams.com/', 'detected': False}], 'detections': 0}, 'ecommerce_platform': {'is_shopify': False, 'is_woocommerce': False, 'is_opencart': False, 'is_prestashop': False, 'is_magento': False, 'is_zencart': False, 'is_shoplazza': False, 'is_shopyy': False, 'is_youcanshop': False, 'is_ueeshop': False}, 'geo_location': {'countries': ['US', 'IE']}, 'redirection': {'found': False, 'external': False, 'url': None}, 'response_headers': {'code': 200, 'status': 'HTTP/2 200', 'content-type': 'text/html;charset=UTF-8', 'server': 'Server', 'date': 'Wed, 07 Dec 2022 11:56:25 GMT', 'x-amz-rid': 'AVXC2J05AEWMB99FTANR', 'set-cookie': 'session-id=143-3272928-7718537; Domain=.amazon.com; Expires=Thu, 07-Dec-2023 11:56:25 GMT; Path=/; Secure session-id-time=2082787201l; Domain=.amazon.com; Expires=Thu, 07-Dec-2023 11:56:25 GMT; Path=/; Secure i18n-prefs=USD; Domain=.amazon.com; Expires=Thu, 07-Dec-2023 11:56:25 GMT; Path=/ sp-cdn="L5Z9:DE"; Version=1; Domain=.amazon.com; Max-Age=31536000; Expires=Thu, 07-Dec-2023 11:56:25 GMT; Path=/; Secure; HttpOnly tinker-id=delete; Domain=.amazon.com; Expires=Thu, 01-Jan-1970 00:00:10 GMT; Path=/ skin=noskin; path=/; domain=.amazon.com', 'accept-ch-lifetime': '86400', 'x-ua-compatible': 'IE=edge', 'cache-control': 'no-cache', 'x-xss-protection': '1;', 'accept-ch': 'ect,rtt,downlink,device-memory,sec-ch-device-memory,viewport-width,sec-ch-viewport-width,dpr,sec-ch-dpr,sec-ch-ua-platform,sec-ch-ua-platform-version', 'pragma': 'no-cache', 'content-security-policy-report-only': "default-src 'self' blob: https: data: mediastream: 'unsafe-eval' 'unsafe-inline';report-uri https://metrics.media-amazon.com/", 'x-content-type-options': 'nosniff', 'expires': '-1', 'content-language': 'en-US', 'content-encoding': 'gzip', 'content-security-policy': 'upgrade-insecure-requests;report-uri https://metrics.media-amazon.com/', 'strict-transport-security': 'max-age=47474747; includeSubDomains; preload', 'vary': 'Content-Type,Accept-Encoding,User-Agent', 'x-frame-options': 'SAMEORIGIN', 'x-cache': 'Miss from cloudfront', 'via': '1.1 c176cabe132d03e00f152d5649d68e96.cloudfront.net (CloudFront)', 'x-amz-cf-pop': 'LHR62-C3', 'x-amz-cf-id': 'vQNf8fHG4_4BpMK7RZQs7ZFOJNV3sCpohl-zhNPcoUk9wnkKAoiNUA=='}, 'security_checks': {'is_suspended_site': False, 'is_most_abused_tld': False, 'is_robots_noindex': False, 'is_website_accessible': True, 'is_empty_page_content': False, 'is_redirect_to_search_engine': False, 'is_http_status_error': False, 'is_http_server_error': False, 'is_http_client_error': False, 'is_empty_page_title': False, 'is_ipv6_enabled': False, 'is_domain_blacklisted': False, 'is_suspicious_domain': False, 'is_sinkholed_domain': False, 'is_directory_listing': False, 'is_domain_ipv4_assigned': True, 'is_domain_ipv4_private': False, 'is_domain_ipv4_loopback': False, 'is_domain_ipv4_reserved': False, 'is_domain_ipv4_valid': True, 'is_uncommon_host_length': False, 'is_uncommon_dash_char_count': False, 'is_uncommon_dot_char_count': False, 'is_email_configured': True, 'is_email_spoofable': False, 'is_dmarc_configured': True, 'is_dmarc_enforced': True, 'is_external_redirect': False, 'is_custom_404_configured': True, 'is_valid_https': True, 'is_ssl_blacklisted': False, 'is_defaced_heuristic': False, 'is_website_popular': True, 'is_domain_recent': 'no', 'is_domain_very_recent': 'no', 'is_heuristic_pattern': False, 'is_free_email': False, 'is_risky_geo_location': False, 'is_china_country': False, 'is_nigeria_country': False}, 'server_details': {'ip': '54.239.28.85', 'hostname': '', 'continent_code': 'NA', 'continent_name': 'North America', 'country_code': 'US', 'country_name': 'United States of America', 'region_name': 'Virginia', 'city_name': 'Ashburn', 'latitude': 39.03947448730469, 'longitude': -77.49180603027344, 'isp': 'Amazon Technologies Inc.', 'asn': 'AS16509'}, 'trust_score': {'result': 100}, 'url_parts': {'scheme': 'https', 'host': 'www.amazon.com', 'host_nowww': 'amazon.com', 'port': None, 'path': '/', 'query': None}, 'web_page': {'title': 'Amazon.com. Spend less. Smile more.', 'description': 'Free shipping on millions of items. Get the best of Shopping and Entertainment with Prime. Enjoy low prices and great deals on the largest selection of everyday essentials and other products, including fashion, home, beauty, electronics, Alexa Devices, sporting goods, toys, automotive, pets, baby, books, video games, musical instruments, office supplies, and more.', 'keywords': 'Amazon, Amazon.com, Books, Online Shopping, Book Store, Magazine, Subscription, Music, CDs, DVDs, Videos, Electronics, Video Games, Computers, Cell Phones, Toys, Games, Apparel, Accessories, Shoes, Jewelry, Watches, Office Products, Sports & Outdoors, Sporting Goods, Baby Products, Health, Personal Care, Beauty, Home, Garden, Bed & Bath, Furniture, Tools, Hardware, Vacuums, Outdoor Living, Automotive Parts, Pet Supplies, Broadband, DSL'}}}, 'credits_remained': 15.43, 'estimated_queries': '18', 'elapsed_time': '2.36', 'success': True}

    response = requests.get(trust)
    parsed = json.loads(response.content)

    #print(parsed["data"]["report"])
    parsed = (parsed["data"]["report"])

    for key, value in parsed.items():
        if key == "trust_score":
            #print("Trust Score", value["result"])
            values.update({"trustScore": value})


def SSLcheck(url):
    APIkey = 'db1ec466f4fe2f87bb914d65ded54ebd73fd7151'
    ssl = 'https://endpoint.apivoid.com/sslinfo/v1/pay-as-you-go/?key=' + APIkey + '&host=' + url
    response = requests.get(ssl)
    parsed = json.loads(response.content)

    # parsed = {'found': True, 'debug_message': '', 'fingerprint': '0c53915b2987436a7dca62ea98bca1a8f013c7d5', 'blacklisted': False, 'valid_peer': True, 'deprecated_issuer': False, 'name_match': True, 'expired': False, 'valid': True, 'details': {'subject': {'name': '/C=US/ST=California/L=San Francisco/O=Cloudflare, Inc./CN=sni.cloudflaressl.com', 'common_name': 'sni.cloudflaressl.com', 'alternative_names': 'DNS:futbin.com, DNS:*.futbin.com, DNS:sni.cloudflaressl.com', 'organization_unit': '', 'organization': 'Cloudflare, Inc.', 'category': '', 'country': 'US', 'street': '', 'postal_code': '', 'state': 'California', 'location': 'San Francisco'}, 'issuer': {'common_name': 'Cloudflare Inc ECC CA-3', 'organization': 'Cloudflare, Inc.', 'country': 'US', 'state': '', 'location': '', 'organization_unit': ''}, 'signature': {'serial': '18487874768970377379187535142030368769', 'serial_hex': '0DE8A29A038894EEB1B87A96084B6001', 'type': 'ecdsa-with-SHA256'}, 'validity': {'days_left': 190, 'valid_from_timestamp': 1655251200, 'valid_to_timestamp': 1686873599, 'valid_from': 'Wed, 15 Jun 2022 00:00:00 GMT', 'valid_to': 'Thu, 15 Jun 2023 23:59:59 GMT'}, 'extensions': {'authority_key_identifier': 'keyid:A5:CE:37:EA:EB:B0:75:0E:94:67:88:B4:45:FA:D9:24:10:87:96:1F\n', 'subject_key_identifier': '42:01:11:F0:4E:A4:E3:57:62:E2:DE:E0:15:DF:E1:CB:81:51:E7:F5', 'key_usage': 'Digital Signature', 'extended_key_usage': 'TLS Web Server Authentication, TLS Web Client Authentication', 'crl_distribution_points': '\nFull Name:\n  URI:http://crl3.digicert.com/CloudflareIncECCCA-3.crl\n\nFull Name:\n  URI:http://crl4.digicert.com/CloudflareIncECCCA-3.crl\n', 'certificate_policies': 'Policy: 2.23.140.1.2.2\n  CPS: http://www.digicert.com/CPS\n', 'authority_info_access': 'OCSP - URI:http://ocsp.digicert.com\nCA Issuers - URI:http://cacerts.digicert.com/CloudflareIncECCCA-3.crt\n', 'basic_constraints': 'CA:FALSE'}}}

    #print(parsed)
    #print(parsed["data"]["certificate"])

    parsed = parsed["data"]["certificate"]

    for key, value in parsed.items():
        # print(key, ":", value)
        if key == "found":
            values.update({"certFound": value})
        elif key == "valid":
            values.update({"certValid": value})


report(inputstr)
googletree(sitename)
ageCheck(url)
domRep(url)
siteTrust(url)
SSLcheck(url)

print(values)

'''
print(values["date"])
print(values["domDetected"])
print(values["trustScore"])
print(values["certFound"])
print(values["certValid"])
print(values["googleTree"])
print(values["transparencyRep"])
'''




