# -*- coding: utf-8 -*-
"""
    writr.extensions
    ~~~~~~~~~

    Extensions file for writr app

    :copyright: (c) 2014 by Joe Hand.
    :license:
"""
from flask_assets import Environment
assets = Environment()

from flask_mongoengine import MongoEngine
db = MongoEngine()

from flask_security import Security
security = Security()
