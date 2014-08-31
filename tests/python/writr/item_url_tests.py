# -*- coding: utf-8 -*-
"""
    tests.writr
    ~~~~~~~~~~~~~~

    writr tests package
"""
from datetime import date, datetime

from flask import url_for

from . import WritrTestCase
from ..factories import ItemFactory

from words.writr import Item


class ItemUrlTestCase(WritrTestCase):
    def _create_fixtures(self):
        super(ItemUrlTestCase, self)._create_fixtures()
        self.item = ItemFactory(user_ref=self.user.id)

    def test_item_today(self):
        r = self.get(url_for('writr.write'))
        self.assertOk(r)
        self.assertIn(date.today().strftime('%d %b %Y'), r.data)

    def test_item_nonexistent(self):
        r = self.get(url_for('writr.item', item_date='01-Jan-2008'))
        self.assertOk(r)
        self.assertIn('No item found for date', r.data)
        self.assertIn(date.today().strftime('%d %b %Y'), r.data)

    def test_item_old(self):
        self.item_old = ItemFactory(user_ref=self.user.id, date=date(2008,01,01))
        r = self.get(url_for('writr.item', item_date='01-Jan-2008'))
        self.assertOk(r)
        self.assertIn('01 Jan 2008', r.data)
