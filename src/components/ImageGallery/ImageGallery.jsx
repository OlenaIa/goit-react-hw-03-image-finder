import { ImageGalleryItem } from "components/ImageGalleryItem/ImageGalleryItem";
import { Gallery } from "./ImageGallery.styled";
import PropTypes from 'prop-types'

export const ImageGallery = ({photos, onClickImageItem}) => (
    <Gallery>
        {photos.map(({id, webformatURL, tags }) => (
            <ImageGalleryItem
                id={id}
                tags={tags}
                smallUrl={webformatURL}
                onClickImageItem={onClickImageItem} />
        ))}
    </Gallery>
);

ImageGallery.propTypes = {
    photos: PropTypes.arrayOf(PropTypes.objectOf({
        id: PropTypes.number.isRequired,
        largeImageURL: PropTypes.string.isRequired,
        webformatURL: PropTypes.string.isRequired,
        tags: PropTypes.string.isRequired,
    }).isRequired,).isRequired,
    onClickImageItem: PropTypes.func.isRequired,
}