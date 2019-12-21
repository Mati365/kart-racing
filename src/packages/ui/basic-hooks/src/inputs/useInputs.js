import {useState, useRef} from 'react';
import * as R from 'ramda';

import {
  dig,
  inputValue,
} from '@pkg/basic-helpers';

const processInputValue = (prevValue, name, e) => {
  const val = inputValue(e);

  if (R.isNil(name))
    return val;

  if (R.is(Array, prevValue) && !Number.isNaN(name)) {
    prevValue = R.clone(prevValue);
    prevValue[Number.parseInt(name, 10)] = val;

  // If name is for example a.b.c, it is a: {b: {c: object}}
  } else if (R.contains('.', name)) {
    // ramda set function is buggy, use own reducer
    const path = R.split('.', name);

    prevValue = R.compose(
      R.mergeDeepRight(prevValue),
      (obj) => {
        const parent = R.reduce(
          (acc, elem) => {
            // if value in path is nil, create blank object
            if (R.isNil(acc[elem]))
              acc[elem] = {};

            return acc[elem];
          },
          obj,
          R.init(path),
        );

        const currentPathKey = R.last(path);
        parent[currentPathKey] = val;
        return obj;
      },
      R.clone,
    )(prevValue);

  // If it is normal name, do not split
  } else if (R.is(Object, prevValue) || R.is(String, name)) {
    prevValue = {
      ...prevValue,
      [name]: val,
    };
  }

  return prevValue;
};

export const pickUpdateValue = (name, data, defaults) => {
  if (R.isNil(data))
    return data;

  return R.defaultTo(
    defaults,
    R.is(String, name) && R.contains('.', name)
      ? dig(R.split('.', name), data)
      : data[name],
  );
};

/**
 * @see
 *  see linkedInputs decorator
 */
const useInputs = (config = {}) => {
  const providedValue = 'value' in config;
  const {
    initialData,
    onChange,
  } = config;

  const controlled = providedValue && onChange;
  const [state, setState] = useState(
    {
      value: initialData,
    },
  );

  if (providedValue)
    state.value = config.value;

  const cacheRef = useRef();
  cacheRef.current = {
    __cachedListeners: {},

    setValue: (e, name, flags) => {
      const newValue = processInputValue(state.value, name, e);

      if (onChange)
        onChange(newValue);

      if (!controlled) {
        if (flags?.noRerenderAfterUpdate)
          state.value = newValue;
        else {
          setState(
            {
              value: newValue,
            },
          );
        }
      }
    },
  };

  return {
    initialData,
    value: state.value,
    setValue: cacheRef.current.setValue,
    l: {
      input: (name = null, flags) => {
        const {
          defaultInputValue,
          disableCache,
          addDefaultValueToProps,
        } = flags || {};

        const cacheStore = cacheRef.current.__cachedListeners;

        let inputProps = null;
        if (!disableCache && cacheStore[name])
          inputProps = cacheStore[name];
        else {
          inputProps = {
            onChange: e => cacheRef.current.setValue(e, name, flags),
          };
        }

        // assign values to listeners
        inputProps.value = pickUpdateValue(name, state.value, defaultInputValue || null);
        if (addDefaultValueToProps)
          inputProps.defaultInputValue = defaultInputValue;

        if (disableCache)
          return inputProps;

        cacheStore[name] = inputProps;
        return inputProps;
      },
    },
  };
};

export default useInputs;
