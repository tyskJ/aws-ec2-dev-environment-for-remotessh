# ╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
# ║ EC2 Dev Environment For Remote SSH Stack - Terraform variable.tf variable                                                                        ║
# ╠═════════════════╤═══════════════════════════════════╤════════════════════════════════════════════════════════════════════════════════════════════╣
# ║ vpc_map         │ map(string)                       │ VPC settings map.                                                                          ║
# ║ subnet_map      │ map(string)                       │ Subnet settings map.                                                                       ║
# ║ nacl_name       │ string                            │ NACL name.                                                                                 ║
# ║ igw_name        │ string                            │ IGW name.                                                                                  ║
# ║ rtb_name        │ string                            │ RTB name.                                                                                  ║
# ║ vpcep_map       │ map(string)                       │ VPC Endpoint settings map.                                                                 ║
# ╚═════════════════╧═══════════════════════════════════╧════════════════════════════════════════════════════════════════════════════════════════════╝

variable "vpc_map" {
  type        = map(string)
  description = "VPC settings map."
}

variable "subnet_map" {
  type        = map(string)
  description = "Subnet settings map."
}

variable "nacl_name" {
  type        = string
  description = "NACL settings."
}

variable "igw_name" {
  type        = string
  description = "IGW settings."
}

variable "rtb_name" {
  type        = string
  description = "RTB settings."
}

variable "vpcep_map" {
  type        = map(string)
  description = "VPC Endpoint settings map."
}
