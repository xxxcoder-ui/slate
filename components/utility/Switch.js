import * as React from "react";

export const Match = React.memo(({ children /** when */ }) => {
  return children;
});
// NOTE(amine): displayName is used to assert that direct children of Switch are the Match components
Match.displayName = "$";

export const Switch = React.memo(({ children, fallback = null }) => {
  if (Array.isArray(children)) {
    for (let element of children) {
      if (element.type.displayName !== "$")
        console.error("Switch component requires Match component as its children");

      if (element.props.when) return element;
    }

    return fallback;
  }

  if (children?.props?.when) return children;

  return fallback;
});
