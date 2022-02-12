//custom alert
function custom_alert( message, title ) {
    if ( !title )
        title = 'Alert';

    if ( !message )
        message = 'No Message to Display.';

    $('<div id="alert_box"></div>').html( message ).dialog({
        title: title,
        resizable: false,
        modal: true,
        buttons: {
            'U redu': function()  {
                $( this ).dialog( 'close' );
            }
        }
    });
}
//returns empty table
const getTableStart = () =>{
    return `
        <thead>
            <tr>
                <td>Kolegij</td>
                <td>ECTS</td>
                <td>Sati</td>
                <td>P</td>
                <td>V</td>
                <td>Tip</td>
                <td></td>
            </tr>
        </thead>
        <tbody>
            
        </tbody>
        <tfoot>
            <tr>
                <td>Ukupno</td>
                <td><span id="red_text_table" class="ects">0</span></td>
                <td><span id="red_text_table" class="hours">0</span></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </tfoot>
    `
}
//returns row for specific course, takes index for id
const getCourseRow = (course, index) => {
    return `
    <tr id="course_${index}" class="${course.kolegij}">
    <td>${course.kolegij}</td>
    <td class="ects">${course.ects}</td>
    <td class="hours">${course.sati}</td>
    <td>${course.predavanja}</td>
    <td>${course.vjezbe}</td>
    <td>${course.tip}</td>
    <td>
        <button id="btn_delete_curriculum">Obriši</button>
    </td>
    </tr>
    `
}

//Appends course row to table, updates red values
function appendCourseRow(course, index){
    $('tbody').append(getCourseRow(course, index));
    updateAppendedTotalResults(course);
}

//Updates total values when course is added
function updateAppendedTotalResults(newCourse){
    var currentEcts = parseInt($('#red_text_table.ects').text());
    var currentHours = parseInt($('#red_text_table.hours').text());

    var newEcts = parseInt(newCourse.ects);
    var newHours = parseInt(newCourse.sati);

    $('#red_text_table.ects').text(currentEcts + newEcts);
    $('#red_text_table.hours').text(currentHours + newHours);
}

//Updates total values when course is deleted from table
function updateDeletedTotalResults(id){
    var currentEcts = parseInt($('#red_text_table.ects').text());
    var currentHours = parseInt($('#red_text_table.hours').text());
    var deletedEcts = parseInt($(id + ' .ects').text());
    var deletedHours = parseInt($(id + ' .hours').text());

    var updatedEcts = currentEcts - deletedEcts;
    var updatedHours = currentHours - deletedHours;
    
    $('#red_text_table.ects').text(updatedEcts);
    $('#red_text_table.hours').text(updatedHours);
}

$(document).ready(function(){
    //All courses that exist in object {label:x, value:x}
    const allCourses = [];
    //Array of avaliable courses that can be entered in input
    var coursesNames = [];
    //Array of courses that are currently in the table and cant be added again
    var enteredCourses = [];

    //Returns array of courses from json
    function getCourses(){
        var courses = [];
        $.getJSON('http://www.fulek.com/VUA/SUPIT/GetNastavniPlan', function(data){
        if(data.length > 0){
            $.each(data, function(index, val){
                allCourses.push({label:val.label, value:val.value});
                courses.push(val.label);
                    });
                }
            });
        return courses;
    }

    //Fills course names from json
    function initialize(){
        coursesNames = getCourses();
    }

    //Fill course names from json CALL
    initialize();
    
    //Binds array of course names to autocomplete input options
    function bindAutocompleteInput(){
        $('#search').autocomplete({
            delay: 0,
            source: function(request, response) {
                var results = $.ui.autocomplete.filter(coursesNames, request.term);
                //Sets maximum 7 autocomplete suggestions
                response(results.slice(0, 7));
            },
            minLength: 0,
            maxLength: 3,
            scroll: true,
        }).focus(function(){
            $(this).autocomplete("search", "");
        });
    }

    //Binds array of course names to autocomplete input options CALL
    bindAutocompleteInput();

    //Enter key pressed event handling
    $(document, '#search').on('keypress', function(key){
        //Enter is presses
        if(key.which == 13){
            //Gets user input
            let inputCourse = $('#search').val();
            //Inputed course is already in enteredCourses (in the table)
            if(enteredCourses.includes(inputCourse)){
                //Throw error, delete input
                $('#search').val('');
                custom_alert( `Kolegij "${inputCourse}" je već upisan!`, 'Greška');
            }
            //Inouted course exists and is not already entered
            else if(coursesNames.includes(inputCourse)){
                //If there is not any entered courses (nothing in the table), generate new table
                if(enteredCourses.length == 0){
                    $('#curriculum_table').append(getTableStart());
                }
                //All courses has array of object course{label:x, value:y}
                //course search id is id that is sent to the server to get all data for that course
                var courseSearchId;
                //Traverse course objects, find one that has same label as the entered one
                for (let index = 0; index < allCourses.length; index++) {
                    //Found by name
                    if(allCourses[index].label == inputCourse){
                        //Get id value of same course
                        courseSearchId = allCourses[index].value;
                        break;
                    }
                }
                //Generate json path for specifc course by id
                var jsonPath = `http://www.fulek.com/VUA/supit/GetKolegij/${courseSearchId}`;
                //Fetch json, appending has to be handeled inside getJson because of async, only append when json is recieved
                $.getJSON(jsonPath, function(data){
                    //Append course row, takes in data (course object{large one}), and index in array (only used for deleting, it's css id)
                    appendCourseRow(data, enteredCourses.indexOf(inputCourse));   
                });
                //Delete input value so it doesn't have to be deleted
                $('#search').val('');
                //Add inputed course to array of entered courses
                enteredCourses.push(inputCourse);
            }
        }
    });
    //Delete button in table is clicked
    $(document).on('click', '#btn_delete_curriculum', function(){
        //Gets row which is closest to current clicked button
        var $tr = $(this).closest('tr');
        //Gets css id in string type od row that has to be deleted
        var deletedRowId = '#'+String($tr[0].id);
        //Update total results (function definition above)
        updateDeletedTotalResults(deletedRowId);
        //Remove row with current id from the DOM
        $(deletedRowId).remove();
        //Remove deleted course from entered courses, where courseName is not equal to deleted class (class is equal to course name)
        enteredCourses = enteredCourses.filter(course => course != $tr[0].className);
        //If there is no entered courses left, delete table
        if(enteredCourses.length == 0){
            $('#curriculum_table').text('');
        }
    });
});