/*
╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║ EC2 Dev Environment For Remote SSH Stack - Cloud Development Kit ec2.ts                                                                            ║
╠════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
║ This construct creates an L1 Construct SecurityGroup, KeyPair, Instance Profile, EC2 Instance.                                                     ║
╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
*/

import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import { secgInfo } from "../../parameter";
import { keypairInfo } from "../../parameter";
import { ec2Info } from "../../parameter";

export interface Ec2Props {
  pseudo: cdk.ScopedAws;
  vpc: ec2.CfnVPC;
  subnet: ec2.CfnSubnet;
  ec2Role: iam.Role;
  keyPair: keypairInfo;
  secg: secgInfo;
  ec2: ec2Info;
}

export class Ec2 extends Construct {
  constructor(scope: Construct, id: string, props: Ec2Props) {
    super(scope, id);

    // Security Group
    const secg = new ec2.CfnSecurityGroup(this, props.secg.id, {
      vpcId: props.vpc.attrVpcId,
      groupDescription: props.secg.description,
      groupName: props.secg.sgName,
    });
    for (const tag of props.secg.tags) {
      cdk.Tags.of(secg).add(tag.key, tag.value);
    }

    // Key Pair
    const keyPair = new ec2.CfnKeyPair(this, props.keyPair.id, {
      keyName: props.keyPair.keyName,
      keyType: props.keyPair.keyType,
      keyFormat: props.keyPair.keyFormat,
    });
    if (props.keyPair.removalPolicy) {
      keyPair.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    }
    for (const tag of props.keyPair.tags) {
      cdk.Tags.of(keyPair).add(tag.key, tag.value);
    }
    new cdk.CfnOutput(this, "Get" + keyPair.keyName + "Command", {
      value: `aws ssm get-parameter --name "/ec2/keypair/${keyPair.attrKeyPairId}:1" --region ${props.pseudo.region} --with-decryption --query Parameter.Value --output text --profile admin > keypair.pem && chmod 400 keypair.pem`,
    });

    // Instance Profile
    const instanceProfile = new iam.CfnInstanceProfile(
      this,
      "instanceprofile",
      {
        roles: [props.ec2Role.roleName],
        instanceProfileName: props.ec2Role.roleName,
      }
    );

    // EC2 Instance
    const ec2Instance = new ec2.CfnInstance(this, props.ec2.id, {
      instanceType: props.ec2.instanceType,
      keyName: keyPair.keyName,
      iamInstanceProfile: instanceProfile.ref,
      imageId: ec2.MachineImage.latestAmazonLinux2023().getImage(this).imageId,
      disableApiTermination: props.ec2.apiTerm,
      subnetId: props.subnet.ref,
      securityGroupIds: [secg.attrGroupId],
      ebsOptimized: props.ec2.ebsOpt,
      blockDeviceMappings: [
        {
          deviceName: "/dev/xvda",
          ebs: {
            deleteOnTermination: true,
            volumeSize: props.ec2.volSize,
            volumeType: ec2.EbsDeviceVolumeType.GP3,
            encrypted: true,
          },
        },
      ],
    });
    for (const tag of props.ec2.tags) {
      cdk.Tags.of(ec2Instance).add(tag.key, tag.value);
    }
    new cdk.CfnOutput(this, "EC2 Instance ID", {
      value: ec2Instance.attrInstanceId,
    });
  }
}
