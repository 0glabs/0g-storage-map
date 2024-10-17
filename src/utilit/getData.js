const formatCityData = (data) => {
  const { city, country, loc, region, timezone } = data;
  const [y, x] = loc.split(",");

  return [Number(x), Number(y), 1, city, country, region, timezone];
};

export const getData = (rpc) =>
  fetch(rpc, {
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "indexer_getNodeLocations",
      params: [],
      id: 1,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  })
    .then((response) => response.json())
    .then((res) => {
      const map = {};
      if (res.result) {
        for (const key in res.result) {
          const value = res.result[key];
          if (map[value.city]) {
            // add count
            map[value.city][2] = map[value.city][2] + 1;
          } else {
            map[value.city] = formatCityData(value);
          }
        }

        return Object.values(map);
      }

      return [];
    });
