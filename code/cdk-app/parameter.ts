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
║ azInfo          │ Type defined Availavility Zone.                                                                                                  ║
║ subnetInfo      │ Type defined L1 Construct subnet configuration information.                                                                      ║
║ protocolInfo    │ Type defined Protocol.                                                                                                           ║
║ naclInfo        │ Type defined L1 Construct NACL configuration information.                                                                        ║
║ gwInfo          │ Type defined Gateway.                                                                                                            ║
║ rtbInfo         │ Type defined L1 Construct RouteTable configuration information.                                                                  ║
║ gwVpcEpInfo     │ Type defined L1 Construct VPC Gateway Endpoint configuration information.                                                        ║
║ iamRoleInfo     │ Type defined L2 Construct IAM Role information.                                                                                  ║
║ iamPolicyInfo   │ Type defined L2 Construct IAM Managed Policy information.                                                                        ║
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
  tags: { key: string; value: string }[];
};

export type protocolInfo = -1 | 6 | 17 | 1;

export type naclInfo = {
  id: string;
  rules: {
    id: string;
    protocol: protocolInfo;
    ruleAction: string;
    ruleNumber: number;
    cidrBlock: string;
    egress: boolean;
    portRange?: {
      fromPort: number;
      toPort: number;
    };
    icmp?: {
      code: number;
      type: number;
    };
  }[];
  tags: { key: string; value: string }[];
};

export type gwInfo = "igw" | "vgw" | "tgw" | "ngw";

export type rtbInfo = {
  id: string;
  name: string;
  routes: {
    type: gwInfo;
    id: string;
    destinations: string[];
  }[];
  tags: { key: string; value: string }[];
};

export type gwVpcEpInfo = {
  type: string;
  id: string;
  name: string;
  service: string;
};

export type iamRoleInfo = {
  id: string;
  roleName: string;
  assumed: string;
  description: string;
  customManagedPolicyAdd: boolean;
  awsManagedPolicyAdd: boolean;
  awsManagedPolicyName?: { policyName: string }[];
  tags: { key: string; value: string }[];
};

export type iamPolicyInfo = {
  id: string;
  policyName: string;
  description: string;
  jsonFileName: string;
};

export type keypairInfo = {
  id: string;
  keyName: string;
  keyType: string;
  keyFormat: string;
  removalPolicy: boolean;
  tags: { key: string; value: string }[];
};

export type secgInfo = {
  id: string;
  sgName: string;
  description: string;
  tags: { key: string; value: string }[];
};

export type ec2Info = {
  id: string;
  instanceType: string;
  apiTerm: boolean;
  ebsOpt: boolean;
  volSize: number;
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
  subnet: subnetInfo;
  nacl: naclInfo;
  rtb: rtbInfo;
  s3GwEp: gwVpcEpInfo;
  ec2Role: iamRoleInfo;
  ssmPolicy: iamPolicyInfo;
  keyPair: keypairInfo;
  secg: secgInfo;
  ec2: ec2Info;
}

/*
╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║ devParameter                                                                                                                                       ║
╠═════════════════╤══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
║ AppName         │ common tag value.                                                                                                                ║
║ vpc             │ VPC.                                                                                                                             ║
║ subnet          │ Public Subnet.                                                                                                                   ║
║ ec2Role         │ EC2 Role.                                                                                                                        ║
║ ssmPolicy       │ SSM Start SSH Session Policy.                                                                                                    ║
║ keyPair         │ KeyPair.                                                                                                                         ║
║ secg            │ SecurityGroup.                                                                                                                   ║
║ ec2             │ EC2 Instance.                                                                                                                    ║
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
    tags: [{ key: "Name", value: "dev-subnet" }],
  },

  nacl: {
    id: "nacl-open",
    rules: [
      {
        id: "nacl-open-rule-in-100",
        protocol: -1,
        ruleAction: "allow",
        ruleNumber: 100,
        cidrBlock: "0.0.0.0/0",
        egress: false,
      },
      {
        id: "nacl-open-rule-out-100",
        protocol: -1,
        ruleAction: "allow",
        ruleNumber: 100,
        cidrBlock: "0.0.0.0/0",
        egress: true,
      },
    ],
    tags: [{ key: "Name", value: "dev-nacl" }],
  },

  rtb: {
    id: "rtb-public-subnet",
    name: "dev-public-rtb",
    routes: [
      {
        type: "igw",
        id: "rtb-private-subnet-for-out",
        destinations: ["0.0.0.0/0"],
      },
    ],
    tags: [{ key: "Name", value: "dev-public-rtb" }],
  },

  s3GwEp: {
    type: "Gateway",
    id: "dev-s3-gw",
    name: "dev-s3-gw",
    service: "com.amazonaws.ap-northeast-1.s3",
  },

  ec2Role: {
    id: "EC2Role",
    roleName: "iam-role-ec2",
    assumed: "ec2.amazonaws.com",
    description: "EC2 Role",
    customManagedPolicyAdd: false,
    awsManagedPolicyAdd: true,
    awsManagedPolicyName: [
      {
        policyName: "AmazonSSMManagedInstanceCore",
      },
    ],
    tags: [{ key: "Name", value: "iam-role-ec2" }],
  },

  ssmPolicy: {
    id: "SSMStartSessionPolicy",
    policyName: "iam-policy-dev",
    description: "SSM Start Session Policy",
    jsonFileName: "ssm-policy.json",
  },

  keyPair: {
    id: "KeyPair",
    keyName: "dev-keypair",
    keyType: "rsa",
    keyFormat: "pem",
    removalPolicy: true,
    tags: [{ key: "Name", value: "dev-keypair" }],
  },

  secg: {
    id: "SecurityGroup",
    sgName: "dev-sg",
    description: "SG for EC2",
    tags: [{ key: "Name", value: "dev-sg" }],
  },

  ec2: {
    id: "EC2Instance",
    instanceType: "t3.large",
    apiTerm: false,
    ebsOpt: false,
    volSize: 30,
    tags: [{ key: "Name", value: "dev-ec2" }],
  },
};
