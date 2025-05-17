// 图块类型常量 (如果没有从map_data_v2.js导入)
const TILE_TYPES = {
    GRASS: 0,          // 可通行的草地
    WALL: 1,           // 障碍物/墙壁
    DOOR: 2,           // 房屋入口 (可通行)
    INDOOR_FLOOR: 3    // 室内地板 (可通行)
};

// 游戏配置
let gameConfig = {
    mapWidth: 20, // 地图宽度(图块)
    mapHeight: 20, // 地图高度(图块)
    tileSize: 32  // 每个图块32像素
};

// 角色状态
let characterState = {
    x: 0,
    y: 0,
    action: ''
};

// 默认使用sampleMapData中的地图数据
let currentMapData = window.sampleMapData || [];

// 初始化地图
function initializeMap(width, height, tileSize, mapData) {
    gameConfig.mapWidth = width;
    gameConfig.mapHeight = height;
    gameConfig.tileSize = tileSize;
    
    if (mapData) {
        currentMapData = mapData;
    }
    
    const gameMap = document.getElementById('game-map');
    gameMap.style.width = `${width * tileSize}px`;
    gameMap.style.height = `${height * tileSize}px`;
    
    // 如果存在地图数据，可以视觉化渲染
    renderMap();
    
    console.log(`地图已初始化: ${width}x${height} 图块, 每个图块 ${tileSize}px`);
}

// 渲染地图
function renderMap() {
    // 清除现有的地图图块
    const gameMap = document.getElementById('game-map');
    const existingTiles = gameMap.querySelectorAll('.map-tile');
    existingTiles.forEach(tile => tile.remove());
    
    // 仅在有地图数据时渲染
    if (currentMapData && currentMapData.length > 0) {
        for (let y = 0; y < currentMapData.length; y++) {
            for (let x = 0; x < currentMapData[y].length; x++) {
                const tileType = currentMapData[y][x];
                const tile = document.createElement('div');
                tile.className = 'map-tile';
                tile.style.position = 'absolute';
                tile.style.left = `${x * gameConfig.tileSize}px`;
                tile.style.top = `${y * gameConfig.tileSize}px`;
                tile.style.width = `${gameConfig.tileSize}px`;
                tile.style.height = `${gameConfig.tileSize}px`;
                
                // 根据图块类型设置样式
                switch (tileType) {
                    case TILE_TYPES.GRASS:
                        tile.style.backgroundColor = '#a6d785'; // 草地颜色
                        break;
                    case TILE_TYPES.WALL:
                        tile.style.backgroundColor = '#8c6f5c'; // 墙壁颜色
                        break;
                    case TILE_TYPES.DOOR:
                        tile.style.backgroundColor = '#b88b4a'; // 门的颜色
                        break;
                    case TILE_TYPES.INDOOR_FLOOR:
                        tile.style.backgroundColor = '#d9c49e'; // 室内地板颜色
                        break;
                    default:
                        tile.style.backgroundColor = '#a6d785'; // 默认为草地
                }
                
                // 将图块添加到地图
                gameMap.appendChild(tile);
            }
        }
    }
}

// 检查图块是否可通行
function isTileWalkable(tileX, tileY) {
    // 检查坐标是否在地图范围内
    if (tileX < 0 || tileX >= gameConfig.mapWidth || 
        tileY < 0 || tileY >= gameConfig.mapHeight) {
        return false;
    }
    
    // 检查地图数据是否存在
    if (!currentMapData || !currentMapData[tileY] || currentMapData[tileY][tileX] === undefined) {
        return true; // 如果没有地图数据，默认可通行
    }
    
    // 检查图块类型是否可通行
    // GRASS, DOOR 和 INDOOR_FLOOR 可通行，WALL 不可通行
    const tileType = currentMapData[tileY][tileX];
    return tileType !== TILE_TYPES.WALL;
}

// 获取图块类型名称（用于调试）
function getTileTypeName(tileX, tileY) {
    if (tileX < 0 || tileX >= gameConfig.mapWidth || 
        tileY < 0 || tileY >= gameConfig.mapHeight ||
        !currentMapData || !currentMapData[tileY]) {
        return "未知";
    }
    
    const tileType = currentMapData[tileY][tileX];
    switch(tileType) {
        case TILE_TYPES.GRASS: return "草地";
        case TILE_TYPES.WALL: return "墙壁";
        case TILE_TYPES.DOOR: return "门";
        case TILE_TYPES.INDOOR_FLOOR: return "室内地板";
        default: return "未知";
    }
}

