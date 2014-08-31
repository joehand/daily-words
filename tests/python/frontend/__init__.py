# -*- coding: utf-8 -*-
"""
    tests.frontend
    ~~~~~~~~~~~~~~

    frontend tests package
"""
import mongoengine

from words import create_app

from .. import AppTestCase, config


class FrontendTestCase(AppTestCase):

    def create_app(self):
        return create_app(config=config.TestingConfig)

    def setUp(self):
        super(FrontendTestCase, self).setUp()
        self._login()

    def test_create_app(self):
        assert self.app.config['TESTING']
        assert mongoengine.connection.get_db().name == 'testing'
