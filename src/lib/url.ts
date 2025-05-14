import queryString from "query-string";

type FormUrlQueryParams = {
  params: string;
  key: string;
  value: string | null;
};

type RemoveUrlQueryParams = {
  params: string;
  keys: string[];
};

export function formUrlQuery({ params, key, value }: FormUrlQueryParams) {
  const queryObj = queryString.parse(params);
  queryObj[key] = value;
  return queryString.stringifyUrl(
    {
      url: window.location.pathname,
      query: queryObj,
    },
    { skipNull: true },
  );
}

export function removeUrlQueryParams({ params, keys }: RemoveUrlQueryParams) {
  const queryObj = queryString.parse(params);
  keys.forEach((key) => {
    delete queryObj[key];
  });
  return queryString.stringifyUrl(
    {
      url: window.location.pathname,
      query: queryObj,
    },
    { skipNull: true },
  );
}

export function getUrlQueryParams(params: string) {
  const queryObj = queryString.parse(params);
  return queryObj;
}
