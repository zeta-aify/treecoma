import { createClient } from "@supabase/supabase-js";

const BUCKET = "content-images";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function uploadImage(
  buffer: Buffer,
  fileName: string,
  contentType: string = "image/jpeg",
): Promise<{ path: string; url: string }> {
  const supabase = getServiceClient();

  const path = `${Date.now()}-${fileName}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType,
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(path);

  return {
    path,
    url: urlData.publicUrl,
  };
}
