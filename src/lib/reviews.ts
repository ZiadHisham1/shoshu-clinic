import "server-only";

export interface CustomerReview {
  id: string;
  /** Full public URL of the screenshot */
  image: string;
  /** Original filename from Supabase */
  filename: string;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Bucket + folder inside the bucket */
const BUCKET = "shima-clinic";
const FOLDER = "tiktok/customer-reviews";

/** Image extensions Supabase will return that we care about */
const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;

/**
 * List all image files inside the reviews folder and return public URLs.
 * Uses Supabase Storage's list API (read-only, uses the anon key).
 *
 * Results are cached for 60 seconds — new uploads appear within a minute.
 */
export async function listReviews(): Promise<CustomerReview[]> {

      console.log("[listReviews] URL:", SUPABASE_URL);
  console.log(
    "[listReviews] key length:",
    SUPABASE_ANON_KEY?.length ?? "MISSING"
  );
  console.log(
    "[listReviews] key starts with eyJ:",
    SUPABASE_ANON_KEY?.startsWith("eyJ")
  );
  try {
    const res = await fetch(
      `${SUPABASE_URL}/storage/v1/object/list/${BUCKET}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          prefix: `${FOLDER}/`,
          limit: 100,
          offset: 0,
          sortBy: { column: "name", order: "asc" },
        }),
        // Cache for 60s, then revalidate in the background
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      console.error("[listReviews] HTTP", res.status, await res.text());
      return [];
    }

    const items: Array<{ name: string; id: string | null }> = await res.json();

    const reviews: CustomerReview[] = items
      .filter((item) => IMAGE_EXT.test(item.name))
      .map((item) => {
        // Encode the filename for spaces/special characters
        const encoded = encodeURIComponent(item.name);
        return {
          id: item.id ?? item.name,
          filename: item.name,
          image: `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${FOLDER}/${encoded}`,
        };
      });

    return reviews;
  } catch (e) {
    console.error("[listReviews] failed:", e);
    return [];
  }
}