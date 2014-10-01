# -*- coding: utf-8 -*-
"""
    tests.api.user_tests
    ~~~~~~~~~~~~~~~~~~~~

    api user tests module
"""

from . import FrontendTestCase


class UrlTestCase(FrontendTestCase):

    def test_authenticated_index(self):
        self._login()
        r = self.get('/')
        self.assertOk(r)
        self.assertIn('Logout', r.data.decode())

    def test_unauthenticated_index(self):
        self._logout()
        r = self.get('/')
        self.assertOk(r)
        self.assertNotIn('Logout', r.data.decode())

    def test_login_page(self):
        self._logout()
        r = self.get('/login')
        self.assertOk(r)
        self.assertIn('Login', r.data.decode())

    def test_login_flow(self):
        r = self._login()
        self.assertOk(r)
        self.assertIn('Logout', r.data.decode())

    def test_logout(self):
        r = self.get('/logout', follow_redirects=True)
        self.assertOk(r)
        self.assertIn('Login', r.data.decode())
        r = self.get('/')
        self.assertOk(r)
        self.assertNotIn('Logout', r.data.decode())

    def test_incorrect_login(self):
        self._logout()
        r = self._login(email='asdf')
        self.assertOk(r)
        self.assertIn('Specified user does not exist', r.data.decode())
        self.assertNotIn('Logout', r.data.decode())
        r = self._login(password='asdf')
        self.assertOk(r)
        self.assertIn('Invalid password', r.data.decode())
        self.assertNotIn('Logout', r.data.decode())
