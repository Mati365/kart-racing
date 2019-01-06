import createMatrix from '../createMatrix';
import {unrollSquareMatrixOperation} from '../compiler';

/**
 * Multiply two matrices creating new matrix
 *
 * @param {Matrix} m1
 * @param {Matrix} m2
 *
 * @returns {Matrix}
 */
export const mulMatrix = (m1, m2) => {
  const result = createMatrix(m2.w, m1.h);

  for (let i = result.h - 1; i >= 0; --i) {
    for (let j = result.w - 1; j >= 0; --j) {
      let buffer = 0;

      for (let k = m2.h - 1; k >= 0; --k) {
        buffer += m1.array[i * m1.w + k] * m2.array[k * m2.w + j];
      }

      result.array[i * result.w + j] = buffer;
    }
  }

  return result;
};

/**
 * Unrolls sum of cells
 *
 * @param {UnrollConfig}  config
 *
 * @returns {String}
 */
const multiplyUnrollExecutor = ({i, j, size1, size2}) => {
  const operations = [];

  for (let k = size2.h - 1; k >= 0; --k) {
    operations.push(
      `(a${i * size1.w + k} * b${k * size2.w + j})`,
    );
  }

  return operations.join(' + ');
};

export const mul3x3 = unrollSquareMatrixOperation(3)(multiplyUnrollExecutor);
export const mul4x4 = unrollSquareMatrixOperation(4)(multiplyUnrollExecutor);
