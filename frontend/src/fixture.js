// начальное значение нашего массива

const initial = [
    { id: 1, // ** уникальный id элемента
    title: "Make task manager", //** заговок элемента
    index: 0, //** порядковый номер элемента в списке
    steps: [
        { num: 3, label: 'first', done: false, index: 0 }, //* num - id
        { num: 4, label: 'f', done: false, index: 1 } //* dome - задача выполнена или нет
    ] //** массив шагов выполнения 
},
    { id: 2, title: "Now add some more tasks", index: 1, steps: [{ num: 5, label: 'e', done: false, index: 0 }] },
];

export default initial;