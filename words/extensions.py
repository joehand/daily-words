# -*- coding: utf-8 -*-
"""
    words.extensions
    ~~~~~~~~~

    Extensions file for writr app

    :copyright: (c) 2014 by Joe Hand.
    :license:
"""
from flask_assets import Environment
assets = Environment()

from flask_mongoengine import MongoEngine
db = MongoEngine()

from flask_s3 import FlaskS3
s3 = FlaskS3()

from flask_security import Security
security = Security()
