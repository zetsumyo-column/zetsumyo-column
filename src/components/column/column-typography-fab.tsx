"use client";

import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";

import { ColumnTypographyControls } from "@/components/column/column-typography-controls";
import { ThemeControls } from "@/components/theme/theme-controls";

export function ColumnTypographyFab() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="column-typography-fab" ref={menuRef}>
      {open && (
        <div
          className="column-typography-fab-popup"
          role="dialog"
          aria-label="表示の設定"
        >
          <div className="column-typography-fab-body">
            <div className="column-display-settings">
              <section className="column-display-settings-section">
                <h3 className="column-display-settings-heading">文字組み</h3>
                <ColumnTypographyControls className="typography-settings typography-settings-compact" />
              </section>
              <section className="column-display-settings-section">
                <h3 className="column-display-settings-heading">カラーモード</h3>
                <ThemeControls variant="compact" />
              </section>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        className={
          open
            ? "column-typography-fab-trigger column-typography-fab-trigger-open"
            : "column-typography-fab-trigger"
        }
        aria-label="表示の設定"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((current) => !current)}
      >
        <AdjustmentsHorizontalIcon
          className="column-typography-fab-icon"
          aria-hidden
        />
      </button>
    </div>
  );
}
