"use strict";

let students;
let student;
let families;
let arrayOfStudents = [];
let expelledStudents = [];
let inquisitorialSquad = [];
let filteredArray;
let houseFilter = "All";
let sortBy;
let modal = document.querySelector("#modal");
let modalBg = document.querySelector("#modal_bg");
let myPersonalObject = {
  fullname: "Frídbjartur Midberg",
  house: "Gryffindor"
};

window.addEventListener("DOMContentLoaded", init);

function init() {
  console.log("Loaded");

  document.querySelector("#filter_all").addEventListener("click", filterAll);
  document
    .querySelector("#filter_hufflepuff")
    .addEventListener("click", filterHufflepuff);
  document
    .querySelector("#filter_gryffindor")
    .addEventListener("click", filterGryffindor);
  document
    .querySelector("#filter_ravenclaw")
    .addEventListener("click", filterRavenclaw);
  document
    .querySelector("#filter_slytherin")
    .addEventListener("click", filterSlytherin);

  document
    .querySelector("#sort_firstname")
    .addEventListener("click", sortFirstName);
  document
    .querySelector("#sort_lastname")
    .addEventListener("click", sortLastName);
  document.querySelector("#sort_house").addEventListener("click", sortHouse);

  loadJson();
}

async function loadJson() {
  let Json = await fetch("http://petlatkea.dk/2019/hogwarts/students.json");
  students = await Json.json();
  let BloodData = await fetch(
    "http://petlatkea.dk/2019/hogwarts/families.json"
  );
  families = await BloodData.json();
  console.log(students);

  students.unshift(myPersonalObject);
  createObjectProto();
}

function createObjectProto() {
  //Object prototype (template)
  const StudentPrototype = {
    fullName: "-student name-",
    firstName: "-student firstname-",
    middleName: "-student middlename-",
    lastName: "-student firstname-",
    house: "-student house-",
    bloodStatus: "-student blood-",
    id: "-student id",

    setJSONdata(studentData) {
      const firstSpace = studentData.fullname.indexOf(" ");
      const lastSpace = studentData.fullname.lastIndexOf(" ");

      this.fullName = studentData.fullname;
      this.firstName = studentData.fullname.substring(0, firstSpace);
      this.middleName = studentData.fullname.substring(
        firstSpace + 1,
        lastSpace
      );
      this.lastName = studentData.fullname.substring(lastSpace + 1);
      this.house = studentData.house;
      this.bloodStatus = showBlood();
      this.id = uuidv4();
    }
  };

  // Add blood type
  function showBlood() {
    if (families.half.includes(student.lastName)) {
      return "Half";
    }

    if (families.pure.includes(student.lastName)) {
      return "Pure";
    } else {
      return "Muggle-born";
    }
  }
  // From stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
  function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  students.forEach(studentData => {
    student = Object.create(StudentPrototype);
    student.setJSONdata(studentData);
    arrayOfStudents.push(student);
  });
  console.log(arrayOfStudents);
  filterStudents(houseFilter);
}

// Add filter list
function filterAll() {
  houseFilter = "All";
  filterStudents(houseFilter);
}

// Hufflepuff
function filterHufflepuff() {
  houseFilter = "Hufflepuff";
  filterStudents(houseFilter);
}

// Gryffindor
function filterGryffindor() {
  houseFilter = "Gryffindor";
  filterStudents(houseFilter);
}

// Ravenclaw
function filterRavenclaw() {
  houseFilter = "Ravenclaw";
  filterStudents(houseFilter);
}

// Slytherin
function filterSlytherin() {
  houseFilter = "Slytherin";
  filterStudents(houseFilter);
}

function filterStudents() {
  if (houseFilter === "All") {
    sortStudents(arrayOfStudents);
  } else {
    filteredArray = arrayOfStudents.filter(function(student) {
      return student.house === houseFilter;
    });
    sortStudents(filteredArray);
  }
}

// Add sort list
function sortFirstName() {
  sortBy = "firstName";
  filterStudents(houseFilter);
}

function sortByFirstName(a, z) {
  if (a.firstName < z.firstName) {
    return -1;
  } else {
    return 1;
  }
}

function sortLastName() {
  sortBy = "lastName";
  filterStudents(houseFilter);
}

function sortByLastName(a, z) {
  if (a.lastName < z.lastName) {
    return -1;
  } else {
    return 1;
  }
}

function sortHouse() {
  sortBy = "house";
  filterStudents(houseFilter);
}

function sortByHouse(a, z) {
  if (a.house < z.house) {
    return -1;
  } else {
    return 1;
  }
}

function sortStudents(filteredArray) {
  if (sortBy === "firstName") {
    filteredArray.sort(sortByFirstName);
  }
  if (sortBy === "lastName") {
    filteredArray.sort(sortByLastName);
  }
  if (sortBy === "house") {
    filteredArray.sort(sortByHouse);
  }
  displayStudents(filteredArray);
}

