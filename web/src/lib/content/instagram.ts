const IG_ACCOUNT_ID = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || "";
const PAGE_ACCESS_TOKEN = process.env.META_PAGE_ACCESS_TOKEN || "";
const GRAPH_API = "https://graph.facebook.com/v21.0";

interface PublishResult {
  instagram_post_id?: string;
  facebook_post_id?: string;
  error?: string;
}

export async function publishToInstagram(
  imageUrl: string,
  caption: string,
): Promise<{ id: string }> {
  if (!IG_ACCOUNT_ID || !PAGE_ACCESS_TOKEN) {
    throw new Error("Instagram credentials not configured");
  }

  // Step 1: Create media container
  const createRes = await fetch(
    `${GRAPH_API}/${IG_ACCOUNT_ID}/media`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: imageUrl,
        caption,
        access_token: PAGE_ACCESS_TOKEN,
      }),
    },
  );

  const createData = await createRes.json();
  if (createData.error) {
    throw new Error(`IG media create failed: ${createData.error.message}`);
  }

  const creationId = createData.id;

  // Step 2: Publish the container
  const publishRes = await fetch(
    `${GRAPH_API}/${IG_ACCOUNT_ID}/media_publish`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: creationId,
        access_token: PAGE_ACCESS_TOKEN,
      }),
    },
  );

  const publishData = await publishRes.json();
  if (publishData.error) {
    throw new Error(`IG publish failed: ${publishData.error.message}`);
  }

  return { id: publishData.id };
}

export async function publishToFacebook(
  imageUrl: string,
  caption: string,
  pageId?: string,
): Promise<{ id: string }> {
  const fbPageId = pageId || process.env.FACEBOOK_PAGE_ID;
  if (!fbPageId || !PAGE_ACCESS_TOKEN) {
    throw new Error("Facebook credentials not configured");
  }

  const res = await fetch(
    `${GRAPH_API}/${fbPageId}/photos`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: imageUrl,
        message: caption,
        access_token: PAGE_ACCESS_TOKEN,
      }),
    },
  );

  const data = await res.json();
  if (data.error) {
    throw new Error(`FB publish failed: ${data.error.message}`);
  }

  return { id: data.id || data.post_id };
}

export async function publishPost(
  imageUrl: string,
  caption: string,
): Promise<PublishResult> {
  const result: PublishResult = {};

  // Publish to Instagram
  if (IG_ACCOUNT_ID && PAGE_ACCESS_TOKEN) {
    try {
      const ig = await publishToInstagram(imageUrl, caption);
      result.instagram_post_id = ig.id;
    } catch (error) {
      console.error("Instagram publish error:", error);
      result.error = `Instagram: ${(error as Error).message}`;
    }
  }

  // Publish to Facebook
  if (process.env.FACEBOOK_PAGE_ID && PAGE_ACCESS_TOKEN) {
    try {
      const fb = await publishToFacebook(imageUrl, caption);
      result.facebook_post_id = fb.id;
    } catch (error) {
      console.error("Facebook publish error:", error);
      const fbError = `Facebook: ${(error as Error).message}`;
      result.error = result.error ? `${result.error}; ${fbError}` : fbError;
    }
  }

  return result;
}
