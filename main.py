# -*- coding: utf-8 -*-
import json, config
import time
import sys
import urllib
from bs4 import BeautifulSoup

#https://git.heroku.com/islandtvsearch.git

print sys.stdout.encoding
#print u"日本語"

url = "https://j-island.net/movie/play/id/"

#lastId = 0
lastId = 8526
beforeLast = 0
idList = []
#movieId = 1
movieId = 8526

for i in range(1): 
	#9over is uploaded
	akirame = 0
	movieList = []

	#f = open('public/JSON/mvlist.json', 'w')
	f = open('public/JSON/newmovie.json', 'w')


	if i != 0:
		movieId = lastId - 10
	else:
		movieId = lastId
		
	#while akirame < 300:
	while akirame < 20:
		#print u"check time is " + str(i) + ". movieId is " + str(movieId) + ". akirame is " + str(akirame)
		movieUrl = url + str(movieId)
		try:
			html = urllib.urlopen(movieUrl) 
			soup = BeautifulSoup(html)
		except:
			movieId += 1
			pass
		pageTitle = "ISLAND TV"
		if soup.find("title") is None:
			pass
		else:
			pageTitle = soup.find("title").text.encode('utf-8')
	
		if pageTitle != "ISLAND TV":
    			#movieplay-infomation__title movieplay-infomation__title-title
			movieTitle = soup.find("h1", attrs={'class': 'movieplay-infomation__title-title'}).text.encode('utf-8')
			movieDate = soup.find("span", attrs={'class': 'movieplay-infomation__title-date'}).text.encode('utf-8')
			movieDescription = soup.find("dd", attrs={'class': 'movieplay-infomation__text'}).text.encode('utf-8')
			if soup.find("dl", attrs={'class': 'movieplay-detail'}) is not None:
				moviePerson = soup.find("dl", attrs={'class': 'movieplay-detail'}).find("dd").text.encode('utf-8')
			else:
				moviePerson = ""

			if movieId in idList:
				print str("True because old movie id is " + str(movieId))
				lastId = movieId
				pass
			else:
				print str("False because new movie id is " + str(movieId) + ". akirame is " + str(akirame))
				#print str(movieId) + ":" + str(movieTitle) + ":" + movieUrl + ":" + str(moviePerson)
				movieDict = { "movieId": movieId, 
					"movieTitle": movieTitle,
					"movieURL": movieUrl,
					"moviePerson": moviePerson,
					"movieDate": movieDate,
					"movieDescription": movieDescription }
				print str(movieDict)
				idList.append(movieId)
				movieList.append(movieDict)
				lastId = movieId
		else:
			akirame += 1
			pass
	
		movieId += 1
		if movieId % 2 == 0:
			time.sleep(1)
	
	
	json.dump(movieList, f, ensure_ascii=False,indent=2)
	if beforeLast != lastId:
		beforeLast = lastId
	else:
		pass
	print u"end of check. time is " + str(i) + ". Last Id is " + str(lastId)
	if i != 0:
		time.sleep(60)
	
print u"Ploglam is over. Please run one time."