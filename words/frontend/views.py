
from flask import (Blueprint, current_app, flash, g, jsonify,
                    redirect, render_template, request, url_for)

from flask_classy import FlaskView, route


frontend = Blueprint('frontend', __name__, url_prefix='/')

class Frontend(FlaskView):
    '''  '''

    route_base = '/'

    @route('/', endpoint='index')
    def index(self):
        ''' '''
        return render_template('frontend/index.html')

#Register our View Class
Frontend.register(frontend)
