import "./PhotoViewer.css"
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import type { OfferProps } from '../../../Data/OfferProps';
import { useState } from "react";


interface Props {
  offerProps: OfferProps;
  compact?: boolean;
}

const PhotoViewer = ({ offerProps, compact = false }: Props) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  // Defensive: ensure we have an array of photo URLs (frontend types use string[])
  const photoDtos = Array.isArray(offerProps.photos) ? offerProps.photos : [];

  const images = photoDtos.map((dto) => ({
    original: compact ? dto.urlSmall : dto.urlMedium,
    thumbnail: dto.urlSmall,
  }));

  const imagesFullscreen = photoDtos.map((dto) => ({
    original: dto.urlLarge,
    thumbnail: dto.urlSmall,
  }));

  return (
    <div className="photo-viewer">
      <ImageGallery
        items={!isFullscreen ? images : imagesFullscreen}
        showPlayButton={false}
        showBullets={true}
        showIndex={true}
        showThumbnails={!compact}
        showFullscreenButton={!compact}
        onScreenChange={ isFullscreen => setIsFullscreen(isFullscreen) }
      />
    </div>
  );
}

export default PhotoViewer