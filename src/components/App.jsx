import { Component } from "react";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchPhoto, onFetchError } from "./service/api";
import { Searchbar } from "./Searchbar/Searchbar";
import { AppStyle } from "./App.styled";
import { ImageGallery } from "./ImageGallery/ImageGallery";
import { Button } from "./Button/Button";
import { Loader } from "./Loader/Loader";
import { Modal } from "./Modal/Modal";

export const paramsForNotify = {
  position: 'center-center',
  timeout: 3000,
  width: '400px',
  fontSize: '24px'
};
const perPage = 12;

export class App extends Component {
  state = {
    search: '',
    photos: [],
    page: 1,
    loading: false,
    btnLoadMore: false,
    showModal: false,
    selectedPhoto: null,
  }

  componentDidUpdate(_, prevState) {
    const prevSearch = prevState.search;
    const prevPage = prevState.page;
    const newSearch = this.state.search;
    const newPage = this.state.page;

    if (prevSearch !== newSearch || prevPage !== newPage) {
      this.addPhotoPage(newSearch, newPage);
    };  
  }

  addPhotoPage = (search, page) => {
    this.setState({ loading: true });

    fetchPhoto(search, page, perPage)
      .then(data => {
        const { totalHits } = data;
        const totalPage = Math.ceil(data.totalHits / perPage);
        if (totalHits === 0) {
          return Notify.failure('Sorry, there are no images matching your search query. Please try again.', paramsForNotify);
        }

        const arrPhotos = data.hits.map(({ id, webformatURL, largeImageURL, tags }) => (
          { id, webformatURL, largeImageURL, tags }
        ));
        
        this.setState(prevState =>
          ({ photos: [...prevState.photos, ...arrPhotos] }));
        
        if (totalPage > page) {
          this.setState({ btnLoadMore: true })
        } else {
          Notify.info("We're sorry, but you've reached the end of search results.", paramsForNotify);
          this.setState({ btnLoadMore: false });
        };
      })
    .catch(onFetchError)
    .finally(() => {
      this.setState({ loading: false });
    });
  }

  onClickRender = () => {
    this.setState(({page}) => ({ page: page + 1}));
  }

  toggleModal = () => {
    this.setState(({showModal}) => ({
      showModal: !showModal
    }))
  }

  onClickOpenModal = (event) => {
    const { photos } = this.state;
    const imageId = event.target.getAttribute('data-id');
    const selectedPhoto = photos.find(photo => 
      photo.id === Number(imageId));
    this.setState({ selectedPhoto });

    this.toggleModal();
  }

  onSubmitSearchBar = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const searchValue = form.search.value
      .trim()
      .toLowerCase()
      .split(' ')
      .join('+');;
    
    if (searchValue === '') {
      Notify.info('Enter your request, please!', paramsForNotify);
      return;
    };

    if (searchValue === this.state.search) {
      Notify.info('Enter new request, please!', paramsForNotify);
      return;
    };

    this.setState({
      search: searchValue,
      page: 1,
      photos: [],
    });
    
    // form.reset();
  }

  render() {
    const { loading, photos, btnLoadMore, showModal, selectedPhoto } = this.state;

    return (
      <div>
        <h1>Image finder</h1>
        <Searchbar onSubmitSearchBar={this.onSubmitSearchBar} />
        {loading && <Loader />}
        {/* {error && <h2>Error</h2>} */}
        <AppStyle>
          <ImageGallery photos={photos} onClickImageItem={this.onClickOpenModal} />
        </AppStyle>
        {photos.length !== 0 && btnLoadMore && <Button onClickRender={this.onClickRender} />}
        {showModal && <Modal selectedPhoto={selectedPhoto} onClose={this.toggleModal} />}
      </div>
    );
  }
};
