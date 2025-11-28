import "./PhotoViewer.css"
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import type { OfferProps } from '../../../Data/OfferProps';


interface Props {
  offerProps: OfferProps;
  compact?: boolean;
}

const PhotoViewer = ({ offerProps, compact = false }: Props) => {
  // Defensive: ensure we have an array of photo URLs (frontend types use string[])
  const photoUrls = Array.isArray(offerProps.photos) ? offerProps.photos : [];

  const images = photoUrls.map((url) => ({
    original: url,
    thumbnail: url,
  }));

  return (
    <div className="photo-viewer">
      <ImageGallery
        items={images}
        showPlayButton={false}
        showBullets={true}
        showIndex={true}
        showThumbnails={!compact}
        showFullscreenButton={!compact}
      />
    </div>
  );
}

export default PhotoViewer