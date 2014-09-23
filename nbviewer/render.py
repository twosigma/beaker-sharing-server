#-----------------------------------------------------------------------------
#  Copyright (C) 2013 The IPython Development Team
#
#  Distributed under the terms of the BSD License.  The full license is in
#  the file COPYING, distributed as part of this software.
#-----------------------------------------------------------------------------

from tornado.log import app_log
import json


#-----------------------------------------------------------------------------
# 
#-----------------------------------------------------------------------------

class NbFormatError(Exception):
    pass

def render_notebook(exporter, json_as_string, url=None, forced_theme=None):
    app_log.info("rendering %d B notebook from %s", len(json_as_string), url)

    try:
        share_as_object = json.loads(json_as_string)
    except ValueError:
        raise SyntaxError("Notebook does not appear to be JSON: %r" % json_as_string[:16])

    template = None
    if share_as_object.get('notebookModel') and share_as_object.get('cellModel'):
        template = 'beaker_section.html'
    elif share_as_object.get('notebookModel'):
        template = 'beaker_notebook.html'
    elif share_as_object.get('cellModel'):
        template = 'beaker_cell.html'
    elif share_as_object.get('beaker'):
        template = 'v2/beaker_notebook.html'

    name = 'Beaker Notebook'

    config = {
            'download_name': name,
            'css_theme': None,
            'template': template
            }
    return json_as_string, config
