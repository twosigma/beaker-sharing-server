<!--
    Copyright 2014 TWO SIGMA INVESTMENTS, LLC

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

           http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
-->
 
#Notices

* As long as this repo is 'private', do not share code or builds with anybody outside of Two Sigma
* Two Sigma employees must complete the appropriate authorization forms in Bonita before contributing to any open source project, including Beaker

#Povenance

This is a fork of https://github.com/ipython/nbviewer

Original README follows:

IPython Notebook Viewer
-----------------------

IPython nbviewer is the web application behind [IPython Notebook Viewer](http://nbviewer.ipython.org) 
(graciously hosted by [rackspace](http://www.rackspace.com)).

You can run this package locally to get most of the feature of nbviewer on your network.

Quick Deploy
------------

If you have an heroku account, or have access to one, 
have a look at heroku-bootstrap.sh that does a quick setup of an heroku account
and set some variables:

```bash
$ ./heroku-bootstrap.sh <an-app-name>
```
```
Creating <an-app-name>... done, stack is cedar
http://<an-app-name>.herokuapp.com/ | git@heroku.com:<an-app-name>.git
Adding memcachier:dev on <an-app-name>... done, v3 (free)
MemCachier is now up and ready to go. Happy bananas!
Use `heroku addons:docs memcachier` to view documentation.
Adding newrelic:standard on <an-app-name>... done, v4 (free)
Use `heroku addons:docs newrelic` to view documentation.
Git remote <an-app-name> added
Setting config vars and restarting <an-app-name>... done, v5
LIBRARY_PATH: /app/.heroku/vendor/lib
Setting config vars and restarting <an-app-name>... done, v6
LD_LIBRARY_PATH: /app/.heroku/vendor/lib
Setting config vars and restarting <an-app-name>... done, v7
PATH: bin:app/.heroku/venv/bin:/bin:/usr/local/bin:/usr/bin
Setting config vars and restarting <an-app-name>... done, v8
BUILDPACK_URL: https://github.com/ddollar/heroku-buildpack-multi.git
```

Push the repo on your new app
```
$ git push <an-app-name> master:master
...
...
```

The application will be available under `yourappname.herokuapp.com`

If `pycurl` cannot be install, remove it from `requirement.txt`
it is not necessary.

You can eventually set the following github key to make authenticated requests to github.
This will increase the maximum number of requests you can do to github/hour.

    GITHUB_OAUTH_KEY:             xxxxxxxxxxxxxxxxxxxx
    GITHUB_OAUTH_SECRET:          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

you can use `heroku config:set KEY1=VALUE1` to do so.

## Install Locally

Local installation of nbviewer requires several binary packages to be installed on your system. The primary ones are `build-essential python-dev libmemcached-dev libcurl4-gnutls-dev pandoc libevent-dev`. Package names may differ on your system, see [salt-states](https://github.com/rgbkrk/salt-states-nbviewer/blob/master/nbviewer/init.sls) for more details.

If they are installed, you can install the required Python packages via pip.

`sudo pip install -r requirements.txt`

## Running Locally

run with 

```
$ cd <path to repo>
$ python -m nbviewer --debug --no-cache
```

This will automatically relaunch the server is a change is detected on a python file, and not cache any result.
You can then just do the modification you like to the source code and/or the templates then refresh the pages.
