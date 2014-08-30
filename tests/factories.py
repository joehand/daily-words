# -*- coding: utf-8 -*-
"""
    tests.factories
    ~~~~~~~~~~~~~~~

    Overholt test factories module
"""

from datetime import datetime

from factory import Factory, Sequence, LazyAttribute
from factory.mongoengine import MongoEngineFactory

from flask_security import MongoEngineUserDatastore
from flask_security.utils import encrypt_password

from words.extensions import db
from words.user import User, Role


ds = MongoEngineUserDatastore(db, User, Role)

class RoleFactory(Factory):
    class Meta:
        model = Role

    name = 'admin'
    description = 'Administrator'

    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        role = model_class(*args, **kwargs)
        role = ds.create_role(
                    name=role.name,
                    description=role.description
                )
        return role


class UserFactory(Factory):
    class Meta:
        model = User

    email = Sequence(lambda n: 'user{0}@test.com'.format(n))
    password = LazyAttribute(lambda a: encrypt_password('password'))
    last_login_at = datetime.utcnow()
    current_login_at = datetime.utcnow()
    last_login_ip = '127.0.0.1'
    current_login_ip = '127.0.0.1'
    login_count = 1
    roles = []
    active = True

    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        user = model_class(*args, **kwargs)
        user = ds.create_user(
                    email=user.email,
                    password=user.password
                )
        if len(user.roles) > 0:
            for role in user.roles:
                ds.add_role_to_user(user, user.role)
        return user
