# フォルダ構成

- フォルダ構成は以下の通り

```
`-- tf
    |-- README.rst
    |-- doc
    |   `-- 001samune.png
    |-- envs
    |   |-- backend.tf                          tfstateファイル管理設定ファイル
    |   |-- data.tf                             外部データソース定義ファイル
    |   |-- locals.tf                           ローカル変数定義ファイル
    |   |-- main.tf                             リソース定義ファイル
    |   |-- output.tf                           リソース戻り値定義ファイル
    |   |-- provider.tf                         プロバイダー設定ファイル
    |   |-- variable.tf                         変数定義ファイル
    |   `-- version.tf                          プロバイダー＆Terraformバージョン管理ファイル
    |-- folder.md
    `-- modules
        |-- ec2                                 EC2モジュール
        |   |-- data.tf                           外部データソース定義ファイル
        |   |-- main.tf                           リソース定義ファイル
        |   |-- output.tf                         リソース戻り値定義ファイル
        |   `-- variable.tf                       変数定義ファイル
        |-- iam                                 IAMモジュール
        |   |-- data.tf                           外部データソース定義ファイル
        |   |-- json
        |   |   |-- ec2-trust-policy.json         EC2用信頼ポリシー
        |   |   `-- ssm-policy.json               SSM用IAMポリシー
        |   |-- main.tf                           リソース定義ファイル
        |   |-- output.tf                         リソース戻り値定義ファイル
        |   `-- variable.tf                       変数定義ファイル
        `-- vpc_subnet                          VPC&Subnetモジュール
            |-- data.tf                           外部データソース定義ファイル
            |-- main.tf                           リソース定義ファイル
            |-- output.tf                         リソース戻り値定義ファイル
            `-- variable.tf                       変数定義ファイル
```
