import {
  THEME_MODES,
  THEME_STORAGE_KEY,
  ZINC_PALETTE,
  ZINC_PALETTE_BY_MODE,
  type ModeColorSpec,
  type PaletteColor,
  type ThemeModeSpec,
} from "@/lib/theme/color-tokens";
import {
  CONTRAST_LEVEL_OPTIONS,
  DARK_CONTRAST_PRESETS,
  LIGHT_CONTRAST_PRESETS,
  THEME_CONTRAST_DARK_STORAGE_KEY,
  THEME_CONTRAST_LIGHT_STORAGE_KEY,
} from "@/lib/theme/contrast-tokens";

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

function PaletteGrid({ title, colors }: { title: string; colors: PaletteColor[] }) {
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

function ModeColorTable({ colors }: { colors: ModeColorSpec[] }) {
  return (
    <div className="typography-spec-table-wrap">
      <table className="typography-spec-table">
        <thead>
          <tr>
            <th scope="col">用途</th>
            <th scope="col">クラス / 変数</th>
            <th scope="col">Tailwind</th>
            <th scope="col">色</th>
          </tr>
        </thead>
        <tbody>
          {colors.map((color) => (
            <tr key={color.label}>
              <th scope="row">{color.label}</th>
              <td>
                <code>{color.css}</code>
                {color.description && (
                  <p className="color-mode-table-note">{color.description}</p>
                )}
              </td>
              <td>{color.tailwind ? <code>{color.tailwind}</code> : "—"}</td>
              <td>
                <div className="color-palette-table-cell">
                  <span
                    className="color-palette-table-chip"
                    style={{ backgroundColor: color.hex }}
                    aria-hidden
                  />
                  <code>{color.hex}</code>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ContrastLevelTable({ theme }: { theme: "light" | "dark" }) {
  const presets = theme === "dark" ? DARK_CONTRAST_PRESETS : LIGHT_CONTRAST_PRESETS;
  const title = theme === "dark" ? "ダークモードのコントラスト" : "ライトモードのコントラスト";

  return (
    <div className="color-palette-group">
      <h3 className="typography-spec-subtitle">{title}</h3>
      <div className="typography-spec-table-wrap">
        <table className="typography-spec-table">
          <thead>
            <tr>
              <th scope="col">段階</th>
              <th scope="col">説明</th>
              <th scope="col">背景</th>
              <th scope="col">文字</th>
            </tr>
          </thead>
          <tbody>
            {CONTRAST_LEVEL_OPTIONS.map((option) => {
              const preset = presets[option.value];

              return (
                <tr key={option.value}>
                  <th scope="row">{option.label}</th>
                  <td>{option.description}</td>
                  <td>
                    <div className="color-palette-table-cell">
                      <span
                        className="color-palette-table-chip"
                        style={{ backgroundColor: preset.background }}
                        aria-hidden
                      />
                      <code>{preset.background}</code>
                    </div>
                  </td>
                  <td>
                    <div className="color-palette-table-cell">
                      <span
                        className="color-palette-table-chip"
                        style={{ backgroundColor: preset.foreground }}
                        aria-hidden
                      />
                      <code>{preset.foreground}</code>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ModeColorSection({ spec }: { spec: ThemeModeSpec }) {
  const paletteNames = new Set<string>(
    spec.mode === "ライト" ? ZINC_PALETTE_BY_MODE.light : ZINC_PALETTE_BY_MODE.dark,
  );
  const modePalette = ZINC_PALETTE.filter((color) => paletteNames.has(color.name));

  return (
    <section className="color-mode-section" aria-labelledby={`color-mode-${spec.htmlClass}`}>
      <h3 className="color-mode-section-title" id={`color-mode-${spec.htmlClass}`}>
        {spec.mode}モード
      </h3>
      <p className="legal-section-paragraph">
        <code>html</code> に <code>{spec.htmlClass}</code> クラスが付いたときの配色です。
        {spec.description}
      </p>

      <div className="color-palette-base-card">
        <p className="color-palette-base-mode">プレビュー</p>
        <div className="color-palette-base-swatches">
          <ColorSwatch label="背景" hex={spec.background} sublabel="--background" />
          <ColorSwatch label="文字" hex={spec.foreground} sublabel="--foreground" />
        </div>
        <div
          className="color-palette-base-preview"
          style={{
            backgroundColor: spec.background,
            color: spec.foreground,
          }}
        >
          <p className="color-palette-base-preview-title">絶妙コラム</p>
          <p className="color-palette-base-preview-body">
            背景と文字色の組み合わせのプレビューです。
          </p>
        </div>
      </div>

      <PaletteGrid
        title={`${spec.mode}モードで使う zinc 段階`}
        colors={modePalette}
      />

      <div className="color-palette-group">
        <h4 className="typography-spec-subtitle">配色一覧</h4>
        <ModeColorTable colors={spec.colors} />
      </div>
    </section>
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
      <p className="legal-section-paragraph">
        UI 全体は Tailwind の zinc
        系パレットのみで構成し、純白（#fff）・純黒（#000）は使いません。以下では標準コントラスト時のライトモードとダークモードの配色を説明します。
      </p>
      <p className="legal-section-paragraph">
        設定画面ではライト・ダークそれぞれについてコントラストを「低」「標準」「高」から選べます（
        <code>{THEME_CONTRAST_LIGHT_STORAGE_KEY}</code> /{" "}
        <code>{THEME_CONTRAST_DARK_STORAGE_KEY}</code>
        ）。ページ背景（<code>--background</code>）と本文（
        <code>--foreground</code>）が変わります。
      </p>

      <ContrastLevelTable theme="light" />
      <ContrastLevelTable theme="dark" />

      <PaletteGrid title="Zinc パレット（共通）" colors={ZINC_PALETTE} />

      {THEME_MODES.map((spec) => (
        <ModeColorSection key={spec.htmlClass} spec={spec} />
      ))}
    </section>
  );
}
