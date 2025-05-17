/**
 * A*寻路算法测试脚本
 * 这个脚本用于验证A*算法在各种场景下的表现
 */

// 导入A*算法和地图数据
const TILE_TYPES = {
    GRASS: 0,          // 可通行的草地
    WALL: 1,           // 障碍物/墙壁
    DOOR: 2,           // 房屋入口 (可通行)
    INDOOR_FLOOR: 3    // 室内地板 (可通行)
};

// 在Node.js环境下导入模块，在浏览器环境下使用全局变量
let findPath, manhattanDistance, euclideanDistance;
if (typeof require !== 'undefined') {
    const pathfinding = require('./pathfinding');
    findPath = pathfinding.findPath;
    manhattanDistance = pathfinding.manhattanDistance;
    euclideanDistance = pathfinding.euclideanDistance;
} else {
    findPath = window.findPath;
    manhattanDistance = window.manhattanDistance;
    euclideanDistance = window.euclideanDistance;
}

/**
 * 打印地图和路径，用于可视化
 * @param {Array<Array<number>>} map - 地图数据
 * @param {Array<{x: number, y: number}>} path - 路径
 */
function printMapWithPath(map, path) {
    const result = [];
    
    // 创建地图副本
    for (let y = 0; y < map.length; y++) {
        result[y] = [];
        for (let x = 0; x < map[y].length; x++) {
            // 显示不同类型的地形
            switch (map[y][x]) {
                case TILE_TYPES.GRASS:
                    result[y][x] = '.'; // 草地显示为点
                    break;
                case TILE_TYPES.WALL:
                    result[y][x] = '#'; // 墙壁显示为井号
                    break;
                case TILE_TYPES.DOOR:
                    result[y][x] = 'D'; // 门显示为D
                    break;
                case TILE_TYPES.INDOOR_FLOOR:
                    result[y][x] = ' '; // 室内地板显示为空格
                    break;
                default:
                    result[y][x] = '?'; // 未知类型
            }
        }
    }
    
    // 如果有路径，标记出来
    if (path) {
        for (const point of path) {
            // 跳过起点和终点
            if (point === path[0] || point === path[path.length - 1]) {
                continue;
            }
            result[point.y][point.x] = '*'; // 路径点显示为星号
        }
        
        // 标记起点和终点
        if (path.length > 0) {
            const start = path[0];
            const end = path[path.length - 1];
            result[start.y][start.x] = 'S'; // 起点显示为S
            result[end.y][end.x] = 'E';     // 终点显示为E
        }
    }
    
    // 打印地图
    return result.map(row => row.join('')).join('\n');
}

/**
 * 运行基本测试场景
 */
function runBasicTests() {
    console.log("=== 基本测试场景 ===");
    
    // 创建一个简单的测试地图
    const simpleMap = [
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
        [1, 1, 1, 0, 1],
        [0, 0, 0, 0, 0]
    ];
    
    console.log("测试地图:");
    console.log(printMapWithPath(simpleMap));
    
    // 测试1: 直线路径
    const path1 = findPath(0, 0, 4, 0, simpleMap);
    console.log("\n测试1 - 直线路径 (0,0) -> (4,0):");
    if (path1) {
        console.log(`找到路径，长度: ${path1.length}`);
        console.log(printMapWithPath(simpleMap, path1));
    } else {
        console.log("未找到路径");
    }
    
    // 测试2: 绕过障碍物
    const path2 = findPath(0, 0, 2, 2, simpleMap);
    console.log("\n测试2 - 绕过障碍物 (0,0) -> (2,2):");
    if (path2) {
        console.log(`找到路径，长度: ${path2.length}`);
        console.log(printMapWithPath(simpleMap, path2));
    } else {
        console.log("未找到路径");
    }
    
    // 测试3: 复杂路径
    const path3 = findPath(0, 0, 4, 4, simpleMap);
    console.log("\n测试3 - 复杂路径 (0,0) -> (4,4):");
    if (path3) {
        console.log(`找到路径，长度: ${path3.length}`);
        console.log(printMapWithPath(simpleMap, path3));
    } else {
        console.log("未找到路径");
    }
    
    // 测试4: 无法到达的目标 (目标被墙壁完全包围)
    const impossibleMap = [
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 0, 1, 0], // 中间的0被墙壁包围
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0]
    ];
    
    const path4 = findPath(0, 0, 2, 2, impossibleMap);
    console.log("\n测试4 - 无法到达的目标 (0,0) -> (2,2):");
    if (path4) {
        console.log(`找到路径，长度: ${path4.length}`);
        console.log(printMapWithPath(impossibleMap, path4));
    } else {
        console.log("未找到路径（这是预期的结果，因为目标被墙壁完全包围）");
    }
}

