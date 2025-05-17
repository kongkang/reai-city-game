/**
 * A*寻路算法实现
 * 为斯坦福小镇风格游戏提供路径查找功能
 */

// 导入地图数据结构(可选，如果直接使用也可以忽略)
let TILE_TYPES;
if (typeof require !== 'undefined') {
    const mapData = require('./map_data_v2');
    TILE_TYPES = mapData.TILE_TYPES;
} else {
    // 浏览器环境，假设TILE_TYPES已经在全局作用域定义
    TILE_TYPES = TILE_TYPES || {
        GRASS: 0,
        WALL: 1,
        DOOR: 2,
        INDOOR_FLOOR: 3
    };
}

/**
 * 节点类，用于A*算法中的每个格子
 */
class Node {
    constructor(x, y, walkable = true) {
        this.x = x;             // X坐标
        this.y = y;             // Y坐标
        this.walkable = walkable; // 是否可通行
        this.parent = null;     // 父节点(用于回溯路径)
        this.g = 0;             // 从起点到这个节点的代价
        this.h = 0;             // 从这个节点到终点的估计代价(启发式)
        this.f = 0;             // 总代价 f = g + h
    }
    
    /**
     * 判断两个节点是否是同一个位置
     */
    equals(other) {
        return this.x === other.x && this.y === other.y;
    }
}

/**
 * 计算两点间的曼哈顿距离
 * 适用于只能水平和垂直移动的情况
 */
