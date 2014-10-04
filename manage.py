# manage.py
import os
import logging

from flask import url_for

from flask_assets import ManageAssets
from flask_s3 import create_all
from flask_script import Manager, Shell, Server
from flask_security import MongoEngineUserDatastore
from flask_security.utils import encrypt_password

from webassets.script import CommandLineEnvironment

from tests import testjs

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
def jasmine():
    """ Runs server for Jasmine JS tests
        Default URL = http://0.0.0.0:5000/
    """
    testjs.run_server()

@manager.command
def tests():
    """ All teh tests!
    """
    print ("JS tests first")
    os.system('grunt test')
    print ("Now Python tests")
    os.system('python `which nosetests`') # TODO: figure out real nosetest

def _clear_asset_cache():
    print ('clearing asset cache')
    ManageAssets(assets, 'clean')

def _build_assets():
    print ('building assets')
    ManageAssets(assets, '--parse-templates build')

def _build_js():
    print ('grunting js')
    os.system('grunt build')

@manager.command
def upload():
    print ('starting file upload to Amazon S3')
    create_all(app)
    #TODO : erase old css files on s3
    print ('done with file upload')

@manager.command
def build():
    _clear_asset_cache()
    _build_js() # This needs to go first before build assets
    _build_assets()
    #upload()


@manager.command
def initdb():
    '''Init/reset database.'''
    if not os.environ.get('PRODUCTION'):
        db.connection.drop_database(app.config['MONGODB_SETTINGS']['db'])
    user_datastore = MongoEngineUserDatastore(db, User, Role)
    admin = user_datastore.create_role(name='admin', description='Admin User')
    user = user_datastore.create_user(
        email='joe.a.hand@gmail.com',
        password=encrypt_password('password')
    )
    user_datastore.add_role_to_user(user, admin)


@manager.command
def routes():
    """ Prints out all the routes to shell
    """
    import urllib.request, urllib.parse, urllib.error
    output = []
    for rule in app.url_map.iter_rules():
        options = {}
        for arg in rule.arguments:
            options[arg] = "[{0}]".format(arg)
        methods = ','.join(rule.methods)
        url = url_for(rule.endpoint, **options)
        line = urllib.parse.unquote("{:50s} {:20s} {}".format(rule.endpoint, methods, url))
        output.append(line)
    for line in sorted(output):
        print (line)

def shell_context():
    return dict(app=app)

#runs the app
if __name__ == '__main__':
    manager.add_command('shell', Shell(make_context=shell_context))
    manager.add_command('assets', ManageAssets(assets_env=assets))
    manager.run()
