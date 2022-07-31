import NextHead from "next/head";
import useHead from "./hooks/useHead";

export default function Head() {
  const { title, description, image, siteName } = useHead();

  return (
    <NextHead>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="noindex" />
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta property="og:locale" content="en_GB" />
      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta name="og:description" content={description} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />

      {image && (
        <>
          <meta property="og:image" itemProp="image" content={image} />
          <meta
            property="og:image:secure_url"
            itemProp="image"
            content={image}
          />
          <meta property="og:image:alt" content={title} />
          <meta name="twitter:image" content={image} />
        </>
      )}
    </NextHead>
  );
}
