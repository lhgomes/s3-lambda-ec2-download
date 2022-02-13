#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { S3LambdaEc2DownloadStack } from '../lib/s3-lambda-ec2-download-stack';

const app = new cdk.App();
new S3LambdaEc2DownloadStack(app, 'S3LambdaEc2DownloadStack');
