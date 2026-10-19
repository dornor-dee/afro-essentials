import { redirect } from "next/navigation";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const category = params.category;
  if (category) {
    redirect(`/shop?category=${encodeURIComponent(String(category))}`);
  }
  redirect("/shop");
}
