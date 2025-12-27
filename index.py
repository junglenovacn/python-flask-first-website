from flask import Flask, render_template
import requests
import json
from datetime import datetime

app = Flask(__name__)

# Creating simple Routes 
@app.route('/test')
def test():
    return "Home Page"

@app.route('/test/about/')
def about_test():
    return "About Page"

# Routes to Render Something
@app.route('/')
def home():
    return render_template("home.html")

@app.route('/about', strict_slashes=False)
def about():
    return render_template("about.html")

@app.route('/weather-clock', strict_slashes=False)
def weather_clock():
    # Get user's IP-based location (simplified approach)
    try:
        # Get user's IP location
        ip_response = requests.get('http://ip-api.com/json/')
        location_data = ip_response.json()
        
        if location_data['status'] == 'success':
            city = location_data['city']
            lat = location_data['lat']
            lon = location_data['lon']
            
            # Get weather data using OpenWeatherMap API (free tier)
            # Using a demo API key - in production, use environment variables
            weather_api_key = "demo_key"
            weather_url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={weather_api_key}&units=metric&lang=zh_cn"
            
            try:
                weather_response = requests.get(weather_url)
                weather_data = weather_response.json()
                
                if weather_response.status_code == 200:
                    weather_info = {
                        'temperature': round(weather_data['main']['temp']),
                        'description': weather_data['weather'][0]['description'],
                        'humidity': weather_data['main']['humidity'],
                        'wind_speed': weather_data['wind']['speed'],
                        'city': city
                    }
                else:
                    # Fallback weather data if API limit reached
                    weather_info = {
                        'temperature': 22,
                        'description': '晴朗',
                        'humidity': 65,
                        'wind_speed': 3.5,
                        'city': city
                    }
            except:
                # Fallback weather data if API fails
                weather_info = {
                    'temperature': 22,
                    'description': '晴朗',
                    'humidity': 65,
                    'wind_speed': 3.5,
                    'city': city
                }
        else:
            # Fallback location and weather
            weather_info = {
                'temperature': 22,
                'description': '晴朗',
                'humidity': 65,
                'wind_speed': 3.5,
                'city': '北京'
            }
    except:
        # Fallback data if location detection fails
        weather_info = {
            'temperature': 22,
            'description': '晴朗',
            'humidity': 65,
            'wind_speed': 3.5,
            'city': '北京'
        }
    
    # Get current time
    current_time = datetime.now()
    
    return render_template("weather_clock.html", 
                         weather=weather_info, 
                         current_time=current_time)

# Make sure this we are executing this file
if __name__ == '__main__':
    app.run(debug=True)
