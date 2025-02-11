# フォルダ構成

- フォルダ構成は以下の通り

```
.
cdk-app
|-- README.rst
|-- bin
|   `-- cdk-app.ts                CDK App定義ファイル
|-- lib
|   |-- construct                 コンストラクト
|   |   |-- ec2.ts                  EC2関連作成
|   |   |-- iam.ts                  IAMロール, ポリシー, グループ, ユーザー, アクセスキー, SecretsManager作成
|   |   `-- network.ts              VPC, Subnet, NACL, IGW, RTB, S3 Gateway Endpoint作成
|   |-- json
|   |   `-- policy
|   |       `-- ssm-policy.json   SSM Start SSH Session用IAMポリシーファイル
|   `-- stack
|       `-- cdk-app-stack.ts      CDK Stack定義ファイル
`-- parameter.ts                  環境リソース設定値定義ファイル
```
