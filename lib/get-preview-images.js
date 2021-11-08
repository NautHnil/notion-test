import crypto from "crypto";
import got from "got";
import pMap from "p-map";

import { api, isPreviewImageSupportEnabled } from "./config";
import * as db from "./db";

function sha256(input) {
  const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

export async function getPreviewImages(images) {
  if (!isPreviewImageSupportEnabled) {
    return {};
  }

  const imageDocRefs = images.map((url) => {
    const id = sha256(url);
    return db.images.doc(id);
  });

  if (!imageDocRefs.length) {
    return {};
  }

  const imageDocs = await db.db.getAll(...imageDocRefs);
  const results = await pMap(imageDocs, async (model, index) => {
    if (model.exists) {
      return model.data();
    } else {
      const json = {
        url: images[index],
        id: model.id,
      };
      console.log("createPreviewImage server-side", json);

      // TODO: should we fire and forget here to speed up builds?
      return got.post(api.createPreviewImage, { json }).json();
    }
  });

  return results
    .filter(Boolean)
    .filter((image) => !image.error)
    .reduce(
      (acc, result) => ({
        ...acc,
        [result.url]: result,
      }),
      {}
    );
}
