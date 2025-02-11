import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Parameter } from "../../parameter";
import { Network } from "../construct/network";

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
    });
  }
}
