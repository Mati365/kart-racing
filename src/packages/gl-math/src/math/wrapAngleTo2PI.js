export const RAD_360 = Math.PI * 2;

/**
 * @todo
 *  Optimise
 */
const wrapAngleTo2PI = rad => (
  (rad + RAD_360) % RAD_360
);

export default wrapAngleTo2PI;
