const createSolidColorMaterial = fgl => fgl.material(
  {
    shaders: {
      vertex: `
        in vec4 inVertexPos;

        uniform mat4 mpMatrix;

        void main() {
          gl_Position = inVertexPos * mpMatrix;
        }
      `,

      fragment: `
        out vec4 fragColor;

        uniform vec4 color;

        void main() {
          fragColor = color;
        }
      `,
    },
  },
);

export default createSolidColorMaterial;