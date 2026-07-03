import { UI_PART_GROUPS, type UiPartSpec } from "@/lib/design/ui-parts";

function PartStyleTable({ part }: { part: UiPartSpec }) {
  return (
    <div className="typography-spec-table-wrap">
      <table className="typography-spec-table">
        <caption className="typography-spec-caption">
          <code>{part.className}</code> — {part.description}
        </caption>
        <thead>
          <tr>
            <th scope="col">プロパティ</th>
            <th scope="col">値</th>
          </tr>
        </thead>
        <tbody>
          {part.styles.map((style) => (
            <tr key={`${part.className}-${style.property}`}>
              <th scope="row">{style.property}</th>
              <td>
                <code>{style.value}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ButtonPreviews() {
  return (
    <div className="ui-parts-preview">
      <button type="button" className="btn btn-sm">
        主ボタン（小）
      </button>
      <button type="button" className="btn">
        主ボタン
      </button>
      <button type="button" className="btn-outline btn-sm">
        枠線（小）
      </button>
      <button type="button" className="btn-outline">
        枠線ボタン
      </button>
      <button type="button" className="btn" disabled>
        無効
      </button>
    </div>
  );
}

function FormPreviews() {
  return (
    <div className="ui-parts-preview ui-parts-preview-stack">
      <div className="field">
        <label className="label" htmlFor="design-preview-input">
          ラベル
        </label>
        <input
          id="design-preview-input"
          type="text"
          className="input"
          defaultValue="テキスト入力の例"
          readOnly
        />
      </div>
      <div className="field">
        <label className="label" htmlFor="design-preview-textarea">
          テキストエリア
        </label>
        <textarea
          id="design-preview-textarea"
          className="textarea"
          rows={3}
          defaultValue="複数行入力の例です。"
          readOnly
        />
      </div>
    </div>
  );
}

function FeedbackPreviews() {
  return (
    <div className="ui-parts-preview ui-parts-preview-stack">
      <p className="alert-error">エラーメッセージの例です。</p>
      <p className="alert-warning">警告メッセージの例です。</p>
      <p className="alert-success">成功メッセージの例です。</p>
      <p>
        下書き <span className="badge">下書き</span>
      </p>
    </div>
  );
}

function MiscPreviews() {
  return (
    <div className="ui-parts-preview ui-parts-preview-stack">
      <div className="card">カードの例</div>
      <div className="empty muted">空状態の例</div>
      <div className="avatar h-10 w-10 text-sm">A</div>
    </div>
  );
}

function GroupPreview({ title }: { title: string }) {
  switch (title) {
    case "ボタン":
      return <ButtonPreviews />;
    case "フォーム":
      return <FormPreviews />;
    case "フィードバック":
      return <FeedbackPreviews />;
    case "カード・リスト":
      return <MiscPreviews />;
    default:
      return null;
  }
}

export function UiPartsSpec() {
  return (
    <section className="legal-section">
      <h2 className="legal-section-title">UI パーツ</h2>
      <p className="legal-section-paragraph">
        ボタン・入力欄・リンク・カードなど、画面を構成する共通パーツは{" "}
        <code>globals.css</code> のコンポーネントクラスで定義しています。クラス名は HTML
        要素に付与して使います。
      </p>

      {UI_PART_GROUPS.map((group) => (
        <div key={group.title} className="ui-parts-group">
          <h3 className="typography-spec-subtitle">{group.title}</h3>
          {group.description && (
            <p className="legal-section-paragraph">{group.description}</p>
          )}

          <GroupPreview title={group.title} />

          <div className="ui-parts-spec-list">
            {group.parts.map((part) => (
              <div key={part.className} className="ui-parts-spec-item">
                <h4 className="ui-parts-spec-name">{part.name}</h4>
                <PartStyleTable part={part} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
