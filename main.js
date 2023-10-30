
const categoryDropdown = document.getElementById('category-dropdown');
const newCategoryInput = document.getElementById('new-category-input');
const newCategoryName = document.getElementById('new-category-name');
const addCategoryButton = document.getElementById('add-category-button');
const bookmarksContainer = document.querySelector('.bookmarks-container');
const addBookmarkButton = document.getElementById('add-bookmark-button');
const addBookmarkModal = document.getElementById('add-bookmark-modal');
const bookmarkDetails = document.getElementById('bookmark-details');

//localStorage
let categories = JSON.parse(localStorage.getItem('categories')) || [];

//categories in the dropdown
function renderCategories() {
    categoryDropdown.innerHTML = '<option value="default">Select Category</option>';
    categories.forEach(category => {
        categoryDropdown.innerHTML += `<option value="${category}">${category}</option>`;
    });
}

//add a new category
function addCategory(categoryName) {
    if (!categories.includes(categoryName)) {
        categories.push(categoryName);
        localStorage.setItem('categories', JSON.stringify(categories));
        renderCategories();
    }
}

// display bookmarks in a category
function displayBookmarks(categoryName) {
    

    const categoryBookmarks = JSON.parse(localStorage.getItem(categoryName)) || [];

    // Display bookmarks in the bookmarksContainer
    bookmarksContainer.innerHTML = '';
    categoryBookmarks.forEach(bookmark => {
        bookmarksContainer.innerHTML += `
            <div class="bookmark" data-url="${bookmark.url}">
                <a href="${bookmark.url}" target="_blank">${bookmark.title}</a>
                <span class="details-button">Details</span>
            </div>`;
    });
}

// display bookmark details
function displayBookmarkDetails(bookmarkUrl) {
    const bookmark = JSON.parse(localStorage.getItem(bookmarkUrl));
    bookmarkDetails.innerHTML = `
        <h3>${bookmark.title}</h3>
        <p>URL: <a href="${bookmark.url}" target="_blank">${bookmark.url}</a></p>
        <p>Description: ${bookmark.description || 'No description available.'}</p>
    `;
}

// category dropdown change
categoryDropdown.addEventListener('change', (e) => {
    const selectedCategory = e.target.value;
    if (selectedCategory !== 'default') {
        displayBookmarks(selectedCategory);
    }
});

// new category input display
addCategoryButton.addEventListener('click', () => {
    newCategoryInput.style.display = 'inline-block';
    categoryDropdown.disabled = true;
});

//  adding a new category
newCategoryName.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addCategory(newCategoryName.value);
        newCategoryName.value = '';
        newCategoryInput.style.display = 'none';
        categoryDropdown.disabled = false;
    }
});

//  add bookmark button
addBookmarkButton.addEventListener('click', () => { 
    addBookmarkModal.style.display = 'block';
});

//  closing the add bookmark modal
addBookmarkModal.addEventListener('click', (e) => {
    if (e.target === addBookmarkModal) {
        addBookmarkModal.style.display = 'none';
    }
});

// Add a bookmark to the selected category
function addBookmarkToCategory(categoryName, bookmark) {
    const categoryBookmarks = JSON.parse(localStorage.getItem(categoryName)) || [];
    categoryBookmarks.push(bookmark);
    localStorage.setItem(categoryName, JSON.stringify(categoryBookmarks));
}

// submitting the bookmark form
document.getElementById('bookmark-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('bookmark-title').value;
    const url = document.getElementById('bookmark-url').value;
    const description = document.getElementById('bookmark-description').value;
    const selectedCategory = categoryDropdown.value;

    if (title && url && selectedCategory !== 'default') {
        const bookmark = { title, url, description };
        addBookmarkToCategory(selectedCategory, bookmark);
        addBookmarkModal.style.display = 'none';


    
        document.getElementById('bookmark-form').reset();
        displayBookmarks(selectedCategory);
    }
});


document.querySelector('.close').addEventListener('click', () => {
    addBookmarkModal.style.display = 'none';
});

// displaying bookmark details
bookmarksContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('details-button')) {
        const bookmark = e.target.parentElement;
        const bookmarkUrl = bookmark.getAttribute('data-url');
        displayBookmarkDetails(bookmarkUrl);
    }
});

// Initial render of categories
renderCategories();
