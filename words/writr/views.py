# -*- coding: utf-8 -*-
"""
    words.writr.view
    ~~~~~~~~~

    Writr views.

    :copyright: (c) 2014 by Joe Hand.
    :license:
"""

from datetime import date, datetime
import json

from flask import (Blueprint, current_app, flash, g, jsonify,
                    redirect, render_template, request, url_for)

from flask_classy import FlaskView, route
from flask_security import current_user, login_required

from .models import Item

writr = Blueprint('writr', __name__, url_prefix='')

class ItemView(FlaskView):
    """ Main Views
        Routes for User-Facing Pages
    """
    route_base = '/'
    decorators = [login_required]

    def before_request(self, name, *args , **kwargs):
        g.today = date.today()

    @route('/', endpoint='dash')
    def index(self):
        """ Dashboard of writr. Must be logged in.
            Returns index template for writr dashboard

            TODO:
            - Will show streak, interesting stats.
            - Big link to write today.
        """
        items = Item.objects(user_ref=current_user.id)
        return render_template('writr/index.html', items=items)

    @route('/write/', endpoint='write')
    @route('/<item_date>/', endpoint='item')
    def get(self, item_date=None):
        """ Writing View
            Returns single item to write/view

            Show current item (today) and make editable
            Or show old item, not editable
        """
        if item_date:
            try:
                item_date = datetime.strptime(item_date, '%d-%b-%Y')
            except:
                flash('Please enter a date in the proper format')
                return redirect(url_for('dash'))
        else:
            item_date = g.today

        item = Item.objects(
                user_ref=current_user.id, date=item_date).first()

        if item is None:
            if item_date == g.today:
                # Create a new item for today
                item = Item(user_ref=current_user.id, date=date.today())
                item.save()
            else:
                flash('No item found for date: %s' %
                        item_date.strftime('%d-%b-%Y'))
                return redirect(url_for('.write'))
        return render_template('writr/item.html', item=item, is_today=item.is_today())


class ItemAPI(FlaskView):
    """ API Views
        All accessed via JS to get/update items
    """
    route_base = '/api/items'
    decorators = [login_required]

    @route('/')
    def index(self):
        """ Get all items for current user
        """
        items = Item.objects(user_ref=current_user.id)
        return jsonify(items=[item.to_dict() for item in items])

    def get(self, id):
        """ Get single item by id
        """
        item = Item.objects(
                user_ref=current_user.id, id=id).first()
        return jsonify(item.to_dict())

    def put(self, id):
        """ Put single item by id
        """
        try:
            item = Item.objects(id=id).first()
            item = item.validate_json(json.loads(request.data))
            item.save()
            return jsonify(item.to_dict())
        except:
            print 'Unexpected error:', sys.exc_info()[0]
            # TODO Make these more helpful
            return jsonify(status='error', error=''), 400


#Register our View Classes on the blueprint
ItemView.register(writr)
ItemAPI.register(writr)
