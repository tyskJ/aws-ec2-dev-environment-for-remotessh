# ╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
# ║ EC2 Dev Environment For Remote SSH Stack - Terraform variable.tf variable                                                                        ║
# ╠═════════════════╤═══════════════════════════════════╤════════════════════════════════════════════════════════════════════════════════════════════╣
# ║ ec2_role_map    │ map(string)                       │ EC2 Role settings map.                                                                     ║
# ║ ssm_policy_map  │ map(string)                       │ SSM Policy settings map.                                                                   ║
# ╚═════════════════╧═══════════════════════════════════╧════════════════════════════════════════════════════════════════════════════════════════════╝

variable "ec2_role_map" {
  type        = map(string)
  description = "EC2 Role settings map."
}

variable "ssm_policy_map" {
  type        = map(string)
  description = "SSM Policy settings map."
}
