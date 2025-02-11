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
import { naclInfo } from "../../parameter";
import { rtbInfo } from "../../parameter";
import { gwVpcEpInfo } from "../../parameter";
import * as ec2 from "aws-cdk-lib/aws-ec2";

export interface NetworkProps {
  pseudo: cdk.ScopedAws;
  vpc: vpcInfo;
  subnet: subnetInfo;
  nacl: naclInfo;
  rtb: rtbInfo;
  s3GwEp: gwVpcEpInfo;
}

export interface GwProps {
  igwId?: string;
  ngwId?: string;
}

export class Network extends Construct {
  public readonly vpc: ec2.CfnVPC;
  public readonly subnet: ec2.CfnSubnet;

  constructor(scope: Construct, id: string, props: NetworkProps) {
    super(scope, id);

    // VPC
    this.vpc = new ec2.CfnVPC(this, props.vpc.id, {
      cidrBlock: props.vpc.cidrBlock,
      enableDnsHostnames: props.vpc.dnsHost,
      enableDnsSupport: props.vpc.dnsSupport,
    });
    for (const tag of props.vpc.tags) {
      cdk.Tags.of(this.vpc).add(tag.key, tag.value);
    }

    // Subnet
    this.subnet = new ec2.CfnSubnet(this, props.subnet.id, {
      vpcId: this.vpc.attrVpcId,
      cidrBlock: props.subnet.cidrBlock,
      availabilityZone: props.pseudo.region + props.subnet.availabilityZone,
      mapPublicIpOnLaunch: props.subnet.mapPublicIpOnLaunch,
    });
    for (const tag of props.subnet.tags) {
      cdk.Tags.of(this.subnet).add(tag.key, tag.value);
    }

    // Network ACL
    const nacl = this.createNetworkACL(this, props.nacl);
    new ec2.CfnSubnetNetworkAclAssociation(this, "nacl-assoc", {
      subnetId: this.subnet.attrSubnetId,
      networkAclId: nacl.attrId,
    });

    // Internet Gateway
    const igw = new ec2.CfnInternetGateway(this, "igw", {
      tags: [
        {
          key: "Name",
          value: "dev-igw",
        },
      ],
    });
    new ec2.CfnVPCGatewayAttachment(this, "igw-attach", {
      vpcId: this.vpc.attrVpcId,
      internetGatewayId: igw.attrInternetGatewayId,
    });

    // Route Table
    const rtb = this.createRouteTable(this, props.rtb, {
      igwId: igw.attrInternetGatewayId,
    });
    new ec2.CfnSubnetRouteTableAssociation(this, "rtb-assoc", {
      routeTableId: rtb.attrRouteTableId,
      subnetId: this.subnet.attrSubnetId,
    });

    // S3 Gateway Endpoint
    const s3Vpce = new ec2.CfnVPCEndpoint(this, props.s3GwEp.id, {
      vpcId: this.vpc.attrVpcId,
      serviceName: props.s3GwEp.service,
      routeTableIds: [rtb.attrRouteTableId],
    });
  }

  /*
  ╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
  ║ Method (private)                                                                                                                                 ║
  ╠═══════════════════════════╤═════════════════════════╤════════════════════════════════════════════════════════════════════════════════════════════╣
  ║ createNetWorkACL          │ ec2.CfnNetworkAcl       │ Method to create NetworkACL for L1 constructs.                                             ║
  ║ createRouteTable          │ ec2.CfnRouteTable       │ Method to create RouteTable for L1 constructs.                                             ║
  ╚═══════════════════════════╧═════════════════════════╧════════════════════════════════════════════════════════════════════════════════════════════╝
  */
  private createNetworkACL(
    scope: Construct,
    nacls: naclInfo
  ): ec2.CfnNetworkAcl {
    const nacl = new ec2.CfnNetworkAcl(scope, nacls.id, {
      vpcId: this.vpc.attrVpcId,
    });
    for (const tag of nacls.tags) {
      cdk.Tags.of(nacl).add(tag.key, tag.value);
    }
    for (const rules of nacls.rules) {
      switch (rules.protocol) {
        case -1:
          new ec2.CfnNetworkAclEntry(scope, rules.id, {
            networkAclId: nacl.attrId,
            protocol: rules.protocol,
            ruleAction: rules.ruleAction,
            ruleNumber: rules.ruleNumber,
            cidrBlock: rules.cidrBlock,
            egress: rules.egress,
          });
          break;
        case 6:
        case 17:
          if (rules.portRange === undefined) {
            throw new Error("Port Range is required");
          }
          new ec2.CfnNetworkAclEntry(scope, rules.id, {
            networkAclId: nacl.attrId,
            protocol: rules.protocol,
            ruleAction: rules.ruleAction,
            ruleNumber: rules.ruleNumber,
            cidrBlock: rules.cidrBlock,
            egress: rules.egress,
            portRange: {
              from: rules.portRange.fromPort,
              to: rules.portRange.toPort,
            },
          });
          break;
        case 1:
          if (rules.icmp === undefined) {
            throw new Error("ICMP Range is required");
          }
          new ec2.CfnNetworkAclEntry(scope, rules.id, {
            networkAclId: nacl.attrId,
            protocol: rules.protocol,
            ruleAction: rules.ruleAction,
            ruleNumber: rules.ruleNumber,
            cidrBlock: rules.cidrBlock,
            egress: rules.egress,
            icmp: {
              code: rules.icmp.code,
              type: rules.icmp.type,
            },
          });
          break;
        default:
          const _: never = rules.protocol;
          throw new Error("Invalid Protocol");
      }
    }
    return nacl;
  }

  private createRouteTable(
    scope: Construct,
    rtbs: rtbInfo,
    gwId: GwProps
  ): ec2.CfnRouteTable {
    const routeTable = new ec2.CfnRouteTable(scope, rtbs.id, {
      vpcId: this.vpc.attrVpcId,
    });
    for (const tag of rtbs.tags) {
      cdk.Tags.of(routeTable).add(tag.key, tag.value);
    }
    for (const rt of rtbs.routes) {
      let i = 1;
      for (const dest of rt.destinations) {
        const route = new ec2.CfnRoute(scope, `${rt.id}-${i}`, {
          routeTableId: routeTable.attrRouteTableId,
          destinationCidrBlock: dest,
        });
        switch (rt.type) {
          case "igw":
            route.gatewayId = gwId.igwId;
            break;
          default:
            throw new Error("Invalid Route Type");
        }
        i++;
      }
    }
    return routeTable;
  }
}
