# ╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
# ║ EC2 Dev Environment For Remote SSH Stack - Terraform main.tf module                                                                              ║
# ╠═════════════════╤═══════════════════════════════════╤════════════════════════════════════════════════════════════════════════════════════════════╣
# ║ nw              │ ./modules/vpc_subnet              │ invoke network module.                                                                     ║
# ╚═════════════════╧═══════════════════════════════════╧════════════════════════════════════════════════════════════════════════════════════════════╝

module "nw" {
  source = "../modules/vpc_subnet"

  vpc_map    = { "name" = "dev-vpc", "cidr" = "10.0.0.0/16", "dnshost" = true, "dnssupport" = true }
  subnet_map = { "name" = "dev-subnet", "cidr" = "10.0.1.0/24", "az_name" = "${local.region_name}a", "publicip" = true }
  nacl_name  = "dev-nacl"
}
