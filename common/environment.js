export const NODE_ENV = process.env.NEXT_PUBLIC_NODE_ENV || "development";

//NOTE(amine): feature flags
export const ACTIVITY_FEATURE_FLAG = NODE_ENV === "development" || NODE_ENV === "staging";

// NOTE(jim): External servers
export const URI_SHOVEL = process.env.NEXT_PUBLIC_URI_SHOVEL;
export const URI_FIJI = process.env.NEXT_PUBLIC_URI_FIJI;
export const URI_LENS = process.env.NEXT_PUBLIC_URI_LENS;
export const URI_ESTUARY = process.env.NEXT_PUBLIC_URI_ESTUARY;

//NOTE(amine): Extensions links
export const EXTENSION_CHROME = process.env.NEXT_PUBLIC_EXTENSION_CHROME;
export const EXTENSION_FIREFOX = process.env.NEXT_PUBLIC_EXTENSION_FIREFOX;
export const EXTENSION_SAFARI = process.env.NEXT_PUBLIC_EXTENSION_SAFARI;
