import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as S3LambdaEc2Download from '../lib/s3-lambda-ec2-download-stack';

test('Lambda Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new S3LambdaEc2Download.S3LambdaEc2DownloadStack(app, 'MyTestStack');
  // THEN

  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::Lambda::Function', 2);
  template.resourceCountIs('AWS::SNS::Topic', 1);
});
