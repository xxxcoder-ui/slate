import { getFilterHandler } from "~/common/filter-utilities";

onmessage = function (e) {
  const { objects = [], view, subview, type } = e.data;
  const filterCallback = getFilterHandler({ view, subview, type });
  const result = objects.filter(filterCallback);
  postMessage(result);
};
