#!/bin/bash

git add .
git commit -m "Commit"
git push heroku master
heroku logs --tail
