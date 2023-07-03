const list = document.querySelector('.list');
const task = document.querySelector('.task');
const taskName = document.getElementById('taskName');
const taskDate = document.getElementById('taskDate');
const clean = document.getElementById('reset');
const listItems = document.querySelector('.list__items');
const remove = document.querySelector('.delete');
const done = document.querySelector('.done');
let input = document.querySelector('.input')
const undone = document.querySelector('.undone')
const listDone = document.querySelector('.list__done')
let tasks;
//Drag'n'drop
function sortable(list){
    let currentEl;
    [].slice.call(list.children).forEach(item => item.draggable = true);
    function dragOStart(e){
        e.dataTransfer.effectAllowed = 'move';
    }
}
sortable(listItems)
//Нахождение ошибок
function findError(){
    if(error) error.remove();
}
//Функционал скрытия модального окна
function hiddenTask(){
    task.classList.add('hidden');
    list.style.filter = 'none';
    taskName.value = '';
    taskDate.value = '';
}
//Стилизация кнопки закрытия модального окна
const cancel = document.createElement('div');
cancel.style.cssText = 'width: 45px; height: 45px; border: 2px solid #8b008b; border-radius: 5px;';
cancel.classList.add('close');
task.insertAdjacentElement('afterbegin', cancel);

//Открыть модальное окно
list.addEventListener('click', function(e){
    if(e.target.className === 'list__btn'){
        task.classList.remove('hidden');
        this.style.filter = 'blur(2px)';
        taskName.focus();
        findError();
    };
})
//Очистить
clean.addEventListener('click', function(){
    findError();
})
//Выйти из модального окна
cancel.addEventListener('click', function(e){
    hiddenTask();
})
//Добавление задачи
let arr = [];
let error;

//Local Storage
function local(){
    let data = JSON.parse(window.localStorage.getItem('tasks'));
    if(!data) return;
    data.filter(obj => obj.isCompleted === false).forEach(obj =>{
        arr.push(obj);
        listItems.insertAdjacentHTML('beforeend', createTask(obj))
    })
    data.filter(obj => obj.isCompleted === true).forEach(obj => {
        listDone.insertAdjacentHTML('beforeend', createTask(obj, true));
        arr.push(obj);
    })
    let contents = listDone.querySelectorAll('.list__content');
        for(let content of contents){
            content.style.borderColor = '#00ff00';
            let date = content.querySelector('.list__date');
            date.textContent = 'Выполнено!'
        }
};
local()

function randomNum(num){
    let findNum = arr.find(item => item.id === num);
    if(findNum){
        num = Math.round(Math.random() * 100);
        return randomNum(num)
    }else{
        return num;
    }
}
let num = Math.round(Math.random() * 100);
document.getElementById('save').addEventListener('click', addTask);

function createTask(task, isCompleted = false){
    return `<fieldset class="list__content" data-id=${task.id}>
    <legend class="list__date">${task.date}</legend>
    <label class="label"><input type="checkbox" name="html" value="html" class="input">${task.value}</label><br />
    </fieldset>`;
}

function addTask(e){
    e.preventDefault();
    if(taskName.value !== ''){
        let newTask = {
            id: randomNum(num),
            date: taskDate.value,
            value: taskName.value,
            isCompleted: false
        };
        let ppp = createTask(newTask);
        arr.push(newTask)
        document.querySelector('.list__items').insertAdjacentHTML('beforeend', ppp);
        hiddenTask();
        window.localStorage.setItem('tasks', JSON.stringify(arr));
    }else{
        if(!task.querySelector('.error')){
            writeError('Пустая строка. Напишите задачу!')
        }
    }
}

//Количество символов сообщение
let textError;
taskName.addEventListener('keydown', function(){
    if(this.value.length === 29 && !task.querySelector('.error')){
        writeError('Текст не должен превышать больше 29 символов!')
    }
})
//Кнопка удаления
remove.addEventListener('click', function(){
    let checkboxes = list.querySelectorAll("input[name='html']:checked");
    checkboxes.forEach(check => {
    let currentList = check.closest('.list__content');
    let idNum = currentList.getAttribute('data-id');
    currentList.remove();
    let removeItem = arr.find(obj => obj.id === Number(idNum));
    if(!removeItem) return;
    arr.splice(arr.indexOf(removeItem), 1);
    window.localStorage.setItem('tasks', JSON.stringify(arr));
});
})
//Кнопка выполнения
done.addEventListener('click', function(){
    let checkboxes = list.querySelectorAll("input[name='html']:checked");
    checkboxes.forEach(check =>{ 
        let content = check.closest('.list__content')
        content.style.borderColor = '#00ff00'
        check.checked = false;
        content.querySelector('.list__date').textContent = 'Выполнено!'
        listDone.appendChild(content);
        let idNum = content.getAttribute('data-id');
        let doneItem = arr
        .filter(obj => obj.id === Number(idNum))
        .map(obj => obj.isCompleted = true)
        if(!doneItem) return;
        window.localStorage.setItem('tasks', JSON.stringify(arr));
})
})
//Drag n drop


function writeError(text){
    error = document.createElement('p');
    error.classList.add('error');
    error.textContent = text;
    taskName.insertAdjacentElement('afterend', error)
}

// function sortable(rootEl){
    //     var dragEl;
    //     [].slice.call(rootEl.children).forEach(function (itemEl){
    //         itemEl.draggable = true;
    //     });
        
    //     function _onDragOver(evt){
    //         evt.preventDefault();
    //         evt.dataTransfer.dropEffect = 'move';
           
    //         var target = evt.target;
    //         if( target && target !== dragEl && target.nodeName == 'FIELDSET' ){
    //             // Сортируем
    //             rootEl.insertBefore(dragEl, target.nextSibling || target);
    //         }
    //     }
    
    //     function _onDragEnd(evt){
    //         evt.preventDefault();
           
    //         dragEl.classList.remove('ghost');
    //         rootEl.removeEventListener('dragover', _onDragOver, false);
    //         rootEl.removeEventListener('dragend', _onDragEnd, false);
    //     }
     
    //     rootEl.addEventListener('dragstart', function (evt){
    //         dragEl = evt.target; 
         
    //         evt.dataTransfer.effectAllowed = 'move';
    //         evt.dataTransfer.setData('Text', dragEl.textContent);
    
    //         rootEl.addEventListener('dragover', _onDragOver, false);
    //         rootEl.addEventListener('dragend', _onDragEnd, false);
    
    //         setTimeout(function (){
    //             dragEl.classList.add('ghost');
    //         }, 0)
    //     }, false);
    // }
    // sortable( listItems);

function dragNDrop(items){
    let dragEl;

    [].slice.call(items).forEach(item =>{
        item.draggable = true;
    });

    function dragOver(e){
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if(e.target && e.target !== dragEl && e.target.tagName === 'FIELDSET'){
            e.target.insertbefore(dragEl, target.nextSibling || target)
        }
    }

    function dragEnd(e){
        e.preventDefault();

    }
}
dragNDrop(listItems.children)