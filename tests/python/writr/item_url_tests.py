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
        self.assertIn(date.today().strftime('%d %b %Y'), r.data.decode())

    def test_item_old(self):
        OLD_DATE = date(2008,1,1)
        self.item_old = ItemFactory(user_ref=self.user.id, date=OLD_DATE)
        r = self.get(url_for('writr.item', date=OLD_DATE.strftime('%d-%b-%Y')))
        self.assertOk(r)
        self.assertIn('01 Jan 2008', r.data.decode())

    def test_item_nonexistent(self):
        item = Item.objects().first()
        url = url_for('writr.item', date=item.date.strftime('%d-%b-%Y'))
        url = url.replace(item.date.strftime('%Y'), '2013')
        r = self.get(url)
        self.assertOk(r)
        self.assertIn('No item found for date', r.data.decode())
        self.assertIn(date.today().strftime('%d %b %Y'), r.data.decode())
