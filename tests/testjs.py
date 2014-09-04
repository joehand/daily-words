# -*- coding: utf-8 -*-
"""
    words.tests.testjs
    ~~~~~~~~~

    Runs server for Jasmine specRunner.html.

    :copyright: (c) 2014 by Joe Hand.
    :license:
"""

from os.path import abspath, dirname, join
import mimetypes

from flask import (Flask, request, make_response, render_template,
                    send_from_directory)

# Testing Directory, where templates/specs will be
TEST_DIR = join(abspath(dirname(__file__)),'js')

# Static dir for writr.app
APP_STATIC = join(abspath(dirname(__file__)),'..','words','static')

app = Flask(__name__, static_folder=APP_STATIC, template_folder=TEST_DIR)

@app.route('/')
def index():
    """ Main specRunner template
    """
    return render_template('specRunner.html')

@app.route('/<path:filename>')
def custom_static(filename):
    """ Sends spec js files.
        Easy url_for access: url_for('custom_static', filename=file)
    """
    return send_from_directory(TEST_DIR, filename)

def run_server():
    """ Runs our server to access specRunner page.
    """
    app.run(host='0.0.0.0', debug=True, port=8000)

if __name__ == '__main__':
    run_server()
