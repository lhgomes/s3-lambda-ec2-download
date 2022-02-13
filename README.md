# CDK project to copy files from S3 to EC2

This CDK project creates a trigger to copy files from a given S3 bucket to an existing EC2 server.

The solution uses an S3 notification event fired when a new file is created in the bucket to run a lambda function. The lambda function will get file details and run a python script through SSM Run Command to download the file to a specified folder and delete the S3 file after that.

In case of failure, the solution will send a alert to the specified email

## Parameters needed
 * ec2InstanceId: Existing EC2 instance id
 * ec2LocalFolder: EC2 folder to download S3 files
 * s3BucketArn: Source S3 Bucket Arn
 * s3BucketEventFilterSuffix: S3 event filter suffix ([help](https://docs.aws.amazon.com/AmazonS3/latest/userguide/notification-how-to-filtering.html))
 * emailToNotify: Email to notify in case of failure

## Objects created by this project
 * S3 Notification Event
 * Lambda Function
 * Cloudwath Alarm
 * SNS Topic
 * SNS Topic Subscription

## Usage
```bash
cdk deploy --parameters ec2InstanceId=EC2_INSTANCE_ID --parameters ec2LocalFolder=/tmp --parameters s3BucketArn=arn:aws:s3:::BUCKET_NAME --parameters s3BucketEventFilterSuffix=pdf --parameters emailToNotify=email@sample.com
```

> You need to replace the **EC2_INSTANCE_ID** with the **Existing EC2 instance id**.
> You need to replace the **BUCKET_NAME** with the **S3 Bucket Arn**.
> **Detail:** Make sure that your existing EC2 role has the following permissions into your S3 Bucket: "s3:GetObject", "s3:DeleteObject"

## Useful commands
 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
