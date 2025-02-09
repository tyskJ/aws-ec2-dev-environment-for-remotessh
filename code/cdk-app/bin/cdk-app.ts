#!/usr/bin/env node
/*
╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║ EC2 Dev Environment For Remote SSH Stack - Cloud Development Kit cdk-app.ts                                                                        ║
╠════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
║ CDK App that bundles multiple CDK stacks.                                                                                                          ║
╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
*/
import * as cdk from "aws-cdk-lib";
import { CdkAppStack } from "../lib/stack/cdk-app-stack";
import { devParameter } from "../parameter";

const app = new cdk.App();
const stack = new CdkAppStack(app, "DEVSTACK", devParameter);

cdk.Tags.of(stack).add("App", devParameter.AppName);
