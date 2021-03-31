import Glyphs from "./Glyphs";
import Sentence from "./Sentence";
import Paragraph from "./Paragraph";

export default function FontView({
  settings,
  view,
  customView,
  content: { sentence, paragraph, custom },
  shouldUpdateView,
  updateCustomView,
}) {
  const isCustomView = (value) => view === "custom" && customView === value;

  if (view === "glyphs") {
    return <Glyphs />;
  }

  if (view === "paragraph" || isCustomView("paragraph")) {
    return (
      <Paragraph
        shouldUpdateView={shouldUpdateView}
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
      shouldUpdateView={shouldUpdateView}
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
