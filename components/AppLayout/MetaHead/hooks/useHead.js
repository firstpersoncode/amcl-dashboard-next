import { useCommonContext } from "context/Common";

export default function useHead() {
  const { siteName, page } = useCommonContext();

  const title = page.title;
  const description = page.description;
  const image = page.image;

  return {
    title,
    description,
    image,
    siteName,
  };
}
