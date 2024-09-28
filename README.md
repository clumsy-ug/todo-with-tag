[English](./README.en.md)

# あなただけのTodoアプリ

[ブラウザで試す](https://todo-with-tag.vercel.app/)

## できること
- メールアドレスとパスワードによるサインイン/サインアップ/サインアウト
- TodoとタグのCRUD(作成/読み込み/更新/削除) 
- 各Todoに任意のタグを紐付ける
- タグによるTodo検索

## はじめに

### 必要条件
- Docker Desktop(Docker CLIとDocker Composeを含む)のインストール

### セットアップ

**1. リポジトリをクローン**
```bash
git clone https://github.com/clumsy-ug/todo-with-tag.git
cd todo-with-tag
```

**2. .env.exampleを基に.env.localファイルを作成**
```bash
cp .env.example .env.local
```

**3. Supabaseの認証情報を.env.localに追加**
```
NEXT_PUBLIC_SUPABASE_URL=<YOUR_SUPABASE_URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_KEY>
```

**4. Docker Composeでアプリをビルドして実行**

> [!TIP]
> Windowsを使用している場合は、Windows環境ではなく**WSL2**環境にプロジェクトを設置し、そこからDockerを起動することで、処理の重さを少し改善できます。

```bash
docker compose up --build
```

&nbsp;&nbsp;&nbsp;キャッシュを無視して依存関係やシステム全体を再構築したい場合は
```bash
docker compose up --build --no-cache
```

**5. http://localhost:3000 をブラウザを開いてアプリを表示**

## 技術構成

| 領域           | 使用技術                                                              |
| -------------  | -------------------------------------------------------------------- |
| Frontend       | TypeScript(5.4.5), React(18.0), Next.js(14.2.10), Tailwind(3.4.1)    |
| Backend        | @supabase/ssr(0.5.1), @supabase/supabase-js(2.45.4)                  |
| Database       | PostgreSQL(15.6)                                                     |
| Infrastructure | Vercel(37.6.0)                                                       |
| Environment    | Node.js(20.14.0) / Docker(27.2.0), Docker Compose(2.28.1)            |
