# -*- coding: utf-8 -*-
"""
    words.frontend.views
    ~~~~~~~~~

    Frontend for writr for non-authenticated users

    :copyright: (c) 2014 by Joe Hand.
    :license:
"""

from flask import (Blueprint, current_app, flash, g, jsonify,
                    redirect, render_template, request, url_for)

from flask_classy import FlaskView, route


frontend = Blueprint('frontend', __name__, url_prefix='')

class Frontend(FlaskView):
    """ Frontend View Class
    """

    route_base = '/hello'

    @route('/', endpoint='index')
    def index(self):
        """ Index page for non-authenticated users
        """
        return render_template('frontend/index.html')

Frontend.register(frontend)
