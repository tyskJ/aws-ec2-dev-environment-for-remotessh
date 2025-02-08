.. image:: ./doc/001samune.png

=====================================================================
デプロイ - CloudFormation -
=====================================================================

作業環境 - ローカル -
=====================================================================
* 64bit版 Windows 11 Pro
* Visual Studio Code 1.96.2 (Default Terminal: Git Bash)
* Git 2.47.1.windows.2
* AWS CLI 2.22.19.0 (profile登録&rainで利用する)
* Session Manager Plugin 1.2.553.0
* Rain v1.20.2 windows/amd64

前提条件
=====================================================================
* *AdministratorAccess* がアタッチされているIAMユーザーのアクセスキーID/シークレットアクセスキーを作成していること
* 実作業は *cfn* フォルダ配下で実施すること
* VS Codeの拡張機能である *Remote-SSH* をインストールしておくこと
* 以下コマンドを実行し、*admin* プロファイルを作成していること (デフォルトリージョンは *ap-northeast-1* )

.. code-block:: bash

  aws configure --profile admin

事前作業(1)
=====================================================================
1. 各種モジュールインストール
---------------------------------------------------------------------
* `GitHub <https://github.com/tyskJ/common-environment-setup>`_ を参照

事前作業(2)
=====================================================================
1. デプロイ用S3バケット作成
---------------------------------------------------------------------
.. code-block:: bash

  DATE=$(date '+%Y%m%d')
  aws s3 mb s3://cfn-$DATE --profile admin

実作業 - ローカル -
=====================================================================
1. *devstack* デプロイ
---------------------------------------------------------------------
.. code-block:: bash

  rain deploy devstack.yaml DEVSTACK \
  --s3-bucket cfn-$DATE \
  --config devstack-parameter.yaml --profile admin

* 以下プロンプトより入力

.. csv-table::

  "Parameter", "概要", "入力値"
  "LatestAmiId", "AmazonLinux2023最新AMIID", "何も入力せずEnter"

2. pemファイル作成
---------------------------------------------------------------------
* デプロイ完了時、プロンプトに表示される *GetKeyPairCommand* を実行する
* カレントディレクトに作成された *keypair.pem* を *~/.ssh* フォルダに移動する ( *.ssh* フォルダがない場合は作成すること)

3. ssm用ユーザーのプロファイル作成
---------------------------------------------------------------------
* デプロイ完了時、プロンプトに表示される *GetAccessKeyCommand* を実行する
* 取得したアクセスキーID/シークレットアクセスキーを使用し、 *dev* プロファイルを作成する (デフォルトリージョンは *ap-northeast-1* )

.. code-block:: bash

  aws configure --profile dev


4. *~/.ssh/config* 作成
---------------------------------------------------------------------
* *config* ファイルに以下内容を追記する

.. code-block::

  Host devserver
    HostName "i-XXXX" # デプロイしたEC2インスタンスID
    Port 22
    User ec2-user
    IdentityFile ~/.ssh/keypair.pem
    ProxyCommand C:\Program Files\Amazon\AWSCLIV2\aws.exe ssm start-session --target %h --document-name AWS-StartSSHSession --parameters portNumber=%p --profile dev



後片付け - ローカル -
=====================================================================
1. *devstack* 削除
---------------------------------------------------------------------
.. code-block:: bash

  rain rm DEVSTACK --profile admin

2. デプロイ用S3バケット削除
---------------------------------------------------------------------
.. code-block:: bash

  aws s3 rm --recursive s3://cfn-$DATE --profile admin
  aws s3 rb s3://cfn-$DATE --profile admin
