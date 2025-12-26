

document.addEventListener('DOMContentLoaded', function() {
    
    const destinationsData = [
        {
            id: 1,
            name: "Great Wall Hiking Expedition",
            location: "Beijing, China",
            duration: "4 Days",
            category: "mountain",
            price: "$1,870",
            rating: "⭐⭐⭐⭐⭐ (36)",
            image: "images/destinations/great-wall.jpg",
            description: "Walk along ancient history with guided hikes on both restored and wild sections of the Great Wall, including sunrise views from Jinshanling.",
            features: ["Guided Hikes", "Cultural Tour", "Sunrise Views", "Photography Spots"]
        },
        {
            id: 2,
            name: "Chureito Pagoda & Mt. Fuji Experience",
            location: "Fujiyoshida, Japan",
            duration: "1 Day",
            category: "cultural",
            price: "$2,450",
            rating: "⭐⭐⭐⭐⭐ (42)",
            image: "images/destinations/chureito-pagoda.jpg",
            description: "Capture the iconic postcard view from Chureito Pagoda's 400-step climb, with guided photography tips and cultural insights at this sacred Shinto shrine.",
            features: ["Photography Tour", "Cultural Experience", "Scenic Views", "Guided Tour"]
        },
        {
            id: 3,
            name: "Batu Caves & Hindu Temple Experience",
            location: "Kuala Lumpur, Malaysia",
            duration: "Half Day",
            category: "cultural",
            price: "$1,950",
            rating: "⭐⭐⭐⭐⭐ (39)",
            image: "images/destinations/batu-caves.jpg",
            description: "Climb the 272 vibrant steps to limestone cave temples, witness the towering golden Murugan statue, and explore Hindu shrines nestled within ancient caverns.",
            features: ["Cultural Tour", "Easy Access", "Photography", "Historical Sites"]
        }
    ];

    
    const destinationsPerPage = 6; 
    let currentPage = 1;
    let filteredDestinations = [...destinationsData];

    // ==================== VIDEO MODAL VARIABLES ====================
    const videoModal = document.getElementById('videoModal');
    const videoFrame = document.getElementById('videoFrame');
    const videoTitle = document.getElementById('videoTitle');
    const videoDescription = document.getElementById('videoDescription');
    const closeModalBtn = document.querySelector('.close-modal');
    // ==================== END VIDEO MODAL VARIABLES ====================

    // DOM Elements
    const destinationsGrid = document.getElementById('destinationsGrid');
    const searchInput = document.getElementById('destinationSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const durationFilter = document.getElementById('durationFilter');
    const resetButton = document.getElementById('resetFilters');
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    const pageNumbers = document.getElementById('pageNumbers');

    
    function initPage() {
        renderDestinations();
        setupEventListeners();
        setupVideoModal();
        updatePagination();
        updateFooterYear();
    }

    
    function renderDestinations() {
        destinationsGrid.innerHTML = '';
        
        const startIndex = (currentPage - 1) * destinationsPerPage;
        const endIndex = startIndex + destinationsPerPage;
        const destinationsToShow = filteredDestinations.slice(startIndex, endIndex);
        
        if (destinationsToShow.length === 0) {
            destinationsGrid.innerHTML = `
                <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 60px;">
                    <i class="fas fa-search" style="font-size: 4rem; color: #ccc; margin-bottom: 20px;"></i>
                    <h3 style="color: #666; margin-bottom: 10px;">No destinations found</h3>
                    <p style="color: #888;">Try adjusting your search or filters</p>
                </div>
            `;
            return;
        }
        
        destinationsToShow.forEach(destination => {
            const destinationCard = createDestinationCard(destination);
            destinationsGrid.appendChild(destinationCard);
        });
        
        // Re-attach event listeners to the new "Details" buttons
        attachDetailsButtonListeners();
    }

    
    function createDestinationCard(destination) {
        const card = document.createElement('div');
        card.className = 'destination-card-large';
        card.innerHTML = `
            <div class="card-image">
                <img src="${destination.image}" alt="${destination.name}">
                <span class="category-badge">${getCategoryName(destination.category)}</span>
                <span class="price-tag-large">${destination.price}</span>
            </div>
            <div class="card-content-large">
                <h3>${destination.name}</h3>
                <div class="card-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${destination.location}</span>
                    <span><i class="far fa-clock"></i> ${destination.duration}</span>
                    <span>${destination.rating}</span>
                </div>
                <p>${destination.description}</p>
                <div class="card-features">
                    ${destination.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
                <div class="card-buttons">
                    <a href="#" class="card-btn-primary">Book Now</a>
                    <button class="card-btn-secondary view-details-btn" 
                            data-youtube-url="${destination.youtubeUrl}"
                            data-title="${destination.name}"
                            data-description="${destination.description}">
                        Details
                    </button>
                </div>
            </div>
        `;
        return card;
    }

    // ==================== VIDEO MODAL FUNCTIONS ====================
    function setupVideoModal() {
        // Close modal when clicking the X button
        closeModalBtn.addEventListener('click', closeVideoModal);
        
        // Close modal when clicking outside the modal content
        videoModal.addEventListener('click', function(e) {
            if (e.target === videoModal) {
                closeVideoModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && videoModal.classList.contains('active')) {
                closeVideoModal();
            }
        });
    }
    
    function openVideoModal(youtubeUrl, title, description) {
        // Set the iframe source to the YouTube embed URL
        videoFrame.src = youtubeUrl;
        videoTitle.textContent = title;
        videoDescription.textContent = description;
        
        // Show the modal
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent page scrolling
    }
    
    function closeVideoModal() {
        // Hide the modal
        videoModal.classList.remove('active');
        
        // Stop video playback by removing the src
        videoFrame.src = '';
        
        // Re-enable page scrolling
        document.body.style.overflow = 'auto';
    }
    
    function attachDetailsButtonListeners() {
        // Get all "Details" buttons
        const detailsButtons = document.querySelectorAll('.view-details-btn');
        
        // Add click event to each button
        detailsButtons.forEach(button => {
            button.addEventListener('click', function() {
                const youtubeUrl = this.getAttribute('data-youtube-url');
                const title = this.getAttribute('data-title');
                const description = this.getAttribute('data-description');
                
                openVideoModal(youtubeUrl, title, description);
            });
        });
    }
    // ==================== END VIDEO MODAL FUNCTIONS ====================

    
    function getCategoryName(category) {
        const categories = {
            'beach': 'Beach',
            'mountain': 'Mountain',
            'cultural': 'Cultural',
            'city': 'City',
            'nature': 'Nature'
        };
        return categories[category] || category;
    }

    
    function filterDestinations() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const selectedDuration = durationFilter.value;
        
        filteredDestinations = destinationsData.filter(destination => {
            
            const matchesSearch = searchTerm === '' || 
                destination.name.toLowerCase().includes(searchTerm) ||
                destination.location.toLowerCase().includes(searchTerm) ||
                destination.description.toLowerCase().includes(searchTerm);
            
            
            const matchesCategory = selectedCategory === 'all' || 
                destination.category === selectedCategory;
            
            
            let matchesDuration = true;
            if (selectedDuration !== 'all') {
                const duration = destination.duration.toLowerCase();
                switch (selectedDuration) {
                    case 'short':
                        matchesDuration = duration.includes('day') && !duration.includes('half');
                        break;
                    case 'medium':
                        
                        matchesDuration = false;
                        break;
                    case 'long':
                        
                        matchesDuration = false;
                        break;
                }
            }
            
            return matchesSearch && matchesCategory && matchesDuration;
        });
        
        currentPage = 1;
        renderDestinations();
        updatePagination();
    }

    
    function updatePagination() {
        const totalPages = Math.ceil(filteredDestinations.length / destinationsPerPage);
        
        
        if (totalPages <= 1) {
            document.querySelector('.pagination').style.display = 'none';
            return;
        }
        
        document.querySelector('.pagination').style.display = 'flex';
        
        
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;
        
        
        pageNumbers.innerHTML = '';
        
        for (let i = 1; i <= totalPages; i++) {
            const pageNumber = document.createElement('span');
            pageNumber.className = `page-number ${i === currentPage ? 'active' : ''}`;
            pageNumber.textContent = i;
            pageNumber.addEventListener('click', () => {
                currentPage = i;
                renderDestinations();
                updatePagination();
            });
            pageNumbers.appendChild(pageNumber);
        }
    }

    
    function setupEventListeners() {
        
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(filterDestinations, 300);
        });
        
        
        categoryFilter.addEventListener('change', filterDestinations);
        durationFilter.addEventListener('change', filterDestinations);
        
        
        resetButton.addEventListener('click', () => {
            searchInput.value = '';
            categoryFilter.value = 'all';
            durationFilter.value = 'all';
            filterDestinations();
        });
        
        
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderDestinations();
                updatePagination();
            }
        });
        
        nextButton.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredDestinations.length / destinationsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderDestinations();
                updatePagination();
            }
        });
    }

    
    function updateFooterYear() {
        const currentYearElement = document.getElementById('currentYear');
        if (currentYearElement) {
            currentYearElement.textContent = new Date().getFullYear();
        }
    }

    
    initPage();
});