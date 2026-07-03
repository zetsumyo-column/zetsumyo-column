import {
  THEME_BASE_COLOR_TOKENS,
  THEME_BASE_PALETTE,
  THEME_STORAGE_KEY,
  THEME_UI_COLOR_TOKENS,
  ZINC_PALETTE,
  type ColorModeToken,
  type PaletteColor,
} from "@/lib/theme/color-tokens";

function isLightSwatch(hex: string): boolean {
  if (!hex.startsWith("#") || hex.length < 7) {
    return false;
  }

  const red = Number.parseInt(hex.slice(1, 3), 16);
  const green = Number.parseInt(hex.slice(3, 5), 16);
  const blue = Number.parseInt(hex.slice(5, 7), 16);
  const luminance = (red * 299 + green * 587 + blue * 114) / 1000;

  return luminance > 160;
}

type ColorSwatchProps = {
  label: string;
  hex: string;
  sublabel?: string;
};

function ColorSwatch({ label, hex, sublabel }: ColorSwatchProps) {
  const lightText = isLightSwatch(hex);

  return (
    <figure className="color-palette-swatch">
      <div
        className="color-palette-chip"
        style={{ backgroundColor: hex }}
        aria-hidden
      >
        <span
          className={
            lightText ? "color-palette-chip-text-dark" : "color-palette-chip-text-light"
          }
        >
          Aa
        </span>
      </div>
      <figcaption className="color-palette-caption">
        <span className="color-palette-name">{label}</span>
        <code className="color-palette-hex">{hex}</code>
        {sublabel && <span className="color-palette-sublabel">{sublabel}</span>}
      </figcaption>
    </figure>
  );
}

type PaletteGridProps = {
  title: string;
  colors: PaletteColor[];
};

function PaletteGrid({ title, colors }: PaletteGridProps) {
  return (
    <div className="color-palette-group">
      <h3 className="typography-spec-subtitle">{title}</h3>
      <div className="color-palette-grid">
        {colors.map((color) => (
          <ColorSwatch key={color.name} label={color.name} hex={color.hex} />
        ))}
      </div>
    </div>
  );
}

function BasePalette() {
  return (
    <div className="color-palette-group">
      <h3 className="typography-spec-subtitle">ベースカラー（ライト / ダーク）</h3>
      <div className="color-palette-base-grid">
        {THEME_BASE_PALETTE.map((palette) => (
          <div key={palette.mode} className="color-palette-base-card">
            <p className="color-palette-base-mode">{palette.mode}</p>
            <div className="color-palette-base-swatches">
              <ColorSwatch label="背景" hex={palette.background} sublabel="--background" />
              <ColorSwatch label="文字" hex={palette.foreground} sublabel="--foreground" />
            </div>
            <div
              className="color-palette-base-preview"
              style={{
                backgroundColor: palette.background,
                color: palette.foreground,
              }}
            >
              <p className="color-palette-base-preview-title">絶妙コラム</p>
              <p className="color-palette-base-preview-body">
                背景と文字色の組み合わせのプレビューです。
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SemanticPalette({ tokens }: { tokens: ColorModeToken[] }) {
  return (
    <div className="color-palette-group">
      <h3 className="typography-spec-subtitle">UI セマンティックカラー</h3>
      <div className="color-palette-semantic-list">
        {tokens.map((token) => (
          <div key={token.label} className="color-palette-semantic-item">
            <p className="color-palette-semantic-label">{token.label}</p>
            <div className="color-palette-semantic-swatches">
              <ColorSwatch label="ライト" hex={token.light} />
              <ColorSwatch label="ダーク" hex={token.dark} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type ColorModeTableProps = {
  caption: string;
  tokens: ColorModeToken[];
};

function ColorModeTable({ caption, tokens }: ColorModeTableProps) {
  return (
    <div className="typography-spec-table-wrap">
      <table className="typography-spec-table">
        <caption className="typography-spec-caption">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">用途</th>
            <th scope="col">CSS</th>
            <th scope="col">ライト</th>
            <th scope="col">ダーク</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr key={token.label}>
              <th scope="row">{token.label}</th>
              <td>
                <code>{token.css}</code>
              </td>
              <td>
                <div className="color-palette-table-cell">
                  <span
                    className="color-palette-table-chip"
                    style={{ backgroundColor: token.light }}
                    aria-hidden
                  />
                  <code>{token.light}</code>
                </div>
              </td>
              <td>
                <div className="color-palette-table-cell">
                  <span
                    className="color-palette-table-chip"
                    style={{ backgroundColor: token.dark }}
                    aria-hidden
                  />
                  <code>{token.dark}</code>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ColorModeSpec() {
  return (
    <section className="legal-section">
      <h2 className="legal-section-title">カラーモードの色</h2>
      <p className="legal-section-paragraph">
        ライトとダークは <code>html</code> 要素の <code>light</code> /{" "}
        <code>dark</code> クラスで切り替えます。設定は{" "}
        <code>localStorage</code>（キー: <code>{THEME_STORAGE_KEY}</code>
        ）に保存され、初回表示前にインラインスクリプトで適用されます。
      </p>

      <PaletteGrid title="Zinc パレット" colors={ZINC_PALETTE} />
      <BasePalette />
      <SemanticPalette tokens={THEME_UI_COLOR_TOKENS} />

      <ColorModeTable caption="ベースカラー（CSS 変数）" tokens={THEME_BASE_COLOR_TOKENS} />

      <ColorModeTable
        caption="UI コンポーネント（Tailwind クラス）"
        tokens={THEME_UI_COLOR_TOKENS}
      />

      <p className="legal-section-paragraph mt-3">
        ベースカラーは <code>body</code> の背景・文字色に使われます。ボタンやボーダーなどは
        Tailwind の zinc 系パレットをライト / ダークで組み合わせ、コントラストを反転させています。
      </p>
    </section>
  );
}
