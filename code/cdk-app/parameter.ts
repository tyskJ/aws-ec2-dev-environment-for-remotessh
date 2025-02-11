/*
╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║ EC2 Dev Environment For Remote SSH Stack - Cloud Development Kit parameter.ts                                                                      ║
╠════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
║ This file that defines the parameters for each resource.                                                                                           ║
╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
*/
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

/*
╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║ type (Define your own type)                                                                                                                        ║
╠═════════════════╤══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
║ vpcInfo         │ Type defined L1 Construct vpc configuration information.                                                                         ║
║ azInfo          │ Type defined Availavility Zone.                                                                         ║
║ subnetInfo      │ Type defined L1 Construct subnet configuration information.                                                                      ║
║ iamPolicyInfo   │ Type defined L2 Construct IAM Managed Policy information.                                                                        ║
║ iamRoleInfo     │ Type defined L2 Construct IAM Role information.                                                                                  ║
║ keypairInfo     │ Type defined L1 Construct KeyPair.                                                                                               ║
║ secgInfo        │ Type defined L2 Construct SecurityGroup.                                                                                         ║
║ ec2Info         │ Type defined L1 Construct EC2 Instance.                                                                                          ║
╚═════════════════╧══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
*/
export type vpcInfo = {
  id: string;
  cidrBlock: string;
  dnsHost: boolean;
  dnsSupport: boolean;
  tags: { key: string; value: string }[];
};

export type azInfo = "a" | "c" | "d";

export type subnetInfo = {
  id: string;
  availabilityZone: azInfo;
  cidrBlock: string;
  mapPublicIpOnLaunch: boolean;
};

/*
╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║ Interface Parameter                                                                                                                                ║
╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
*/
export interface Parameter {
  AppName: string;
  vpc: vpcInfo;
  subnet: subnetInfo;
}

/*
╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║ devParameter                                                                                                                                       ║
╠═════════════════╤══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
║ AppName         │ common tag value.                                                                                                                ║
║ vpc             │ VPC.                                                                                                                             ║
╚═════════════════╧══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
*/
export const devParameter: Parameter = {
  AppName: "dev",

  vpc: {
    id: "Vpc",
    cidrBlock: "10.0.0.0/16",
    dnsHost: true,
    dnsSupport: true,
    tags: [{ key: "Name", value: "dev-vpc" }],
  },

  subnet: {
    id: "Subnet",
    availabilityZone: "a",
    cidrBlock: "10.0.1.0/24",
    mapPublicIpOnLaunch: true,
  },
};
