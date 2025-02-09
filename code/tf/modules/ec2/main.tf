# ╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
# ║ EC2 Dev Environment For Remote SSH Stack - Terraform main.tf resource                                                                            ║
# ╠═════════════════════════╤═══════════════════════════════════╤════════════════════════════════════════════════════════════════════════════════════╣
# ║ ssh_keygen              │ tls_private_key                   │ setting SSH keygen algorithm.                                                      ║
# ║ keypair_pem             │ local_sensitive_file              │ create private key file to local.                                                  ║
# ║ keypair                 │ aws_key_pair                      │ Key Pair.                                                                          ║
# ║ securitygroup           │ aws_security_group                │ EC2 Security Group.                                                                ║
# ║ sg_out_rule1            │ aws_security_group_rule           │ SG Outbound Rule.                                                                  ║
# ║ ec2_instance            │ aws_instance                      │ EC2 Instance.                                                                      ║
# ╚═════════════════════════╧═══════════════════════════════════╧════════════════════════════════════════════════════════════════════════════════════╝

resource "tls_private_key" "ssh_keygen" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "local_sensitive_file" "keypair_pem" {
  filename        = var.private_key_file_name
  content         = tls_private_key.ssh_keygen.private_key_pem
  file_permission = "0600"
}

resource "aws_key_pair" "keypair" {
  key_name   = var.key_name
  public_key = tls_private_key.ssh_keygen.public_key_openssh
  tags = {
    Name = var.key_name
  }
}

resource "aws_security_group" "securitygroup" {
  name        = var.securitygroup_map.name
  vpc_id      = var.vpc_id
  description = var.securitygroup_map.description
  tags = {
    Name = var.securitygroup_map.name
  }
}

resource "aws_security_group_rule" "sg_out_rule1" {
  security_group_id = aws_security_group.securitygroup.id
  description       = "Allow all outbound traffic"
  type              = "egress"
  protocol          = "-1"
  from_port         = 0
  to_port           = 0
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_instance" "ec2_instance" {
  ami                         = data.aws_ssm_parameter.amazonlinux_2023.value
  associate_public_ip_address = true
  iam_instance_profile        = var.ec2_instance_profile_name
  key_name                    = aws_key_pair.keypair.id
  instance_type               = var.ec2_map.instancetype
  root_block_device {
    volume_size           = var.ec2_map.volumesize
    volume_type           = "gp3"
    iops                  = 3000
    throughput            = 125
    delete_on_termination = true
    encrypted             = true
    tags = {
      Name = var.ec2_map.volname
    }
  }
  metadata_options {
    http_tokens = "required"
  }
  subnet_id              = var.subnet_id
  vpc_security_group_ids = [aws_security_group.securitygroup.id]
  tags = {
    Name = var.ec2_map.name
  }
}
