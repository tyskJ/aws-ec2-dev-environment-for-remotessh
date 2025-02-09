# ╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
# ║ EC2 Dev Environment For Remote SSH Stack - Terraform main.tf module                                                                              ║
# ╠═════════════════╤═══════════════════════════════════╤════════════════════════════════════════════════════════════════════════════════════════════╣
# ║ nw              │ ./modules/vpc_subnet              │ invoke network module.                                                                     ║
# ║ iam             │ ./modules/iam                     │ invoke iam module.                                                                         ║
# ║ ec2             │ ./modules/ec2                     │ invoke ec2 module.                                                                         ║
# ╚═════════════════╧═══════════════════════════════════╧════════════════════════════════════════════════════════════════════════════════════════════╝

module "nw" {
  source = "../modules/vpc_subnet"

  vpc_map    = { "name" = "dev-vpc", "cidr" = "10.0.0.0/16", "dnshost" = true, "dnssupport" = true }
  subnet_map = { "name" = "dev-subnet", "cidr" = "10.0.1.0/24", "az_name" = "${local.region_name}a", "publicip" = true }
  nacl_name  = "dev-nacl"
  igw_name   = "dev-igw"
  rtb_name   = "dev-public-rtb"
  vpcep_map  = { "name" = "dev-vpcep-gw-s3", "type" = "Gateway", "service" = "com.amazonaws.${local.region_name}.s3" }
}

module "iam" {
  source = "../modules/iam"

  ec2_role_map   = { "name" = "dev-ec2-role", "description" = "IAM role for EC2", "partition" = "${local.partition_name}" }
  ssm_policy_map = { "name" = "dev-iam-policy-ssm-ssh", "description" = "IAM Policy for SSM Start SSH Session.", "partition" = "${local.partition_name}", "region" = "${local.region_name}", "account" = "${local.account_id}", "instanceid" = module.ec2.ec2_instance_id }
}

module "ec2" {
  source = "../modules/ec2"

  key_name                  = "keypair.pem"
  private_key_file_name     = "./.keypair/keypair.pem"
  securitygroup_map         = { "name" = "dev-ec2-sg", "description" = "EC2 Security Group" }
  vpc_id                    = module.nw.vpc_id
  subnet_id                 = module.nw.subnet_id
  ec2_instance_profile_name = module.iam.ec2_instance_profile_name
  ec2_map                   = { "name" = "dev-ec2", "instancetype" = "t3.large", "volname" = "dev-ebs-root", "volumesize" = "30" }
}
