import boto3
import os
import sys
import uuid
from urllib.parse import unquote_plus


s3_client = boto3.client('s3')

#def resize_image(image_path, resized_path):
 # with Image.open(image_path) as image:
  #    image.thumbnail(tuple(x / 2 for x in image.size))
   #   image.save(resized_path)

def lambda_handler(event, context):
  for record in event['Records']:
      bucket = record['s3']['bucket']['name']
      key = unquote_plus(record['s3']['object']['key'])
      tmpkey = key.replace('/', '')
      #print("bucket", bucket)
     # print("key", key)
      download_path = '/tmp/{}'.format(tmpkey)
      #print("download_path", download_path)
      upload_path = '/tmp/{}'.format(tmpkey)
      #print("upload_path", upload_path)
      s3_client.download_file(bucket, key, download_path)
  #    resize_image(download_path, upload_path)
      s3_client.upload_file(upload_path, '{}-resized'.format(bucket), key)
            
