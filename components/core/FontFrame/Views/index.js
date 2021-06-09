import Glyphs from "~/components/core/FontFrame/Views/Glyphs";
import Sentence from "~/components/core/FontFrame/Views/Sentence";
import Paragraph from "~/components/core/FontFrame/Views/Paragraph";

export default function FontView({
  settings,
  view,
  customView,
  content: { sentence, paragraph, custom },
  updateCustomView,
}) {
  const isCustomView = (value) => view === "custom" && customView === value;

  if (view === "glyphs") {
    return <Glyphs />;
  }

  if (view === "paragraph" || isCustomView("paragraph")) {
    return (
      <Paragraph
        content={view === "custom" ? custom : paragraph}
        valign={settings.valign}
        textAlign={settings.textAlign}
        fontSize={settings.fontSize}
        lineHeight={settings.lineHeight}
        tracking={settings.tracking}
        column={settings.column}
        onChange={(v) => updateCustomView({ customView: "paragraph", customViewContent: v })}
      />
    );
  }

  return (
    <Sentence
      content={view === "custom" ? custom : sentence}
      valign={settings.valign}
      textAlign={settings.textAlign}
      fontSize={settings.fontSize}
      lineHeight={settings.lineHeight}
      tracking={settings.tracking}
      onChange={(v) => updateCustomView({ customView: "sentence", customViewContent: v })}
    />
  );
}

export { Glyphs, Paragraph, Sentence };
