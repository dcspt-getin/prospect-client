/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";

import { API_BASE_URL } from "config";

export default async (options, value, meta) => {
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

        const _val = v.option1 === curr.id ? b : a;

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
      },
    };
  }, {});

  const valuesByColumnSum = Object.keys(valuesByColumn).reduce((acc, key) => {
    const totalCol = Object.keys(valuesByColumn).reduce(
      (accCol, keyCol) => accCol + valuesByColumn[keyCol][key],
      0
    );

    return {
      ...acc,
      [key]: totalCol,
    };
  }, {});

  // Step 3: normalize values
  const normalizedValues = Object.keys(valuesByColumn).reduce((acc, curr) => {
    const column = valuesByColumn[curr];

    return {
      ...acc,
      [curr]: Object.keys(column).reduce((accRow, currRow) => {
        const value = column[currRow];
        const normalizedValue = value / valuesByColumnSum[currRow];

        return {
          ...accRow,
          [currRow]: normalizedValue,
          total: (accRow?.total || 0) + normalizedValue,
        };
      }, {}),
    };
  }, {});

  // Step 4: Get all rows values and sum
  // const normalizedValueSumByRow = Object.keys(normalizedValues).reduce(
  //   (acc, row) => {
  //     return {
  //       ...acc,
  //       ...Object.keys(normalizedValues).reduce((accRow, col) => {
  //         if (col === "total" || row === "total") return accRow;
  //         const value = normalizedValues[col][row];

  //         return {
  //           ...accRow,
  //           [row]: (accRow[row] || 0) + value,
  //         };
  //       }, {}),
  //     };
  //   },
  //   {}
  // );

  // Step 5: calc Eigenvector
  const eigenvector = Object.keys(normalizedValues).reduce((acc, colId) => {
    return {
      ...acc,
      [colId]:
        (1 / Object.keys(normalizedValues).length) *
        normalizedValues[colId].total,
    };
  }, {});
  // const eigenvectorSize = Object.keys(eigenvector).length;

  // // step 6: sum all eigenvector values
  // const eigenvectorSum = Object.keys(eigenvector).reduce(
  //   (acc, curr) => acc + eigenvector[curr] * valuesByColumn[curr].total,
  //   0
  // );

  // // setp 7: calc inconsistency index
  // const inconsistencyIndex =
  //   (eigenvectorSum - eigenvectorSize) / (eigenvectorSize - 1);

  // // step 8: calc consistency ratio
  // const consistencyRatio =
  //   inconsistencyIndex /
  //   (parseFloat(consistencyRatioMatrix[eigenvectorSize]) || 0);

  // step 9: calc perfect consistency matrix
  const perfectConsistencyMatrix = Object.values(eigenvector).reduce(
    (acc, curr) => {
      return [
        ...acc,
        Object.values(eigenvector).reduce((accRow, currRow) => {
          return [...accRow, curr / currRow];
        }, []),
      ];
    },
    []
  );
  const inversedPerfectConsistencyMatrix = perfectConsistencyMatrix.map(
    (row, rowIndex) => {
      return row.map((col, colIndex) => {
        if (rowIndex > colIndex) {
          return 1 / perfectConsistencyMatrix[colIndex][rowIndex];
        }
        return col;
      });
    }
  );

  // step 10: compare the perfect consistency matrix with the current value matrix

  const currentValueMatrix = Object.keys(valuesByColumn).reduce(
    (acc, currKey) => {
      const curr = valuesByColumn[currKey];

      return [
        ...acc,
        Object.keys(curr).reduce((accRow, currRow) => {
          if (currRow === "total") return accRow;

          return [...accRow, curr[currRow]];
        }, []),
      ];
    },
    []
  );

  const { data } = await axios.post(
    `${API_BASE_URL}/configurations/calc_correl/`,
    {
      xarr: currentValueMatrix,
      yarr: inversedPerfectConsistencyMatrix,
    }
  );

  const r = parseFloat(data.result);
  const r2 = r * r;
  const isValid = r2 > 0.6;
  const comparisionsMatrix = [];
  const numAttempts = (meta?.numAttempts || 0) + 1;

  if (!isValid) {
    for (let i = 0; i < currentValueMatrix.length; i++) {
      const row = currentValueMatrix[i];
      const comparisionsMatrixRow = [];

      for (let j = 0; j < row.length; j++) {
        const currentValue = currentValueMatrix[i][j];
        const perfectConsistencyValue = inversedPerfectConsistencyMatrix[i][j];

        const comparision =
          Math.abs(perfectConsistencyValue - currentValue) /
          (perfectConsistencyValue + currentValue);

        comparisionsMatrixRow.push(comparision);
      }

      comparisionsMatrix.push(comparisionsMatrixRow);
    }
  }

  // console.log({
  //   value,
  //   matrix,
  //   valuesByColumn,
  //   normalizedValues,
  //   normalizedValueSumByRow,
  //   eigenvector,
  //   inversedPerfectConsistencyMatrix,
  //   currentValueMatrix,
  //   r,
  //   r2,
  //   isValid,
  //   comparisionsMatrix,
  // });

  return {
    eigenVector: eigenvector,
    currentValueMatrix,
    perfectConsistencyMatrix: inversedPerfectConsistencyMatrix,
    r2,
    isValid: isValid || numAttempts > 1,
    comparisionsMatrix,
    numAttempts,
  };
};
