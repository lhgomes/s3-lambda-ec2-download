import os
import sys
import boto3
import logging

logging.basicConfig(format='%(asctime)s - %(levelname)s - %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p', level=logging.INFO)

s3 = boto3.resource('s3')

local_file = os.path.join(local_folder, object_key)
local_folder = os.path.dirname(os.path.abspath(local_file))

os.makedirs(local_folder, exist_ok=True)

logging.info('S3 Bucket Name: ' + bucket_name)
logging.info('S3 Object Key: ' + object_key)
logging.info('Local Filename: ' + local_file)

s3_object = s3.Object(bucket_name, object_key)

s3_object.download_file(local_file)
logging.info('File downloaded to ' + local_folder)

s3_object.delete()
logging.info('S3 file deleted')