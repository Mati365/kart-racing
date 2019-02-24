import * as R from 'ramda';

import * as COLORS from './constants/colors';

import {createShaderMaterial} from './material/types';
import texture2D from './texture/texture2D';
import tileTexture2D from './texture/tileTexture2D';

import createMesh from './mesh/createMesh';
import createMeshBatch from './mesh/createMeshBatch';

import {
  meshes,
  materials,
} from './predefined';

import createFGLState from './createFGLState';
import {
  pickGlContext,
  createDtRenderLoop,
} from './viewport';

export {
  COLORS,
};

/**
 * Create global engine context
 *
 * @param {HTMLElement} canvasHandle
 * @param {Object} glContextFlags
 *
 * @return {FGLContext}
 */
const createRenderContext = (canvasElement, glContextFlags) => {
  const gl = pickGlContext(canvasElement)(glContextFlags);

  // see: it is mutable
  const state = createFGLState(gl);
  const fgl = {};

  // attaches GL / FGL global state to each function
  const bindSceneContext = R.flip(R.apply)([gl, fgl]);
  const bindObjectSceneContext = R.mapObjIndexed(
    R.when(
      R.is(Function),
      bindSceneContext,
    ),
  );

  // Object.assign due to shared fglContext between callers
  Object.assign(
    fgl,
    {
      // shared between engine flags
      state,

      // pick shared constants
      ...R.pick(
        ['flags', 'colors'],
        state,
      ),

      // creators
      ...bindObjectSceneContext(
        {
          frame: createDtRenderLoop,
          mesh: createMesh,
          texture2D,
          tileTexture2D,
        },
      ),

      // different material types, for solid color material
      // will be slightly different
      material: bindObjectSceneContext(
        {
          shader: createShaderMaterial,
        },
      ),
    },
  );

  // batch multiple mesh renders calls into one
  fgl.mesh.batch = bindSceneContext(createMeshBatch);

  // assign predefined meshes / materials
  R.forEachObjIndexed(
    (fn, meshName) => {
      fgl.mesh[meshName] = fn(fgl);
    },
    meshes,
  );

  R.forEachObjIndexed(
    (fn, materialName) => {
      fgl.material[materialName] = fn(fgl);
    },
    materials,
  );

  return fgl;
};

export default createRenderContext;
