export function getFileNameAndExtension(filename) {
  const lastDotIndex = filename.lastIndexOf('.');

  if (lastDotIndex === -1) {
      // No dot found
      return {
          name: filename,
          extension: ''
      };
  } else {
      return {
          name: filename.slice(0, lastDotIndex),
          extension: filename.slice(lastDotIndex + 1)
      };
  }
}