ZIP_FILE_NAME="mashkanta_charts.zip"
echo $ZIP_FILE_NAME
rm $ZIP_FILE_NAME
zip -r $ZIP_FILE_NAME  app/ data/ wp-content/ config.py requirements.txt tox.ini wsgi.py
