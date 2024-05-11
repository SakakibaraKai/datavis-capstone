import os
c=get_config()
c.NotebookApp.notebook_dir = '/workspace'
c.NotebookApp.ip = '0.0.0.0'
c.NotebookApp.allow_origin = '*'
