const bal = document.querySelector("#balance");


const inc_amt = document.querySelector("#inc-amt")
const exp_amt = document.querySelector("#exp-amt")
const trans = document.querySelector("#trans")
const form = document.querySelector("#form")
const description = document.querySelector('input[name="description"]');
const amount = document.querySelector("#amount");
const addTransactionButton = document.getElementById("addTransactionButton");


const LocalStorageTrans = JSON.parse(localStorage.getItem("trans"))
let transactions = localStorage.getItem("trans") !== null ? LocalStorageTrans : []
function loadTransactionDetails(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+"
  const item = document.createElement("li")
  item.classList.add(transaction.amount < 0 ? "exp" : "inc")
  item.innerHTML = `${transaction.description}
                    <span>${sign}  ${Math.abs(transaction.amount)}</span>
                     <button class="btn-del" onclick="removeTrans(${transaction.id})">x</button>
                     
                     `
  trans.appendChild(item)

  console.log(transaction)
}
function removeTrans(id) {
  if (confirm("Are you sure want to delete transaction")) {
    transactions = transactions.filter((transaction) => transaction.id != id)

    config()
    updateLocalStorage()
  }
  else {
    return;
  }
}
function updateAmount() {
  const amounts = transactions.map((transaction) => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  balance.innerHTML = `₹ ${total}`;

  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  inc_amt.innerHTML = `₹ ${income}`;

  const expenses = amounts
    .filter((item) => item < 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  exp_amt.innerHTML = `₹ ${Math.abs(expenses)}`;
}
function config() {
  trans.innerHTML = "";
  transactions.forEach(loadTransactionDetails);
  updateAmount();
}



function addTransaction(event) {
  event.preventDefault();

  if (description.value.trim() === "" || amount.value.trim() === "") {
    alert("Please enter a description and amount.");
    return;
  }

  const descriptionValue = description.value;
  const amountValue = +amount.value;


  const existingTransaction = transactions.find(
    (transaction) => transaction.description === descriptionValue
  );

  if (existingTransaction) {

    existingTransaction.amount += amountValue;
  } else {

    const transaction = {
      description: descriptionValue,
      amount: amountValue,
    };


    transactions.push(transaction);
  }


  description.value = "";
  amount.value = "";


  updateTransactionUI();
  updateAmount();
  updateLocalStorage();
}
function deleteTransaction(transaction) {
  const index = transactions.findIndex(item => item === transaction);
  if (index >= 0) {
    transactions.splice(index, 1);
    console.log("Transaction deleted successfully.");


    const table = document.querySelector("table");
    const rows = table.getElementsByTagName("tr");
    const rowToDelete = rows[index + 1];
    if (rowToDelete) {
      table.deleteRow(rowToDelete.rowIndex);
    }
  } else {
    console.log("Transaction not found.");
  }
}




function updateTransactionUI() {
  trans.textContent = "";

  const table = document.createElement("table");

  const headerRow = document.createElement("tr");

  const descriptionHeader = document.createElement("th");
  descriptionHeader.textContent = "Description";
  const amountHeader = document.createElement("th");
  amountHeader.textContent = "Amount";
  const deleteHeader = document.createElement("th");
  deleteHeader.textContent = "Delete";

  headerRow.appendChild(descriptionHeader);
  headerRow.appendChild(amountHeader);
  headerRow.appendChild(deleteHeader);

  table.appendChild(headerRow);


  const uniqueTransactions = new Set();


  transactions.forEach(transaction => {
    const { description, amount } = transaction;


    if (!uniqueTransactions.has(description)) {

      const row = document.createElement("tr");

      const descriptionCell = document.createElement("td");
      descriptionCell.textContent = description;

      const amountCell = document.createElement("td");
      amountCell.textContent = amount;

      const deleteCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.style.backgroundColor = "red";
      deleteButton.style.color = "white";
      deleteButton.style.border = "none";
      deleteButton.style.borderRadius = "5px";
      deleteButton.style.padding = "5px 10px";
      deleteButton.addEventListener("click", () => {
        deleteTransaction(transaction);
        updateTransactionUI();
      });

      deleteCell.appendChild(deleteButton);

      row.appendChild(descriptionCell);
      row.appendChild(amountCell);
      row.appendChild(deleteCell);

      table.appendChild(row);


      uniqueTransactions.add(description);
    }
  });

  trans.appendChild(table);
}


addTransactionButton.addEventListener("click", addTransaction);

function UniqueId() {
  return Math.floor(Math.random() * 1000000)
}
form.addEventListener("submit", addTransaction);

window.addEventListener("load", function() {
  config();
});
window.addEventListener("load", function() {
  const localData = localStorage.getItem("transactions");
  if (localData) {
    transactions = JSON.parse(localData);
    config();
  } else {
    bal.innerHTML = "₹ 0.00";
    inc_amt.innerHTML = "₹ 0.00";
    exp_amt.innerHTML = "₹ 0.00";
  }
});

function updateLocalStorage() {
  localStorage.setItem("trans", JSON.stringify(transactions));
}