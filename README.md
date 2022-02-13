# CDK project to copy files from S3 to EC2

This [CDK project](https://aws.amazon.com/cdk) creates a trigger to copy files from a given S3 bucket to an existing EC2 server.

The solution uses an S3 notification event fired when a new file is created in the bucket to run a lambda function. The lambda function will get file details and run a python script through SSM Run Command to download the file to a specified folder and delete the S3 file after that.

In case of failure, the solution will send a alert to the specified email

## Parameters needed
 * ec2InstanceId: Existing EC2 instance id
 * ec2LocalFolder: EC2 folder to download S3 files
 * s3BucketArn: Source S3 Bucket Arn
 * s3BucketEventFilterSuffix: S3 event filter suffix ([help](https://docs.aws.amazon.com/AmazonS3/latest/userguide/notification-how-to-filtering.html))
 * emailToNotify: Email to notify in case of failure

## Objects created by this project
 * [S3 Notification Event](https://docs.aws.amazon.com/AmazonS3/latest/userguide/NotificationHowTo.html)
 * [Lambda Function](https://docs.aws.amazon.com/lambda)
 * [Cloudwath Alarm](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html)
 * [SNS Topic](https://aws.amazon.com/sns)
 * [SNS Topic Subscription](https://docs.aws.amazon.com/sns/latest/dg/sns-create-subscribe-endpoint-to-topic.html)

## Usage
```bash
cdk deploy --parameters ec2InstanceId=EC2_INSTANCE_ID \
  --parameters ec2LocalFolder=/tmp \
  --parameters s3BucketArn=arn:aws:s3:::BUCKET_NAME \
  --parameters s3BucketEventFilterSuffix=pdf \
  --parameters emailToNotify=email@sample.com /
```

#### You need to change the parameters according to your need<br>

> **Detail:** Make sure your existing EC2 role has [SSM permissions](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-getting-started-instance-profile.html) and the following permissions related with your S3 Bucket: "s3:GetObject", "s3:DeleteObject"<br>
**ProTip:** The EC2 server needs to have the boto3 python library installed. If you don't already have it, you can install it with the command: pip3 install boto3

## Useful commands
 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
 * `cdk destroy`     removes the stack and all resources created by the stack
