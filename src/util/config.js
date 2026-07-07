const admin = sessionStorage.getItem("isAdmin");

export const baseURL = process.env.REACT_APP_BACKEND_URI;

export const fileURL = (process.env.REACT_APP_FILE_URI || "").replace(/\/$/, "");

/** Resolve video/image URLs — rewrites stale hosts and relative /uploads paths. */
export function resolveMediaUrl(url) {
  if (url == null || url === "") return "";

  const trimmed = String(url).trim().replace(/\\/g, "/");
  if (!trimmed) return "";

  let path = trimmed.replace(/\/api\/uploads\//gi, "/uploads/");

  if (/^https?:\/\//i.test(path)) {
    try {
      const { pathname } = new URL(path);
      path = pathname || "";
    } catch {
      return trimmed;
    }
  } else if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  const uploadsAt = path.indexOf("/uploads/");
  if (uploadsAt >= 0) {
    path = path.slice(uploadsAt);
  }

  if (path.startsWith("/uploads/")) {
    return `${fileURL}${path}`;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `${fileURL}${path.startsWith("/") ? path : `/${path}`}`;
}

export const secretKey = process.env.REACT_APP_SECRET_KEY;
export const projectName = "";
export const folderStructurePath = "";