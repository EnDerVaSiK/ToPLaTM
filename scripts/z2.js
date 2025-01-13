
// функция вывода уведомления об ошибке
function showNotification({className, html}) {
    let notification = document.createElement('div');
    notification.className = "notification";
    if (className) notification.classList.add(className);
    notification.innerHTML = html;
    document.body.append(notification);
    setTimeout(() => notification.remove(), 1500);
}

String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

try {

    //-------------------------------------- BACK --------------------------------------\\

    const metaSymbol = `•`;
    
    class State {
        constructor(rule, dot, start, end) {//, backPointers = []) {
            this.rule = rule; // [левая часть, правая часть]
            this.dot = dot; // Позиция мета-символа/маркера/точки
            this.start = start; // Начальная позиция в слове
            this.end = end; // Конечная позиция в слове
            // this.backPointers = backPointers;
        }
        
        isComplete() {
            return this.dot >= this.rule[1].length;
        }
        
        nextSymbol() {
            return this.rule[1][this.dot];
        }
        
        toString() {
            const beforeDot = this.rule[1].slice(0, this.dot).join("");
            const afterDot = this.rule[1].slice(this.dot).join("");
            return `[${this.rule[0]}->${beforeDot}`+ metaSymbol +`${afterDot},${this.start}]`; // \t|${this.end}|`;
        }
    }

    class EarleyParser {
        constructor(grammar, startSymbol) {
            this.grammar = grammar;
            this.startSymbol = startSymbol;
        }

        parse(word) {
            let flag = 0;
            const chart = Array(word.length + 1).fill().map(() => []);
            chart[0].push(new State(["S1", [this.startSymbol]], 0, 0, 0));
            let state;
            let curCondition = -1;
            for (let i = 0; i <= word.length; i++) {
                for (state of chart[i]) {
                    if (state.end !== curCondition) {
                        curCondition = state.end;
                        if (state.end != 0) {
                            resultOutUpdate("===============\n\n");
                        }
                        resultOutUpdate("===============\n  Состояние " + state.end + "\n");
                        resultOutUpdate("    " + word.splice(curCondition, 0, metaSymbol) + "\n---------------\n");
                    }
                    if (!state.isComplete()) {
                        const nextSym = state.nextSymbol();
                        if (this.isNonTerminal(nextSym)) {
                            this.Predict(state, i, chart);
                        } else {
                            this.Scan(state, i, word, chart);
                        }
                    } else {
                        this.Complete(state, i, chart);
                    }
                    if (flag < 2) {
                        resultOutUpdate(state.toString() + "\n");
                        if (state.rule[0] === "S1") flag++;
                    }
                }
            }
        
            const res = chart[word.length].some(
                (state) =>
                state.rule[0] === "S1" && state.isComplete() && state.start === 0
            );
            if (chart.length - 1 > state.end) {
                resultOutUpdate("===============\n\n===============\n  Состояние " + (state.end + 1) + "\n");
                resultOutUpdate("    " + word.splice(curCondition + 1, 0, metaSymbol) + "\n---------------\nПусто\n");
            }

            resultOutUpdate("===============\n\n");

            return res
        }

        Predict(state, pos, chart) {
            for (let rule of this.grammar) {
                if (rule[0] === state.nextSymbol()) {
                    const newState = new State(rule, 0, pos, pos);
                    if (!this.stateExists(chart[pos], newState)) {
                    chart[pos].push(newState);
                    }
                }
            }
        }

        Scan(state, pos, word, chart) {
            if (pos < word.length && word[pos] === state.nextSymbol()) {
                const newState = new State(
                    state.rule,
                    state.dot + 1,
                    state.start,
                    pos + 1
                );
                if (!this.stateExists(chart[pos + 1], newState)) {
                    chart[pos + 1].push(newState);
                }
            }
        }

        Complete(state, pos, chart) {
            for (let prevState of chart[state.start]) {
                if (prevState.nextSymbol() === state.rule[0]) {
                    const newState = new State(
                        prevState.rule,
                        prevState.dot + 1,
                        prevState.start,
                        pos
                    );
                    if (!this.stateExists(chart[pos], newState)) {
                        chart[pos].push(newState);
                    }
                }
            }
        }

        isNonTerminal(symbol) {
            return this.grammar.some((rule) => rule[0] === symbol);
        }

        stateExists(states, newState) {
            return states.some(
                (state) =>
                state.rule[0] === newState.rule[0] &&
                JSON.stringify(state.rule[1]) === JSON.stringify(newState.rule[1]) &&
                state.dot === newState.dot &&
                state.start === newState.start &&
                state.end === newState.end
            );
        }
    }

    function formGrammar(rules) {
        let grammar = [];
        for (r of rules.trim().replaceAll(' ', '').split(`\n`)) {
            r = r.trim().split(`->`)
            rr = r[1];
            if (rr.indexOf(`|`) != -1) {
                rr = rr.split(`|`);
                for (rrr of rr)
                    grammar.push([r[0], rrr.split('')]);
            } else grammar.push(r[0], rr.split(''));
        }
        return grammar;
    }

    function EarleyProcess(rules, word) {
        // grammar = rules.trim().replaceAll(' ', '').split(`\n`).map((line) => line.trim().split(`->`));
        // for (r of grammar) {
        //     r[1] = r[1].split('');
        // }
        grammar = formGrammar(rules);

        // for (g of grammar) {
        //     console.log(g);
        // }
        startSymbol = grammar[0][0].trim().replaceAll(' ', '');

        let earley = new EarleyParser(grammar, startSymbol);

        return earley.parse(word) ? "TRUE" : "FALSE";
    }


    //------------------------------------------------------------------------------------------//




    //-------------------------------------- TEST  -------------------------------------\\




    // rules:

    // S -> A + S
    // S->b
    // A ->S - A
    // A ->a


    // word:
    
    // a + b


    // output:

    // ---------------
    // Состояние 0
    // ---------------
    // [S1->•S,0]	|0|
    // [S->•A+S,0]	|0|
    // [S->•b,0]	|0|
    // [A->•S-A,0]	|0|
    // [A->•a,0]	|0|

    // ---------------
    // Состояние 1
    // ---------------
    // [A->a•,0]	|1|
    // [S->A•+S,0]	|1|

    // ---------------
    // Состояние 2
    // ---------------
    // [S->A+•S,0]	|2|
    // [S->•A+S,2]	|2|
    // [S->•b,2]	|2|
    // [A->•S-A,2]	|2|
    // [A->•a,2]	|2|

    // ---------------
    // Состояние 3
    // ---------------
    // [S->b•,2]	|3|
    // [S->A+S•,0]	|3|
    // [A->S•-A,2]	|3|
    // [S1->S•,0]	|3|

    // TRUE




    //------------------------------------------------------------------------------------------//




    //-------------------------------------- FRONT -------------------------------------\\


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
    // const disabledColor = '#444';


    // удаление текстов с полей ввода-вывода
    clearButton.addEventListener('click', async () => {
        rules_in.value = '';
        word_in.value = '';
        result_out.value = '';
        span_process.innerHTML = 'Ожидание';
    });


    // Добавление текста в поле вывода
    function resultOutUpdate(text) {
        result_out.value += text
    }

    // // Установка текста в поле для вывода
    // function resultOutSet(text) {
    //     result_out.value = text
    // }


    // Запуск алгоритма Эрли пользователем
    async function runEarley() {
        resultOutUpdate(EarleyProcess(rules_in.value, word_in.value));
    }

    
     // отключение элементов во время обработки и вывода
    function disableActiveElements() {
        rules_in.setAttribute('readonly', '');
        word_in.setAttribute('readonly', '');

        clearButton.setAttribute('disabled', '');
        // copyFromOutToInButton.setAttribute('disabled', '');

        runEarleyButton.setAttribute('disabled', '');

        document.body.classList.toggle('disabled-elements');
    }


    // включение элементов, когда не происходит обработка и вывод
    function enableActiveElements() {
        rules_in.removeAttribute('readonly');
        word_in.removeAttribute('readonly');
        
        clearButton.removeAttribute('disabled');
        // copyFromOutToInButton.removeAttribute('disabled');

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


    //------------------------------------------------------------------------------------------//







}
catch(err) {
    showNotification({
        html: err, // HTML-уведомление
        className: "warning-message"
        //className: "alert-message"
    });
}
