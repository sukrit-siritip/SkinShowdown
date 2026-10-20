export const RENDER_BUCKET = "item-renders";

const RENDER_PATH = /^items\/[0-9a-f-]{36}\.(webp|png|jpg)$/;

export function isRenderPath(path) {
  return typeof path === "string" && RENDER_PATH.test(path);
}

export function renderUrl(path) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${RENDER_BUCKET}/${path}`;
}

export function itemRender(item) {
  if (!item?.render_path) return null;
  return {
    path: item.render_path,
    src: renderUrl(item.render_path),
    width: item.render_width,
    height: item.render_height,
  };
}
