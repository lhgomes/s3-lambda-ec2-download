import os
import json
import boto3
import logging

root = logging.getLogger()
if root.handlers:
    for handler in root.handlers:
        root.removeHandler(handler)
logging.basicConfig(format='%(asctime)s - %(levelname)s - %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p', level=logging.INFO)

script_lines = []
ssm = boto3.client('ssm')
ec2_instance_id = os.environ['EC2_INSTANCE_ID']
ec2_local_folder = os.environ['EC2_LOCAL_FOLDER']

with open('script.py') as file:
    script_lines = file.readlines()

def lambda_handler(event, context):
    logging.debug('Event Received:' + json.dumps(event))
    
    for record in event['Records']:
        bucket_name = record['s3']['bucket']['name']
        object_key = record['s3']['object']['key']
    
        logging.info('S3 Bucket Name: ' + bucket_name)
        logging.info('S3 Object Key: ' + object_key)

        command_lines = script_lines
        command_lines.insert(0,'local_folder = \'' + ec2_local_folder + '\'')
        command_lines.insert(0,'object_key = \'' + object_key + '\'')
        command_lines.insert(0,'bucket_name = \'' + bucket_name + '\'')
        command_lines.insert(0,'#!/usr/bin/python3')
        
        response = ssm.send_command(
            InstanceIds=[ec2_instance_id],
            DocumentName="AWS-RunShellScript",
            Parameters={
                'commands': command_lines
            })
            
        command_id = response['Command']['CommandId']
        logging.info('Command Id:' + command_id)
    
    return True