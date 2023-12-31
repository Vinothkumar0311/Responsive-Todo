// Select form
var form = document.getElementById("form");
// Getting input field
var input = document.getElementById("input");
// Getting elements to display lists in HTML
var forward = document.getElementById("list");
var forward2 = document.getElementById("completedList");

// Getting data from localStorage
let List = JSON.parse(localStorage.getItem("List")) || [];
let listLength = List.length;
let CompletedList = JSON.parse(localStorage.getItem("CompletedList")) || [];
let completedListLength = CompletedList.length;

let changesList = 0;

// Variable to store the index of an item being edited
let EditList = -1;
let msgText;

// Check the width of the window
var windowWidth = window.innerWidth;
//Calling function to getvalue in localstorage
console.log("Calling List to get list form local")
addingTodo();
listCompleted();
form.addEventListener("submit", function (event) {
  event.preventDefault();
  add();
  addingTodo();
  listCompleted();
  localStorage.setItem("List", JSON.stringify(List));
  localStorage.setItem("CompletedList", JSON.stringify(CompletedList));
});
// Function to add a value
function add() {
  let inputValue = input.value.trim();
  // Checking duplicate value
  var isDuplicate = List.some(
    (store) => store.value.toUpperCase() == inputValue.toUpperCase()
  );
  // Checking if the input is empty
  if (inputValue.length == 0) {
    msgText = "You entered an empty text!";
    popupNotification(0, msgText);
  }
  // Checking for duplicate value before storing it in the list
  else if (isDuplicate) {
    if (EditList >= 0) {
      input.value = "";
      document.getElementById("btn").innerHTML = "Add";
      msgText = "There are no changes in your todo";
      popupNotification(1, msgText);
      EditList = -1;
      if (windowWidth > 700) {
        document.getElementById("popup").style.display = "block";
      } else {
        document.getElementById("popup").style.display = "none";
      }
      document.getElementById("formTitle").innerHTML = "Add todo";
    } else {
      msgText = "This value is already entered in the list";
      popupNotification(0, msgText);
    }
  }
  // Adding or editing the value
  else {
    if (EditList >= 0) {
      List = List.map((q, index) => ({
        ...q,
        time: index == EditList ? new Date() : q.time,
        value: index == EditList ? inputValue : q.value,
      }));
      EditList = -1;
      document.getElementById("btn").innerHTML = "Add";
      input.value = "";
      msgText = "Changes have been saved in the list";
      popupNotification(1, msgText);
      if (windowWidth > 700) {
        document.getElementById("popup").style.display = "block";
      } else {
        document.getElementById("popup").style.display = "none";
      }
      document.getElementById("formTitle").innerHTML = "Add todo";
    } else {
      List.push({
        time: new Date(),
        value: inputValue,
        checked: false,
      });
      input.value = "";
      listLength += 1;
      msgText = "Your new todo has been added";
      popupNotification(1, msgText);
      if (windowWidth > 700) {
        document.getElementById("popup").style.display = "block";
      } else {
        document.getElementById("popup").style.display = "none";
      }
    }
  }
}

// Function to display the list of todos
function addingTodo() {
  //debugger;
  console.log("List---------------", List);
  console.log("List.length---------------", List.length);

  if (List.length === 0) {
    forward.innerHTML =
      '<center class="valueMessage" style="margin-top:50px; font-size:20px">Your Todo List is empty</center>';

    return;
  }
  forward.innerHTML = "";
  List.sort((a, b) => new Date(b.time) - new Date(a.time));
  List.forEach((todo, index) => {
    if (todo.checked === true) {
      CompletedList.push(todo);
      List = List.filter((_, idx) => idx !== index);
      localStorage.setItem("List", JSON.stringify(List));
      localStorage.setItem("CompletedList", JSON.stringify(CompletedList));
      listLength -= 1;
      completedListLength += 1;

      if (List.length === 0) {
        forward.innerHTML =
          '<center class="valueMessage">Your Todo List is empty</center>';
        document.getElementById("taskValue").innerHTML =
          "Tasks - " + listLength;
        return;
      }
    }
    // Sort the list based on time
    forward.innerHTML += `
      <div class="listview" id=${index}>
        <i 
          class="bi ${
            todo.checked ? "bi-check-circle-fill" : "bi-circle"
          } check"
          data-action="check"
        ></i> 
        <p class="value">${todo.value}</p>
        <button id="editbutton" class="btnedit bi bi-pencil-square" data-action="edit"></button>
        <button id="deletebutton" class="btndelete bi bi-trash" data-action="delete"></button>   
      </div>`;
  });
  if (listLength > 0) {
    document.getElementById("taskValue").innerHTML = "Tasks - " + listLength;
  }
  document.getElementById("taskValue").innerHTML = "Tasks - " + List.length;
}

