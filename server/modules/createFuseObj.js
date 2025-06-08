import Fuse from "fuse.js";

function createFuse(data, keys) {
  return new Fuse(data, {
    keys,
    threshold: 0.3,
  });
}

export default createFuse;
