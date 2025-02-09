# ╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
# ║ EC2 Dev Environment For Remote SSH Stack - Terraform output.tf output                                                                            ║
# ╠═════════════════════════════╤════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
# ║ ec2_instance_id             │ EC2 instance ID.                                                                                                   ║
# ║ accesskeyid                 │ AccessKeyId.                                                                                                       ║
# ║ secretaccesskey             │ SecretAccessKey.                                                                                                   ║
# ╚═════════════════════════════╧════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝

output "ec2_instance_id" {
  value       = module.ec2.ec2_instance_id
  description = "EC2 instance ID."
}

output "accesskeyid" {
  value       = module.iam.accesskeyid
  description = "AccesskeyId."
}

output "secretaccesskey" {
  value       = module.iam.secretaccesskey
  description = "SecretAccessKey."
  sensitive   = true
}
