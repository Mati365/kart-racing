import {vec2, vec3} from '@pkg/gl-math';

import {
  CAR_TYPES,
  OBJECT_TYPES,
} from '@game/network/constants/serverCodes';

import {createPackedStruct} from '@pkg/struct-pack';

import CarPhysicsBody from '../logic/physics/CarPhysicsBody';
import MapElement from './MapElement';

/**
 * Calculates angle and position car on map segment
 *
 * @param {Segments[]} segments
 * @param {Number} segmentIndex
 * @param {Object} transform
 *
 * @returns {Object}
 */
export const CAR_ALIGN = {
  CENTER: 0,
  LEFT_CORNER: 1,
  RIGHT_CORNER: -1,
};

export const genCarSegmentTransform = ({
  segment,
  align = CAR_ALIGN.LEFT_CORNER,
} = {}) => {
  const point = vec3.add(
    segment.point,
    vec2.toVec3(
      vec2.fromScalar(align * segment.width / 2, segment.angle),
      0.0,
    ),
  );

  return {
    angle: segment.angle,
    pos: point,
  };
};

export default class PlayerMapElement extends MapElement {
  constructor(
    {
      id,
      player,
      carType = CAR_TYPES.BLUE,
      body = {},
      transform = {
        scale: [1.25, 1.25, 1.25],
      },
    },
  ) {
    super(OBJECT_TYPES.PLAYER, null, id);

    this.player = player;
    this.carType = carType;
    this.transform = transform;
    this.body = new CarPhysicsBody(body);
  }

  toBSON() {
    const {
      id, player, type,
      carType, body, transform,
    } = this;

    return {
      id,
      type,
      params: {
        carType,
        playerID: player.id,
        body: body.toBSON(),
        transform: {
          ...transform,
          rotate: [0, 0, body.angle],
          translate: vec2.toVec3(body.pos),
        },
      },
    };
  }

  static binarySnapshotSerializer = createPackedStruct(
    {
      align: 'plain',
      wrapToType: false,
      fields: {
        type: {
          type: 'int8',
        },
        id: {
          type: 'int16',
        },
        pos: {
          type: 'float32',
          count: 2,
          srcPath: 'body.pos',
        },
        velocity: {
          type: 'float32',
          count: 2,
          srcPath: 'body.velocity',
        },
        throttle: {
          type: 'float32',
          srcPath: 'body.throttle',
        },
        corneringIntensity: {
          type: 'float32',
          srcPath: 'body.corneringIntensity',
        },
        angularVelocity: {
          type: 'float32',
          srcPath: 'body.angularVelocity',
        },
        angle: {
          type: 'float32',
          srcPath: 'body.angle',
        },
        steerAngle: {
          type: 'float32',
          srcPath: 'body.steerAngle',
        },
        lastProcessedInput: {
          type: 'int16',
          srcPath: 'player.info.lastProcessedInput',
        },
      },
    },
  );
}