# -*- coding: utf-8 -*-
"""
    tests
    ~~~~~

    tests package

    thanks to https://github.com/mattupstate/overholt for the framework
"""

import sys
import os
sys.path.insert(0, os.path.abspath('..'))

from flask_testing import FlaskClient

from flask_fillin import FormWrapper
from flask_testing import TestCase
from flask_security import MongoEngineUserDatastore

from words.extensions import db
from words.user import User, Role

from .factories import UserFactory, RoleFactory
from .utils import FlaskTestCaseMixin


class BaseTestCase(TestCase):
    pass


class AppTestCase(FlaskTestCaseMixin, BaseTestCase):

    def create_app(self):
        raise NotImplementedError

    def _create_fixtures(self):
        db.connection.drop_database(self.db_name)
        role = RoleFactory()
        self.user = UserFactory(roles=[role])

    def setUp(self):
        self.db_name = 'testing'

        super(AppTestCase, self).setUp()
        self.app = self.create_app()
        self.client = FlaskClient(self.app, response_wrapper=FormWrapper)
        self.app_context = self.app.app_context()
        self.app_context.push()
        self._create_fixtures()

    def tearDown(self):
        super(AppTestCase, self).tearDown()
        db.connection.drop_database(self.db_name)
        self.app_context.pop()

    def _login(self, email=None, password=None):
        r = self.get('/login')
        if len(r.forms):
            self.csrf_token = r.form.fields['csrf_token']
        email = email or self.user.email
        password = password or 'password'
        return self.post('/login', data={'email': email, 'password': password},
                         follow_redirects=True)

    def _logout(self):
        return self.get('/logout', follow_redirects=True)


if __name__ == '__main__':
    unittest.main()
