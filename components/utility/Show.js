export const Show = ({ children, when, fallback = null }) => (when ? children : fallback);
