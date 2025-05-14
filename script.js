document.addEventListener('DOMContentLoaded', function () {
    if (typeof axios === 'undefined') {
        console.error('Axios is not loaded.');
        return;
    }
  
    const weatherInfo = document.querySelector('.weather-info');
    const beachReport = document.querySelector('#beach-report p');
    const tideReport = document.querySelector('#tide-report p');
    const londonBtn = document.querySelector('#london-btn');
    const nycBtn = document.querySelector('#nyc-btn');
    const mumBtn = document.querySelector('#mum-btn');
  
    if (!londonBtn || !nycBtn || !mumBtn) {
        console.error('One or more buttons not found.');
        return;
    }
  
    // Dummy data for reports
    const beachData = [
        "Waves are moderate, water temperature is 24°C, and the weather is sunny.",
        "High waves, water temperature is 26°C, and strong winds detected.",
        "Calm sea, water temperature is 23°C, and light breeze."
    ];
  
    const tideData = [
        "Next high tide: 3:00 PM, Next low tide: 9:00 PM.",
        "Next high tide: 5:30 AM, Next low tide: 11:45 AM.",
        "Next high tide: 8:15 PM, Next low tide: 2:00 AM."
    ];
  
    let beachIndex = 0;
    let tideIndex = 0;
  
    londonBtn.addEventListener('click', () => {
        beachIndex = (beachIndex + 1) % beachData.length;
        beachReport.innerText = beachData[beachIndex];
        tideIndex = (tideIndex + 1) % tideData.length;
        tideReport.innerText = tideData[tideIndex];
        let map = document.querySelector("#map");
        map.setAttribute("src" , "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27208.398975439548!2d-0.15019559717007502!3d51.507142845858745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a00baf21de75%3A0x52963a5addd52a99!2sLondon%2C%20UK!5e0!3m2!1sen!2sin!4v1740255756347!5m2!1sen!2sin");
        fetchWeather('london');
    });
  
    nycBtn.addEventListener('click', () => {
        beachIndex = (beachIndex + 1) % beachData.length;
        beachReport.innerText = beachData[beachIndex];
        tideIndex = (tideIndex + 1) % tideData.length;
        tideReport.innerText = tideData[tideIndex];
        let map = document.querySelector("#map");
        map.setAttribute("src" , "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d79028.10725612043!2d-74.0494490986479!3d40.74095928750671!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1740255937612!5m2!1sen!2sin");
        fetchWeather('new york');
    });
  
    mumBtn.addEventListener('click', () => {
        beachIndex = (beachIndex + 1) % beachData.length;
        beachReport.innerText = beachData[beachIndex];
        tideIndex = (tideIndex + 1) % tideData.length;
        tideReport.innerText = tideData[tideIndex];
        let map = document.querySelector("#map");
        map.setAttribute("src" , "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119100.1370380504!2d72.79845167806347!3d19.10934029222348!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1740256038883!5m2!1sen!2sin");
        fetchWeather('mumbai');
    });
  
    // Function to fetch weather data
    function fetchWeather(city) {
        axios.get(`http://localhost:3000/weather?city=${city}`)
            .then(response => {
                const weatherData = response.data;
                document.querySelector('.weather-app .location').innerText = `${weatherData.name}, ${weatherData.sys?.country || ''}`;
                document.querySelector('.weather-app .temperature').innerText = `${weatherData.main?.temp ?? ''}°C`;
                document.querySelector('.weather-app .condition').innerText = weatherData.weather?.[0]?.description || '';
  
                weatherInfo.innerHTML = `
                    <div id="weatherInfo" class="weather-container">
                        <h2>Current Weather</h2>
                        <div class="weather-details">
                            <p><strong>Temperature:</strong> ${weatherData.main?.temp}°C</p>
                            <p><strong>Feels Like:</strong> ${weatherData.main?.feels_like}°C</p>
                            <p><strong>Humidity:</strong> ${weatherData.main?.humidity}%</p>
                            <p><strong>Wind Speed:</strong> ${weatherData.wind?.speed} m/s</p>
                            <p><strong>Pressure:</strong> ${weatherData.main?.pressure} hPa</p>
                            <p><strong>Visibility:</strong> ${(weatherData.visibility / 1000).toFixed(1)} km</p>
                            <p><strong>Sunrise:</strong> ${new Date(weatherData.sys?.sunrise * 1000).toLocaleTimeString()}</p>
                            <p><strong>Sunset:</strong> ${new Date(weatherData.sys?.sunset * 1000).toLocaleTimeString()}</p>
                        </div>
                    </div>
                `;
            })
            .catch(error => {
                weatherInfo.innerText = 'Failed to fetch weather data.';
                console.error('Error fetching weather data:', error);
            });
    }
  
    // --- Begin: Beach dropdown suggestions ---
    const searchInput = document.getElementById('beach-search');
    const suggestionsContainer = document.getElementById('suggestions');
    // Define three beach suggestions (1 is an Indian beach)
    const beachSuggestions = [
      { name: "Bondi Beach", info: "Bondi Beach is popular in Sydney, Australia with great waves and vibrant culture." },
      { name: "Goa Beach", info: "Goa Beach is known for its vibrant nightlife, beautiful scenery, and relaxed vibes." },
      { name: "Marina Beach", info: "Marina Beach is one of the longest urban beaches in India, located in Chennai." }
    ];
  
    // When the search input is clicked, show suggestions.
    searchInput.addEventListener('click', () => {
      suggestionsContainer.innerHTML = ''; // clear previous suggestions
      beachSuggestions.forEach(beach => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.innerText = beach.name;
        div.addEventListener('click', () => {
          // Navigate to beach.html with the beach name passed as a URL query parameter.
          window.location.href = `beach.html?beach=${encodeURIComponent(beach.name)}`;
        });
        suggestionsContainer.appendChild(div);
      });
      suggestionsContainer.style.display = 'block';
    });
  
    // Hide suggestions when clicking outside the search input or suggestions container.
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
        suggestionsContainer.style.display = 'none';
      }
    });
    // --- End: Beach dropdown suggestions ---
  
    // Dummy Data for Graphs
    const oceanographicData = {
        airCurrent: [5, 10, 7, 14, 9, 12, 8],
        salinity: [35, 36, 34, 37, 38, 36, 35],
        currentPatterns: [2.1, 3.0, 2.8, 3.5, 2.9, 3.1, 3.4]
    };
  
    function generateGraph(canvasId, label, data) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
                datasets: [{
                    label: label,
                    data: data,
                    backgroundColor: 'rgba(63, 162, 191, 0.2)',
                    borderColor: 'rgba(63, 162, 191, 1)',
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
  
    generateGraph('airCurrentChart', 'Air Current (m/s)', oceanographicData.airCurrent);
    generateGraph('salinityChart', 'Salinity (PSU)', oceanographicData.salinity);
    generateGraph('currentPatternChart', 'Current Patterns (m/s)', oceanographicData.currentPatterns);
  });