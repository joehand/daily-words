# -*- coding: utf-8 -*-
"""
    writr.user.view
    ~~~~~~~~~

    User view. Nothing to see here. YET!!!! (TODO)

    :copyright: (c) 2014 by Joe Hand.
    :license:
"""

from flask import (Blueprint, abort)

from flask_security import login_required

from .models import User


user = Blueprint('user', __name__, url_prefix='/user')


@login_required
@user.route('/')
def index():
    return abort(404)
