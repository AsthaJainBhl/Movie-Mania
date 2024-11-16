// OMDB API Key
const apiKey = ''; // Replace with your OMDB API key
const ytapikey = ''; // Replace with your YouTube API key


// URL for fetching latest movies (for the current year)
const apiUrl = `http://www.omdbapi.com/?apikey=${apiKey}&s=movie&type=movie&y=${new Date().getFullYear()}`;

// Function to fetch latest movies from OMDB API and create the slider
function fetchLatestMovies() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.Response === 'True') {
        const movies = data.Search.slice(0, 5); // Take the first 5 movies
        createSlider(movies);
        fetchTrailer(movies[0].Title); // Fetch trailer for the first movie
      } else {
        console.error('Error fetching movies:', data.Error);
      }
    })
    .catch(error => {
      console.error('Error fetching movie data:', error);
    });
}

// Function to fetch the latest entertainment news
async function fetchEntertainmentNews() {
  try {
    const response = await fetch('https://api.currentsapi.services/v1/latest-news?category=entertainment&apiKey=ECsCGTnCxWL7QMkfgN-z-9ihFgP_FRKkrpwkMcMTxhTZAwgz');
    const data = await response.json();
    
    // Get the news container element
    const newsContainer = document.getElementById('news-container');
    
    // Clear any existing content
    newsContainer.innerHTML = '';
    
    // Check if we have news results
    if (data.news && data.news.length > 0) {
      // Loop through the news and display it
      data.news.forEach(newsItem => {
        const newsElement = document.createElement('div');
        newsElement.classList.add('news-item');

        // Create image (if available)
        if (newsItem.image) {
          const image = document.createElement('img');
          image.src = newsItem.image;
          image.alt = newsItem.title;
          image.style.width = '100%'; // Optional: Set image width
          newsElement.appendChild(image);
        }

        // Create title
        const title = document.createElement('h2');
        title.textContent = newsItem.title;

        // Create description
        const description = document.createElement('p');
        description.textContent = newsItem.description;

        // Create link
        const link = document.createElement('a');
        link.href = newsItem.url;
        link.textContent = 'Read more...';
        link.target = '_blank'; // Open link in a new tab

        // Append elements to news item
        newsElement.appendChild(title);
        newsElement.appendChild(description);
        newsElement.appendChild(link);

        // Append news item to container
        newsContainer.appendChild(newsElement);
      });
    } else {
      newsContainer.innerHTML = '<p>No entertainment news available at the moment.</p>';
    }
  } catch (error) {
    console.error('Error fetching news:', error);
    document.getElementById('news-container').innerHTML = '<p>Failed to load news.</p>';
  }
}

// Call the function when the page loads
fetchEntertainmentNews();


// Function to create the slider with the movie posters
function createSlider(movies) {
  const slider = document.getElementById('slider');
  slider.innerHTML = ''; // Clear existing content

  movies.forEach((movie) => {
    const slide = document.createElement('div');
    slide.classList.add('slide');

    const img = document.createElement('img');
    img.src = movie.Poster;
    img.alt = movie.Title;

    slide.appendChild(img);
    slider.appendChild(slide);
  });

  // Initialize the slider controls
  initSliderControls(movies.length);
}

// Function to initialize slider controls (arrows)
function initSliderControls(totalSlides) {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const slider = document.getElementById('slider');
  
  let currentSlideIndex = 0;

  function updateSliderPosition() {
    slider.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
  }

  prevBtn.addEventListener('click', function() {
    currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
    updateSliderPosition();
  });

  nextBtn.addEventListener('click', function() {
    currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
    updateSliderPosition();
  });
}

// Function to fetch the trailer for a movie from YouTube API
function fetchTrailer(movieName) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(movieName + " trailer")}&key=${ytapikey}&maxResults=1&type=video&order=date`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.items.length > 0) {
        const videoId = data.items[0].id.videoId;
        const videoUrl = `https://www.youtube.com/embed/${videoId}`;
        displayTrailer(videoUrl);
      } else {
        console.log('No trailers found for', movieName);
      }
    })
    .catch(error => console.error('Error fetching trailer:', error));
}

// Function to display the trailer in an iframe
function displayTrailer(url) {
  const trailerDiv = document.getElementById('trailerContainer');
  trailerDiv.innerHTML = ''; // Clear previous trailer

  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.width = "100%"; // Adjust width and height
  iframe.height = "315";
  iframe.frameBorder = "0";
  iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
  iframe.allowFullscreen = true;
  
  trailerDiv.appendChild(iframe);
}

// Start by fetching the latest movies and displaying them in the slider
fetchLatestMovies();

// OMDB API Key for the movie search
const searchApiKey = '';

// Handle the form submission for movie search
document.getElementById('movieForm').addEventListener('submit', function (event) {
  event.preventDefault();
});

// Handle the input field value changes for movie search
document.getElementById('title').addEventListener('input', async function (event) {
  const search = event.target.value;

  if (search.trim() === '') {
    clearResults();
    return;
  }

  // Hide the content-container when searching
  document.getElementById('content-container').style.display = 'none';

  // Fetch and display movie search results
  const searchResults = await fetchMovies(search);

  if (searchResults && searchResults.Search) {
    displaySearchResults(searchResults.Search);
  } else {
    clearResults();
  }
});

// Function to fetch movie details from OMDB API based on search
async function fetchMovies(search) {
  const url = `https://www.omdbapi.com/?s=${search}&apikey=${searchApiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

// Function to display search results as movie tiles
function displaySearchResults(results) {
  const searchResultsContainer = document.getElementById('searchResults');
  searchResultsContainer.innerHTML = ''; // Clear previous results

  results.forEach((movie) => {
    const movieTile = document.createElement('div');
    movieTile.className = 'col-md-4 movie-tile';

    // Check if the movie has a poster, or use a placeholder image
    const posterUrl = movie.Poster === 'N/A' ? 'placeholder-image.jpg' : movie.Poster;

    // Create an anchor tag for the movie title
    const movieDetailsLink = document.createElement('a');
    movieDetailsLink.href = `movie.html?title=${encodeURIComponent(movie.Title)}`;
    movieDetailsLink.textContent = movie.Title;

    movieTile.innerHTML = `
      <img src="${posterUrl}" alt="${movie.Title}" class="movie-poster">
      <h2>${movieDetailsLink.outerHTML}</h2>
      <p>Year: ${movie.Year}</p>
      <button class="btn btn-primary add-to-watchlist" data-title="${movie.Title}">Add to watchlist</button>
    `;

    searchResultsContainer.appendChild(movieTile);
  });

  // Add click event listeners to the "Add to watchlist" buttons
  const addTowatchlistButtons = document.querySelectorAll('.add-to-watchlist');
  addTowatchlistButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const title = button.getAttribute('data-title');
      addTowatchlist(title);
    });
  });
}

// Function to clear search results and show carousel if no results
function clearResults() {
  const searchResultsContainer = document.getElementById('searchResults');
  const carouselContainer = document.getElementById('carouselContainer');
  const contentContainer = document.getElementById('content-container');

  searchResultsContainer.innerHTML = ''; // Clear search results

  // Show the carousel if no search results are displayed
  carouselContainer.style.display = 'block';

  // Show the content-container if there are no results or after clearing search
  contentContainer.style.display = 'block';
}

// Function to add a movie to watchlist and store in localStorage
function addTowatchlist(title) {
  const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  if (!watchlist.includes(title)) {
    watchlist.push(title);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    alert(`${title} has been added to your watchlist!`);
  } else {
    alert(`${title} is already in your watchlist!`);
  }
  console.log('watchlist:', watchlist); // For debugging
}
