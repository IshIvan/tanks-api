/**
 * Конфигурирование:
 * @param row - количество строк
 * @param column - количество колонок
 * @param stepTime - количество мс для обдумывания одного хода
 * @param multipleFactorFireSpeed - количество раз, во сколько скорость одного выстрела быстрее скорости игрока.
 * @param airStrikeNumber - количество раз, которое необходимо для начала обстрела зоны.
 * @param airStrikePercent - процент вероятности срабатывания авиаудара по области.
 * @param isAirStrikeModeEnabled - включены ли авиаудары в принципе.
 * @param winnerPoints - количество очков, которое получит бот в случае победы.
 * Скорость не может быть дробным или отрицательным числом.
 */
export const config = {
    row: 25,
    column: 25,
    stepTime: 50,
    multipleFactorFireSpeed: 2,
    airStrikeNumber: 2,
    airStrikePercent: 20,
    isAirStrikeModeEnabled: true,
    winnerPoints: 2
};
