// your code goes here
const inventory = {
  screwdriver: { make: "BrandA", model: "ModelX", specification: "Steel", rack: "A1", bin: "B3", available: 25, quantityTaken: 0, updated: new Date().toLocaleString(), updatedBy: "" },
  hammer: { make: "BrandB", model: "ModelY", specification: "Aluminum", rack: "A2", bin: "B1", available: 10, quantityTaken: 0, updated: new Date().toLocaleString(), updatedBy: "" },
  wrench: { make: "BrandC", model: "ModelZ", specification: "Iron", rack: "A3", bin: "B4", available: 15, quantityTaken: 0, updated: new Date().toLocaleString(), updatedBy: "" },
  pliers: { make: "BrandD", model: "ModelW", specification: "Plastic", rack: "A4", bin: "B2", available: 8, quantityTaken: 0, updated: new Date().toLocaleString(), updatedBy: "" }
};

const validUsers = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "user", password: "user123", role: "user" }
];

let currentUser = null;

function showAdminLogin() {
  document.getElementById("adminLoginForm").classList.remove("hidden");
  document.getElementById("loginMessage").textContent = "";
}

function hideAdminLogin() {
  document.getElementById("adminLoginForm").classList.add("hidden");
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  document.getElementById("loginMessage").textContent = "";
}

function adminLogin() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const loginMessage = document.getElementById("loginMessage");
  const user = validUsers.find(u => u.username === username && u.password === password && u.role === "admin");
  if (user) {
    currentUser = user;
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("appPage").classList.remove("hidden");
    updateUIForRole();
    document.getElementById("userInfo").textContent = `Logged in as: ${user.username} (${user.role})`;
  } else {
    loginMessage.textContent = "❌ Invalid admin credentials!";
  }
}

function userLogin() {
  const user = validUsers.find(u => u.role === "user");
  currentUser = user;
  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("appPage").classList.remove("hidden");
  updateUIForRole();
  document.getElementById("userInfo").textContent = `Logged in as: ${user.username} (${user.role})`;
}

function updateUIForRole() {
  const addButton = document.querySelector('button[onclick="openAdd()"]');
  const updateButton = document.querySelector('button[onclick="openUpdate()"]');
  const deleteButton = document.querySelector('button[onclick="openDelete()"]');

  if (currentUser.role === "user") {
    // Hide admin-only functions for regular users
    addButton.style.display = "none";
    deleteButton.style.display = "none";
    updateButton.textContent = "📝 View/Update Item";
  } else {
    // Show all functions for admin
    addButton.style.display = "block";
    deleteButton.style.display = "block";
    updateButton.textContent = "✏️ Update Item";
  }
}

function logout() {
  currentUser = null;
  
  // Hide the app page and show login page
  document.getElementById("appPage").classList.add("hidden");
  document.getElementById("loginPage").classList.remove("hidden");
  
  // Clear all inputs and reset forms
  clearInputs();
  hideAdminLogin();
  
  // Clear any search results or messages
  document.getElementById("searchResult").innerHTML = "";
  document.getElementById("loginMessage").textContent = "";
  
  // Hide side menu if it's open
  const menu = document.getElementById("sideMenu");
  if (menu.classList.contains("active")) {
    menu.classList.remove("active");
    document.getElementById("overlay").style.display = "none";
  }
  
  // Reset to main section
  document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
  document.getElementById("main").classList.remove("hidden");
}

function toggleMenu() {
  const menu = document.getElementById("sideMenu");
  menu.classList.toggle("active");
  document.getElementById("overlay").style.display = menu.classList.contains("active") ? "block" : "none";
}

function goBack() {
  document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
  document.getElementById("main").classList.remove("hidden");
  clearInputs();
}

function clearInputs() {
  document.querySelectorAll("input").forEach(i => (i.value = ""));
  document.getElementById("updatedBy").selectedIndex = 0; // Reset the dropdown
  document.getElementById("searchResult").innerHTML = "";
}

function showSuggestions() {
  showGenericSuggestions("searchInput", "suggestBox", searchItem);
}
function showAddSuggestions() {
  showGenericSuggestions("newItem", "suggestAdd");
}
function showUpdateSuggestions() {
  showGenericSuggestions("updateItem", "suggestUpdate");
}
function showDeleteSuggestions() {
  showGenericSuggestions("deleteItem", "suggestDelete");
}

function showGenericSuggestions(inputId, boxId, onSelect) {
  const input = document.getElementById(inputId).value.toLowerCase();
  const box = document.getElementById(boxId);
  box.innerHTML = "";
  if (!input) return;
  Object.keys(inventory).forEach(item => {
    if (item.includes(input)) {
      const div = document.createElement("div");
      div.textContent = item;
      div.onclick = () => {
        document.getElementById(inputId).value = item;
        box.innerHTML = "";
        if (onSelect) onSelect();
      };
      box.appendChild(div);
    }
  });
}

function searchItem() {
  const name = document.getElementById("searchInput").value.toLowerCase();
  const item = inventory[name];
  const result = document.getElementById("searchResult");
  result.innerHTML = item
    ? `<p><strong>Item:</strong> ${name}</p>
       <p><strong>Make:</strong> ${item.make}</p>
       <p><strong>Model:</strong> ${item.model}</p>
       <p><strong>Specification:</strong> ${item.specification}</p>
       <p><strong>Rack:</strong> ${item.rack}</p>
       <p><strong>Bin:</strong> ${item.bin}</p>
       <p><strong>Available Quantity:</strong> ${item.available} ${item.available < 5 ? '(Low Quantity)' : ''}</p>
       <p><strong>Quantity Taken:</strong> ${item.quantityTaken}</p>
       <p><strong>Last Updated:</strong> ${item.updated}</p>
       <p><strong>Updated By:</strong> ${item.updatedBy}</p>`
    : `<p style="color:red;">❌ Item not found!</p>`;
}

