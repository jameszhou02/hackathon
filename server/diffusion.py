import sys
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from google.cloud import storage
from google.cloud.storage import Blob
storage_client = storage.Client()

config = {
    "apiKey": "AIzaSyCisXDPRsqLxT8hR3wWi3S0Db0YUc9zzaw",
    "authDomain": "hackathon-8e9ac.firebaseapp.com",
    "projectId": "hackathon-8e9ac",
    "storageBucket": "hackathon-8e9ac.appspot.com",
    "messagingSenderId": "423832736018",
    "appId": "1:423832736018:web:ed9fbca5fbd8a157c8a3cb",
}

firebase = pyrebase.initialize_app(config)
storage = firebase.storage()

path_on_cloud = "videos/"
storage.child("videos/").download("videos/")
