"use client";

import { useEffect, useState } from "react";

import { OptionGroup } from "@/components/ui/option-group";
import { useTheme } from "@/components/theme/theme-provider";
import {
  CONTRAST_LEVEL_OPTIONS,
  getContrastPreset,
  type ContrastLevel,
} from "@/lib/theme/contrast-tokens";

const CONTRAST_OPTIONS = CONTRAST_LEVEL_OPTIONS.map((option) => ({
  value: option.value,
  label: option.label,
}));

type ContrastPreviewProps = {
  theme: "light" | "dark";
  level: ContrastLevel;
};

function ContrastPreview({ theme, level }: ContrastPreviewProps) {
  const preset = getContrastPreset(theme, level);
  const option = CONTRAST_LEVEL_OPTIONS.find((item) => item.value === level);

  return (
    <div className="contrast-preview-wrap">
      <div
        className="contrast-preview"
        style={{
          backgroundColor: preset.background,
          color: preset.foreground,
        }}
      >
        <p className="contrast-preview-title">絶妙コラム</p>
        <p className="contrast-preview-body">{option?.description}</p>
      </div>
      <dl className="contrast-preview-codes">
        <div className="contrast-preview-code-item">
          <dt className="contrast-preview-code-label">背景</dt>
          <dd className="contrast-preview-code-value">
            <span
              className="color-palette-table-chip"
              style={{ backgroundColor: preset.background }}
              aria-hidden
            />
            <code className="color-palette-hex">{preset.background}</code>
          </dd>
        </div>
        <div className="contrast-preview-code-item">
          <dt className="contrast-preview-code-label">文字</dt>
          <dd className="contrast-preview-code-value">
            <span
              className="color-palette-table-chip"
              style={{ backgroundColor: preset.foreground }}
              aria-hidden
            />
            <code className="color-palette-hex">{preset.foreground}</code>
          </dd>
        </div>
      </dl>
    </div>
  );
}

type ContrastSettingBlockProps = {
  label: string;
  value: ContrastLevel;
  onChange: (level: ContrastLevel) => void;
  previewTheme: "light" | "dark";
};

function ContrastSettingBlock({
  label,
  value,
  onChange,
  previewTheme,
}: ContrastSettingBlockProps) {
  return (
    <div className="contrast-setting-block">
      <OptionGroup
        label={label}
        options={CONTRAST_OPTIONS}
        value={value}
        onChange={onChange}
      />
      <ContrastPreview theme={previewTheme} level={value} />
    </div>
  );
}

export function ThemeSetting() {
  const {
    theme,
    contrastLight,
    contrastDark,
    setTheme,
    setContrastLight,
    setContrastDark,
  } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="theme-settings">
        <OptionGroup
          options={[
            { value: "light", label: "ライト" },
            { value: "dark", label: "ダーク" },
          ]}
          value="light"
          onChange={() => {}}
        />
      </div>
    );
  }

  const currentTheme = theme === "dark" ? "dark" : "light";

  return (
    <div className="theme-settings">
      <OptionGroup
        label="表示モード"
        options={[
          { value: "light", label: "ライト" },
          { value: "dark", label: "ダーク" },
        ]}
        value={currentTheme}
        onChange={setTheme}
      />

      <ContrastSettingBlock
        label="ライトモードのコントラスト"
        value={contrastLight ?? "medium"}
        onChange={setContrastLight}
        previewTheme="light"
      />

      <ContrastSettingBlock
        label="ダークモードのコントラスト"
        value={contrastDark ?? "medium"}
        onChange={setContrastDark}
        previewTheme="dark"
      />

      <p className="hint">
        コントラストはライト・ダークそれぞれ独立して保存されます。表示モードを切り替えると、対応する設定が反映されます。
      </p>
    </div>
  );
}
