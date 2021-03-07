//NOTE(martina): this file is for utility functions that do not involve API calls
//For API related utility functions, see common/user-behaviors.js
//And for uploading related utility functions, see common/file-utilities.js

export const getPublicAndPrivateFiles = ({ viewer }) => {
  let publicFileIds = [];
  for (let slate of viewer.slates) {
    if (slate.isPublic) {
      publicFileIds.push(...slate.objects.map((obj) => obj.id));
    }
  }

  let publicFiles = [];
  let privateFiles = [];
  let library = viewer.library || [];
  for (let file of library) {
    if (file.isPublic || publicFileIds.includes(file.id)) {
      publicFiles.push(file);
    } else {
      privateFiles.push(file);
    }
  }
  return { publicFiles, privateFiles };
};

export const generateNumberByStep = ({ min, max, step = 1 }) => {
  var numbers = [];
  for (var n = min; n <= max; n += step) {
    numbers.push(n);
  }

  const randomIndex = Math.floor(Math.random() * numbers.length);
  return numbers[randomIndex];
};

export const endsWithAny = (options, string) => options.some((option) => string.endsWith(option));
