# Tanks api
Платформа для ботов-танчиков в одноименной игре.

## Запуск
Все стандартно:
```
    npm i
    npm start
```

## Основы
Каждому участнику необходимо создать свой класс, реализующий логику работы бота.
Для этого необходимо занаследоваться от `Bot`, как показано ниже:
```javascript
export class ExampleBot extends Bot {
    constructor() {
        super();
    }

    doStep() {
      ...
    }
}
```

В методе `doStep()` необходимо описать поведение бота на текущий ход.

[Пример бота](https://github.com/IshIvan/tanks-api/blob/master/src/bots/example-bot.js)

[Желательная директория для ваших ботов](https://github.com/IshIvan/tanks-api/tree/master/src/bots)

### Важно:
* Бот не должен вмешиваться в работу других ботов.
* Бот не должен переопределять какие-либо другие методы или свойства.
* Бот не должен обращаться к `api-config.js`
* Бот может создавать свои методы и свойства.
* Результатом `doStep()` будет являться любой ход отличный от `ACTIONS.nothing`
* `doStep()` ничего не возвращает, следовательно, можно определить любое количество действий подряд, но выполнится **только последнее**.

## Api
### Методы передвижения
Данные методы напрямую не сообщат боту, что действие невозможно, однако если на пути будет препятствие или другой игрок, то действие не выполнится.
```javascript
    up()
    down()
    right()
    left()
```

Если вы не хотите ничего делать в данный ход, то:
```javascript
    sleep()
```
Однако, даже если вы не вызовете данный метод явно, он все равно будет вызван, в случае если вы не сделали ход.

Узнать о возможности перемещения в любую из сторон:
```javascript
    canIDoMoveAction(moveActions): boolean
    moveActions = ACTIONS.up | down | right | left
```

### Методы ведения огня
Для того чтобы выстрелить, необходимо указать направление. В качестве направления служат `ACTIONS`.
В случае попадания по противнику, ему присвоится `STATUS.dead`, так как на данный момент у каждого бота только 1 здоровье.
Выстрел занимает 1 ход, следовательно, двигаться и стрелять одновременно не получится.
Снаряд быстрее игрока в `config.multipleFactorFireSpeed` раз.
```javascript
    fire(vector)
```

Получить все выстрелы можно методом:
```javascript
    get fires(): Fire[]

    class Fire {
        position: {x: number, y: number},
        vector: moveActions
    }
```

Получить объект красной зоны можно, где `counter` - количество ходов до удара:
```javascript
    get strike(): AirStrikeModel | null
    class AirStrikeModel {
        topLeft: {x: number, y: number},
        bottomRight: {x: number, y: number},
        counter: number
    }
```

### Методы ориентирования
Данные методы не будут засчитаны как ход, однакое не следует ими злоупотреблять.

Узнать свое положение:
```javascript
    myPosition: {x: number, y: number}
```

Узнать местоположение всех `STATUS.live` противников:
```javascript
    enemies: [{x: number, y: number}]
```

Получить всю карту на текущий ход:
```javascript
    gameMap: Array<Array<cellType>>;
    cellType = CELL_TYPES.ground | barricade | player
```

Узнать размер карты:
```javascript
    gameMapSize: [columnNumber: number, rowNumber: number]
```

### Действия
Только данные методы присваивают признак действия, использовать другие методы можно в неограниченном(**разумном**) количестве.
```javascript
    up()
    down()
    right()
    left()
    fire(vector)
```