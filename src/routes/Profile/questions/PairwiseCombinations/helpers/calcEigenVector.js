/* eslint-disable import/no-anonymous-default-export */

export default (options, value) => {
  // Step 1: Cal Matrix
  const matrix = options.reduce((acc, curr) => {
    return [
      ...acc,
      ...options.reduce((accOpt, o) => {
        const v = value.find(
          (vf) =>
            (vf.option1 === curr.id && vf.option2 === o.id) ||
            (vf.option2 === curr.id && vf.option1 === o.id)
        );

        if (!v) return [...accOpt, [[curr.id, o.id], 1]];

        let a = 1;
        let b = 1;

        if (v.value !== 0) {
          const _value = v.value < 0 ? v.value - 1 : v.value + 1;

          a = _value < 0 ? _value * -1 : parseFloat((1 / _value).toFixed(2));
          b = _value > 0 ? _value : parseFloat((1 / (_value * -1)).toFixed(2));
        }

        const _val = v.option1 === curr.id ? a : b;

        return [...accOpt, [[curr.id, o.id], _val]];
      }, []),
    ];
  }, []);

  // Step 2: Get all columns values
  const valuesByColumn = matrix.reduce((acc, curr) => {
    const column = curr[0][0];
    const row = curr[0][1];
    const value = curr[1];

    return {
      ...acc,
      [column]: {
        ...(acc[column] || {}),
        [row]: value,
        total: (acc[column]?.total || 0) + value,
      },
    };
  }, {});

  // Step 3: normalize values
  const normalizedValues = Object.keys(valuesByColumn).reduce((acc, curr) => {
    const column = valuesByColumn[curr];

    return {
      ...acc,
      [curr]: Object.keys(column).reduce((accRow, currRow) => {
        const value = column[currRow];
        const normalizedValue = value / column.total;

        return {
          ...accRow,
          [currRow]: normalizedValue,
          total: (accRow[column]?.total || 0) + normalizedValue,
        };
      }, {}),
    };
  }, {});

  // Step 4: Get all rows values and sum
  const normalizedValueSumByRow = Object.keys(normalizedValues).reduce(
    (acc, row) => {
      return {
        ...acc,
        ...Object.keys(normalizedValues).reduce((accRow, col) => {
          if (col === "total" || row === "total") return accRow;
          const value = normalizedValues[col][row];

          return {
            ...accRow,
            [row]: (accRow[row] || 0) + value,
          };
        }, {}),
      };
    },
    {}
  );

  // Step 5: calc Eigenvector
  const eigenvector = Object.keys(normalizedValueSumByRow).reduce(
    (acc, row) => {
      return {
        ...acc,
        [row]:
          normalizedValueSumByRow[row] *
          (1 / Object.keys(normalizedValueSumByRow).length),
      };
    },
    {}
  );

  console.log({
    valuesByColumn,
    normalizedValues,
    normalizedValueSumByRow,
    eigenvector,
  });

  return eigenvector;
};
