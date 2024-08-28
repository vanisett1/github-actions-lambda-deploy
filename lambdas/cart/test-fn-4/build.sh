#!/bin/sh

npm install --omit=dev --production --prefer-dedupe
zip -y -r fn.zip .