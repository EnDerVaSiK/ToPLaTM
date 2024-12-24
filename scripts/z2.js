
// функция вывода уведомления об ошибке
function showNotification({className, html}) {
    let notification = document.createElement('div');
    notification.className = "notification";
    if (className) notification.classList.add(className);
    notification.innerHTML = html;
    document.body.append(notification);
    setTimeout(() => notification.remove(), 1500);
}

try {

     //------------------------------ BACK ------------------------------\\


    function Earley(rules, word) {
        // let earley = new EarleyParser(rules, word);
        // return earley.parse();
    }


     //------------------------------------------------------------------//




     //------------------------------ TEST  -----------------------------\\





     //------------------------------------------------------------------//




     //------------------------------ FRONT -----------------------------\\


     // искусственная задержка
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    // поле для ввода правил
    const rules_in = document.getElementById("rules-in");
    // поле для вывода слова
    const word_in = document.getElementById("word-in");
    // поле для вывода результатов состояний и TRUE/FALSE
    const result_out = document.getElementById("result-out");
    // отображение статуса процесса выполнения
    const span_process = document.getElementById("span-process");

    // кнопка для запуска процесса удаления комментариев
    const runEarleyButton = document.getElementById('run-button');
    
    // кнопка для удаления текста из полей для ввода и отображения
    const clearButton = document.getElementById('clear-button');

    // цвет заблокированной кнопки
    const disabledColor = '#444';


    // удаление текстов с полей ввода-вывода
    clearButton.addEventListener('click', async () => {
        rules_in.value = '';
        word_in.value = '';
        result_out.value = '';
        span_process.innerHTML = 'Ожидание';
    });


    async function runEarley() {
        result_out.value =  Earley(rules_in.value, word_in.value);
    }

    
     // отключение элементов во время обработки и вывода
    function disableActiveElements() {
        rules_in.setAttribute('readonly', '');
        word_in.setAttribute('readonly', '');

        clearButton.setAttribute('disabled', '');
        copyFromOutToInButton.setAttribute('disabled', '');

        runEarleyButton.setAttribute('disabled', '');

        document.body.classList.toggle('disabled-elements');
    }


    // включение элементов, когда не происходит обработка и вывод
    function enableActiveElements() {
        rules_in.removeAttribute('readonly');
        word_in.removeAttribute('readonly');
        
        clearButton.removeAttribute('disabled');
        copyFromOutToInButton.removeAttribute('disabled');

        runEarleyButton.removeAttribute('disabled');

        document.body.classList.toggle('disabled-elements');
    }


    // обработчик событий для кнопки "Запуск алгоритма Эрли"
    runEarleyButton.addEventListener('click', async () => {
        result_out.value = '';
        span_process.innerHTML = 'В процессе...';
        disableActiveElements();

        await runEarley();
        
        span_process.innerHTML = 'Выполнено!'
        enableActiveElements();
    });


     //------------------------------------------------------------------//







}
catch(err) {
    showNotification({
        html: err, // HTML-уведомление
        className: "warning-message"
        //className: "alert-message"
    });
}