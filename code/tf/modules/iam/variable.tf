# ╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
# ║ EC2 Dev Environment For Remote SSH Stack - Terraform variable.tf variable                                                                        ║
# ╠═════════════════╤═══════════════════════════════════╤════════════════════════════════════════════════════════════════════════════════════════════╣
# ║ ec2_role_map    │ map(string)                       │ EC2 Role settings map.                                                                     ║
# ║ ssm_policy_map  │ map(string)                       │ SSM Policy settings map.                                                                   ║
# ║ iam_user_map    │ map(string)                       │ IAM User settings map.                                                                     ║
# ║ iam_group_name  │ string                            │ IAM Group Name.                                                                            ║
# ╚═════════════════╧═══════════════════════════════════╧════════════════════════════════════════════════════════════════════════════════════════════╝

variable "ec2_role_map" {
  type        = map(string)
  description = "EC2 Role settings map."
}

variable "ssm_policy_map" {
  type        = map(string)
  description = "SSM Policy settings map."
}

variable "iam_user_map" {
  type        = map(string)
  description = "IAM User settings map."
}

variable "iam_group_name" {
  type        = string
  description = "IAM Group Name."
}
