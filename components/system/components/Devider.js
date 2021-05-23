import * as React from "react";

export const Devider = ({ width = "100%", height = "1px", color, ...props }) => {
  return (
    <div
      css={(theme) => ({
        height,
        width,
        minHeight: height,
        backgroundColor: theme.system?.[color] || color,
      })}
      {...props}
    />
  );
};
