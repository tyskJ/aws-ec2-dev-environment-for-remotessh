# ╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
# ║ EC2 Dev Environment For Remote SSH Stack - Terraform main.tf resource                                                                            ║
# ╠═════════════════════════╤═══════════════════════════════════╤════════════════════════════════════════════════════════════════════════════════════╣
# ║ ec2_role                │ aws_iam_role                      │ IAM role for EC2.                                                                  ║
# ║ ec2_ssm_attach          │ aws_iam_role_policy_attachment    │ Attach ssm policy to EC2 role.                                                     ║
# ║ ec2_instance_profile    │ aws_iam_instance_profile          │ EC2 instance profile.                                                              ║
# ║ ssm_policy              │ aws_iam_policy                    │ SSM Policy.                                                                        ║
# ╚═════════════════════════╧═══════════════════════════════════╧════════════════════════════════════════════════════════════════════════════════════╝

resource "aws_iam_role" "ec2_role" {
  name               = var.ec2_role_map.name
  description        = var.ec2_role_map.description
  assume_role_policy = file("${path.module}/json/ec2-trust-policy.json")
  tags = {
    Name = var.ec2_role_map.name
  }
}

resource "aws_iam_role_policy_attachment" "ec2_ssm_attach" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:${var.ec2_role_map.partition}:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "ec2_instance_profile" {
  name = aws_iam_role.ec2_role.name
  role = aws_iam_role.ec2_role.name
}

resource "aws_iam_policy" "ssm_policy" {
  name        = var.ssm_policy_map.name
  description = var.ssm_policy_map.description
  policy = templatefile("${path.module}/json/ssm-policy.json",
    {
      Partition   = var.ssm_policy_map.partition,
      Region      = var.ssm_policy_map.region,
      Account     = var.ssm_policy_map.account,
      instance_id = var.ssm_policy_map.instanceid
    }
  )
  tags = {
    Name = var.ssm_policy_map.name
  }
}
