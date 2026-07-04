"use client";

import { useEffect, useState } from "react";

import { OptionGroup } from "@/components/ui/option-group";
import { useTheme } from "@/components/theme/theme-provider";
import {
  CONTRAST_LEVEL_OPTIONS,
  getContrastPreset,
  type ContrastLevel,
} from "@/lib/theme/contrast-tokens";

const THEME_OPTIONS = [
  { value: "light", label: "ライト" },
  { value: "dark", label: "ダーク" },
] as const;

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
  const label = theme === "dark" ? "ダーク" : "ライト";

  return (
    <div className="contrast-preview-wrap">
      <p className="contrast-preview-mode-label">{label}</p>
      <div
        className="contrast-preview"
        style={{
          backgroundColor: preset.background,
          color: preset.foreground,
        }}
      >
        <p className="contrast-preview-title">絶妙コラム</p>
        <p className="contrast-preview-body">背景と文字色のプレビューです。</p>
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

type ThemeControlsProps = {
  variant?: "full" | "compact" | "fab";
  className?: string;
};

export function ThemeControls({
  variant = "full",
  className,
}: ThemeControlsProps) {
  const { theme, contrast, setTheme, setContrast } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isFab = variant === "fab";
  const optionSize = isFab ? "compact" : "default";

  useEffect(() => {
    setMounted(true);
  }, []);

  const wrapperClass =
    className ??
    (variant === "fab"
      ? "theme-settings-fab"
      : variant === "compact"
        ? "theme-settings-compact"
        : "theme-settings");

  if (!mounted) {
    return (
      <div className={wrapperClass}>
        <OptionGroup options={THEME_OPTIONS} value="light" onChange={() => {}} />
      </div>
    );
  }

  const currentTheme = theme === "dark" ? "dark" : "light";
  const currentContrast = contrast ?? "medium";
  const contrastDescription = CONTRAST_LEVEL_OPTIONS.find(
    (option) => option.value === currentContrast,
  )?.description;

  return (
    <div className={wrapperClass}>
      <OptionGroup
        label={isFab ? "モード" : "表示モード"}
        options={THEME_OPTIONS}
        value={currentTheme}
        onChange={setTheme}
        size={optionSize}
      />

      <div className={isFab ? "contrast-setting-block-fab" : "contrast-setting-block"}>
        <OptionGroup
          label="コントラスト"
          options={CONTRAST_OPTIONS}
          value={currentContrast}
          onChange={setContrast}
          size={optionSize}
        />

        {variant === "full" && contrastDescription && (
          <p className="hint">{contrastDescription}</p>
        )}

        {variant === "full" && (
          <div className="contrast-preview-grid">
            <ContrastPreview theme="light" level={currentContrast} />
            <ContrastPreview theme="dark" level={currentContrast} />
          </div>
        )}
      </div>

      {variant === "full" && (
        <p className="hint">
          コントラストはライト・ダーク共通の段階です。表示モードを切り替えても同じ段階が使われます。
        </p>
      )}
    </div>
  );
}
