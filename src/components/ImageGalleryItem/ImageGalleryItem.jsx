import { ImageGalleryItemStyled, ImageGalleryImg } from "./ImageGalleryItem.styled";
import PropTypes from 'prop-types'

export const ImageGalleryItem = ({id, smallUrl, tags, onClickImageItem }) => (
    <ImageGalleryItemStyled
        key={id}
        data-id={id}
        onClick={onClickImageItem}
    >
        <ImageGalleryImg src={smallUrl} alt={tags} data-id={id} />
    </ImageGalleryItemStyled>
);

ImageGalleryItem.propTypes = {
    id: PropTypes.number.isRequired,
    smallUrl: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
    onClickImageItem: PropTypes.func.isRequired,
};