// lib/cloudinary.ts
import { Cloudinary } from '@cloudinary/url-gen';
import { quality } from '@cloudinary/url-gen/actions/delivery';
import { auto } from '@cloudinary/url-gen/qualifiers/quality';
import { scale } from '@cloudinary/url-gen/actions/resize';

export const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  }
});

export const getOptimizedImageUrl = (publicId: string, width?: number, height?: number) => {
  let image = cld.image(publicId).delivery(quality(auto()));

  if (width && height) {
    image = image.resize(scale().width(width).height(height));
  } else if (width) {
    image = image.resize(scale().width(width));
  } else if (height) {
    image = image.resize(scale().height(height));
  }

  return image.toURL();
};