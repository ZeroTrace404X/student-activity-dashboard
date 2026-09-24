let students = [];
let currentFilter = "all";
const form = document.getElementById("studentForm");
const nameInput = document.getElementById("studentName");
const idInput = document.getElementById("studentId");
const departmentInput = document.getElementById("department");
const statusInput = document.getElementById("studentStatus");
const studentList = document.getElementById("studentList");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");
const totalStudents = document.getElementById("totalStudents");
const activeStudents = document.getElementById("activeStudents");
const inactiveStudents = document.getElementById("inactiveStudents");
const themeBtn = document.getElementById("themeBtn");
const studentsPanel = document.querySelector(".students-panel");
const filterButtons = document.querySelectorAll(".filter-btn");
function renderStudents() {
  studentList.innerHTML = "";
  const searchText = searchInput.value.toLowerCase().trim();
  let visibleCount = 0;
  students.forEach(function (student, index) {
    const card = document.createElement("div");
    card.classList.add("student-card");
    if (student.status === "inactive") card.classList.add("inactive");
    card.setAttribute("data-student-index", index);
    card.setAttribute("data-student-id", student.id);
    card.setAttribute("data-status", student.status);
    const storedId = card.getAttribute("data-student-id");
    const matchesSearch =
      student.name.toLowerCase().includes(searchText) ||
      storedId.toLowerCase().includes(searchText);
    const matchesFilter =
      currentFilter === "all" || student.status === currentFilter;
    if (!matchesSearch || !matchesFilter) card.classList.add("hidden");
    else visibleCount++;
    const top = document.createElement("div");
    top.classList.add("student-card-top");
    const info = document.createElement("div");
    const studentName = document.createElement("div");
    studentName.classList.add("student-name");
    studentName.textContent = student.name;
    const studentInfo = document.createElement("div");
    studentInfo.classList.add("student-info");
    studentInfo.textContent =
      "ID: " + student.id + "  •  Department: " + student.department;
    info.appendChild(studentName);
    info.appendChild(studentInfo);
    const badge = document.createElement("span");
    badge.classList.add("status-badge");
    badge.textContent = student.status === "active" ? "Active" : "Inactive";
    if (student.status === "inactive") badge.classList.add("inactive");
    top.appendChild(info);
    top.appendChild(badge);
    const actions = document.createElement("div");
    actions.classList.add("student-actions");
    const toggleBtn = document.createElement("button");
    toggleBtn.classList.add("toggle-btn");
    toggleBtn.type = "button";
    toggleBtn.textContent = "Change Status";
    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-btn");
    removeBtn.type = "button";
    removeBtn.textContent = "Remove";
    toggleBtn.addEventListener("click", function () {
      student.status = student.status === "active" ? "inactive" : "active";
      renderStudents();
      updateStatistics();
    });
    removeBtn.addEventListener("click", function () {
      card.remove();
      students.splice(index, 1);
      renderStudents();
      updateStatistics();
    });
    actions.appendChild(toggleBtn);
    actions.appendChild(removeBtn);
    card.appendChild(top);
    card.appendChild(actions);
    studentList.appendChild(card);
  });
  if (students.length === 0) {
    emptyState.classList.remove("hidden");
    emptyState.querySelector(".empty-title").textContent =
      "No students added yet.";
  } else if (visibleCount === 0) {
    emptyState.classList.remove("hidden");
    emptyState.querySelector(".empty-title").textContent =
      "No matching students.";
  } else {
    emptyState.classList.add("hidden");
  }
}
function updateStatistics() {
  let active = 0;
  let inactive = 0;
  students.forEach(function (student) {
    if (student.status === "active") active++;
    else inactive++;
  });
  totalStudents.textContent = students.length;
  activeStudents.textContent = active;
  inactiveStudents.textContent = inactive;
}
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = nameInput.value.trim();
  const id = idInput.value.trim();
  const department = departmentInput.value.trim();
  const status = statusInput.value;
  if (name === "" || id === "" || department === "") return;
  students.push({ name: name, id: id, department: department, status: status });
  renderStudents();
  updateStatistics();
  form.reset();
});
searchInput.addEventListener("input", function () {
  renderStudents();
});
filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentFilter = button.getAttribute("data-filter");
    filterButtons.forEach(function (btn) {
      btn.classList.remove("selected");
    });
    button.classList.add("selected");
    renderStudents();
  });
});
themeBtn.addEventListener("click", function () {
  const darkModeOn = document.body.classList.contains("dark");
  document.body.classList.toggle("dark");
  themeBtn.textContent = darkModeOn ? "🌙 Dark Mode" : "☀️ Light Mode";
});
renderStudents();
updateStatistics();
