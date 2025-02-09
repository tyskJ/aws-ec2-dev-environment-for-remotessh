/*
╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║ EC2 Dev Environment For Remote SSH Stack - Cloud Development Kit parameter.ts                                                                      ║
╠════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
║ This file that defines the parameters for each resource.                                                                                           ║
╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
*/

/*
╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║ type (Define your own type)                                                                                                                        ║
╠═════════════════╤══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
║ vpcInfo         │ Type defined L1 Construct vpc configuration information.                                                                         ║
║ subnetInfo      │ Type defined L1 Construct subnet configuration information.                                                                      ║
║ kmsInfo         │ Type defined L2 Construct KMS information.                                                                                       ║
║ iamPolicyInfo   │ Type defined L2 Construct IAM Managed Policy information.                                                                        ║
║ iamRoleInfo     │ Type defined L2 Construct IAM Role information.                                                                                  ║
║ bkvaultInfo     │ Type defined L2 Construct AWS Backup Vault information.                                                                          ║
║ logsInfo        │ Type defined L1 Construct CloudWatch Logs LogGroup.                                                                              ║
║ lambdaInfo      │ Type defined L2 Construct Lambda Function.                                                                                       ║
║ ruleInfo        │ Type defined L2 Construct EventBridge Rule.                                                                                      ║
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

/*
╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║ Interface Parameter                                                                                                                                ║
╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
*/
export interface Parameter {
  AppName: string;
  vpc: vpcInfo;
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
};