function removeById(id) {
  //Add to expelled array
  let objIndex = arrayOfStudents.findIndex(obj => obj.id === id);
  let expelledStudent = arrayOfStudents[objIndex];
  expelledStudents.unshift(expelledStudent);

  //Expel students
  let remove = indexById(id);
  arrayOfStudents.splice(remove, 1);
  filteredArray = arrayOfStudents;
  filterStudents();
}

function addByIdSquad(id) {
  let objIndex = arrayOfStudents.findIndex(obj => obj.id === id);
  let addToSquad = arrayOfStudents[objIndex];
  inquisitorialSquad.unshift(addToSquad);

  filterStudents();
}

function indexById(id) {
  return arrayOfStudents.findIndex(obj => obj.id === id);
}

function addByIdSquad(id) {
  let objIndex = arrayOfStudents.findIndex(obj => obj.id === id);
  let addToSquad = arrayOfStudents[objIndex];
  inquisitorialSquad.unshift(addToSquad);

  filterStudents();
}

// Display
function displayStudents(filteredArray) {
  let modtager = document.querySelector(".data-container");
  let temp = document.querySelector(".data-template");

  // Clear content
  modtager.innerHTML = "";

  filteredArray.forEach(student => {
    let klon = temp.cloneNode(true).content;

    // Display data in html
    klon.querySelector("[data-field=firstname]").textContent =
      student.firstName;
    klon.querySelector("[data-field=lastname]").textContent = student.lastName;
    klon.querySelector("[data-field=house]").textContent = student.house;
    klon.querySelector("img").src =
      "images/" +
      student.lastName.toLowerCase() +
      "_" +
      student.firstName.toLowerCase().charAt(0) +
      ".png";

    if (student.house == "Gryffindor") {
      klon.querySelector("p").style.color = "var(--gryffindor-bg-color)";
    }
    if (student.house == "Hufflepuff") {
      klon.querySelector("p").style.color = "var(--hufflepuff-bg-color)";
    }
    if (student.house == "Ravenclaw") {
      klon.querySelector("p").style.color = "var(--ravenclaw-bg-color)";
    }
    if (student.house == "Slytherin") {
      klon.querySelector("p").style.color = "var(--slytherin-bg-color)";
    }

    if (student.lastName == "Midberg") {
      klon.querySelector("img").classList.add("midberg");
    }

    klon.querySelector(".students").addEventListener("click", () => {
      showModal(student);
    });

    klon.querySelector("#expel").addEventListener("click", () => {
      if (student.firstName === "Frídbjartur") {
        alert("You can't expel me!!!!!");
      } else {
        removeById(student.id);
      }
      event.stopPropagation();
    });

    // Put clone in html
    modtager.appendChild(klon);
  });

  let studentNumber = document.querySelector("#student_count");
  let hCount = arrayOfStudents.filter(function(element) {
    return element.house === "Hufflepuff";
  });
  let gCount = arrayOfStudents.filter(function(element) {
    return element.house === "Gryffindor";
  });
  let rCount = arrayOfStudents.filter(function(element) {
    return element.house === "Ravenclaw";
  });
  let sCount = arrayOfStudents.filter(function(element) {
    return element.house === "Slytherin";
  });

  studentNumber.querySelector("#count_all").textContent =
    arrayOfStudents.length;
  studentNumber.querySelector("#count_expelled").textContent =
    expelledStudents.length;
  studentNumber.querySelector("#count_hufflepuff").textContent = hCount.length;
  studentNumber.querySelector("#count_gryffindor").textContent = gCount.length;
  studentNumber.querySelector("#count_ravenclaw").textContent = rCount.length;
  studentNumber.querySelector("#count_slytherin").textContent = sCount.length;
}

function showModal(student) {
  modal.classList.add("open");
  modalBg.classList.add("modal_bg");
  modal.classList.add(student.house.toLowerCase());
  modal.querySelector("p").classList.add(student.house.toLowerCase());

  modal.querySelector("[data-modal=firstname]").textContent = student.firstName;
  modal.querySelector("[data-modal=lastname]").textContent = student.lastName;
  modal.querySelector("[data-modal=house]").textContent = student.house;
  modal.querySelector("[data-modal=profile]").src =
    "images/" +
    student.lastName.toLowerCase() +
    "_" +
    student.firstName.toLowerCase().charAt(0) +
    ".png";
  modal.querySelector("[data-modal=blood]").textContent =
    "Blood status: " + student.bloodStatus;

  modal.querySelector("#join_squad").addEventListener("click", () => {
    addByIdSquad(student.id);
  });

  document.querySelector("#close").addEventListener("click", closeModal);
}

function closeModal() {
  modal.classList.remove("open");
  modalBg.classList.remove("modal_bg");
  modal.classList.remove("hufflepuff", "gryffindor", "ravenclaw", "slytherin");
  modal
    .querySelector("p")
    .classList.remove("hufflepuff", "gryffindor", "ravenclaw", "slytherin");
}
