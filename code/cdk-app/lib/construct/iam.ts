/*
╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║ EC2 Dev Environment For Remote SSH Stack - Cloud Development Kit iam.ts                                                                            ║
╠════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
║ This construct creates an L2 Construct IAM Managed Policy and IAM Role.                                                                            ║
╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
*/
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import { iamPolicyInfo } from "../../parameter";
import { iamRoleInfo } from "../../parameter";
import * as fs from "fs";
import * as path from "path";

export interface IamProps {
  pseudo: cdk.ScopedAws;
  ssmPolicy: iamPolicyInfo;
  ec2Role: iamRoleInfo;
}

export class Iam extends Construct {
  public readonly ec2Role: iam.Role;

  constructor(scope: Construct, id: string, props: IamProps) {
    super(scope, id);

    // SSM Policy
    const filePath = path.join(
      `${__dirname}`,
      "../json/policy/",
      props.ssmPolicy.jsonFileName
    );
    const jsonData = fs.readFileSync(filePath, "utf8");
    const jsonPolicy = JSON.parse(
      jsonData
        .replace(/{Partition}/g, props.pseudo.partition)
        .replace(/{Region}/g, props.pseudo.region)
        .replace(/{Account}/g, props.pseudo.accountId)
    );
    const ssmPolicy = new iam.ManagedPolicy(this, props.ssmPolicy.id, {
      managedPolicyName: props.ssmPolicy.policyName,
      description: props.ssmPolicy.description,
      document: iam.PolicyDocument.fromJson(jsonPolicy),
    });

    // EC2 Role
    this.ec2Role = this.createIamRole(this, props.ec2Role);

    // IAM Group
    const iamGroup = new iam.Group(this, "iamGroup", {
      groupName: "dev-iam-group",
      managedPolicies: [ssmPolicy],
    });

    // IAM User
    const iamUser = new iam.User(this, "iamUser", {
      userName: "dev-iam-user",
      groups: [iamGroup],
    });
    cdk.Tags.of(iamUser).add("Name", "dev-iam-user");
  }
  /*
  ╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
  ║ Method (private)                                                                                               ║
  ╠═══════════════════════════╤═════════════════════════╤══════════════════════════════════════════════════════════╣
  ║ createIamRole             │ iam.Role                │ Method to create IAM Role for L2 constructs.             ║
  ╚═══════════════════════════╧═════════════════════════╧══════════════════════════════════════════════════════════╝
  */
  private createIamRole(
    scope: Construct,
    roleInfo: iamRoleInfo,
    managedPolicy?: iam.ManagedPolicy[]
  ): iam.Role {
    const iamRole = new iam.Role(scope, roleInfo.id, {
      roleName: roleInfo.roleName,
      description: roleInfo.description,
      assumedBy: new iam.ServicePrincipal(roleInfo.assumed),
    });
    if (roleInfo.awsManagedPolicyAdd && roleInfo.awsManagedPolicyName) {
      for (const amp of roleInfo.awsManagedPolicyName) {
        iamRole.addManagedPolicy(
          iam.ManagedPolicy.fromAwsManagedPolicyName(amp.policyName)
        );
      }
    }
    if (roleInfo.customManagedPolicyAdd && managedPolicy) {
      for (const cmp of managedPolicy) {
        iamRole.addManagedPolicy(cmp);
      }
    }
    for (const tag of roleInfo.tags) {
      cdk.Tags.of(iamRole).add(tag.key, tag.value);
    }
    return iamRole;
  }
}
