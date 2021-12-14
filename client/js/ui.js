const taskForm = document.querySelector('#task-form')

document.addEventListener("DOMContentLoaded", () => {
  App.init();
})

taskForm.addEventListener("submit", e => {
  e.preventDefault();

  //  const { title, description } = taskForm;
  //  App.createTask(title.value, description.value);

  //console.log('Values : ', taskForm['title'].value, taskForm['description'].value);

  App.createTask(taskForm['title'].value, taskForm['description'].value);

})