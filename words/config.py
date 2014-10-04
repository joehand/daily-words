# -*- coding: utf-8 -*-
"""
    words.config
    ~~~~~~~~~

    Config file for words app (dev and production)

    :copyright: (c) 2014 by Joe Hand.
    :license:
"""

import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):

    PROJECT = 'words'

    # Get project and app root path
    PROJECT_ROOT = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    APP_ROOT = os.path.abspath(os.path.dirname(__file__))

    DEBUG = True
    PRODUCTION = False

    SECRET_KEY = 'this_is_so_secret' #used for development, reset in prod

    # Flask Security Config
    SECURITY_TRACKABLE = True
    SECURITY_CHANGEABLE = True
    SECURITY_PASSWORD_HASH = 'bcrypt'
    SECURITY_PASSWORD_SALT = '/2aX16zPnnIgfMwkOjGX4S'

    # Flask Assets Config
    ASSETS_MANIFEST = 'file:%s' % 'webcache'

    # Flask S3 Config
    S3_BUCKET_NAME = 'joehand_words'
    S3_CDN_DOMAIN = 'd2hqsc0ciw0ikl.cloudfront.net'
    S3_HEADERS = {'Cache-Control': str('public, max-age=15552000')}
    S3_ONLY_MODIFIED = True

class ProductionConfig(Config):

    DEBUG = False
    PRODUCTION = True

    SECRET_KEY = os.environ.get('SECRET_KEY')

    # Flask Security Config
    SECURITY_PASSWORD_SALT = os.environ.get('SECURITY_PASSWORD_SALT')

    # Flask Assets Config
    ASSETS_AUTO_BUILD = False
    FLASK_ASSETS_USE_S3 = True

    #MongoDB Config
    MONGODB_DATABASE = os.environ.get('MONGODB_DATABASE')
    MONGODB_HOST = os.environ.get('MONGODB_URL')
    MONGODB_USERNAME = os.environ.get('MONGODB_USERNAME')
    MONGODB_PASSWORD = os.environ.get('MONGODB_PASSWORD')
    MONGODB_PORT = os.environ.get('MONGODB_PORT')
    MONGODB_TZ_AWARE = True

    # Flask S3 Config
    AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')

class DevelopmentConfig(Config):

    # MongoDB Config
    MONGODB_SETTINGS = {
        'db': 'words_db2',
        'host':'localhost',
        'port':27017,
        'tz_aware':True
    }
