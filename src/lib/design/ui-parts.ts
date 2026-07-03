export type UiPartStyleSpec = {
  property: string;
  value: string;
};

export type UiPartSpec = {
  name: string;
  className: string;
  description: string;
  styles: UiPartStyleSpec[];
};

export type UiPartGroup = {
  title: string;
  description?: string;
  parts: UiPartSpec[];
};

const RADIUS = "rounded-md (0.375rem)";
const FOCUS_RING =
  "focus-visible:ring-2 focus-visible:ring-zinc-400/40 dark:focus-visible:ring-zinc-500/40";

export const UI_PART_GROUPS: UiPartGroup[] = [
  {
    title: "ボタン",
    description: "操作の優先度に応じて主ボタン・枠線ボタン・小サイズを使い分けます。",
    parts: [
      {
        name: "主ボタン",
        className: "btn",
        description: "保存・公開・フォローなど、主要な操作に使用します。",
        styles: [
          { property: "角丸", value: RADIUS },
          { property: "パディング", value: "px-4 py-2.5" },
          { property: "文字", value: "text-sm font-medium" },
          { property: "ライト", value: "bg-zinc-800 text-zinc-50 border-zinc-800" },
          { property: "ダーク", value: "bg-zinc-200 text-zinc-900 border-zinc-200" },
          { property: "ホバー", value: "hover:bg-zinc-700 / dark:hover:bg-zinc-300" },
          { property: "フォーカス", value: FOCUS_RING },
          { property: "無効時", value: "disabled:opacity-50" },
        ],
      },
      {
        name: "主ボタン（小）",
        className: "btn btn-sm",
        description: "ヘッダーのログイン、プロフィールのフォローなどコンパクトな主操作に使用します。",
        styles: [
          { property: "ベース", value: ".btn を継承" },
          { property: "パディング", value: "px-3 py-1.5" },
        ],
      },
      {
        name: "枠線ボタン",
        className: "btn-outline",
        description: "下書き保存、フォロー解除、写真変更など副次の操作に使用します。",
        styles: [
          { property: "角丸", value: RADIUS },
          { property: "パディング", value: "px-4 py-2.5" },
          { property: "背景", value: "bg-transparent" },
          { property: "ライト枠", value: "border-zinc-200" },
          { property: "ダーク枠", value: "border-zinc-800" },
          { property: "ホバー", value: "hover:bg-zinc-100 / dark:hover:bg-zinc-800" },
          { property: "フォーカス", value: FOCUS_RING },
        ],
      },
      {
        name: "枠線ボタン（小）",
        className: "btn-outline btn-sm",
        description: "コンパクトな副次操作に使用します。",
        styles: [
          { property: "ベース", value: ".btn-outline を継承" },
          { property: "パディング", value: "px-3 py-1.5" },
        ],
      },
      {
        name: "ボタン行",
        className: "btn-row",
        description: "投稿フォームなど、複数ボタンを横並び（スマホは縦並び）に配置します。",
        styles: [
          { property: "レイアウト", value: "flex flex-col gap-3 sm:flex-row" },
          { property: "子要素", value: ".btn-row .btn / .btn-outline は flex-1" },
        ],
      },
    ],
  },
  {
    title: "フォーム",
    description: "ラベル・入力欄・テキストエリアを組み合わせて設定画面や投稿フォームを構成します。",
    parts: [
      {
        name: "フィールド",
        className: "field",
        description: "ラベルと入力要素のまとまりです。",
        styles: [
          { property: "レイアウト", value: "flex flex-col gap-1.5" },
        ],
      },
      {
        name: "ラベル",
        className: "label",
        description: "入力項目の見出しです。",
        styles: [{ property: "文字", value: "text-sm font-medium" }],
      },
      {
        name: "テキスト入力",
        className: "input",
        description: "プロフィール設定などの一行入力に使用します。",
        styles: [
          { property: "幅", value: "w-full" },
          { property: "角丸", value: RADIUS },
          { property: "パディング", value: "px-3 py-2.5" },
          { property: "文字", value: "text-base" },
          { property: "背景", value: "bg-transparent" },
          { property: "ライト枠", value: "border-zinc-200" },
          { property: "ダーク枠", value: "border-zinc-800" },
          { property: "フォーカス", value: FOCUS_RING },
        ],
      },
      {
        name: "テキストエリア",
        className: "textarea",
        description: "自己紹介文など複数行の入力に使用します。",
        styles: [
          { property: "ベース", value: ".input と同じ枠・フォーカススタイル" },
          { property: "リサイズ", value: "resize-none" },
        ],
      },
    ],
  },
  {
    title: "リンク・ナビゲーション",
    parts: [
      {
        name: "テキストリンク",
        className: "link",
        description: "補助的な遷移や戻るリンクに使用します。",
        styles: [
          { property: "文字", value: "text-sm text-zinc-500 underline" },
        ],
      },
      {
        name: "設定ナビ項目",
        className: "settings-nav-item",
        description: "設定画面のメニュー行です。",
        styles: [
          { property: "レイアウト", value: "flex items-center gap-3 py-4" },
          { property: "区切り", value: "border-b border-dashed border-zinc-200 / dark:border-zinc-800" },
          { property: "ホバー", value: "hover:text-zinc-600 / dark:hover:text-zinc-300" },
        ],
      },
      {
        name: "コラムタブ",
        className: "column-feed-nav-item",
        description: "マイページの公開済み・下書きなどのタブです。",
        styles: [
          { property: "パディング", value: "px-3 py-2.5" },
          { property: "文字", value: "text-sm text-zinc-500" },
          { property: "アクティブ", value: "column-feed-nav-item-active（下線 border-b-2）" },
        ],
      },
      {
        name: "フッターリンク",
        className: "site-footer-link",
        description: "利用規約などフッターのリンクです。",
        styles: [
          { property: "文字", value: "text-sm text-zinc-500" },
          { property: "ホバー", value: "hover:text-zinc-800 / dark:hover:text-zinc-200" },
        ],
      },
    ],
  },
  {
    title: "カード・リスト",
    parts: [
      {
        name: "カード",
        className: "card",
        description: "内容を枠で囲む静的なコンテナです。",
        styles: [
          { property: "角丸", value: RADIUS },
          { property: "パディング", value: "px-4 py-3" },
          { property: "枠", value: "border-zinc-200 / dark:border-zinc-800" },
        ],
      },
      {
        name: "カードリンク",
        className: "card-link",
        description: "クリック可能なカード型リンクです。",
        styles: [
          { property: "ベース", value: ".card と同じ枠・パディング" },
          { property: "ホバー", value: "hover:bg-zinc-50 / dark:hover:bg-zinc-900/60" },
        ],
      },
      {
        name: "空状態",
        className: "empty",
        description: "コラムやリストが空のときのプレースホルダーです。",
        styles: [
          { property: "角丸", value: RADIUS },
          { property: "枠", value: "border border-dashed border-zinc-200 / dark:border-zinc-800" },
          { property: "パディング", value: "px-6 py-12" },
          { property: "配置", value: "text-center" },
        ],
      },
      {
        name: "コラム一覧項目",
        className: "column-feed-item",
        description: "コラムリストの各行です。",
        styles: [
          { property: "区切り", value: "border-b border-dashed border-zinc-200 / dark:border-zinc-800" },
          { property: "パディング", value: "py-6" },
        ],
      },
    ],
  },
  {
    title: "フィードバック",
    description: "エラー・警告・成功は色分けせず、zinc 系の統一スタイルで表示します。",
    parts: [
      {
        name: "エラー",
        className: "alert-error",
        description: "保存失敗などエラーメッセージに使用します。",
        styles: [
          { property: "角丸", value: RADIUS },
          { property: "パディング", value: "px-4 py-3" },
          { property: "ライト", value: "bg-zinc-100 text-zinc-800 border-zinc-200" },
          { property: "ダーク", value: "bg-zinc-900 text-zinc-200 border-zinc-800" },
        ],
      },
      {
        name: "警告",
        className: "alert-warning",
        description: "注意喚起メッセージに使用します。",
        styles: [
          { property: "スタイル", value: ".alert-error と同じ（zinc 系統一）" },
        ],
      },
      {
        name: "成功",
        className: "alert-success",
        description: "保存完了などの成功メッセージに使用します。",
        styles: [
          { property: "スタイル", value: ".alert-error と同じ（zinc 系統一）" },
        ],
      },
      {
        name: "バッジ",
        className: "badge",
        description: "下書きラベルなど補足的なラベルです。",
        styles: [{ property: "文字", value: "text-xs text-zinc-500" }],
      },
    ],
  },
  {
    title: "その他のパーツ",
    parts: [
      {
        name: "セグメント切替",
        className: "segmented-control / segmented-item",
        description: "カラーモードや文字組み設定の選択 UI です。",
        styles: [
          { property: "コンテナ", value: "grid w-full rounded-md border" },
          { property: "項目", value: "px-3 py-2.5 text-sm" },
          { property: "選択中", value: "segmented-item-active（bg-zinc-100 / dark:bg-zinc-800）" },
        ],
      },
      {
        name: "アバター",
        className: "avatar",
        description: "プロフィール画像のフォールバック（イニシャル表示）です。",
        styles: [
          { property: "形", value: "rounded-full" },
          { property: "ライト", value: "bg-zinc-200 text-zinc-600" },
          { property: "ダーク", value: "bg-zinc-800 text-zinc-400" },
        ],
      },
      {
        name: "エディター",
        className: "editor",
        description: "コラム投稿の本文入力エリアの外枠です。",
        styles: [
          { property: "角丸", value: RADIUS },
          { property: "枠", value: "border-zinc-200 / dark:border-zinc-800" },
          { property: "フッター", value: "editor-footer（文字数表示）" },
        ],
      },
      {
        name: "ヘッダーメニュー",
        className: "header-menu-popup / header-menu-item",
        description: "ログイン後のユーザーメニューです。",
        styles: [
          { property: "ポップアップ", value: "rounded-lg border shadow-sm w-56" },
          { property: "項目", value: "px-4 py-2.5 text-sm hover:bg-zinc-100" },
        ],
      },
      {
        name: "文字組み FAB",
        className: "column-typography-fab-trigger",
        description: "コラム閲覧時の文字組み設定ボタンです。",
        styles: [
          { property: "形", value: "h-10 w-10 rounded-full" },
          { property: "影", value: "shadow-md" },
          { property: "枠", value: "border-zinc-200 / dark:border-zinc-800" },
        ],
      },
    ],
  },
];
