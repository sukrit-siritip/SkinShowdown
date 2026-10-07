export const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
export const MAX_INPUT_BYTES = 10 * 1024 * 1024;
const MAX_EDGE = 2560;
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const QUALITY = 0.92;
const PASSTHROUGH_TYPES = { "image/webp": "webp", "image/jpeg": "jpg" };

function toBlob(canvas, type) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, QUALITY));
}

export async function prepareRender(file) {
  if (!ACCEPTED_TYPES.includes(file.type)) throw new Error("Use a PNG, JPG, or WebP image.");
  if (file.size > MAX_INPUT_BYTES) throw new Error("Images must be 10 MB or smaller.");

  const bitmap = await createImageBitmap(file);
  const { width: sourceWidth, height: sourceHeight } = bitmap;
  const scale = Math.min(1, MAX_EDGE / Math.max(sourceWidth, sourceHeight));

  const passthrough = PASSTHROUGH_TYPES[file.type];
  if (passthrough && scale === 1 && file.size <= MAX_UPLOAD_BYTES) {
    bitmap.close();
    return {
      blob: file,
      width: sourceWidth,
      height: sourceHeight,
      ext: passthrough,
      preview: URL.createObjectURL(file),
    };
  }

  const width = Math.round(sourceWidth * scale);
  const height = Math.round(sourceHeight * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d").drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let blob = await toBlob(canvas, "image/webp");
  if (!blob || blob.type !== "image/webp") blob = await toBlob(canvas, "image/png");
  if (!blob) throw new Error("Couldn't process this image.");
  if (blob.size > MAX_UPLOAD_BYTES) {
    throw new Error("This image is over 5 MB after resizing — export it smaller or as WebP.");
  }

  return {
    blob,
    width,
    height,
    ext: blob.type === "image/webp" ? "webp" : "png",
    preview: URL.createObjectURL(blob),
  };
}
