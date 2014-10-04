# -*- coding: utf-8 -*-
"""
    words.writr.models
    ~~~~~~~~~

    Writr models.

    :copyright: (c) 2014 by Joe Hand.
    :license:
"""

from datetime import datetime, date, timezone
import json
import re
from functools import wraps

import bleach
import pytz

from ..extensions import db
from ..user import User


def localize(tz, dt):
    dt = dt.replace(tzinfo=pytz.utc) #TODO: this is a hack. Should be created with tzinfo.
    return dt.astimezone(pytz.timezone(tz))


class Item(db.Document):
    """ This is the main model.
        Keeps track of the words (content), date, start/end times, and user.
    """
    user_ref = db.ReferenceField(User)
    content = db.StringField()
    date = db.DateTimeField(required=True, unique_with='user_ref',
                                default=datetime.now(timezone.utc)
                                    .replace(tzinfo=pytz.utc)
                                    .replace(hour=0, minute=0, second=0, microsecond=0)
                            )
    start_time = db.DateTimeField(required=True,
                                    default=datetime.now(timezone.utc)
                                        .replace(tzinfo=pytz.utc)
                                )
    last_update = db.DateTimeField(required=True,
                                    default=datetime.now(timezone.utc)
                                        .replace(tzinfo=pytz.utc)
                                )

    # List of dicts containing change in words & time
    #    {word_delta:int, time_delta:int}
    typing_speed = db.ListField(db.DictField(), default = [])

    meta = {
            'ordering': ['-date']
            }

    @property
    def tz(self):
        settings = Settings.objects(user_ref=self.user_ref).first()
        if not settings:
            settings = Settings(user_ref=self.user_ref)
            settings.save()
        return settings['tz']

    @property
    def word_goal(self):
        settings = Settings.objects(user_ref=self.user_ref).first()
        if not settings:
            settings = Settings(user_ref=self.user_ref)
            settings.save()
        return settings['word_goal']

    @property
    def word_count(self):
        """ Returns number of words in item's content
            TODO: Does this match count I am doing on JS side for typing_speed?
        """
        regex = '/\s+/gi'
        if self.content:
            content = self.content.strip().replace('<br\s*[\/]?>', ' ')
            words = re.sub(regex, ' ', content).split()
            words = [word for word in words if re.match('[\w]+', word) is not None]
            return len(words)
        return 0

    @property
    def local_start_time(self):
        return localize(self.tz, self.start_time)

    @property
    def local_last_update(self):
        return localize(self.tz, self.last_update)

    @property
    def item_date(self):
        """ Shortcut to a date object (instead of datetime)
        """
        return self.date.date()

    @property
    def is_today(self):
        """ Check if this model is today's model
            Returns True if is today
        """
        try:
            # TODO: this may fail if item was just created, why?
            return self.item_date == datetime.utcnow().replace(tzinfo = pytz.utc).date()
        except:
            return self.date == datetime.utcnow().replace(tzinfo = pytz.utc).date()

    @property
    def reached_goal(self):
        """ Returns True/False on whether word count >= 750
            TODO: Make goal adjustable
        """
        return self.word_count >= self.word_goal

    @property
    def writing_time(self):
        """ Returns total writing time based on start and last update
        """
        return self.last_update - self.start_time

    def clean(self):
        """ Runs on each save

            Currently:
             - Updates last_update time to now
        """
        self.last_update = datetime.now(timezone.utc).replace(tzinfo=pytz.utc)

    def validate_json(self, inputJSON):
        """ Validates & cleans json from API before save
            Returns cleaned up JSON

            Validations/Cleans:
             - Update datetime from JS to Python
        """
        for key, val in inputJSON.items():
            if key in ['last_update']:
                try:
                    # divide by 1000 because JS timestamp is in ms
                    # http://stackoverflow.com/questions/10286224/javascript-timestamp-to-python-datetime-conversion
                    val = datetime.utcfromtimestamp(val/1000.0).replace(tzinfo=pytz.utc)
                except:
                    continue
            elif key == 'content' and val != None and val != 'None':
                val = bleach.clean(bleach.linkify(val.replace('<br>', '\n')))
                val = val.replace('\n','<br>') # TODO: Bleach should be able to keep these
                self[key] = val
            elif key == 'typing_speed' and len(val):
                self[key] = val
            else:
                continue
        return self

    def to_dict(self):
        """ MongoDB Object to Dict Object
            Returns dict of model

            TODO: Do I need this? Or just use the one in utils?
        """
        data = json.loads(self.to_json())
        data.pop('_cls', None)
        for key, val in data.items():
            if key == 'user_ref':
                data[key] = str(self[key].id)
            elif key == '_id':
                data[key] = str(self.id)
            elif key in ['date','start_time','last_update']:
                data[key] = self[key].isoformat()
            else:
                data[key] = self[key]
        return data

class Settings(db.Document):
    user_ref = db.ReferenceField(User, unique=True)
    word_goal = db.IntField(default=750)
    tz = db.StringField(default='US/Mountain')
