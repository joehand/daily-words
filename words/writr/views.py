
from flask import (Blueprint, current_app, flash, g, jsonify,
                    redirect, render_template, request, url_for)

from flask_classy import FlaskView, route
from flask_security import current_user, login_required


writr = Blueprint('writr', __name__, url_prefix='/')

class Writr(FlaskView):
    """ Main Views
    """
    route_base = '/'
    decorators = [login_required]


    @route('/', endpoint='dash')
    def index(self):
        """ Dashboard of writr. Must be logged in.
            Will show streak, interesting stats.
            Big link to write today.
        """
        flash('Logged In')
        return render_template('writr/index.html')



#Register our View Class
Writr.register(writr)
