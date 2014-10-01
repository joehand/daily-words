# -*- coding: utf-8 -*-
"""
    tests.writr
    ~~~~~~~~~~~~~~

    writr tests package
"""
from datetime import date, datetime
import json

from flask import url_for

from . import WritrTestCase
from ..factories import ItemFactory


class ItemAPITestCase(WritrTestCase):
    def _create_fixtures(self):
        super(ItemAPITestCase, self)._create_fixtures()
        self.item = ItemFactory(user_ref=self.user.id)

    def test_item_get_single(self):
        r = self.jget(url_for('writr.ItemAPI:get', id=self.item.id))
        self.assertOkJson(r)
        self.assertIn(str(self.item.id), r.data.decode())

    def test_item_get_all(self):
        for i in range(1,10):
            ItemFactory(user_ref=self.user.id, date=date(2008,1,i))

        r = self.jget(url_for('writr.ItemAPI:index'))
        self.assertOkJson(r)
        self.assertIn(str(self.item.id), r.data.decode())
        items = json.loads(r.data.decode())['items']
        self.assertEquals(len(items), 10)

    def test_item_update(self):
        r = self.jput(url_for('writr.ItemAPI:put', id=self.item.id),
            data={
                'content': 'updated content'
            })
        self.assertOkJson(r)
        self.assertIn('"content": "updated content"', r.data.decode())