// Function to display the completed list
function listCompleted() {
  //debugger;
  CompletedList.sort((a, b) => new Date(b.time) - new Date(a.time));
  if (CompletedList.length === 0) {
    forward2.innerHTML =
      '<center class="valueMessage" style="margin-top:50px; font-size:20px">There are no completed tasks</center>';
    document.getElementById("completedListLength").innerHTML =
      "Completed - " + completedListLength;
    return;
  }
  forward2.innerHTML = "";
  CompletedList.forEach((todo, index) => {
    if (todo.checked === false) {
      List.push(todo);
      CompletedList = CompletedList.filter((_, idx) => idx !== index);
      localStorage.setItem("List", JSON.stringify(List));
      localStorage.setItem("CompletedList", JSON.stringify(CompletedList));
      listLength += 1;
      completedListLength -= 1;
      document.getElementById("taskValue").innerHTML = "Tasks - " + listLength;

      if (CompletedList.length === 0) {
        forward2.innerHTML =
          '<center class="valueMessage">There are no completed tasks</center>';
        document.getElementById("completedListLength").innerHTML =
          "Completed - " + completedListLength;
        return;
      }
    }
    forward2.innerHTML += `
      <div class="listview" id=${index}>
        <i 
          class="bi ${
            todo.checked ? "bi-check-circle-fill" : "bi-circle"
          } check"
          data-action="checkCompleted"
        ></i> 
        <p class="${
          todo.checked ? "checked" : ""
        } compvalue" data-action="check">${todo.value}</p>
      </div>`;
  });
  if (completedListLength > 0) {
    document.getElementById("completedListLength").innerHTML =
      "Completed - " + completedListLength;
  }
  console.log(listLength);
  if(listLength>List.length){
    console.log("there is some changes");
  }
  if(changesList ===1 )
  addingTodo();
}

// Event listener for check, edit, and delete buttons in the list
forward.addEventListener("click", (event) => {
  var target = event.target;
  var click = target.parentNode;
  if (click.className !== "listview") return;
  // Getting id to Edit or Delete the value in list
  var wl = click.id;
  // Getting action form the list button
  var action = target.dataset.action;
  //Calling function to Edit nor delete
  action === "check" && checkList(wl);
  action === "edit" && editList(wl);
  action === "delete" && deleteList(wl);
});

forward2.addEventListener("click", (event) => {
  var target = event.target;
  var click = target.parentNode;
  if (click.className !== "listview") return;
  // Getting id to Edit or Delete the value in list
  var wl = click.id;
  // Getting action form the list button
  var action = target.dataset.action;
  //Calling function to Edit nor delete
  action === "checkCompleted" && completedMove(wl);
});

// Function to mark a todo as completed
function completedMove(wl) {
  CompletedList = CompletedList.map((todo, index) => ({
    ...todo,
    checked: index == wl ? !todo.checked : todo.checked,
  }));
  addingTodo();
  listCompleted(wl);
  listCompleted();
  msgText = "Your todo has been moved to task in process";
  popupNotification(1, msgText);
}

function checkList(wl) {
  List = List.map((todo, index) => ({
    ...todo,
    checked: index == wl ? !todo.checked : todo.checked,
  }));
  changesList = 1;
  addingTodo(wl);
  listCompleted();
  msgText = "Your todo has been marked as completed";
  popupNotification(1, msgText);
}

// Function to edit a todo
function editList(wl) {
  document.getElementById("formTitle").innerHTML = "Edit todo";
  document.getElementById("popup").style.display = "block";
  document.getElementById("btn").innerHTML = "Save";
  input.value = List[wl].value;
  EditList = wl;
}

// Function to delete a todo
function deleteList(wl) {
  document.getElementById("id01").style.display = "block";
  var removeValue = document.getElementById("deleteValue");
  removeValue.addEventListener("click", function (event) {
    event.preventDefault();
    console.log(wl);
    List = List.filter((_, index) => index != wl);
    // listLength -= 1;
    if (listLength === 0) {
      List = [];
      localStorage.setItem("List", JSON.stringify(List));
    } else {
      localStorage.setItem("List", JSON.stringify(List));
    }
    msgText = "Todo has been deleted";
    popupNotification(1, msgText);
    document.getElementById("id01").style.display = "none";
    localStorage.setItem("List", JSON.stringify(List));

    // Remove the event listener after deleting the item
    removeValue.removeEventListener("click", arguments.callee);
    addingTodo();
    return;
  });
  var closeFormPopup = document.getElementById("formClose");
  closeFormPopup.addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("id01").style.display = "none";
    wl = null;
  });
  closeFormPopup.removeEventListener("click", arguments.callee);
  return;
}
// To open the add popup form in mobile view
function openForm() {
  document.getElementById("popup").style.display = "block";
}
// To open the close popup form in mobile view
function closeForm() {
  document.getElementById("popup").style.display = "none";
}

// Popup notification function
function popupNotification(msg, msgText) {
  const toast = document.createElement("div");
  if (msg === 0) {
    document.getElementById("toastmsg").classList.remove("toast");
    document.getElementById("toastmsg").classList.add("toast3");
    toast.textContent = msgText;
    document.body.appendChild(toast);
    document.getElementById("input").classList.add("invalid");
    setTimeout(() => {
      toast.remove();
      document.getElementById("toastmsg").classList.remove("toast");
      document.getElementById("toastmsg").classList.add("toast");
      document.getElementById("input").classList.remove("invalid");
    }, 2300);
  } else {
    let toast2 = document.getElementById("toast2");
    document.getElementById("msgTetxt").innerHTML = msgText;
    toast2.classList.add("toast-active");
    document
      .getElementById("toastCloseBtn")
      .addEventListener("click", function () {
        toast2.classList.remove("toast-active");
      });
  }
}
