# ╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
# ║ EC2 Dev Environment For Remote SSH Stack - Terraform variable.tf variable                                                                        ║
# ╠════════════════════════╤═══════════════════════════════════╤═════════════════════════════════════════════════════════════════════════════════════╣
# ║ private_key_file_name  │ string                            │ SSH public key file name.                                                           ║
# ║ key_name               │ string                            │ KeyPair name.                                                                       ║
# ║ securitygroup_map      │ map(string)                       │ Security Group settings.                                                            ║
# ║ vpc_id                 │ string                            │ VPC ID.                                                                             ║
# ║ subnet_id              │ string                            │ Subnet ID.                                                                          ║
# ║ instanceprofile_name   │ string                            │ EC2 instance profile name.                                                          ║
# ║ ec2_map                │ map(string)                       │ ec2 instance settings.                                                              ║
# ║ lt_name                │ string                            │ launch template name.                                                               ║
# ╚════════════════════════╧═══════════════════════════════════╧═════════════════════════════════════════════════════════════════════════════════════╝

variable "private_key_file_name" {
  type        = string
  description = "SSH private key file name."
}

variable "key_name" {
  type        = string
  description = "KeyPair name."
}

variable "securitygroup_map" {
  type        = map(string)
  description = "Security Group settings."
}

variable "vpc_id" {
  type        = string
  description = "VPC ID."
}

variable "subnet_id" {
  type        = string
  description = "Subnet ID."
}

variable "ec2_instance_profile_name" {
  type        = string
  description = "EC2 instance profile name."
}

variable "ec2_map" {
  type        = map(string)
  description = "ec2 instance settings."
}
