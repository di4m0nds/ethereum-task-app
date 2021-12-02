const TasksContract = artifacts.require("TasksContract")

contract("TasksContract", () => {
  
  before(async () => {
    this.tasksContract = await TasksContract.deployed();
  });

  it('Migrate deployed successfully!', async () => {
    const address = this.tasksContract.address;

    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
  });

  it('Get tasks list', async () => {
    const counter = await this.tasksContract.taskCounter();
    const task = await this.tasksContract.tasks(counter)

    assert.equal(counter, 1)
    assert.equal(task.id.toNumber(), counter)
    assert.equal(task.title, "mi primer tarea")
    assert.equal(task.description, "I need to do something")
    assert.equal(task.done , false)
  });

  it('Task created successfully', async () => {
    const res = await this.tasksContract.createTask("some task", "description two")
    const taskEvent = res.logs[0].args;
    const counter = await this.tasksContract.taskCounter();

    assert.equal(counter, 2);
    assert.equal(taskEvent.id.toNumber(), 2);
    assert.equal(taskEvent.title, "some task")
    assert.equal(taskEvent.description, "description two")
    assert.equal(taskEvent.done, false)
  });

  it('Task toggle done successfully!', async () => {
    const taskBeforeChange = await this.tasksContract.tasks(1);
    const res = await this.tasksContract.toggleDone(1);
    const taskEvent = res.logs[0].args;

    assert.equal(taskEvent.id, taskBeforeChange.id)
    assert.equal(taskEvent.done, !taskBeforeChange.done);
  });
  
});