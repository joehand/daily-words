"""
    Runs a server for the Jasmine specRunner

"""

from os.path import abspath, dirname, join
import mimetypes
from flask import Flask, request, make_response, render_template, send_from_directory

test_dir = join(abspath(dirname(__file__)),'js')
app_resources = join(abspath(dirname(__file__)),'..','words','static')

app = Flask(__name__, static_folder=app_resources, template_folder=test_dir)

@app.route('/')
def index():
    return render_template('specRunner.html')

# Custom static data
@app.route('/<path:filename>')
def custom_static(filename):
    return send_from_directory(test_dir, filename)

def run_server():
    app.run(host='0.0.0.0', debug=True, port=8000)

if __name__ == '__main__':
    run_server()
