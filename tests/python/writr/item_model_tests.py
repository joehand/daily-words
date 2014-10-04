# -*- coding: utf-8 -*-
"""
    tests.writr
    ~~~~~~~~~~~~~~

    writr tests package
"""
from datetime import date, datetime

import pytz

from . import WritrTestCase
from ..factories import ItemFactory

from words.writr import Item


class ItemModelTestCase(WritrTestCase):
    def _create_fixtures(self):
        super(ItemModelTestCase, self)._create_fixtures()
        self.item = ItemFactory(user_ref=self.user.id)

    def test_item_created(self):
        item = Item.objects()
        self.assertEqual(len(item),1)

    def test_item_date(self):
        item = Item.objects().first()
        self.assertEqual(item.item_date,date.today())

    def test_item_istoday(self):
        item = Item.objects().first()
        self.assertTrue(item.is_today)

    def test_item_wordcount(self):
        item = Item.objects().first()
        self.assertEqual(item.word_count, 100)

    def test_item_last_update(self):
        item = Item.objects().first()
        item.content = 'joe'
        item.save()
        delta = datetime.now().replace(tzinfo=pytz.utc) - item.last_update
        self.assertAlmostEqual(delta.total_seconds(), 0, places=2)
