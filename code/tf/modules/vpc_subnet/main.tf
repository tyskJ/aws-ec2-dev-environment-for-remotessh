# ╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
# ║ EC2 Dev Environment For Remote SSH Stack - Terraform main.tf resource                                                                            ║
# ╠═════════════════╤═══════════════════════════════════╤════════════════════════════════════════════════════════════════════════════════════════════╣
# ║ vpc             │ aws_vpc                           │ VPC.                                                                                       ║
# ║ subnet          │ aws_subnet                        │ Subnet.                                                                                    ║
# ║ nacl            │ aws_network_acl                   │ NACL.                                                                                      ║
# ║ nacl_in_rule100 │ aws_network_acl_rule              │ NACL Inbound Rule.                                                                         ║
# ║ assoc_nacl1     │ aws_network_acl_association       │ NACL Association Subnet.                                                                   ║
# ╚═════════════════╧═══════════════════════════════════╧════════════════════════════════════════════════════════════════════════════════════════════╝

resource "aws_vpc" "vpc" {
  cidr_block           = var.vpc_map.cidr
  enable_dns_hostnames = var.vpc_map.dnshost
  enable_dns_support   = var.vpc_map.dnssupport
  tags = {
    Name = var.vpc_map.name
  }
}

resource "aws_subnet" "subnet" {
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = var.subnet_map.cidr
  availability_zone = var.subnet_map.az_name
  map_public_ip_on_launch = var.subnet_map.publicip
  tags = {
    Name = var.subnet_map.name
  }
}

resource "aws_network_acl" "nacl" {
  vpc_id = aws_vpc.vpc.id
  tags = {
    Name = var.nacl_name
  }
}

resource "aws_network_acl_rule" "nacl_in_rule100" {
  network_acl_id = aws_network_acl.nacl.id
  rule_number    = 100
  egress         = false
  protocol       = -1
  rule_action    = "allow"
  cidr_block     = "0.0.0.0/0"
}

resource "aws_network_acl_rule" "nacl_out_rule100" {
  network_acl_id = aws_network_acl.nacl.id
  rule_number    = 100
  egress         = true
  protocol       = -1
  rule_action    = "allow"
  cidr_block     = "0.0.0.0/0"
}

resource "aws_network_acl_association" "assoc_nacl1" {
  network_acl_id = aws_network_acl.nacl.id
  subnet_id      = aws_subnet.subnet.id
}
