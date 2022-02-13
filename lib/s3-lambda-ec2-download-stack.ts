import { aws_cloudwatch, aws_iam, aws_lambda, aws_s3, aws_s3_notifications, aws_sns, aws_sns_subscriptions, CfnParameter, Stack, StackProps } from 'aws-cdk-lib';
import { SnsAction } from 'aws-cdk-lib/aws-cloudwatch-actions';
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';

export class S3LambdaEc2DownloadStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //Parameters section
    const ec2InstanceId = new CfnParameter(this, "ec2InstanceId", {
      type: "String",
      description: "EC2 Instance Id"
    });

    const ec2LocalFolder = new CfnParameter(this, "ec2LocalFolder", {
      type: "String",
      description: "EC2 folder to download S3 files"
    });

    const s3BucketArn = new CfnParameter(this, "s3BucketArn", {
      type: "String",
      description: "Source S3 Bucket Arn"
    });

    const s3BucketEventFilterSuffix = new CfnParameter(this, "s3BucketEventFilterSuffix", {
      type: "String",
      description: "S3 event filter suffix"
    });

    const emailToNotify = new CfnParameter(this, "emailToNotify", {
      type: "String",
      description: "Email to notify in case of failure"
    });

    //Create a lambda function, add evironment variables and add permissions
    const lambdaFunction = new aws_lambda.Function(this, "s3-lambda-ec2-download", {
      code: aws_lambda.Code.fromAsset('resources/s3-lambda-ec2-download'),
      runtime: aws_lambda.Runtime.PYTHON_3_9,
      handler: "lambda_function.lambda_handler"
    });
    lambdaFunction.addEnvironment("EC2_INSTANCE_ID", ec2InstanceId.valueAsString);
    lambdaFunction.addEnvironment("EC2_LOCAL_FOLDER", ec2LocalFolder.valueAsString);
    lambdaFunction.addToRolePolicy(new aws_iam.PolicyStatement({
      effect: aws_iam.Effect.ALLOW,
      actions: [
        'ssm:SendCommand',
      ],
      resources: [
        cdk.Fn.join(':', ['arn:aws:ssm', this.region, ':document/AWS-RunShellScript']),
        this.formatArn({
          service: 'ec2',
          resource: 'instance',
          resourceName: ec2InstanceId.valueAsString
        })
      ],
    }));

    //Create a reference for the existing S3 Bucket and add the event notification
    const s3Bucket = aws_s3.Bucket.fromBucketArn(this, "s3Bucket", s3BucketArn.valueAsString);
    s3Bucket.addObjectCreatedNotification(
      new aws_s3_notifications.LambdaDestination(lambdaFunction),
      {
        suffix: s3BucketEventFilterSuffix.valueAsString,
      }
    );
    
    //Create the SNS topic and add the email notification
    const alarmTopic = new aws_sns.Topic(this, "s3-lambda-ec2-download-alarm-topic", {
      displayName: "s3-lambda-ec2-download-alarm-topic"
    });
    alarmTopic.addSubscription(new aws_sns_subscriptions.EmailSubscription(emailToNotify.valueAsString))

    //Create the cloudwatch alarm and add the SNS topic as a target
    new aws_cloudwatch.Alarm(this, "s3-lambda-ec2-download-alarm-failed", {
      evaluationPeriods: 1,
      metric: new aws_cloudwatch.Metric({
        metricName: "CommandsFailed",
        namespace: "AWS/SSM-RunCommand",
        statistic: "sum"
      }),
      threshold: 1,
      alarmDescription: "Run Command has failed",
      comparisonOperator: aws_cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: aws_cloudwatch.TreatMissingData.IGNORE,
      actionsEnabled: true
    }).addAlarmAction(new SnsAction(alarmTopic));
  }
}
