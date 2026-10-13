#!/bin/sh
set -eu
# Railway's mounted directory is owned by root on first attachment.
# Only directory ownership is adjusted; the JVM runs as the app user.
mkdir -p /data
chown app:app /data
exec su-exec app java -jar /app/app.jar
