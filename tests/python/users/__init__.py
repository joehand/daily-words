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
        self.assertEqual(len(user),1)

    def test_roles(self):
        roles = Role.objects()
        role = roles.first()
        self.assertEqual(len(roles),1)
        self.assertEqual(role.name,'admin')
        self.assertEqual(role.description,'Administrator')

    def test_user_page(self):
        r = self.get('/user')
        self.assert404(r)

    def test_user_avatar(self):
        #TODO!
        self.assertEqual(True,False)
