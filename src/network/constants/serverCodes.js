export const ERROR_CODES = {
  ROOM_FULL: 'ROOM_FULL',
  ROOM_ALREADY_EXISTS: 'ROOM_ALREADY_EXISTS',
  ALREADY_KICKED: 'ALREADY_KICKED',
  ACCESS_DENIED: 'ACCESS_DENIED',
  UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',
};

export const ACTION_FLAGS = {
  // TYPE
  REQUEST: 0b0,
  RESPONSE: 0b1,

  // RESPONSE_TYPE
  ARRAYBUF_PAYLOAD: 0b000,
  BSON_PAYLOAD: 0b100,
};

export const PLAYER_ACTIONS = {
  PLAYER_INFO: 0,
  JOIN_ROOM: 1,
  PRESS_KEY: 2,

  // GLOBAL ROOM METHODS
  START_ROOM_RACE: 3,

  // BROADCAST
  PLAYER_JOINED_TO_ROOM: 3,
  PLAYER_LEFT_ROOM: 4,

  // LOW LATENCY BROADCAST
  PLAYERS_STATE_UPDATE: 5,
};

export const CAR_TYPES = {
  RED: 0,
  BLUE: 1,
};

export const OBJECT_TYPES = {
  PRIMITIVE: 0,
  ROAD: 1,
  TERRAIN: 2,
  PLAYER: 3,
};
