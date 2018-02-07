/**
 * Конфигурирование:
 * @param row - количество строк
 * @param column - количество колонок
 * @param stepTime - количество мс для обдумывания одного хода
 * @param multipleFactorFireSpeed - количество раз, во сколько скорость одного выстрела быстрее скорости игрока.
 * Скорость не может быть дробным или отрицательным числом.
 */
export const config = {
    row: 20,
    column: 20,
    stepTime: 200,
    multipleFactorFireSpeed: 2
};
