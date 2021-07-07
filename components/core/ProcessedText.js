import { H1, H2, H3, H4, P1, UL, OL, LI, A } from "~/components/system/components/Typography";

import { Markdown } from "~/components/system/components/Markdown";

const ProcessedText = ({ text, dark }) => {
  const remarkReactComponents = {
    h1: P1,
    h2: P1,
    h3: P1,
    h4: P1,
    h5: P1,
    h6: P1,
    ol: OL,
    ul: UL,
    li: LI,
    a: (props) => <A dark={dark} {...props} />,
  };
  return <Markdown md={text} options={{ remarkReactComponents }} />;
};

export default ProcessedText;