function addItem() {
  if (currentUser.role !== "admin") {
    alert("❌ Access denied! Only admins can add items.");
    return;
  }

  const name = document.getElementById("newItem").value.toLowerCase();
  const make = document.getElementById("newMake").value;
  const model = document.getElementById("newModel").value;
  const specification = document.getElementById("newSpecification").value;
  const rack = document.getElementById("newRack").value;
  const bin = document.getElementById("newBin").value;
  const qty = parseInt(document.getElementById("newQty").value);

  if (name && make && model && specification && rack && bin && qty) {
    inventory[name] = { make, model, specification, rack, bin, available: qty, quantityTaken: 0, updated: new Date().toLocaleString(), updatedBy: currentUser.username };
    alert("✅ Item added!");
    goBack();
  } else {
    alert("❌ Fill all fields!");
  }
}

function updateItem() {
  const name = document.getElementById("updateItem").value.toLowerCase();
  const quantityTaken = parseInt(document.getElementById("quantityTaken").value);
  const updatedBy = currentUser.role === "admin" ? document.getElementById("updatedBy").value : currentUser.username;

  if (inventory[name]) {
    if (quantityTaken !== undefined && !isNaN(quantityTaken)) {
      inventory[name].quantityTaken = quantityTaken;
      inventory[name].updated = new Date().toLocaleString();
      inventory[name].updatedBy = updatedBy;
      alert("✅ Quantity updated!");
      goBack();
    } else {
      alert("❌ Please enter a valid quantity!");
    }
  } else {
    alert("❌ Item not found!");
  }
}

function deleteItem() {
  if (currentUser.role !== "admin") {
    alert("❌ Access denied! Only admins can delete items.");
    return;
  }

  const name = document.getElementById("deleteItem").value.toLowerCase();
  if (inventory[name]) {
    delete inventory[name];
    alert("✅ Item deleted!");
    goBack();
  } else {
    alert("❌ Item not found!");
  }
}

function downloadCSV() {
  let csv = "Item,Make,Model,Specification,Rack,Bin,Available Quantity,Quantity Taken,Last Updated,Updated By\n";
  Object.entries(inventory).forEach(([item, { make, model, specification, rack, bin, available, quantityTaken, updated, updatedBy }]) => {
    csv += `${item},${make},${model},${specification},${rack},${bin},${available},${quantityTaken},${updated},${updatedBy}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "inventory.csv";
  a.click();
}

function showSpares() {
  toggleMenu(); goBack();
  const table = `
    <table>
      <tr><th>Item</th><th>Make</th><th>Model</th><th>Specification</th><th>Rack</th><th>Bin</th><th>Available Quantity</th><th>Quantity Taken</th><th>Balance Quantity</th><th>Last Updated</th><th>Updated By</th></tr>
      ${Object.entries(inventory)
        .map(([item, { make, model, specification, rack, bin, available, quantityTaken, updated, updatedBy }]) => {
          const balance = available - quantityTaken;
          const rowClass = balance < 5 ? 'low-quantity' : '';
          return `<tr class="${rowClass}"><td>${item}</td><td>${make}</td><td>${model}</td><td>${specification}</td><td>${rack}</td><td>${bin}</td><td>${available}</td><td>${quantityTaken}</td><td>${balance}</td><td>${updated}</td><td>${updatedBy}</td></tr>`;
        })
        .join("")}
    </table>`;
  document.getElementById("sparesList").innerHTML = table;
  document.getElementById("sparesSection").classList.remove("hidden");
}

function startListening() {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Speech Recognition not supported!");
    return;
  }
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.start();
  recognition.onresult = event => {
    document.getElementById("searchInput").value = event.results[0][0].transcript.toLowerCase();
    searchItem();
  };
}

function fillUpdatedBy() {
  const name = document.getElementById("updateItem").value.toLowerCase();
  if (inventory[name]) {
    const availableQty = inventory[name].available;
    const quantityTaken = inventory[name].quantityTaken;
    const balanceQty = availableQty - quantityTaken;
    document.getElementById("availableQty").value = balanceQty;
  } else {
    document.getElementById("availableQty").value = '';
  }
}

function openAdd() {
  if (currentUser.role !== "admin") {
    alert("❌ Access denied! Only admins can add items.");
    return;
  }
  toggleMenu(); goBack();
  document.getElementById("addSection").classList.remove("hidden");
}
function openUpdate() {
  toggleMenu(); goBack();
  document.getElementById("updateSection").classList.remove("hidden");

  // Hide updatedBy dropdown for regular users
  const updatedByContainer = document.getElementById("updatedBy").parentElement;
  if (currentUser.role === "user") {
    document.getElementById("updatedBy").style.display = "none";
  } else {
    document.getElementById("updatedBy").style.display = "block";
  }
}
function openDelete() {
  if (currentUser.role !== "admin") {
    alert("❌ Access denied! Only admins can delete items.");
    return;
  }
  toggleMenu(); goBack();
  document.getElementById("deleteSection").classList.remove("hidden");
}
