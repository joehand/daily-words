# manage.py
import os

from flask import url_for

from flask_assets import ManageAssets
from flask_s3 import create_all
from flask_script import Manager, Shell, Server
from flask_security import MongoEngineUserDatastore
from flask_security.utils import encrypt_password

from words import create_app
from words.config import ProductionConfig, DevelopmentConfig
from words.extensions import db, assets
from words.user import User, Role

if os.environ.get('PRODUCTION'):
    app = create_app(config = ProductionConfig)
else:
    app = create_app()

manager = Manager(app)

@manager.command
def initdb():
    '''Init/reset database.'''
    if not os.environ.get('PRODUCTION'):
        db.connection.drop_database(app.config['MONGODB_DB'])
    user_datastore = MongoEngineUserDatastore(db, User, Role)
    admin = user_datastore.create_role(name='admin', description='Admin User')
    user = user_datastore.create_user(
        email='joe.a.hand@gmail.com',
        password=encrypt_password('password')
    )
    user_datastore.add_role_to_user(user, admin)


@manager.command
def routes():
    import urllib
    output = []
    for rule in app.url_map.iter_rules():
        options = {}
        for arg in rule.arguments:
            options[arg] = "[{0}]".format(arg)
        methods = ','.join(rule.methods)
        url = url_for(rule.endpoint, **options)
        line = urllib.unquote("{:50s} {:20s} {}".format(rule.endpoint, methods, url))
        output.append(line)
    for line in sorted(output):
        print line

def shell_context():
    return dict(app=app)

#runs the app
if __name__ == '__main__':
    manager.add_command('shell', Shell(make_context=shell_context))
    manager.run()
