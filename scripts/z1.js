
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


    // способ с регулярным выражением, находил ошибки, не взял в реализацию
    // function RemoveComments(text) {
    //     return text.replace(/\/\*[\s\S]*?\*\//, '');
    // }
    // function removeBlockComments(code) {
    //     let result = '';
    //     let isInComment = false;
    //     for (let i = 0; i < code.length; i++) {
    //         // Проверяем начало комментария
    //         if (code[i] === '/' && code[i + 1] === '*') {
    //             isInComment = true;
    //             i++; // Пропустить следующий символ '*'
    //         }
    //         // Проверяем конец комментария
    //         else if (isInComment && code[i] === '*' && code[i + 1] === '/') {
    //             isInComment = false;
    //             i++; // Пропустить следующий символ '/'
    //         }
    //         // Если не в комментарии, добавляем символ в результат
    //         else if (!isInComment) {
    //             result += code[i];
    //         }
    //     }
    //     return result;
    // }


    // удаление комментариев
    // функция, реализующая процесс обработки автоматной грамматикой строки
    function removeCommentsGrammar(text) {
        let res = '';
        let i = 0;
        let state = 'Text';

        // функция, реализующая автоматную грамматику
        function Transition(state, symbol) {
            // if символ == '/' или '*' - оставляем, иначе замена на 'a' для обработки
            let symbol_ = '/*'.includes(symbol) ? symbol : 'a';
            
            const T = {
                'Text' : {
                    '/': ['CommentBegin', ''],
                    '*': ['Text', '*'],
                    'a': ['Text', symbol]
                },
                'CommentBegin' : {
                    '/': ['CommentBegin', '/'],
                    '*': ['CommentMiddle', ''],
                    'a': ['Text', '/' + symbol]
                },
                'CommentMiddle' : {
                    '/': ['CommentMiddle', ''],
                    '*': ['CommentEnd', ''],
                    'a': ['CommentMiddle', '']
                },
                'CommentEnd' : {
                    '/': ['Text', ''],
                    '*': ['CommentEnd', ''],
                    'a': ['CommentMiddle', '']
                }
            };

            let res = T[state][symbol_];
            return res;
        }
        
        // посимвольная обработка
        while (text[i]) {
            [state, out] = Transition(state, text[i++]);
            //console.log(state);
            res += out;
        }
        
        // if последний символ строки '/' и он не в комментарии, то выводить '/'
        if (state === 'CommentBegin' && text[i-1] === '/') {
            res += '/';
        }

        // if последнее состояние это "/*_"" или "/*_*"", то выводить предупреждение о незакрытом комментарии
        if (state === 'CommentMiddle' || state === 'CommentEnd') {
            // показывает элемент с текстом "Hello" рядом с правой верхней частью окна.
            showNotification({
                html: "Возможно, вы не закрыли комментарий!", // HTML-уведомление
                className: "warning-message"
                //className: "alert-message"
            });
        }
        else {
            showNotification({
                html: "Успех, комментарии убраны!",
                className: "success-message"
            });
        }
        return res;
    }




    // удаление лишних пробелов
    function removeExtraSpaces(text) {
        let res = text;
        // space = " ";
        // space_no = "";
        // spaces = "(\\s)+";

        // заменим все цепочки пробелов на один пробел: '    ' -> ' '
        res = res.replace(/(\s)+/g, ' ');
        // заменим все цепочки пробелов на один пробел: '    ' -> ''
        // res = res.replace(RegExp(spaces, "g"), space_no);

        // убираем пробелы в начале и в конце строки: ' a ' -> 'a'
        res = res.trim();
        
        // разные знаки
        // numbers                  = [0-9];
        // letters                  = [\wа-яА-Я];
        // punctuation_marks        = [!,.:;?];
        // math_operations          = [\*\+\-\/\^\=];
        // logical_operations       = [<>&|];
        // brackets_and_quotations  = [\(\)\[\]\{\}\"\'];
        // other_symbols            = [`~@#$%\\];

        // обработка знаков
        // :=, ==, !=, >=, <=, &&, ||
        res = res.replace(/(:)(\s)(=)/g, "$1$3");   // ': =' -> ':='
        res = res.replace(/(=)(\s)(=)/g, "$1$3");   // '= =' -> '=='
        res = res.replace(/(!)(\s)(=)/g, "$1$3");   // '! =' -> '!='
        res = res.replace(/(>)(\s)(=)/g, "$1$3");   // '> =' -> '>='
        res = res.replace(/(<)(\s)(=)/g, "$1$3");   // '< =' -> '<='
        res = res.replace(/(&)(\s)(&)/g, "$1$3");   // '& &' -> '&&'
        res = res.replace(/(\|)(\s)(\|)/g, "$1$3"); // '| |' -> '||'
        // numbers
        // x2 numbers-numbers: '1 2 3 4 5' ->(1) '12 34 5' ->(2) '12345'
        // res = res.replace(/([0-9])(\s)([0-9])/g, "$1$3");              // '1 1' -> '12'
        // res = res.replace(/([0-9])(\s)([\*\+\-\/\^\=])/g, "$1$3");           // '1 +' -> '1+'
        // res = res.replace(/([\*\+\-\/\^\=])(\s)([0-9])/g, "$1$3");           // '+ 1' -> '+1'
        // res = res.replace(/([0-9])(\s)([!,.:;?])/g, "$1$3");           // '1 ;' -> '1;'
        // res = res.replace(/([0-9])(\s)([<>&|])/g, "$1$3");             // '1 &' -> '1&'
        // res = res.replace(/([<>&|])(\s)([0-9])/g, "$1$3");             // '& 1' -> '&1'
        // res = res.replace(/([\(\)\[\]\{\}\"\'])(\s)([0-9])/g, "$1$3"); // '[ 1' -> '[1'
        // res = res.replace(/([0-9])(\s)([\(\)\[\]\{\}\"\'])/g, "$1$3"); // '1 ]' -> '1]'
        // letters (include numbers in "\w")
        // x2 letters-letters: 'a a a a a' ->(1) 'aa aa a' ->(2) 'aaaaa'
        res = res.replace(/([\wа-яА-Я])(\s)([\wа-яА-Я])/g, "$1$3");             // 'a a' -> 'aa' ...
        res = res.replace(/([\wа-яА-Я])(\s)([\wа-яА-Я])/g, "$1$3");             // 'a a' -> 'aa' ...

        res = res.replace(/([\wа-яА-Я])(\s)([\*\+\-\/\^\=])/g, "$1$3");         // 'a +' -> 'a+' ...
        res = res.replace(/([\*\+\-\/\^\=])(\s)([\wа-яА-Я])/g, "$1$3");         // '+ a' -> '+a' ...
        res = res.replace(/([\wа-яА-Я])(\s)([!,.:;?])/g, "$1$3");               // 'a ;' -> 'a;' ...
        res = res.replace(/([\wа-яА-Я])(\s)([<>&|])/g, "$1$3");                 // 'a &' -> 'a&' ...
        res = res.replace(/([<>&|])(\s)([\wа-яА-Я])/g, "$1$3");                 // '& a' -> '&a' ...
        res = res.replace(/([\(\)\[\]\{\}\"\'])(\s)([\wа-яА-Я])/g, "$1$3");     // '[ a' -> '[a' || '] a' -> ']a' ...
        res = res.replace(/([\wа-яА-Я])(\s)([\(\)\[\]\{\}\"\'])/g, "$1$3");     // 'a ]' -> 'a]' || 'a [' -> 'a[' ...
        // brackets_and_quotations
        res = res.replace(/([\(\)\[\]\{\}\"\'])(\s)([!,.:;?])/g, "$1$3");       // '] ;' -> '];' || '[ !' -> '[!' ...
        res = res.replace(/([\(\)\[\]\{\}\"\'])(\s)([\*\+\-\/\^\=])/g, "$1$3"); // '[ +' -> '[+' || '] -' -> ']+' ...
        res = res.replace(/([\(\)\[\]\{\}\"\'])(\s)([<>&|])/g, "$1$3");         // '[ &' -> '[&' || '] &' -> ']&' ...
        // = and math_operations
        res = res.replace(/(=)(\s)([\+\-])/g, "$1$3");                  // '= -' -> '=-' || '= +' -> '=+'
        // other_symbols не будем обрабатывать

        // получим распознавание только:
        // - или целые числа
        // - или буквенные операнды
        // - или цифро-буквенные операнды

        showNotification({
            html: "Успех, незначащие пробелы удалены!",
            className: "success-message"
        });

        return res;
    }




    // формирование лексем
    function formLexemes(text) {
        let res = text;
        res = res.match(/([\wа-яА-Я0-9]+)|([\(\)\[\]\{\}\"\'])|(:=)|(==)|(!=)|(<=)|(>=)|(<)|(>)|(&)|(&&)|(\|\|)|\||([\*\+\-\/\^\=])|([!,.:;?])/g);
        // оставляем уникальные
        let res_ = [];
        for (let el of res) {
            if (!res_.includes(el)) {
                res_.push(el);
            }
        }
        // console.log(res);
        // не распознает унарные операторы как части следующей после него лексемы, а выделяет отдельно

        showNotification({
            html: "Успех, лексемы сформированы!",
            className: "success-message"
        });

        res = res_.join('\n');
        return res;
    }




    //------------------------------------------------------------------//






    //------------------------------ TEST ------------------------------\\
    

    // input:

    // "a/a"
    // "/*a/a*/a"
    // "a//*a/a*/a"
    // "/* a/a /* //*// /* */a"
    // "a/ /* asd /* fgh */b/ c/"


    // output:

    // "a/a"
    // "a"
    // "a/a"
    // "/ a"
    // "a/ b/ c/"


    // extra spaces test

    // input:

    // a := 5 + 10 ;
    // a [ i ] .   a : = -1 2 3  ,    4 3  3 3 4  +   30 ( 1 / 8 e _ 3 9   *  8 37 2 ^ 1 9 2    b ) ;     0   ,   as is it

    // output:

    // a:=5+10;
    // a[i]. a:=-123, 43334+30(1/8e_39*8372^192b); 0, asisit


    // lexemes test

    // input:

    // a := 5 + 10 ;
    // a[i]. a:=-123, a[j]=512383; 43334+30(1/8e_39*8372^192b); 0, asisit

    // output:

    // a|:=|5|+|10|;
    // a|[|i|]|.|:=|-|123|,|j|=|512383|;|43334|+|30|(|1|/|8e_39|*|8372|^|192b|)|0|asisit

    //------------------------------------------------------------------//






    //------------------------------ FRONT ------------------------------\\

    // искусственная задержка
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    // поле для ввода любого текста - с комментариями
    const text_in = document.getElementById("text-in");
    // поле для вывода текста с удаленными комментариями
    const text_out = document.getElementById("text-out");
    // отображение статуса процесса удаления комментариев
    const span_process = document.getElementById("span-process");

    // кнопка для запуска процесса удаления комментариев
    const deleteCommentsButton = document.getElementById('delete-comments-button');
    // кнопка для запуска процесса удаления лишних пробелов
    const deleteExtraSpacesButton = document.getElementById('delete-extra-spaces-button');
    // кнопка для запуска процесса формирования лексем
    const formLexemesButton = document.getElementById('form-lexemes-button');

    // кнопка для удаления текста из полей для ввода и отображения
    const clearButton = document.getElementById('clear-button');

    // кнопка для копирования текста из поля справа в поле слева
    const copyFromOutToInButton = document.getElementById('from-out-to-in');

    // цвет заблокированной кнопки
    const disabledColor = '#444';

    // кнопка для переключения режима просмотра быстрого выполнения
    const fastToggleButton = document.getElementById('fast-toggle');
    // по умолчанию обработка и вывод - Быстро
    let is_fast = true




    // переключение с быстрого и медленного режимов
    fastToggleButton.addEventListener('click', async () => {
        fastToggleButton.classList.toggle('slow-btn');
        fastToggleButton.classList.toggle('fast-btn');
        if (is_fast) {
            is_fast = false;
            fastToggleButton.textContent = 'Медленно';
            // fastToggleButton.classList.toggle('slow-btn');
        } else {
            is_fast = true;
            fastToggleButton.textContent = 'Быстро';
            // fastToggleButton.classList.toggle('fast-btn');
        }
        // console.log(`Fast is ${is_fast}`);
    });


    // удаление текстов с полей ввода-вывода
    clearButton.addEventListener('click', async () => {
        text_in.value = '';
        text_out.value = '';
        span_process.innerHTML = 'Ожидание';
    });

    // копирование текста из поля справа в поле слева
    copyFromOutToInButton.addEventListener('click', async () => {
        text_in.value = text_out.value;
    });




    // быстрое удаление комментариев
    function fastRemoveComments() {
        return removeCommentsGrammar(text_in.value);
    }


    // медленное удаление комментариев (вывод с задержкой)
    async function slowRemoveComments() {
        let text_new = removeCommentsGrammar(text_in.value);
        for (let s in text_new) {
            text_out.value += text_new[s];
            await sleep(Math.floor(1100 / text_new.length));
            // console.log(Math.floor(1100 / text_new.length));
        }
    }




    // быстрое удаление лишних пробелов
    function fastRemoveExtraSpaces() {
        return removeExtraSpaces(text_in.value);
    }


    // медленное удаление лишних пробелов (вывод с задержкой)
    async function slowRemoveExtraSpaces() {
        let text_new = removeExtraSpaces(text_in.value);
        for (let s in text_new) {
            text_out.value += text_new[s];
            await sleep(Math.floor(1100 / text_new.length));
            // console.log(Math.floor(1100 / text_new.length));
        }
    }




    // быстрое формирование лексем
    function fastFormLexemes() {
        return formLexemes(text_in.value);
    }


    // медленное формирование лексем (вывод с задержкой)
    async function slowFormLexemes() {
        let text_new = formLexemes(text_in.value);
        for (let s in text_new) {
            text_out.value += text_new[s];
            await sleep(Math.floor(1100 / text_new.length));
            // console.log(Math.floor(1100 / text_new.length));
        }
    }




    // отключение элементов во время обработки и вывода
    function disableActiveElements() {
        text_in.setAttribute('readonly', '');

        fastToggleButton.setAttribute('disabled', '');
        clearButton.setAttribute('disabled', '');
        copyFromOutToInButton.setAttribute('disabled', '');

        deleteCommentsButton.setAttribute('disabled', '');
        deleteExtraSpacesButton.setAttribute('disabled', '');
        formLexemesButton.setAttribute('disabled', '');

        document.body.classList.toggle('disabled-elements');
    }


    // включение элементов, когда не происходит обработка и вывод
    function enableActiveElements() {
        text_in.removeAttribute('readonly');
        
        fastToggleButton.removeAttribute('disabled');
        clearButton.removeAttribute('disabled');
        copyFromOutToInButton.removeAttribute('disabled');

        deleteCommentsButton.removeAttribute('disabled');
        deleteExtraSpacesButton.removeAttribute('disabled');
        formLexemesButton.removeAttribute('disabled');

        document.body.classList.toggle('disabled-elements');
    }


    // обработчик событий для кнопки "удаление комментариев"
    deleteCommentsButton.addEventListener('click', async () => {
        text_out.value = '';
        span_process.innerHTML = 'В процессе...';
        disableActiveElements();

        if (is_fast) {
            text_out.value = fastRemoveComments();
        } else {
            await slowRemoveComments();
        }

        span_process.innerHTML = 'Выполнено!'
        enableActiveElements();
    });




    // обработчик событий для кнопки "удаление лишних пробелов"
    deleteExtraSpacesButton.addEventListener('click', async () => {
        text_out.value = '';
        span_process.innerHTML = 'В процессе...';
        disableActiveElements();

        if (is_fast) {
            text_out.value = fastRemoveExtraSpaces();
        } else {
            await slowRemoveExtraSpaces();
        }
        
        span_process.innerHTML = 'Выполнено!'
        enableActiveElements();
    });




    // обработчик событий для кнопки "формирование лексем"
    formLexemesButton.addEventListener('click', async () => {
        text_out.value = '';
        span_process.innerHTML = 'В процессе...';
        disableActiveElements();

        if (is_fast) {
            text_out.value = fastFormLexemes();
        } else {
            await slowFormLexemes();
        }
        
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