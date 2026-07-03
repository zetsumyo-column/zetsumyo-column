import type { LegalSection } from "@/content/legal/terms";
import { LEGAL_LAST_UPDATED } from "@/lib/legal/site";

type LegalDocumentProps = {
  title: string;
  sections: LegalSection[];
};

export function LegalDocument({ title, sections }: LegalDocumentProps) {
  return (
    <article className="legal-document">
      <header className="legal-document-header">
        <h1 className="title">{title}</h1>
        <p className="hint">最終更新日: {LEGAL_LAST_UPDATED}</p>
      </header>

      <div className="legal-document-body">
        {sections.map((section) => (
          <section key={section.title} className="legal-section">
            <h2 className="legal-section-title">{section.title}</h2>
            {section.paragraphs.map((paragraph, index) => (
              <p key={`${section.title}-p-${index}`} className="legal-section-paragraph">
                {paragraph}
              </p>
            ))}
            {section.list && (
              <ul className="legal-section-list">
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </article>
  );
}
