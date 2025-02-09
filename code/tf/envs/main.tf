# ╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
# ║ EC2 Dev Environment For Remote SSH Stack - Terraform main.tf module                                                                              ║
# ╠═════════════════╤═══════════════════════════════════╤════════════════════════════════════════════════════════════════════════════════════════════╣
# ║ nw              │ ./modules/vpc_subnet              │ invoke network module.                                                                     ║
# ║ iam             │ ./modules/iam                     │ invoke iam module.                                                                         ║
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

  ec2_role_map = { "name" = "dev-ec2-role", "description" = "IAM role for EC2", "partition" = "${local.partition_name}" }
}
