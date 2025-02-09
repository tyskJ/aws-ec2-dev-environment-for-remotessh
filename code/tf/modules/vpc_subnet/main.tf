# ╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
# ║ EC2 Dev Environment For Remote SSH Stack - Terraform main.tf resource                                                                            ║
# ╠═════════════════╤═══════════════════════════════════╤════════════════════════════════════════════════════════════════════════════════════════════╣
# ║ vpc             │ aws_vpc                           │ VPC.                                                                                       ║
# ║ subnet          │ aws_subnet                        │ Subnet.                                                                                    ║
# ║ nacl            │ aws_network_acl                   │ NACL.                                                                                      ║
# ║ nacl_in_rule100 │ aws_network_acl_rule              │ NACL Inbound Rule.                                                                         ║
# ║ assoc_nacl1     │ aws_network_acl_association       │ NACL Association Subnet.                                                                   ║
# ║ igw             │ aws_internet_gateway              │ IGW.                                                                                       ║
# ║ rtb             │ aws_route_table                   │ RouteTable.                                                                                ║
# ║ route1          │ aws_route                         │ RouteTable Route.                                                                          ║
# ║ assoc_rtb1      │ aws_route_table_association       │ RouteTable Association Subnet.                                                             ║
# ║ vpcep_gw_s3     │ aws_vpc_endpoint                  │ VPC Endpoint Gateway S3.                                                                   ║
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
  vpc_id                  = aws_vpc.vpc.id
  cidr_block              = var.subnet_map.cidr
  availability_zone       = var.subnet_map.az_name
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

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc.id
  tags = {
    Name = var.igw_name
  }
}

resource "aws_route_table" "rtb" {
  vpc_id = aws_vpc.vpc.id
  tags = {
    Name = var.rtb_name
  }
}

resource "aws_route" "route1" {
  route_table_id         = aws_route_table.rtb.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.igw.id
}

resource "aws_route_table_association" "assoc_rtb1" {
  subnet_id      = aws_subnet.subnet.id
  route_table_id = aws_route_table.rtb.id
}

resource "aws_vpc_endpoint" "vpcep_gw_s3" {
  vpc_id            = aws_vpc.vpc.id
  vpc_endpoint_type = var.vpcep_map.type
  service_name      = var.vpcep_map.service
  route_table_ids   = [aws_route_table.rtb.id]
  tags = {
    Name = var.vpcep_map.name
  }
}
