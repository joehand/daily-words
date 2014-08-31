from datetime import datetime, date
import json
import re

from ..extensions import db
from ..user import User
from ..utils import mongo_to_dict

WORDS_TYPED_INTERVAL = 10000 #milliseconds

class Item(db.Document):
    """ This is the main model.
        Keeps track of the words (content), date, start/end times, and user.
    """
    user_ref = db.ReferenceField(User)
    content = db.StringField()
    date = db.DateTimeField(default=date.today(), required=True, unique_with='user_ref')
    start_time = db.DateTimeField(default=datetime.utcnow(), required=True)
    end_time = db.DateTimeField() # recorded when goal is met
    last_update = db.DateTimeField(default=datetime.utcnow(), required=True)

    # List of number of words typed every 10 seconds
    # TODO: IS this the best way to track? Or should I track time per interval of words
    # Used this because this will be easier in JS to check word count every 10 sec
    words_typed = db.ListField(default = [])
    # Time Interval for list above (ms)
    words_typed_interval = db.IntField(default=WORDS_TYPED_INTERVAL)


    meta = {
            'ordering': ['-date']
            }

    def clean(self):
        """ Runs on each save()
        """
        self.last_update = datetime.utcnow() #Refresh last update timestamp

    def word_count(self):
        """ Counts the words in item's content!
        """
        if self.content:
            words = re.findall('\w+', self.content, flags=re.I)
            return len(words)
        return 0

    def is_today(self):
        """ Check if this model is today's model
            Returns True if is today
        """
        return self.date.date() == date.today()

    def validate_json(self, inputJSON):
        for key, val in inputJSON.items():
            if key in ['content', 'end_time']:
                if key == 'end_time':
                    try:
                        val = datetime.utcfromtimestamp(val/1000.0)
                    except:
                        continue
                    # divide by 1000 because JS timestamp is in ms
                    # http://stackoverflow.com/questions/10286224/javascript-timestamp-to-python-datetime-conversion
                if val != None and val != 'None':
                    self[key] = val
            else:
                continue
        return self


    def to_dict(self):
        data = json.loads(self.to_json())
        data.pop('_id', None)
        data.pop('_cls', None)
        data['id'] = str(self.id)
        data['user_ref'] = str(self.user_ref.id)
        data['date'] = str(self.date)
        data['start_time'] = str(self.start_time)
        data['end_time'] = str(self.end_time)
        data['last_update'] = str(self.last_update)
        return data
