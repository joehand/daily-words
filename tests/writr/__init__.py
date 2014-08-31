# -*- coding: utf-8 -*-
"""
    tests.writr
    ~~~~~~~~~~~~~~

    writr tests package
"""

from words import create_app

from .. import AppTestCase, config

class WritrTestCase(AppTestCase):

    def create_app(self):
        return create_app(config=config.TestingConfig)

    def setUp(self):
        super(WritrTestCase, self).setUp()
        self._login()
