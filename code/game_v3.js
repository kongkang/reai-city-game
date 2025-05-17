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
    tileSize: 32,  // 每个图块32像素
    pathfindingEnabled: true, // 是否启用A*寻路
    pathAnimationSpeed: 200,  // 路径动画速度(毫秒)
    showPath: true            // 是否显示路径
};

// 角色状态
let characterState = {
    x: 0,
    y: 0,
    action: '',
    // 与路径相关的状态
    isMoving: false,       // 角色是否正在移动
    currentPath: null,     // 当前路径
    pathIndex: 0,          // 当前路径索引
    moveInterval: null,    // 移动定时器
    targetX: null,         // 目标X坐标
    targetY: null          // 目标Y坐标
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
    
    // 创建一个文档片段以提高性能
    const fragment = document.createDocumentFragment();
    
    // 仅在有地图数据时渲染
    if (currentMapData && currentMapData.length > 0) {
        for (let y = 0; y < currentMapData.length; y++) {
            for (let x = 0; x < currentMapData[y].length; x++) {
                const tileType = currentMapData[y][x];
                const tile = document.createElement('div');
                tile.className = 'map-tile';
                
                // 根据图块类型添加特定的CSS类
                switch (tileType) {
                    case TILE_TYPES.GRASS:
                        tile.classList.add('tile-grass');
                        break;
                    case TILE_TYPES.WALL:
                        tile.classList.add('tile-wall');
                        break;
                    case TILE_TYPES.DOOR:
                        tile.classList.add('tile-door');
                        break;
                    case TILE_TYPES.INDOOR_FLOOR:
                        tile.classList.add('tile-indoor-floor');
                        break;
                    default:
                        tile.classList.add('tile-grass'); // 默认为草地
                }
                
                // 设置图块位置
                tile.style.left = `${x * gameConfig.tileSize}px`;
                tile.style.top = `${y * gameConfig.tileSize}px`;
                
                // 将图块添加到文档片段
                fragment.appendChild(tile);
            }
        }
        
        // 一次性将所有图块添加到地图
        gameMap.appendChild(fragment);
    }
    
    console.log(`地图已渲染，大小: ${currentMapData.length}x${currentMapData[0].length}`);
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

// 停止角色的移动动画
function stopCharacterMovement() {
    if (characterState.moveInterval) {
        clearInterval(characterState.moveInterval);
        characterState.moveInterval = null;
    }
    characterState.isMoving = false;
    characterState.currentPath = null;
    characterState.pathIndex = 0;
    clearPathVisualization();
}

// 执行角色移动到特定位置
function moveCharacterToPosition(tileX, tileY) {
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
}

// 显示路径可视化
function visualizePath(path) {
    if (!gameConfig.showPath || !path || path.length === 0) {
        return;
    }
    
    // 先清除现有的路径可视化
    clearPathVisualization();
    
    // 创建一个包含路径点的容器
    const gameMap = document.getElementById('game-map');
    const pathContainer = document.createElement('div');
    pathContainer.id = 'path-visualization';
    pathContainer.style.position = 'absolute';
    pathContainer.style.top = '0';
    pathContainer.style.left = '0';
    pathContainer.style.width = '100%';
    pathContainer.style.height = '100%';
    pathContainer.style.pointerEvents = 'none'; // 确保路径点不会阻止点击事件
    gameMap.appendChild(pathContainer);
    
    // 为每个路径点创建一个可视元素 (跳过起点和终点)
    for (let i = 1; i < path.length - 1; i++) {
        const point = path[i];
        const pathPoint = document.createElement('div');
        pathPoint.className = 'path-point';
        pathPoint.style.position = 'absolute';
        
        // 将路径点放在图块中央
        const pointX = point.x * gameConfig.tileSize + gameConfig.tileSize / 2;
        const pointY = point.y * gameConfig.tileSize + gameConfig.tileSize / 2;
        
        pathPoint.style.left = `${pointX - 4}px`; // 假设路径点大小为8px
        pathPoint.style.top = `${pointY - 4}px`;
        pathPoint.style.width = '8px';
        pathPoint.style.height = '8px';
        pathPoint.style.backgroundColor = 'rgba(0, 100, 255, 0.7)';
        pathPoint.style.borderRadius = '50%';
        pathPoint.style.zIndex = '1000';
        
        pathContainer.appendChild(pathPoint);
    }
}

// 清除路径可视化
function clearPathVisualization() {
    const pathContainer = document.getElementById('path-visualization');
    if (pathContainer) {
        pathContainer.remove();
    }
}

// 新的移动角色函数，使用A*寻路
function moveCharacter(targetX, targetY) {
    // 如果角色已经在移动中，停止当前移动
    if (characterState.isMoving) {
        stopCharacterMovement();
    }
    
    // 存储目标坐标
    characterState.targetX = targetX;
    characterState.targetY = targetY;
    
    // 验证目标坐标是否在地图范围内且可通行
    if (!isTileWalkable(targetX, targetY)) {
        console.warn(`移动失败: 图块 (${targetX}, ${targetY}) 不可通行!`);
        return false;
    }
    
    // 如果起点和终点相同，无需移动
    if (characterState.x === targetX && characterState.y === targetY) {
        console.log(`角色已经在目标位置 (${targetX}, ${targetY})`);
        return true;
    }
    
    // 如果启用了A*寻路
    if (gameConfig.pathfindingEnabled && typeof findPath === 'function') {
        // 使用A*寻路算法计算路径
        const path = findPath(characterState.x, characterState.y, targetX, targetY, currentMapData);
        
        // 如果找到路径
        if (path && path.length > 0) {
            console.log(`找到从 (${characterState.x}, ${characterState.y}) 到 (${targetX}, ${targetY}) 的路径，长度: ${path.length}`);
            characterState.currentPath = path;
            characterState.pathIndex = 0;
            characterState.isMoving = true;
            
            // 显示路径可视化
            visualizePath(path);
            
            // 设置合适的角色行为
            if (path.length > 5) {
                setCharacterAction("我要到那边去");
            }
            
            // 开始路径动画
            characterState.moveInterval = setInterval(() => {
                // 如果到达终点或停止移动
                if (characterState.pathIndex >= path.length - 1 || !characterState.isMoving) {
                    stopCharacterMovement();
                    return;
                }
                
                // 移动到路径上的下一个点
                characterState.pathIndex++;
                const nextPoint = path[characterState.pathIndex];
                moveCharacterToPosition(nextPoint.x, nextPoint.y);
                
                // 如果到达终点
                if (characterState.pathIndex >= path.length - 1) {
                    console.log(`已到达目标位置 (${targetX}, ${targetY})`);
                    setCharacterAction("我到了！");
                    stopCharacterMovement();
                }
            }, gameConfig.pathAnimationSpeed);
            
            return true;
        } else {
            console.warn(`无法找到从 (${characterState.x}, ${characterState.y}) 到 (${targetX}, ${targetY}) 的路径`);
            setCharacterAction("我无法到达那里！");
            return false;
        }
    } else {
        // 如果未启用A*寻路，直接移动到目标位置（与原版逻辑相同）
        console.log(`A*寻路未启用，直接移动到目标位置 (${targetX}, ${targetY})`);
        moveCharacterToPosition(targetX, targetY);
        return true;
    }
}

// 设置角色行为并更新气泡
function setCharacterAction(actionDescription) {
    // 更新角色状态
    characterState.action = actionDescription;
    
    // 获取或创建行为气泡容器
    let actionBubbleContainer = document.getElementById('action-bubble-container');
    if (!actionBubbleContainer) {
        const character = document.getElementById('character');
        if (!character) {
            console.warn('找不到character元素');
            return;
        }
        
        // 创建气泡容器
        actionBubbleContainer = document.createElement('div');
        actionBubbleContainer.id = 'action-bubble-container';
        character.appendChild(actionBubbleContainer);
        
        // 创建气泡元素
        const actionBubble = document.createElement('div');
        actionBubble.id = 'action-bubble';
        actionBubbleContainer.appendChild(actionBubble);
    }
    
    // 更新行为气泡
    const actionBubble = document.getElementById('action-bubble');
    if (!actionBubble) {
        console.warn('找不到action-bubble元素');
        return;
    }
    
    actionBubble.textContent = actionDescription;
    
    // 显示气泡
    actionBubble.style.display = 'block';
    
    // 3秒后隐藏气泡
    setTimeout(() => {
        actionBubble.style.display = 'none';
    }, 3000);
    
    console.log(`角色行为: ${actionDescription}`);
}

// 切换寻路功能
function togglePathfinding(enabled) {
    gameConfig.pathfindingEnabled = enabled;
    console.log(`A*寻路已${enabled ? '启用' : '禁用'}`);
    return gameConfig.pathfindingEnabled;
}

// 设置路径动画速度
function setPathAnimationSpeed(speed) {
    if (speed > 0) {
        gameConfig.pathAnimationSpeed = speed;
        console.log(`路径动画速度已设置为 ${speed}ms`);
    }
    return gameConfig.pathAnimationSpeed;
}

// 切换路径可视化
function togglePathVisualization(show) {
    gameConfig.showPath = show;
    
    if (!show) {
        clearPathVisualization();
    } else if (characterState.currentPath) {
        visualizePath(characterState.currentPath);
    }
    
    console.log(`路径可视化已${show ? '启用' : '禁用'}`);
    return gameConfig.showPath;
}

// 当窗口加载时初始化游戏
window.onload = function() {
    // 如果引入了外部地图数据，使用它
    const mapToUse = window.sampleMapData || [];
    const mapWidth = mapToUse.length > 0 ? mapToUse[0].length : 20;
    const mapHeight = mapToUse.length || 20;
    
    initializeMap(mapWidth, mapHeight, 32, mapToUse);
    
    // 添加CSS样式到文档头部
    const style = document.createElement('style');
    style.textContent = `
        .path-point {
            transition: opacity 0.3s ease;
            animation: pulse 1.5s infinite alternate;
        }
        
        @keyframes pulse {
            0% { transform: scale(0.8); opacity: 0.7; }
            100% { transform: scale(1.2); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // 找到一个可通行的起始位置
    let startX = 0, startY = 0;
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
    
    // 移动角色到起始位置（不使用寻路，直接设置位置）
    gameConfig.pathfindingEnabled = false;
    moveCharacter(startX, startY);
    gameConfig.pathfindingEnabled = true;
    
    // 初始化行为气泡
    setCharacterAction("我在探索这个小镇");
    
    // 显示地图渲染统计
    console.log(`地图渲染完成：${mapWidth}x${mapHeight} 图块`);
};

// 全局暴露函数
window.moveCharacter = moveCharacter;
window.setCharacterAction = setCharacterAction;
window.initializeMap = initializeMap;
window.renderMap = renderMap;
window.isTileWalkable = isTileWalkable;
window.getTileTypeName = getTileTypeName;
window.stopCharacterMovement = stopCharacterMovement;
window.togglePathfinding = togglePathfinding;
window.setPathAnimationSpeed = setPathAnimationSpeed;
window.togglePathVisualization = togglePathVisualization;