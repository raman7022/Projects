
const helpForm = document.getElementById("helpForm");
const helpList = document.getElementById("helpList");
const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");
const emptyMessage = document.getElementById("emptyMessage");

const STORAGE_KEY = "humanityHubPosts";

let posts = [];

try {
    const savedPosts = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
    );

    if (Array.isArray(savedPosts)) {
        posts = savedPosts.filter(post =>
            post &&
            typeof post.id === "string" &&
            typeof post.name === "string" &&
            typeof post.category === "string" &&
            typeof post.type === "string" &&
            typeof post.location === "string" &&
            typeof post.description === "string"
        );
    }
} catch (error) {
    console.error("Unable to load saved posts:", error);
}

function savePosts() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
        return true;
    } catch (error) {
        alert("Unable to save data. Please check browser storage.");
        return false;
    }
}

// Create a new community post
helpForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("personName").value.trim();
    const category = document.getElementById("category").value;
    const type = document.getElementById("postType").value;
    const location = document.getElementById("location").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!name || !category || !type || !location || !description) {
        alert("Please fill in all fields.");
        return;
    }

    if (
        name.length > 50 ||
        location.length > 80 ||
        description.length > 500
    ) {
        alert("Please keep your information within the allowed limits.");
        return;
    }

    const newPost = {
        id: generateId(),
        name: name,
        category: category,
        type: type,
        location: location,
        description: description,
        date: new Date().toLocaleDateString()
    };

    posts.unshift(newPost);

    if (!savePosts()) {
        posts.shift();
        return;
    }

    helpForm.reset();
    displayPosts();

    alert("Your community post has been published!");
});

// Generate unique post ID
function generateId() {
    if (window.crypto && window.crypto.randomUUID) {
        return window.crypto.randomUUID();
    }

    return Date.now().toString() + Math.random().toString(36).slice(2);
}

// Display posts
function displayPosts() {
    helpList.replaceChildren();

    const searchText = searchInput.value.toLowerCase().trim();
    const selectedCategory = filterCategory.value;

    const filteredPosts = posts.filter(post => {
        const matchesSearch =
            post.name.toLowerCase().includes(searchText) ||
            post.category.toLowerCase().includes(searchText) ||
            post.location.toLowerCase().includes(searchText) ||
            post.description.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            post.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    emptyMessage.hidden = filteredPosts.length !== 0;

    filteredPosts.forEach(post => {
        const card = document.createElement("div");
        card.className = "help-card";

        const title = document.createElement("h3");
        title.textContent = post.category + " Support";

        const badge = document.createElement("span");
        badge.className = "post-type";

        if (post.type === "Requesting Help") {
            badge.classList.add("request");
        }

        badge.textContent = post.type;

        const details = [
            ["Name", post.name],
            ["Location", post.location],
            ["Description", post.description],
            ["Date", post.date || "Not available"]
        ];

        card.append(title, badge);

        details.forEach(([label, value]) => {
            const paragraph = document.createElement("p");
            const strong = document.createElement("strong");

            strong.textContent = label + ": ";
            paragraph.append(strong, document.createTextNode(value));

            card.appendChild(paragraph);
        });

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete Post";

        deleteButton.addEventListener("click", function() {
            deletePost(post.id);
        });

        card.appendChild(deleteButton);
        helpList.appendChild(card);
    });
}

// Delete a post
function deletePost(id) {
    const confirmDelete = confirm(
        "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) return;

    const oldPosts = posts;
    posts = posts.filter(post => post.id !== id);

    if (!savePosts()) {
        posts = oldPosts;
        return;
    }

    displayPosts();
}

// Search functionality
searchInput.addEventListener("input", displayPosts);

// Category filter
filterCategory.addEventListener("change", displayPosts);

// Load saved posts when website opens
displayPosts();
