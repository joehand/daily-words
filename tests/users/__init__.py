# -*- coding: utf-8 -*-
"""
    tests.users
    ~~~~~~~~~~~~~~

    users tests package
"""
from words import create_app
from words.user import User, Role

from .. import AppTestCase, config


class UserTestCase(AppTestCase):

    def create_app(self):
        return create_app(config=config.TestingConfig)

    def setUp(self):
        super(UserTestCase, self).setUp()
        self._login()

    def test_user_created(self):
        user = User.objects()
        assert len(user) == 1

    def test_roles(self):
        roles = Role.objects()
        role = roles.first()
        assert len(roles) == 1
        assert role.name == 'admin'
        assert role.description == 'Administrator'

    def test_user_page(self):
        r = self.get('/user')
        self.assert404(r)
