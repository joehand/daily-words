# -*- coding: utf-8 -*-
"""
    tests.settings
    ~~~~~~~~~~~~~~

    tests settings module
"""

from words.config import Config


class TestingConfig(Config):

    TESTING = True
    LOGIN_DISABLED = False # UGH why do I have to set this!?!

    MONGODB_DB = 'testing'
    MONGODB_HOST = 'localhost'
    MONGODB_PORT = 27017

    SECURITY_PASSWORD_SALT = '/2aX16zPnnIgfMwkOjGX4S'
