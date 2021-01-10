from splinter import Browser
from bs4 import BeautifulSoup
from webdriver_manager.chrome import ChromeDriverManager
import pandas as pd
import datetime
import time

class ScrapeMars():
    def __init__(self):
        pass

    def init_browser(self):
        executable_path = {'executable_path': ChromeDriverManager().install()}
        browser = Browser('chrome', **executable_path, headless=True)
        return browser


    def scrape_info(self):
        # appending Mongo
        scraped_data = {}
        browser = self.init_browser()

        # Getting NASA News

        url = "https://mars.nasa.gov/news/"
        browser.visit(url)
        time.sleep(1)

        soup = BeautifulSoup(browser.html)
        slide = soup.find("li", {"class": "slide"})
        news_title = slide.find("div", {"class": "content_title"}).text.strip()
        news_p = slide.find("div", {"class": "article_teaser_body"}).text.strip()

        # FEATURED URL

        base = "https://www.jpl.nasa.gov"
        url = f"{base}/spaceimages/?search=&category=Mars"
        browser.visit(url)
        time.sleep(1)

        browser.find_by_id("full_image").click()
        time.sleep(1)

        browser.find_link_by_partial_text("more info").click()
        time.sleep(1)

        soup = BeautifulSoup(browser.html)
        image = soup.find("img", {"class": "main_image"})

        featured_image_url  = base + image["src"]

        # Facts
        url = "https://space-facts.com/mars/"
        browser.visit(url)
        time.sleep(1)

        dfs = pd.read_html(browser.html)
        df = dfs[0]
        df.columns = ["Statistic", "Value"]
        mars_facts = df.to_html(index=False)

        # HEMISPHERE Data

        base = "https://astrogeology.usgs.gov"
        url = f"{base}/search/results?q=hemisphere+enhanced&k1=target&v1=Mars"
        browser.visit(url)
        time.sleep(1)

        soup = BeautifulSoup(browser.html)
        links = soup.find("div", {"class": "results"}).findAll("a", {"class": "itemLink"})

        #filter out non image results
        realLinks = []
        for link in links:
            image = link.find("img")
            if (image):
                realLinks.append(base + link["href"])

        # Looping through each image
        hemisphere_data = []
        for realLink in realLinks:
            browser.visit(realLink)
            time.sleep(1)
            
            soup = BeautifulSoup(browser.html)
            hemi_url = soup.find("ul").find("li").find("a")["href"]
            hemi_title = soup.find("h2", {'class', "title"}).text.split(" Enhanced")[0]
            
            hemisphere_data.append({"title": hemi_title, "url": hemi_url})

        #Quit the browser
        browser.quit()

        #Appending final data
        scraped_data["news_title"] = news_title
        scraped_data["news_p"] = news_p
        scraped_data["featured_image_url"] = featured_image_url
        scraped_data["mars_facts"] = mars_facts
        scraped_data["hemispheres"] = hemisphere_data
        scraped_data["last_updated"] = datetime.datetime.now()

        # Returning results
        return scraped_data
