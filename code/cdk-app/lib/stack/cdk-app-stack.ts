import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Parameter } from "../../parameter";
import { Network } from "../construct/network";
import { Iam } from "../construct/iam";
import { Ec2 } from "../construct/ec2";

export class CdkAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: Parameter) {
    super(scope, id, {
      ...props,
      description: "EC2 Dev Environment For Remote SSH Stack",
    });

    // Pseudo Parameters
    const pseudo = new cdk.ScopedAws(this);

    // Network Construct
    const nw = new Network(this, "Network", {
      pseudo: pseudo,
      vpc: props.vpc,
      subnet: props.subnet,
      nacl: props.nacl,
      rtb: props.rtb,
      s3GwEp: props.s3GwEp,
    });

    // IAM Construct
    const iam = new Iam(this, "Iam", {
      pseudo: pseudo,
      ssmPolicy: props.ssmPolicy,
      ec2Role: props.ec2Role,
    });

    // EC2 Construct
    const ec2 = new Ec2(this, "Ec2", {
      pseudo: pseudo,
      vpc: nw.vpc,
      subnet: nw.subnet,
      ec2Role: iam.ec2Role,
      keyPair: props.keyPair,
      secg: props.secg,
      ec2: props.ec2,
    });
  }
}
