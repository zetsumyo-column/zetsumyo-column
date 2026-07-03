import {
  COLUMN_TITLE_FONT_SIZE_BY_BODY,
  DEFAULT_COLUMN_TYPOGRAPHY,
  FONT_FAMILY_OPTIONS,
  FONT_SIZE_OPTIONS,
  LETTER_SPACING_OPTIONS,
  LINE_HEIGHT_OPTIONS,
  PARAGRAPH_SPACING_OPTIONS,
  getTypographyStyle,
} from "@/lib/column/typography";

type TransposedSpecTableProps = {
  caption: string;
  property: string;
  options: Array<{ label: string; value: string }>;
};

function TransposedSpecTable({
  caption,
  property,
  options,
}: TransposedSpecTableProps) {
  return (
    <div className="typography-spec-table-wrap">
      <table className="typography-spec-table">
        <caption className="typography-spec-caption">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">CSS プロパティ</th>
            {options.map((option) => (
              <th key={option.label} scope="col">
                {option.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">
              <code>{property}</code>
            </th>
            {options.map((option) => (
              <td key={option.label}>
                <code>{option.value}</code>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function TypographySpec() {
  const defaultStyle = getTypographyStyle(DEFAULT_COLUMN_TYPOGRAPHY);

  return (
    <section className="legal-section">
      <h2 className="legal-section-title">文字組みの CSS 値</h2>
      <p className="legal-section-paragraph">
        コラム本文は <code>.column-content</code> に、見出しは <code>h1</code>（
        <code>ColumnTitle</code>）にインラインスタイルで反映されます。設定値は{" "}
        <code>localStorage</code>（キー: <code>zetsumyo-column-typography</code>
        ）に保存されます。
      </p>

      <h3 className="typography-spec-subtitle">デフォルト（初回表示時）</h3>
      <div className="typography-spec-table-wrap">
        <table className="typography-spec-table">
          <thead>
            <tr>
              <th scope="col">対象</th>
              <th scope="col">CSS プロパティ</th>
              <th scope="col">値</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">本文</th>
              <td>
                <code>font-family</code>
              </td>
              <td>
                <code>{defaultStyle.fontFamily}</code>
              </td>
            </tr>
            <tr>
              <th scope="row">本文</th>
              <td>
                <code>font-size</code>
              </td>
              <td>
                <code>{defaultStyle.fontSize}</code>
              </td>
            </tr>
            <tr>
              <th scope="row">本文・見出し</th>
              <td>
                <code>line-height</code>
              </td>
              <td>
                <code>{defaultStyle.lineHeight}</code>
              </td>
            </tr>
            <tr>
              <th scope="row">本文・見出し</th>
              <td>
                <code>letter-spacing</code>
              </td>
              <td>
                <code>{defaultStyle.letterSpacing}</code>
              </td>
            </tr>
            <tr>
              <th scope="row">本文（段落間）</th>
              <td>
                <code>gap</code>
              </td>
              <td>
                <code>{defaultStyle.gap}</code>
              </td>
            </tr>
            <tr>
              <th scope="row">本文（レイアウト）</th>
              <td>
                <code>display / flex-direction</code>
              </td>
              <td>
                <code>
                  {defaultStyle.display} / {defaultStyle.flexDirection}
                </code>
              </td>
            </tr>
            <tr>
              <th scope="row">見出し</th>
              <td>
                <code>font-size</code>
              </td>
              <td>
                <code>
                  {COLUMN_TITLE_FONT_SIZE_BY_BODY[DEFAULT_COLUMN_TYPOGRAPHY.fontSize]}
                </code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <TransposedSpecTable
        caption="書体（font-family）"
        property="font-family"
        options={FONT_FAMILY_OPTIONS.map((option) => ({
          label: option.label,
          value: option.family,
        }))}
      />

      <TransposedSpecTable
        caption="文字サイズ（font-size）— 本文"
        property="font-size"
        options={FONT_SIZE_OPTIONS.map((option) => ({
          label: option.label,
          value: option.size,
        }))}
      />

      <TransposedSpecTable
        caption="文字サイズ（font-size）— 見出し"
        property="font-size"
        options={FONT_SIZE_OPTIONS.map((option) => ({
          label: option.label,
          value: COLUMN_TITLE_FONT_SIZE_BY_BODY[option.value],
        }))}
      />

      <TransposedSpecTable
        caption="行間（line-height）"
        property="line-height"
        options={LINE_HEIGHT_OPTIONS.map((option) => ({
          label: option.label,
          value: option.height,
        }))}
      />

      <TransposedSpecTable
        caption="段落の広さ（gap）"
        property="gap"
        options={PARAGRAPH_SPACING_OPTIONS.map((option) => ({
          label: option.label,
          value: option.spacing,
        }))}
      />

      <TransposedSpecTable
        caption="字間（letter-spacing）"
        property="letter-spacing"
        options={LETTER_SPACING_OPTIONS.map((option) => ({
          label: option.label,
          value: option.spacing,
        }))}
      />

      <p className="legal-section-paragraph mt-3">
        段落の広さは <code>display: flex</code> と <code>flex-direction: column</code>{" "}
        を組み合わせ、段落要素間の <code>gap</code> として適用しています。見出しは本文と同じ{" "}
        <code>font-family</code>・<code>line-height</code>・<code>letter-spacing</code>{" "}
        を引き継ぎ、<code>font-size</code> のみ見出し用の値になります。
      </p>
    </section>
  );
}
