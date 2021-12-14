const App = {
  contracts: {},

  init: async () => {
    await App.loadEthereum();
    await App.loadAccount();
    await App.laodContracts();
    App.renderWalletCode();
    await App.renderTask()
  },

  loadEthereum: async () => {
    if (typeof window.ethereum !== 'undefined') {
      App.web3Provider = window.ethereum;
      await window.ethereum.request({ method: 'eth_requestAccounts' })
    } else if(window.web3) {
      web3 = new Web3(window.web3.currentProvider)
    }else console.log('No exists wallet!');
  },

  loadAccount: async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    App.account = accounts[0];
  },

  laodContracts: async () => {
    try {
      const response = await fetch('TasksContract.json');
      const jsonResponse = await response.json();

      App.contracts.tasksContract = TruffleContract(jsonResponse);
      App.contracts.tasksContract.setProvider(App.web3Provider);
      App.tasksContract = await App.contracts.tasksContract.deployed();
    } catch (error) {
      console.error(error);
    }
  },

  renderWalletCode: async () => {
    const walletCode = document.getElementById("wallet-code"); 

    if (App.account === undefined) walletCode.innerText = 'Not found wallet code. Please try again!';
    else walletCode.innerText = App.account;
  },

  createTask: async (title, description) => {
    try {
      const res = await App.tasksContract.createTask(title, description, {
        from: App.account
      });
      console.log('result request :', res.logs[0].args);
    } catch (error) {
      console.error('bad request :', error);
    }
  },

  renderTask: async () => {
    const taskCounter = await App.tasksContract.taskCounter()
    console.log(taskCounter)

    let html = '';

    for (let i = 1; i <= taskCounter.toNumber(); i++) {
      const task = await App.tasksContract.tasks(i)

      const task_id = task[0];
      const task_title = task[1];
      const task_description = task[2];
      const task_done = task[3];
      const task_date = new Date(task[4] * 1000).toLocaleString();

      let task_card = `
        <div class="eth__tasks-task scale-up-tl">
          <div class="eth__tasks-task_title">
            <span>${task_title.toUpperCase()}</span>
          </div>

          <div class="eth__tasks-task_content">
            <div class="eth__tasks-task_content-description">
              <span>${task_description}</span>
            </div>

            <div class="eth__tasks-task_content-done">
              <label>
                <input type="checkbox" data-id="${task_id}" ${task_done && "checked"} onchange="App.toggleDone(this)"><span>Done</span>
              </label>
            </div>
          </div>

          <div class="eth__tasks-task_date">
            <span>${task_date}</span>
          </div>
        </div>
      `;

      html += task_card;
    }

    document.querySelector('#task-list').innerHTML = html;
  },

  toggleDone: async (element) => {
    const id = element.dataset.id;
    await App.tasksContract.toggleDone(id, {
      from: App.account
    })
    window.location.reload()
  }
}