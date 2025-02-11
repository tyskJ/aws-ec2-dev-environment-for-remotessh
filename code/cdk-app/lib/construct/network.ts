/*
╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║ EC2 Dev Environment For Remote SSH Stack - Cloud Development Kit network.ts                                                                        ║
╠════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
║ This construct creates an L1 Construct VPC and an L1 Construct Subnet.                                                                             ║
╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
*/

import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { vpcInfo } from "../../parameter";
import { subnetInfo } from "../../parameter";
import * as ec2 from "aws-cdk-lib/aws-ec2";

export interface NetworkProps {
  pseudo: cdk.ScopedAws;
  vpc: vpcInfo;
  subnet: subnetInfo;
}

export class Network extends Construct {
  public readonly vpc: ec2.CfnVPC;
  public readonly subnet: ec2.CfnSubnet;

  constructor(scope: Construct, id: string, props: NetworkProps) {
    super(scope, id);

    this.vpc = new ec2.CfnVPC(this, props.vpc.id, {
      cidrBlock: props.vpc.cidrBlock,
      enableDnsHostnames: props.vpc.dnsHost,
      enableDnsSupport: props.vpc.dnsSupport,
    });
    for (const tag of props.vpc.tags) {
      cdk.Tags.of(this.vpc).add(tag.key, tag.value);
    }

    this.subnet = new ec2.CfnSubnet(this, props.subnet.id, {
      vpcId: this.vpc.attrVpcId,
      cidrBlock: props.subnet.cidrBlock,
      availabilityZone: props.pseudo.region + props.subnet.availabilityZone,
      mapPublicIpOnLaunch: props.subnet.mapPublicIpOnLaunch,
    });
    for (const tag of props.vpc.tags) {
      cdk.Tags.of(this.subnet).add(tag.key, tag.value);
    }
  }
}
