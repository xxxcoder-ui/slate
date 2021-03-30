import Glyphs from "./Glyphs";
import Sentence from "./Sentence";
import Paragraph from "./Paragraph";

export default function FontView({
  settings,
  view,
  customView,
  shouldUpdateView,
  customViewContent,
  updateCustomView,
}) {
  const isCustomView = (value) => view === "custom" && customView === value;

  if (view === "glyphs") {
    return <Glyphs />;
  }

  if (view === "paragraph" || isCustomView("paragraph")) {
    const content =
      view === "custom"
        ? customViewContent
        : "The sun is gone but I have a light The day is done but I'm having fun I think I'm dumb or maybe I'm just happy I think I'm just happy I think I'm just happy I'm not like them but I can pretend The sun is gone but I have a light The day is done but I'm having fun I think I'm dumb or maybe I'm just happy I think I'm just happy I think I'm just happy I think I'm just happy My heart is broke but I have some glue Help me inhale and mend it with you We'll float around and hang out on clouds Then we'll come down and have a hangover We'll have a hangover We'll have a hangover We'll have a hangover Skin the sun, fall asleep The sun is gone but I have a light The day is done but I'm having fun I think I'm dumb or maybe I'm just happy I think I'm just happy I think I'm just happy I'm not like them but I can pretend The sun is gone but I have a light The day is done but I'm having fun I think I'm dumb or maybe I'm just happy I think I'm just happy I think I'm just happy I think I'm just happy My heart is broke but I have some glue Help me inhale and mend it with you We'll float around and hang out on clouds Then we'll come down and have a hangover We'll have a hangover We'll have a hangover We'll have a hangover Skin the sun, fall asleep The sun is gone but I have a light The day is done but I'm having fun I think I'm dumb or maybe I'm just happy I think I'm just happy I think I'm just happy I'm not like them but I can pretend The sun is gone but I have a light The day is done but I'm having fun I think I'm dumb or maybe I'm just happy I think I'm just happy I think I'm just happy I think I'm just happy My heart is broke but I have some glue Help me inhale and mend it with you We'll float around and hang out on clouds Then we'll come down and have a hangover We'll have a hangover We'll have a hangover We'll have a hangover Skin the sun, fall asleep";
    return (
      <Paragraph
        shouldUpdateView={shouldUpdateView}
        content={content}
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

  const content =
    view === "custom"
      ? customViewContent
      : "The sun is gone but I have a light The day is done but I'm having fun I think I'm dumb or maybe I'm just happy I think I'm just happy I think I'm just happy I'm not like them but I can pretend The sun is gone but I have a light The day is done but I'm having fun I think I'm dumb or maybe I'm just happy";
  return (
    <Sentence
      shouldUpdateView={shouldUpdateView}
      content={content}
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