// 移动角色到特定图块
function moveCharacter(tileX, tileY) {
    // 验证坐标是否在地图范围内且可通行
    if (!isTileWalkable(tileX, tileY)) {
        console.warn(`移动失败: 图块 (${tileX}, ${tileY}) 不可通行!`);
        return false;
    }
    
    // 更新角色状态
    characterState.x = tileX;
    characterState.y = tileY;
    
    // 计算像素位置（在图块中居中）
    const pixelX = tileX * gameConfig.tileSize + (gameConfig.tileSize - 16) / 2;
    const pixelY = tileY * gameConfig.tileSize + (gameConfig.tileSize - 16) / 2;
    
    // 更新角色位置
    const character = document.getElementById('character');
    character.style.left = `${pixelX}px`;
    character.style.top = `${pixelY}px`;
    
    // 检查角色站在什么类型的图块上
    if (currentMapData && currentMapData[tileY]) {
        const currentTileType = currentMapData[tileY][tileX];
        const tileTypeName = getTileTypeName(tileX, tileY);
        
        if (currentTileType === TILE_TYPES.DOOR) {
            console.log(`角色站在门口，可以进入或离开建筑物`);
            // 这里可以添加进入/离开建筑物的逻辑
        } else if (currentTileType === TILE_TYPES.INDOOR_FLOOR) {
            console.log(`角色在室内`);
            // 这里可以添加室内特定逻辑
        }
        
        console.log(`角色站在 ${tileTypeName} 上`);
    }
    
    console.log(`角色移动到图块 (${tileX}, ${tileY}), 像素位置 (${pixelX}, ${pixelY})`);
    return true;
}

// 设置角色行为并更新气泡
function setCharacterAction(actionDescription) {
    // 更新角色状态
    characterState.action = actionDescription;
    
    // 更新行为气泡
    const actionBubble = document.getElementById('action-bubble');
    actionBubble.textContent = actionDescription;
    
    // 显示气泡
    actionBubble.style.display = 'block';
    
    // 3秒后隐藏气泡
    setTimeout(() => {
        actionBubble.style.display = 'none';
    }, 3000);
    
    console.log(`角色行为: ${actionDescription}`);
}

// 当窗口加载时初始化游戏
window.onload = function() {
    // 如果引入了外部地图数据，使用它
    const mapToUse = window.sampleMapData || [];
    const mapWidth = mapToUse.length > 0 ? mapToUse[0].length : 20;
    const mapHeight = mapToUse.length || 20;
    
    initializeMap(mapWidth, mapHeight, 32, mapToUse);
    
    // 找到一个可通行的起始位置
    let startX = 0, startY = 0;
    // 优先尝试找门或室内地板作为起点
    let foundSpecialTile = false;
    
    // 第一轮：尝试找门
    for (let y = 0; y < mapHeight && !foundSpecialTile; y++) {
        for (let x = 0; x < mapWidth; x++) {
            if (currentMapData[y] && currentMapData[y][x] === TILE_TYPES.DOOR) {
                startX = x;
                startY = y;
                foundSpecialTile = true;
                break;
            }
        }
    }
    
    // 第二轮：如果没找到门，尝试找任何可通行的图块
    if (!foundSpecialTile) {
        for (let y = 0; y < mapHeight; y++) {
            for (let x = 0; x < mapWidth; x++) {
                if (isTileWalkable(x, y)) {
                    startX = x;
                    startY = y;
                    foundSpecialTile = true;
                    break;
                }
            }
            if (foundSpecialTile) break;
        }
    }
    
    moveCharacter(startX, startY);
    setCharacterAction("我在探索这个小镇");
};

// 全局暴露函数
window.moveCharacter = moveCharacter;
window.setCharacterAction = setCharacterAction;
window.initializeMap = initializeMap;
window.renderMap = renderMap;
window.isTileWalkable = isTileWalkable;
window.getTileTypeName = getTileTypeName;