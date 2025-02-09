.. image:: ./doc/001samune.png

=====================================================================
デプロイ - Terraform -
=====================================================================

作業環境 - ローカル -
=====================================================================
* 64bit版 Windows 11 Pro
* Visual Studio Code 1.96.2 (Default Terminal: Git Bash)
* Git 2.47.1.windows.2
* AWS CLI 2.22.19.0 (profile登録&rainで利用する)
* Session Manager Plugin 1.2.553.0
* tenv v4.1.0
* Terraform v1.10.3
* gpg (GnuPG) 2.4.5
* libgcrypt 1.9.4

フォルダ構成
=====================================================================
* `こちら <./folder.md>`_ を参照

前提条件
=====================================================================
* *AdministratorAccess* がアタッチされているIAMユーザーのアクセスキーID/シークレットアクセスキーを作成していること
* 実作業は *envs* フォルダ配下で実施すること
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
1. *tfstate* 用S3バケット作成
---------------------------------------------------------------------
.. code-block:: bash

  aws s3 mb s3://tf-20250208 --profile admin

.. note::

  * バケット名は全世界で一意である必要があるため、作成に失敗した場合は任意の名前に変更
  * 変更した場合は、「 *envs/backend.tf* 」ファイル内のバケット名も修正

実作業 - ローカル -
=====================================================================
1. 公開鍵/秘密鍵ペア作成
---------------------------------------------------------------------
* 鍵ペアを作成する

.. code-block:: bash

  gpg --gen-key

.. note::

  * *Real name* には任意の名前を入力してください (今回は *dev-tf* としています)
  * *Email address* には任意のメールアドレスを入力してください (今回は入力せずEnterを押しています)
  * *passphrase* には任意のパスフレーズを入力してください (今回は入力せずEnterを押しています)

2. 公開鍵/秘密鍵ペアエクスポート
---------------------------------------------------------------------
* 公開鍵/秘密鍵ペアをエクスポートする

.. code-block:: bash

  gpg -o ./dev-tf.public.gpg --export dev-tf
  gpg -o ./dev-tf.private.gpg --export-secret-keys dev-tf

3. 公開鍵をBase64エンコード
---------------------------------------------------------------------
* エクスポートした公開鍵をBase64エンコードする

.. code-block:: bash

  cat ./dev-tf.public.gpg | base64 | tr -d '\n' > ./dev-tf.public.gpg.base64

4. *Terraform* 初期化
---------------------------------------------------------------------
.. code-block:: bash

  terraform init

5. 事前確認
---------------------------------------------------------------------
.. code-block:: bash

  terraform plan

.. note::

  * 計画時に *pgpキー* の入力が求められます
  * 作成した *dev-tf.public.gpg.base64* の中身を貼り付けてEnterを押してください

6. デプロイ
---------------------------------------------------------------------
.. code-block:: bash

  terraform apply -auto-approve

.. note::

  * デプロイ時に *pgpキー* の入力が求められます
  * 作成した *dev-tf.public.gpg.base64* の中身を貼り付けてEnterを押してください

7. pemファイル移動
---------------------------------------------------------------------
* カレントディレクトに作成された *./keypair/keypair.pem* を *~/.ssh* フォルダに移動する ( *.ssh* フォルダがない場合は作成すること)

8. ssm用ユーザーのプロファイル作成
---------------------------------------------------------------------
* outputしたSecretAccessKeyをBase64デコードし、値を確認する

.. code-block:: bash

  terraform output -raw secretaccesskey | base64 --decode | gpg -r dev-tf

* デコードしたSecretAccessKeyと、デプロイ時にプロンプトに表示されるAccessKeyIdを使用し、 *dev* プロファイルを作成する (デフォルトリージョンは *ap-northeast-1* )

.. code-block:: bash

  aws configure --profile dev


9. *~/.ssh/config* 作成
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
1. 環境削除
---------------------------------------------------------------------
.. code-block:: bash

  terraform destroy

2. *tfstate* 用S3バケット削除
---------------------------------------------------------------------
.. code-block:: bash

  aws s3 rm s3://tf-20250208/ --recursive --profile admin
  aws s3 rb s3://tf-20250208 --profile admin

.. note::

  * *事前作業(2)* で作成したバケット名に合わせること

3. 公開鍵/秘密鍵ペア削除
---------------------------------------------------------------------
* 作成した公開鍵/秘密鍵ペアを削除する

.. code-block:: bash

  gpg --delete-secret-keys dev-tf
  gpg --delete-keys dev-tf

4. エクスポートした公開鍵/秘密鍵ペア削除
---------------------------------------------------------------------
* エクスポートした公開鍵/秘密鍵ペアを削除する

.. code-block:: bash

  rm -rf ./dev-tf.public.gpg ./dev-tf.private.gpg ./dev-tf.public.gpg.base64

参考資料
=====================================================================
ブログ
---------------------------------------------------------------------
* `gpgでのファイルの暗号化基礎 <https://akihiro-ob.hatenadiary.org/entry/20120131/1328031230>`_
* `Terraform＋GPG で IAM User にログインパスワードを設定 <https://blog.father.gedow.net/2016/12/16/terraform-iam-user-password/>`_
* `Terraformで初期パスワードとシークレットアクセスキーを持つIAMユーザを作成する <https://qiita.com/takkii1010/items/eef57e29be6cb7061d95>`_
* `Terraform のコマンド、オプションを出来るだけ使ってみる <https://qiita.com/takkii1010/items/082c0854fd41bc0b26c3#terraform-apply--inputtrue>`_
