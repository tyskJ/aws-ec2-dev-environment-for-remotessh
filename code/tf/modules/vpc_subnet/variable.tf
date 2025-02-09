# ╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
# ║ EC2 Dev Environment For Remote SSH Stack - Terraform variable.tf variable                                                                        ║
# ╠═════════════════╤═══════════════════════════════════╤════════════════════════════════════════════════════════════════════════════════════════════╣
# ║ vpc_map         │ map(string)                       │ VPC settings map.                                                                          ║
# ║ subnet_map      │ map(string)                       │ Subnet settings map.                                                                       ║
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
