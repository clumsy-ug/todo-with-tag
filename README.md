[English](./README.en.md)

# あなただけのTodoアプリ

[ブラウザで試す](https://todo-with-tag.vercel.app/)

# できること
- メールアドレス&パスワードによるサインイン/サインアップ/サインアウト
- TodoとタグのCRUD(作成/読み込み/更新/削除) 
- 各Todoに任意のタグを紐付ける
- タグによるTodo検索

# はじめに

## 必要条件
- Docker Desktop(Docker CLIとDocker Composeを含む)のインストール

## セットアップ

**1. リポジトリをクローン**
```bash
git clone https://github.com/clumsy-ug/todo-with-tag.git
cd todo-with-tag
```

**2. .env.exampleを基に.env.localファイルを作成**
```bash
cp .env.example .env.local
```

**3. Supabaseでプロジェクトを作成**

**4. Supabaseの認証情報を.env.localに追加**
```
NEXT_PUBLIC_SUPABASE_URL=<YOUR_SUPABASE_URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_KEY>
```

**5. (Node.jsを使う場合) 開発用サーバーを起動**
```bash
npm run dev
```

**5. (Dockerを使う場合) Docker Composeでアプリをビルドして実行**

> [!TIP]
> Windowsを使用している場合は、Windows環境ではなく**WSL2**環境にプロジェクトを設置し、そこからDockerを起動することで、処理の重さを少し改善できます。

```bash
docker compose up --build
```

&nbsp;&nbsp;&nbsp;キャッシュを無視して依存関係やシステム全体を再構築したい場合は以下
```bash
docker compose up --build --no-cache
```

**6. http://localhost:3000 をブラウザで開いてアプリを表示**

# 技術構成

## 言語/ライブラリ/フレームワーク等

| 領域                 | 使用技術                                                              |
| -------------------- | -------------------------------------------------------------------- |
| フロントエンド        | TypeScript(5.4.5), React(18.0), Next.js(14.2.10), Tailwind(3.4.1)    |
| バックエンド          | @supabase/ssr(0.5.1), @supabase/supabase-js(2.45.4)                  |
| データベース          | PostgreSQL(15.6)                                                     |
| インフラストラクチャー | Vercel(37.6.0)                                                       |
| 環境                 | Node.js(20.14.0) / Docker(27.2.0), Docker Compose(2.28.1)            |

## データベース構造

> [!IMPORTANT]
> テーブルの実際の中身やSupabaseのAPIキーなどの機密情報はセキュリティ上の問題から共有しません。<br>
スキーマ情報(テーブル名、カラム名、型、説明)のみの共有となります。<br>
実際に運用する際は、Supabase DashboardのAuthenticationで各テーブルに対する権限をPolicyとして別途設定する必要があります。

> [!NOTE]
> PK = Primary Key(主キー)の略、FK = Foreign Key(外部キー)の略です。<br>
あるテーブルのカラムが別のテーブルの主キーを参照する場合、そのカラムは外部キーとなります。<br>
FKの矢印は参照先を表します。FKは参照先からの影響を受ける(同期されている)ことを意味します。


### `users`テーブル

| カラム名      | 型          | 説明             |
| ------------ | ----------- | ---------------- |
| `id`         | VARCHAR     | ユーザーのID (PK) |
| `email`      | VARCHAR     | メールアドレス    |
| `created_at` | TIMESTAMPTZ | 登録日時          |

### `todos`テーブル

| カラム名      | 型          | 説明                       |
| ------------ | ----------- | -------------------------- |
| `id`         | UUID        | TodoのID (PK)              |
| `user_id`    | VARCHAR     | ユーザーのID (FK->users.id) |
| `content`    | VARCHAR     | Todoの内容                  |
| `created_at` | TIMESTAMPTZ | 作成日時                    |

### `tags`テーブル

| カラム名 | 型      | 説明                                |
| ------- | ------- | ----------------------------------- |
| `id`    | UUID    | タグのID (PK, FK->todos_tags.tag_id) |
| `name`  | VARCHAR | タグ名                               |

### `todos_tags`テーブル

| カラム名   | 型   | 説明                        |
| --------- | ---- | --------------------------- |
| `todo_id` | UUID | TodoのID (PK, FK->todos.id) |
| `tag_id`  | UUID | タグのID (PK)               |
