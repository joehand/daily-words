from datetime import date, datetime

from flask import (Blueprint, current_app, flash, g, jsonify,
                    redirect, render_template, request, url_for)

from flask_classy import FlaskView, route
from flask_security import current_user, login_required

from .models import Item

writr = Blueprint('writr', __name__, url_prefix='')

class ItemView(FlaskView):
    """ Main Views
    """
    route_base = '/'
    decorators = [login_required]

    def before_request(self, name, *args , **kwargs):
        g.today = date.today()

    @route('/', endpoint='dash')
    def index(self):
        """ Dashboard of writr. Must be logged in.
            Will show streak, interesting stats.
            Big link to write today.
        """
        flash('Logged In')
        return render_template('writr/index.html')

    @route('/write/', endpoint='write')
    @route('/<item_date>/', endpoint='item')
    def get(self, item_date=None):
        """ Writing View
            Show current item (today) and make editable
            Or show old item, not editable
        """
        item_date = datetime.strptime(item_date, '%d-%b-%Y') if item_date else g.today

        item = Item.objects(
                user_ref=current_user.id, date=item_date).first()

        if item is None:
            if item_date == g.today:
                # Create a new item for today
                item = Item(user_ref=current_user.id, date=g.today)
                item.save()
            else:
                flash('No item found for date: %s' %
                        item_date.strftime('%d-%b-%Y'))
                return redirect(url_for('.write'))
        return render_template('writr/item.html', item=item, is_today=item.is_today())


#Register our View Class
ItemView.register(writr)
