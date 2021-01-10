from flask import Flask, render_template, redirect
import pymongo
from scrape_mars import ScrapeMars

#Flask app and class
app = Flask(__name__)
scrapeMars = ScrapeMars()

#Mongo connection
conn = 'mongodb://localhost:27017'
##################################
client = pymongo.MongoClient(conn)

#Connecting to database
db = client.mars_app

# Route to render index.html file
@app.route("/")
def home():

    # Find one record of data from the mongo database
    mars_data = db.mars_data.find_one()

    # Return template and data
    return render_template("index.html", mars=mars_data)


# Starting scrape function
@app.route("/scrape")
def scrape():
    #Scrape dat data
    scraped_data = scrapeMars.scrape_info()
    #Update dat database
    db.mars_data.update({}, scraped_data, upsert=True)
    return redirect("/", code=302)


if __name__ == "__main__":
    app.run(debug=True)
