const BINARY_TYPES = {
  float32: {
    size: 4,
    setter: 'setFloat32',
    getter: 'getFloat32',
    array: 'Float32Array',
  },

  int8: {
    size: 1,
    setter: 'setInt8',
    getter: 'getInt8',
    array: 'Float8Array',
  },

  int16: {
    size: 2,
    setter: 'setInt16',
    getter: 'getInt16',
    array: 'Float16Array',
  },

  int32: {
    size: 4,
    setter: 'setInt32',
    getter: 'getInt32',
    array: 'Int32Array',
  },

  uint16: {
    size: 2,
    setter: 'setUint16',
    getter: 'setUint16',
    array: 'Uint16Array',
  },

  uint32: {
    size: 4,
    setter: 'setUint32',
    getter: 'setUint32',
    array: 'Uint32Array',
  },
};

const parseStruct = ({fields}) => {
  const offsets = {};
  const content = {
    pack: '',
    load: '',
  };

  let offset = 0;

  for (const key in fields) {
    const {type, count, srcPath = key} = fields[key];
    const {size, setter, getter, array} = BINARY_TYPES[type];

    offsets[key] = offset;

    if (count) {
      content.load += `obj.${key} = new ${array}(${count});\n`;

      for (let index = 0; index < count; ++index) {
        content.pack += `view.${setter}(destOffset + ${offset}, obj.${srcPath}[${index}], true);\n`;
        content.load += `obj.${key}[${index}] = view.${getter}(bufferOffset + ${offset}, true);\n`;
        offset += size;
      }
    } else {
      content.pack += `view.${setter}(destOffset + ${offset}, obj.${srcPath}, true);\n`;
      content.load += `obj.${key} = view.${getter}(bufferOffset + ${offset}, true);\n`;
    }

    offset += size;
  }

  /* eslint-disable no-new-func */
  const pack = new Function('obj', 'dest', 'destOffset', `
    destOffset = destOffset || 0;
    const buffer = dest || new ArrayBuffer(${offset});
    const view = new DataView(buffer);

    ${content.pack}

    return buffer;
  `);

  const load = new Function('buffer', 'bufferOffset', 'obj', `
    obj = obj || {};
    bufferOffset = bufferOffset || 0;

    const view = new DataView(buffer);

    ${content.load}

    return obj;
  `);
  /* eslint-enable no-new-func */

  return {
    size: offset,
    offsets,
    pack,
    load,
  };
};

export default parseStruct;