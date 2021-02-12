# -*- coding: utf-8 -*-
import json, config
from requests_oauthlib import OAuth1Session
import smtplib
from email.mime.text import MIMEText
from email.utils import formatdate
import time
import sys
import urllib
from bs4 import BeautifulSoup

# https://git.heroku.com/islandtvuploadcheck.git

CK = config.CONSUMER_KEY
CS = config.CONSUMER_SECRET
AT = config.ACCESS_TOKEN
ATS = config.ACCESS_TOKEN_SECRET
twitter = OAuth1Session(CK, CS, AT, ATS)

def tweet(msg):
	url = "https://api.twitter.com/1.1/statuses/update.json"
	params = {"status" : msg}

	res = twitter.post(url, params = params) #post

	if res.status_code == 200: #OK
		print("Success.")
	else: #Error
		print("Failed. : %d"% res.status_code)

print sys.stdout.encoding
#print u"日本語"

url = "https://j-island.net/artist/person/id/"

lastId = 0
beforeLast = 0
idList = []
personId = 1

for i in range(1): 
	#9over is uploaded
	akirame = 0
	if i != 0:
		personId = lastId - 10
	else:
		personId = lastId
		
	while akirame < 60:
		#print u"check time is " + str(i) + ". movieId is " + str(movieId) + ". akirame is " + str(akirame)
		personUrl = url + str(personId)
		try:
			html = urllib.urlopen(personUrl) 
			soup = BeautifulSoup(html)
		except:
			personId += 1
			pass
		pageTitle = "ISLAND TV"
		if soup.find("title") is None:
			pass
		else:
			pageTitle = soup.find("title").text.encode('utf-8')
	
		if pageTitle != "ISLAND TV":
			#personName = soup.find("h1", attrs={'class': 'artist-hero__name'}).text.encode('utf-8')
			personName = pageTitle.split(" ")[0]
			dict = {}
			
			if personId in idList:
				print str("True because old person id is " + str(personId))
				lastId = personId
				pass
			else:
				print str("False because new person id is " + str(personId))
				print str(personId) + ":" + str(personName) + ":"  + pageTitle + ":" + personUrl
				personMovieURLs = soup.find_all("li", attrs={'class': 'l-thumb-list__list'})
				#print str(personMovieURLs)
				URLs = ["name"]
				Titles = [personName]
				for i in personMovieURLs:
					personMovieURL = "https://j-island.net" +  i.find("a").get('href')
					personMovieTitle = i.find("span", {'class': 'l-thumb-list__title'}).text.encode('utf-8');
					print str(personMovieTitle) + ": " + str(personMovieURL)
					URLs.append(personMovieURL);
					Titles.append(personMovieTitle);
				idList.append(personId)
				lastId = personId
				dict.update(zip(URLs, Titles))
			f = open('public/JSON/' + str(personId) + '.json', 'w')
			json.dump(dict, f, ensure_ascii=False)
		else:
			akirame += 1
			pass
	
		personId += 1
		time.sleep(1)
	
	if beforeLast != lastId:
		beforeLast = lastId
	else:
		pass
	print u"end of check. time is " + str(i) + ". Last Id is " + str(lastId)
	if i != 0:
		time.sleep(20)
	
print u"Ploglam is over. Please run one time."