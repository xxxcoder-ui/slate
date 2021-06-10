export const filterPublic = (arr = []) => {
  return arr.filter((item) => item.isPublic);
};

export const filterPrivate = (arr = []) => {
  return arr.filter((item) => !item.isPublic);
};

export const mapToIds = (arr = []) => {
  return arr.map((item) => item.id);
};

export const countPublic = (arr = []) => {
  return arr.reduce((item, count) => {
    if (item.isPublic) return count + 1;
    else return count;
  });
};

export const countPrivate = (arr = []) => {
  return arr.reduce((item, count) => {
    if (!item.isPublic) return count + 1;
    else return count;
  });
};
