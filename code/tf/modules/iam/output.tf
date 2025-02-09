# ╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
# ║ EC2 Dev Environment For Remote SSH Stack - Terraform output.tf output                                                                            ║
# ╠═════════════════════════════╤════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
# ║ ec2_instance_profile_name   │ EC2 instance profile name.                                                                                         ║
# ║ accesskeyid                 │ AccessKeyId.                                                                                                       ║
# ║ secretaccesskey             │ SecretAccessKey.                                                                                                   ║
# ╚═════════════════════════════╧════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝

output "ec2_instance_profile_name" {
  value       = aws_iam_instance_profile.ec2_instance_profile.name
  description = "EC2 instance profile name."
}

output "accesskeyid" {
  value       = aws_iam_access_key.access_key.id
  description = "AccesskeyId."
}

output "secretaccesskey" {
  value       = aws_iam_access_key.access_key.encrypted_secret
  description = "SecretAccessKey."
}
