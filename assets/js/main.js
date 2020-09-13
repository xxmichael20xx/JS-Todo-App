$(document).ready(function() {
    fetch("https://type.fit/api/quotes")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let randomIndex = Math.floor(Math.random() * 1000)
            let quote = `“${data[randomIndex]['text']}”`
            let author = `-${data[randomIndex]['author'] == null ? "Anonymous" : data[randomIndex]['author']}`

            $('#quote').text(quote)
            $('#author').text(author)

            $('#quote-container').show()
        })

    $('#addModal').on('shown.bs.modal', function() {
        $('#add_title').focus()
    })

    todoHtml()
    setTimeout(function() {
        let loading = document.getElementsByClassName('loading')
        let loading_done = document.getElementsByClassName('loading-done')

        for (let index = 0; index < loading.length; index++) {
            const element = loading[index];
            
            element.style.display = "none"
            loading_done[index].style.display = "block"
        }
    }, 3000)

    $('#addModalForm').submit(function(e) {
        e.preventDefault()
        
        let title = $('#add_title').val()
        let todos = getTodos()
        
        addTodo(title)
    })

    // Stike / Mark as done todo
    $(document).on('click', '.strike', function () {
        let id = $(this).attr('data-id')
        let is_done = $(this).attr('data-is-done')

        let todos = getTodos()
        let temp_todos = todos[id]
        let new_todo = todos.filter(function(value, index, arr) {
            if (index != id) {
                return arr;
            } else {
                if (is_done == "true") {
                    temp_todos['is_done'] = false
                    temp_todos['date_done'] = null
                } else {
                    temp_todos['is_done'] = true
                    temp_todos['date_done'] = getDateTime()
                }
            }
        })

        new_todo.push(temp_todos)
        localStorage.setItem("todos", JSON.stringify(new_todo))
        todoHtml()
    })

    // Get current date time with moment.js
    function getDateTime() {
        return moment().format("Y-MM-D H:mm:ss")
    }

    // Get all todos
    function getTodos() {
        let todos = JSON.parse(localStorage.getItem("todos")) || []

        return todos
    }

    // Add Todo
    function addTodo(title) {
        let todos = getTodos()
        let data = {
            title: title,
            is_done: false,
            date_added: getDateTime(),
            date_done: null
        }
        localStorage.setItem("todos", JSON.stringify(data))
        todos.push(data)
        localStorage.setItem("todos", JSON.stringify(todos))

        todoHtml()
        closeAddModal()
    }

    // Close Add Modal
    function closeAddModal() {
        $('#addFormReset').click()
        $('#addModal').modal('hide')
    }

    // Generate and Append HTML table row to table body
    function todoHtml() {
        let todos = getTodos()
        let pendingHtml = ``;
        let doneHtml = ``;
        let pendingCount = 0;
        let doneCount = 0;

        if (todos.length > 0) {
            todos.forEach((element, index) => {
                if (element.is_done == false) {
                    pendingCount++
                    pendingHtml += `
                        <tr id="${index}" class="strike" data-id="${index}" data-is-done="${element.is_done}">
                            <td>
                                ${pendingCount}
                            </td>
                            <td>
                                ${element.title}
                            </td>
                            <td>
                                ${element.date_added}
                            </td>
                        </tr>
                    `;
                } else {
                    doneCount++
                    doneHtml += `
                        <tr id="${index}" class="strike" data-id="${index}" data-is-done="${element.is_done}">
                            <td>
                                ${doneCount}
                            </td>
                            <td>
                                ${element.title}
                            </td>
                            <td>
                                ${element.date_added}
                            </td>
                            <td>
                                ${element.date_done == null ? "" : element.date_done}
                            </td>
                        </tr>
                    `;
                }
            })

            if (pendingCount == 0) {
                pendingHtml += `
                    <tr>
                        <td>No result(s)</td>
                        <td>No result(s)</td>
                        <td>No result(s)</td>
                    </tr>
                `;
            }
            
            if (doneCount == 0) {
                doneHtml += `
                    <tr>
                        <td>No result(s)</td>
                        <td>No result(s)</td>
                        <td>No result(s)</td>
                        <td>No result(s)</td>
                    </tr>
                `;
            }

            $('#pending-todo-container').html(pendingHtml)
            $('#done-todo-container').html(doneHtml)
        } else {
            pendingHtml += `
                <tr>
                    <td>No result(s)</td>
                    <td>No result(s)</td>
                    <td>No result(s)</td>
                </tr>
            `;
            doneHtml += `
                <tr>
                    <td>No result(s)</td>
                    <td>No result(s)</td>
                    <td>No result(s)</td>
                    <td>No result(s)</td>
                </tr>
            `;

            $('#pending-todo-container').html(pendingHtml)
            $('#done-todo-container').html(doneHtml)
        }
    }
});