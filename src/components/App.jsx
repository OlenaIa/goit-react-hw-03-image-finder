import { Component } from "react";
import { Searchbar } from "./Searchbar/Searchbar";
import { AppStyle } from "./App.styled";
import { fetchPhoto } from "./service/api";
import { ImageGallery } from "./ImageGallery/ImageGallery";
import { Button } from "./Button/Button";
import { Loader } from "./Loader/Loader";
import { Modal } from "./Modal/Modal";

let page = null;

export class App extends Component {
  state = {
    search: '',
    photos: [],
    loading: false,
    error: null,
    btnLoadMore: false,
    showModal: false,
    selectedPhoto: null,
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
      alert('Put the word')
      return;
    }

    this.setState({
      search: searchValue,
    });
    
    form.reset();
  }

  componentDidUpdate(_, prevState) {
    const prevSearch = prevState.search;
    const newSearch = this.state.search;
    
    if (prevSearch !== newSearch) {

      page = 1;
      this.setState({ loading: true, photos: []});

      fetchPhoto(newSearch, page)
        .then(data => {

          if (data.totalHits === 0) {
            alert('No result')
                // Notify.failure('Sorry, there are no images matching your search query. Please try again.', paramsForNotify);
          } else {
            alert(`Hooray! We found ${data.totalHits} images.`);
            const arrPhotos = data.hits.map(({ id, webformatURL, largeImageURL, tags }) => (
              { id, webformatURL, largeImageURL, tags }   
        ));

            this.setState({ photos: [...arrPhotos] });
                // Notify.info(`Hooray! We found ${data.totalHits} images.`, paramsForNotify);
          };
          if (data.totalHits > 12) {
            this.setState({btnLoadMore: true})
          };
        })
      .catch(error => this.setState({error}))
      .finally(() => {
        this.setState({loading: false})
      });
    };  
  }

  onClickRender = () => {
    page += 1;
    console.log(page);
    const {search, photos } = this.state;
    this.setState({ loading: true});
    console.log('tap button');
    console.log('photos.length', photos.length);

    fetchPhoto(search, page)
      .then(data => {
        console.log('data.totalHits', data.totalHits);
        if (data.totalHits > photos.length) {
          console.log('data.totalHits > photos.length  render more');
        
          const arrPhotos = data.hits.map(({ id, webformatURL, largeImageURL, tags }) => (
          {id, webformatURL, largeImageURL, tags}
        ));

        this.setState(prevState =>
          ({ photos: [...prevState.photos, ...arrPhotos] }));
        } else {
          console.log('data.totalHits <= photos.length  stoooooop');
          alert('finish')
        };
        
          })
        
        
        .catch(error => this.setState({error}))
      .finally(() => {
        this.setState({loading: false})
      });

    // const searchResults = data.hits;
    //         const numberOfPage = Math.ceil(data.totalHits / perPage);
            
    //         createMarkup(searchResults);
    //         if (page === numberOfPage) {
    //             btnLoadMore.classList.add('is-hidden');
    //             Notify.info("We're sorry, but you've reached the end of search results.", paramsForNotify);
    //             btnLoadMore.removeEventListener('click', onClickLoadMore);
    //             window.removeEventListener('scroll', showLoadMorePage);
    //         };
  }

  render() {
    const { loading, photos, error, btnLoadMore, showModal, selectedPhoto } = this.state;

    return (
      <div>
        <h1>Image finder</h1>
        <Searchbar onSubmitSearchBar={this.onSubmitSearchBar} />
        {loading && <Loader />}
        {error && <h2>Error</h2>}
        <AppStyle>
          <ImageGallery photos={photos} onClickImageItem={this.onClickOpenModal} />
        </AppStyle>
        {photos.length !== 0 && btnLoadMore && <Button onClickRender={this.onClickRender} />}
        {showModal && <Modal selectedPhoto={selectedPhoto} onClose={this.toggleModal} />}
      </div>
    );
  }
};
