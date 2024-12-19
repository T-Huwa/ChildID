const API_BASE_URL = "http://localhost:3000/api";

function openModal() {
  document.getElementById("registerModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("registerModal").classList.add("hidden");
  document.getElementById("registerChildForm").reset();
}

// Template function
function renderChildCard(childData) {
  const template = document.getElementById("childCardTemplate").innerHTML;
  const statusClass = childData.active
    ? "bg-green-100 text-green-600"
    : "bg-red-100 text-red-600";
  const status = childData.active ? "Active" : "Inactive";

  return template
    .replace("{{name}}", childData.name)
    .replace("{{idHash}}", childData.idHash)
    .replace("{{dob}}", new Date(childData.dob).toLocaleDateString())
    .replace(
      "{{registeredDate}}",
      new Date(childData.registeredDate).toLocaleDateString()
    )
    .replace("{{statusClass}}", statusClass)
    .replace("{{status}}", status);
}

// get children data from backend
async function loadChildren() {
  try {
    const response = await fetch(`${API_BASE_URL}/children`);
    const data = await response.json();

    const childrenGrid = document.getElementById("childrenGrid");
    childrenGrid.innerHTML = "";

    data.forEach((child) => {
      const cardHtml = renderChildCard(child);
      childrenGrid.innerHTML += cardHtml;
    });
  } catch (error) {
    console.error("Error loading children:", error);
  }
}

// Register new child
document
  .getElementById("registerChildForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const childData = {
      name: document.getElementById("childName").value,
      dob: document.getElementById("childDOB").value,
      details: document.getElementById("childDetails").value,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/register-child`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(childData),
      });

      const data = await response.json();
      if (data.success) {
        closeModal();
        loadChildren();
        alert("Child registered successfully!");
      } else {
        alert("Failed to register child: " + data.error);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  });

// Verify access
async function verifyAccess(idHash) {
  try {
    const response = await fetch(`${API_BASE_URL}/verify-access/${idHash}`);
    const data = await response.json();

    alert(`Access Status: ${data.hasAccess ? "Verified" : "Not Verified"}`);
  } catch (error) {
    alert("Error verifying access: " + error.message);
  }
}

// Revoke access for a particular child
async function revokeAccess(idHash) {
  if (!confirm("Are you sure you want to revoke access for this child?")) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/revoke-access/${idHash}`, {
      method: "POST",
    });

    const data = await response.json();
    if (data.success) {
      loadChildren();
      alert("Access revoked successfully");
    } else {
      alert("Failed to revoke access: " + data.error);
    }
  } catch (error) {
    alert("Error: " + error.message);
  }
}

document.addEventListener("DOMContentLoaded", loadChildren);
