(function(){

    $(document).ready(function() {
        $( function() {
            $( "#datepicker" ).datepicker();
        } );

        var todos = getLocalStoredTodoList();
        loadTodoList(todos);
    });

    $("table").on("click",".done", function() {
        var clickedButtonRow = $($(this).parent()).parent();
        var clickedElementId = $(clickedButtonRow).attr('id');
        toggleDone(clickedElementId.substr(4));//row_xxx => xxx
    });

    $("table").on("click", ".fa-trash-alt", function() {
        var clickedButtonRow = $($(this).parent()).parent();
        var clickedElementId = $(clickedButtonRow).attr('id');
        removeTodoById(clickedElementId);
    });

    $("#taskContent").keydown(function(key) {
        if(key.which == 13) {
            $("#btnAddTask").click();
        }
    });
    
    $("#btnAddTask").click(function() {
        var aufgabeTitel = $("input[name=task]").val();
        if (aufgabeTitel == "") {
            $(".alert").css("display", "block"); 
        } else {
            $(".alert").css("display", "none");          
            var category = $("#category").val();
            var requiredBy = $("input[name=requiredBy]").val();
            if (requiredBy == "") {
                var today = getTodayDate();
                requiredBy = today;
            } else {
                var date = requiredBy.split("/");
                requiredBy = date[0] + "-" + date[1] + "-" + date[2];
            }

            clearInput();
            addTodo(aufgabeTitel, category, requiredBy);
        }
    });


    
    function addTodo(todo, category, requiredBy) {

        var todos = getLocalStoredTodoList();
        var newTodo = {
            "content": todo,
            "category" : category,
            "requiredBy": requiredBy,
            "done": false,
        };
        todos.push(newTodo);
        var newTodoIndex = todos.indexOf(newTodo);
        saveLocalStoredTodoList(todos);
        prependToTable(newTodo, newTodoIndex);
    }

    function loadTodoList(todos) {
        for (todo in todos) {
            prependToTable(todos[todo], todo);
        }
    }

    function prependToTable(todo, index = null) {
       var doneButton_td;
        if (todo.done === true) {
            doneButton_td = '<td><i class="done far fa-check-circle"></i></td>';
        } else {
            doneButton_td = '<td><i class="done far fa-circle"></i></td>';
        }
        
        var removeButton_td = "<td ><i class='far fa-trash-alt'></i></td>";
        var contetClass = "content ";
        if (todo.done === true) {
            contetClass += "doneTodo";
        }
        var aufgabe_td = "<td ><label class='"+contetClass+"'>" + todo.content  +"</label></td>" ;
        var datum_td = "<td>" + todo.requiredBy  +"</td>" ;
        var kategorie_td = "<td>" + todo.category + "</td>";
        var row = "<tr id='row_" + index + "'>" + doneButton_td + aufgabe_td  + datum_td + kategorie_td + removeButton_td + "</tr>";

        //to add new todos at the bottom of the list, use $("tbody").append(row) instead
        $("tbody").prepend(row);    
    }

    function clearInput() {
        $("input[name=task]").val(null);
    }

    function getTodayDate() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1;
        var yyyy = today.getFullYear();
        
        if(dd<10) {
            dd = '0'+dd
        } 
        
        if(mm<10) {
            mm = '0'+mm
        } 
        
        today = dd + "-" + mm + "-" + yyyy;
        
        return today;
    }

    function removeTodoById(id) {
        $("#" + id).remove();
        var elementIndex = id.substr(4); //row_xx
        removeTodoFromLocalStoredByIndex(elementIndex);
    }

    function getLocalStoredTodoList() {
        var todoList = localStorage.todoList;
        if (todoList == "" || typeof todoList == "undefined" || todoList == "undefined") {
            //just for demo! Can be replaced with empty array []
            var initialList = JSON.parse("[{\"content\":\"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet\",\"category\":\"private\",\"requiredBy\":\"03-01-2018\",\"done\":false},{\"content\":\"consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\",\"category\":\"private\",\"requiredBy\":\"03-12-2018\",\"done\":true},{\"content\":\"\\\"De finibus bonorum et malorum\\\" Cicero\",\"category\":\"private\",\"requiredBy\":\"22-05-2018\",\"done\":false},{\"content\":\"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam\",\"category\":\"private\",\"requiredBy\":\"10-11-2018\",\"done\":false},{\"content\":\"Li Europan lingues es membres del sam familie. Lor separat existentie es un myth. Por scientie, musica, sport etc, litot \",\"category\":\"private\",\"requiredBy\":\"15-02-2018\",\"done\":false},{\"content\":\"Jemand musste Josef K. verleumdet haben, denn ohne dass er etwas Böses getan hätte, wurde er eines Morgens verhaftet. »Wie \",\"category\":\"private\",\"requiredBy\":\"22-01-2018\",\"done\":true},{\"content\":\"Herkunft und Bedeutung des Lorem ipsum-Textes\",\"category\":\"arbeit\",\"requiredBy\":\"15-01-2018\",\"done\":false},{\"content\":\"Automatische Erkennung von Lorem ipsum bei der Druckaufbereitung\",\"category\":\"arbeit\",\"requiredBy\":\"10-10-2018\",\"done\":false},{\"content\":\"Die Begriffsfolge des Lorem ipsum-Textes ist heutzutage so verbreitet und üblich, dass viele DTP-Programme Blindtexte mit der Anfangssequenz \\\"Lorem ipsum\\\" erzeugen können. Von großem Vorteil ist, dass die Begriffsfolge \\\"Lorem ipsum\\\" heute in der elektronischen Druckaufbereitung erkannt und eine Warnmeldung ausgelöst werden kann. Damit wird vermieden, dass eine Publikation mit einem verbliebenem Fülltext irrtümlich in den Druck geht.\",\"category\":\"arbeit\",\"requiredBy\":\"01-11-2018\",\"done\":true}]");
            saveLocalStoredTodoList(initialList);
        }

        return JSON.parse(localStorage.todoList);
    }

    function saveLocalStoredTodoList(todoList) {
        localStorage.todoList =  JSON.stringify(todoList);
    }

    function removeTodoFromLocalStoredByIndex(todoIndex) {
        var localToDoList = getLocalStoredTodoList();
        localToDoList.splice(todoIndex, 1);
        saveLocalStoredTodoList(localToDoList);
    }

    function toggleDone(todoIndex) {
        var localToDoList = getLocalStoredTodoList();
        localToDoList[todoIndex].done = !localToDoList[todoIndex].done;
        saveLocalStoredTodoList(localToDoList);
        $("#row_" + todoIndex + " .content ").toggleClass("doneTodo");

        if (localToDoList[todoIndex].done === true) {
            $("#row_" + todoIndex + " .far.fa-circle")
                .removeClass("fa-circle")
                .addClass("fa-check-circle");
        } else {
            $("#row_" + todoIndex + " .far.fa-check-circle")
                .removeClass("fa-check-circle")
                .addClass("fa-circle");
        }
    }

})();