/**
 * 使用V2地图数据结构的测试场景
 */
function runComplexMapTests() {
    console.log("\n=== 使用复杂地图的测试场景 ===");
    
    // 创建一个迷你版的V2地图
    const miniMapV2 = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 1, 3, 3, 3, 1, 0, 0, 0, 0],
        [0, 1, 3, 3, 3, 1, 0, 0, 0, 0],
        [0, 1, 3, 3, 3, 2, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 3, 3, 3, 1, 0, 0],
        [0, 0, 0, 1, 1, 2, 1, 1, 0, 0]
    ];
    
    console.log("迷你V2地图:");
    console.log(printMapWithPath(miniMapV2));
    
    // 测试1: 从室外到室内
    const path1 = findPath(0, 0, 3, 3, miniMapV2);
    console.log("\n测试1 - 从室外到室内 (0,0) -> (3,3):");
    if (path1) {
        console.log(`找到路径，长度: ${path1.length}`);
        console.log(printMapWithPath(miniMapV2, path1));
    } else {
        console.log("未找到路径");
    }
    
    // 测试2: 从一栋建筑到另一栋
    const path2 = findPath(3, 3, 5, 8, miniMapV2);
    console.log("\n测试2 - 从一栋建筑到另一栋 (3,3) -> (5,8):");
    if (path2) {
        console.log(`找到路径，长度: ${path2.length}`);
        console.log(printMapWithPath(miniMapV2, path2));
    } else {
        console.log("未找到路径");
    }
    
    // 测试3: 长距离路径
    const path3 = findPath(2, 2, 9, 9, miniMapV2);
    console.log("\n测试3 - 长距离路径 (2,2) -> (9,9):");
    if (path3) {
        console.log(`找到路径，长度: ${path3.length}`);
        console.log(printMapWithPath(miniMapV2, path3));
    } else {
        console.log("未找到路径");
    }
}

/**
 * 性能测试 - 测量大地图上的寻路性能
 */
function runPerformanceTest() {
    console.log("\n=== 性能测试 ===");
    
    // 创建一个大地图 (50x50)
    const largeMap = [];
    for (let y = 0; y < 50; y++) {
        largeMap[y] = [];
        for (let x = 0; x < 50; x++) {
            // 地图边缘和随机10%的位置设为墙壁
            if (x === 0 || y === 0 || x === 49 || y === 49 || Math.random() < 0.1) {
                largeMap[y][x] = TILE_TYPES.WALL;
            } else {
                largeMap[y][x] = TILE_TYPES.GRASS;
            }
        }
    }
    
    console.log("大地图尺寸: 50x50");
    
    // 测量10次寻路的平均时间
    let totalTime = 0;
    const testCount = 10;
    
    for (let i = 0; i < testCount; i++) {
        // 随机选择起点和终点 (避开边缘)
        let startX, startY, endX, endY;
        do {
            startX = Math.floor(Math.random() * 40) + 5;
            startY = Math.floor(Math.random() * 40) + 5;
        } while (largeMap[startY][startX] === TILE_TYPES.WALL);
        
        do {
            endX = Math.floor(Math.random() * 40) + 5;
            endY = Math.floor(Math.random() * 40) + 5;
        } while (largeMap[endY][endX] === TILE_TYPES.WALL || (startX === endX && startY === endY));
        
        const startTime = performance.now();
        const path = findPath(startX, startY, endX, endY, largeMap);
        const endTime = performance.now();
        
        const time = endTime - startTime;
        totalTime += time;
        
        console.log(`测试 ${i+1}: (${startX},${startY}) -> (${endX},${endY})`);
        console.log(`  结果: ${path ? '找到路径' : '未找到路径'}, 耗时: ${time.toFixed(2)}ms`);
        if (path) {
            console.log(`  路径长度: ${path.length}`);
        }
    }
    
    console.log(`\n平均耗时: ${(totalTime / testCount).toFixed(2)}ms`);
}

// 运行所有测试
console.log("开始A*寻路算法测试...");
runBasicTests();
runComplexMapTests();

// 如果在浏览器环境中运行，需要一个全局函数
if (typeof window !== 'undefined') {
    window.runAllPathfindingTests = function() {
        runBasicTests();
        runComplexMapTests();
        runPerformanceTest();
    };
    
    console.log("\nA*寻路算法测试脚本已加载");
    console.log("在控制台运行 window.runAllPathfindingTests() 来执行所有测试");
} 
// 如果在Node.js环境中运行，直接执行性能测试
else if (typeof performance !== 'undefined') {
    runPerformanceTest();
} else {
    console.log("\n性能测试在当前环境中不可用");
}

// 导出测试函数（用于Node.js环境）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        runBasicTests,
        runComplexMapTests,
        runPerformanceTest
    };
}