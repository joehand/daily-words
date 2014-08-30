from flask_assets import Environment
assets = Environment()

from flask_mail import Mail
mail = Mail()

from flask_misaka import Misaka
md = Misaka()

from flask_mongoengine import MongoEngine
db = MongoEngine()

from flask_s3 import FlaskS3
s3 = FlaskS3()

from flask_security import Security
security = Security()
