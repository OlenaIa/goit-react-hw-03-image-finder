import axios from "axios";

const perPage = 12;
    const KEY = "37440122-e5d5a2493910548fa520b3add";
    const URL = "https://pixabay.com/api/";

export async function fetchPhoto(search, page) {
    const url = `${URL}?key=${KEY}&q=${search}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal`;
    const response = await axios.get(url);
    return response.data;       
};

// export async function fetchPhoto(URL, KEY, search, page, perPage) {
//     const url = `${URL}?key=${KEY}&q=${search}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal`;
//     const response = await axios.get(url);
//     console.log('response', response);
// console.log('response.ok', response.ok);

//     if (response.ok) {
//         return response.data; 
//     };
//     return Promise.reject(new Error(`No card ${search}}`));       
// };

export function onFetchError() {
    alert('Oops!');
    // Notify.failure('Oops! Something went wrong! Try reloading the page or make another choice!', paramsForNotify);
};
