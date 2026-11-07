import JSZip from "jszip";
import { FileItem } from "@/types/ide";

/**
 * Recursively add files to JSZip instance
 */
function addFilesToZip(zip: JSZip, items: FileItem[]) {
  for (const item of items) {
    if (item.type === "file") {
      // Strip leading slash for zip relative paths
      const relativePath = item.path.replace(/^\//, "");
      zip.file(relativePath, item.content || "");
    } else if (item.type === "folder") {
      if (item.children) {
        addFilesToZip(zip, item.children);
      }
    }
  }
}

/**
 * Export entire workspace as a .zip file download
 */
export async function exportWorkspaceAsZip(files: FileItem[], projectName = "ela-project") {
  const zip = new JSZip();
  addFilesToZip(zip, files);

  const blob = await zip.generateAsync({ type: "blob" });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = `${projectName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}

