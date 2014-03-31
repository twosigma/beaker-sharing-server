#-----------------------------------------------------------------------------
#  Copyright (C) 2013 The IPython Development Team
#
#  Distributed under the terms of the BSD License.  The full license is in
#  the file COPYING, distributed as part of this software.
#-----------------------------------------------------------------------------

from tornado.log import app_log
from IPython.nbformat.current import reads_json

#-----------------------------------------------------------------------------
# 
#-----------------------------------------------------------------------------

class NbFormatError(Exception):
    pass

def render_notebook(exporter, json_notebook, url=None, forced_theme=None):
    app_log.info("rendering %d B notebook from %s", len(json_notebook), url)

    name = 'Beaker Notebook'

    config = {
            'download_name': name,
            'css_theme': None,
            }
    return json_notebook, config