function manhattanDistance(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

/**
 * 计算两点间的欧几里得距离
 * 适用于可以任意方向移动的情况
 */
function euclideanDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

/**
 * 使用A*算法寻找从起点到终点的路径
 * @param {number} startX - 起点X坐标
 * @param {number} startY - 起点Y坐标
 * @param {number} endX - 终点X坐标
 * @param {number} endY - 终点Y坐标
 * @param {Array<Array<number>>} mapData - 地图数据二维数组
 * @param {boolean} allowDiagonal - 是否允许对角线移动，默认为false(四向移动)
 * @returns {Array<{x: number, y: number}>|null} - 路径坐标数组或null(无路径)
 */
function findPath(startX, startY, endX, endY, mapData, allowDiagonal = false) {
    // 检查起点和终点是否有效
    if (!isValidCoordinate(startX, startY, mapData) || 
        !isValidCoordinate(endX, endY, mapData)) {
        console.error("起点或终点坐标无效");
        return null;
    }
    
    // 检查起点和终点是否可通行
    if (!isWalkable(startX, startY, mapData)) {
        console.error("起点不可通行");
        return null;
    }
    
    if (!isWalkable(endX, endY, mapData)) {
        console.error("终点不可通行");
        return null;
    }
    
    // 如果起点和终点相同，直接返回
    if (startX === endX && startY === endY) {
        return [{x: startX, y: startY}];
    }
    
    // 地图尺寸
    const height = mapData.length;
    const width = mapData[0].length;
    
    // 创建起点和终点节点
    const startNode = new Node(startX, startY);
    const endNode = new Node(endX, endY);
    
    // 开放列表和关闭列表
    const openList = [];
    const closedList = [];
    
    // 添加起点到开放列表
    openList.push(startNode);
    
    // 定义移动方向：上、右、下、左
    const directions = [
        {x: 0, y: -1},  // 上
        {x: 1, y: 0},   // 右
        {x: 0, y: 1},   // 下
        {x: -1, y: 0}   // 左
    ];
    
    // 如果允许对角线移动，添加四个对角线方向
    if (allowDiagonal) {
        directions.push(
            {x: 1, y: -1},  // 右上
            {x: 1, y: 1},   // 右下
            {x: -1, y: 1},  // 左下
            {x: -1, y: -1}  // 左上
        );
    }
    
    // 主循环
    while (openList.length > 0) {
        // 找到开放列表中f值最小的节点
        let currentIndex = 0;
        let currentNode = openList[0];
        
        for (let i = 1; i < openList.length; i++) {
            if (openList[i].f < currentNode.f) {
                currentNode = openList[i];
                currentIndex = i;
            }
        }
        
        // 从开放列表中移除当前节点，并加入关闭列表
        openList.splice(currentIndex, 1);
        closedList.push(currentNode);
        
        // 如果当前节点是终点，回溯路径并返回
        if (currentNode.equals(endNode)) {
            const path = [];
            let current = currentNode;
            
            while (current) {
                path.push({x: current.x, y: current.y});
                current = current.parent;
            }
            
            // 路径需要反转，因为是从终点回溯到起点的
            return path.reverse();
        }
        
        // 检查相邻节点
        for (const dir of directions) {
            const neighborX = currentNode.x + dir.x;
            const neighborY = currentNode.y + dir.y;
            
            // 检查坐标是否有效且可通行
            if (!isValidCoordinate(neighborX, neighborY, mapData) || 
                !isWalkable(neighborX, neighborY, mapData)) {
                continue;
            }
            
            // 创建邻居节点
            const neighbor = new Node(neighborX, neighborY);
            
            // 检查邻居是否在关闭列表中
            let inClosedList = false;
            for (const closedNode of closedList) {
                if (neighbor.equals(closedNode)) {
                    inClosedList = true;
                    break;
                }
            }
            
            if (inClosedList) {
                continue;
            }
            
            // 计算新的g值 (当前节点的g值 + 移动代价)
            // 对角线移动代价为1.414(√2)，垂直/水平移动代价为1
            const moveCost = (dir.x !== 0 && dir.y !== 0) ? 1.414 : 1;
            const tentativeG = currentNode.g + moveCost;
            
            // 检查邻居是否在开放列表中
            let inOpenList = false;
            let openNeighbor = null;
            
            for (const openNode of openList) {
                if (neighbor.equals(openNode)) {
                    inOpenList = true;
                    openNeighbor = openNode;
                    break;
                }
            }
            
            // 如果邻居不在开放列表中，或者找到了更短的路径
            if (!inOpenList || tentativeG < openNeighbor.g) {
                // 确定要更新的节点
                let nodeToUpdate = neighbor;
                
                // 如果不在开放列表中，添加它
                if (!inOpenList) {
                    openList.push(nodeToUpdate);
                } else {
                    // 如果已经在开放列表中，使用已有的节点
                    nodeToUpdate = openNeighbor;
                }
                
                // 更新节点的值
                nodeToUpdate.g = tentativeG;
                // 使用曼哈顿距离作为启发函数
                nodeToUpdate.h = manhattanDistance(nodeToUpdate.x, nodeToUpdate.y, endX, endY);
                nodeToUpdate.f = nodeToUpdate.g + nodeToUpdate.h;
                nodeToUpdate.parent = currentNode;
            }
        }
    }
    
    // 如果开放列表为空，且未找到路径，则无法到达终点
    console.warn("无法找到路径");
    return null;
}

/**
 * 检查坐标是否在地图范围内
 */
function isValidCoordinate(x, y, mapData) {
    return y >= 0 && y < mapData.length && x >= 0 && x < mapData[0].length;
}

/**
 * 检查坐标是否可通行
 */
function isWalkable(x, y, mapData) {
    // TILE_WALL(值为1)是不可通行的，其它类型可通行
    return mapData[y][x] !== TILE_TYPES.WALL;
}

/**
 * 简单的A*测试用例
 * @param {function} logFunction - 用于输出测试结果的函数
 */
function runTests(logFunction = console.log) {
    // 创建一个简单的测试地图
    const testMap = [
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
        [1, 1, 1, 0, 1],
        [0, 0, 0, 0, 0]
    ];
    
    logFunction("A*寻路算法测试:");
    
    // 测试用例1: 直线路径
    const path1 = findPath(0, 0, 4, 0, testMap);
    logFunction("测试1 - 直线路径 (0,0) -> (4,0):");
    logFunction(path1 ? `找到路径，长度: ${path1.length}` : "未找到路径");
    
    // 测试用例2: 绕过障碍物
    const path2 = findPath(0, 0, 2, 2, testMap);
    logFunction("测试2 - 绕过障碍物 (0,0) -> (2,2):");
    logFunction(path2 ? `找到路径，长度: ${path2.length}` : "未找到路径");
    
    // 测试用例3: 无法到达的目标
    const path3 = findPath(0, 0, 3, 3, testMap);
    logFunction("测试3 - 跨越多个障碍 (0,0) -> (3,3):");
    logFunction(path3 ? `找到路径，长度: ${path3.length}` : "未找到路径");
    
    // 测试用例4: 起点和终点相同
    const path4 = findPath(2, 2, 2, 2, testMap);
    logFunction("测试4 - 起点和终点相同 (2,2) -> (2,2):");
    logFunction(path4 ? `找到路径，长度: ${path4.length}` : "未找到路径");
}

// 如果在Node.js环境中，导出函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        findPath,
        manhattanDistance,
        euclideanDistance,
        runTests
    };
} else {
    // 在浏览器环境中，将函数添加到全局对象
    window.findPath = findPath;
    window.manhattanDistance = manhattanDistance;
    window.euclideanDistance = euclideanDistance;
    window.runPathfindingTests = runTests;
}

// 自动运行测试(可以在浏览器控制台查看结果)
if (typeof window !== 'undefined') {
    console.log("A*寻路算法已加载，运行window.runPathfindingTests()可以测试算法");
}