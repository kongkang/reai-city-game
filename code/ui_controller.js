/**
 * UI Controller - 处理游戏UI交互逻辑
 * 与game_v3.js配合使用，提供用户界面事件处理
 */

// 确保DOM加载完成后才执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化UI控制器
    initUIController();
});

/**
 * 初始化UI控制器，设置所有事件监听器
 */
function initUIController() {
    // 1. 设置基本方向控制按钮
    initDirectionControls();
    
    // 2. 设置自定义坐标移动控制
    initCustomMovementControls();
    
    // 3. 设置行为控制
    initActionControls();
    
    // 4. 设置寻路测试按钮
    initPathfindingTests();
    
    // 5. 设置地图点击移动
    initMapClickMovement();
    
    // 6. 设置设置面板控件
    initSettingsPanel();
    
    // 7. 设置状态更新函数
    initStatusUpdates();
    
    console.log('UI控制器初始化完成');
}

/**
 * 初始化方向控制按钮
 */
function initDirectionControls() {
    // 上移动
    const moveUpButton = document.getElementById('move-up');
    if (moveUpButton) {
        moveUpButton.addEventListener('click', function() {
            if (characterState.y > 0) {
                moveCharacter(characterState.x, characterState.y - 1);
            }
        });
    }
    
    // 下移动
    const moveDownButton = document.getElementById('move-down');
    if (moveDownButton) {
        moveDownButton.addEventListener('click', function() {
            if (characterState.y < gameConfig.mapHeight - 1) {
                moveCharacter(characterState.x, characterState.y + 1);
            }
        });
    }
    
    // 左移动
    const moveLeftButton = document.getElementById('move-left');
    if (moveLeftButton) {
        moveLeftButton.addEventListener('click', function() {
            if (characterState.x > 0) {
                moveCharacter(characterState.x - 1, characterState.y);
            }
        });
    }
    
    // 右移动
    const moveRightButton = document.getElementById('move-right');
    if (moveRightButton) {
        moveRightButton.addEventListener('click', function() {
            if (characterState.x < gameConfig.mapWidth - 1) {
                moveCharacter(characterState.x + 1, characterState.y);
            }
        });
    }
}

/**
 * 初始化自定义坐标移动控制
 */
function initCustomMovementControls() {
    const moveButton = document.getElementById('moveButton');
    
    if (moveButton) {
        moveButton.addEventListener('click', function() {
            const targetXInput = document.getElementById('targetX');
            const targetYInput = document.getElementById('targetY');
            
            // 输入验证
            if (!targetXInput || !targetYInput) {
                console.error('找不到坐标输入框');
                return;
            }
            
            // 解析坐标值
            const x = parseInt(targetXInput.value, 10);
            const y = parseInt(targetYInput.value, 10);
            
            // 验证坐标值的有效性
            if (isNaN(x) || isNaN(y)) {
                showErrorMessage('请输入有效的数字坐标');
                return;
            }
            
            // 验证坐标值的范围
            if (x < 0 || y < 0 || x >= gameConfig.mapWidth || y >= gameConfig.mapHeight) {
                showErrorMessage(`请输入有效的坐标范围 (X: 0-${gameConfig.mapWidth-1}, Y: 0-${gameConfig.mapHeight-1})`);
                return;
            }
            
            // 调用移动函数
            moveCharacter(x, y);
            
            // 可选：移动后清空或保留输入框的值
            // targetXInput.value = '';
            // targetYInput.value = '';
        });
    }
}

/**
 * 初始化行为控制
 */
function initActionControls() {
    const setActionButton = document.getElementById('setAction');
    
    if (setActionButton) {
        setActionButton.addEventListener('click', function() {
            const actionInput = document.getElementById('actionDescription');
            
            // 输入验证
            if (!actionInput) {
                console.error('找不到行为描述输入框');
                return;
            }
            
            const action = actionInput.value.trim();
            
            // 验证行为描述不为空
            if (!action) {
                showErrorMessage('请输入行为描述');
                return;
            }
            
            // 设置角色行为
            setCharacterAction(action);
            
            // 可选：清空输入框
            // actionInput.value = '';
        });
    }
    
    // 预设行为按钮
    const actionButtons = document.querySelectorAll('.control-group button[onclick*="setCharacterAction"]');
    actionButtons.forEach(button => {
        const originalOnClick = button.getAttribute('onclick');
        button.removeAttribute('onclick');
        
        button.addEventListener('click', function() {
            // 从原始onclick属性中提取行为描述
            const actionMatch = originalOnClick.match(/setCharacterAction\(['"](.+)['"]\)/);
            if (actionMatch && actionMatch[1]) {
                setCharacterAction(actionMatch[1]);
            }
        });
    });
}

/**
 * 初始化寻路测试按钮
 */
function initPathfindingTests() {
    // 测试1：室外绕行建筑
    const testPath1Button = document.getElementById('test-path1');
    if (testPath1Button) {
        testPath1Button.addEventListener('click', function() {
            runPathTest(3, 12, 18, 3);
        });
    }
    
    // 测试2：穿过多个房间
    const testPath2Button = document.getElementById('test-path2');
    if (testPath2Button) {
        testPath2Button.addEventListener('click', function() {
            runPathTest(5, 5, 14, 4);
        });
    }
    
    // 测试3：长距离寻路
    const testPath3Button = document.getElementById('test-path3');
    if (testPath3Button) {
        testPath3Button.addEventListener('click', function() {
            runPathTest(2, 2, 18, 18);
        });
    }
    
    // 停止移动按钮
    const stopMovementButton = document.getElementById('stop-movement');
    if (stopMovementButton) {
        stopMovementButton.addEventListener('click', function() {
            stopCharacterMovement();
            setCharacterAction("我停下来了");
            updateAllStatus();
        });
    }
}

/**
 * 运行寻路测试
 * @param {number} startX - 起始X坐标
 * @param {number} startY - 起始Y坐标
 * @param {number} endX - 目标X坐标
 * @param {number} endY - 目标Y坐标
 */
function runPathTest(startX, startY, endX, endY) {
    // 先移动到起点（不使用寻路）
    stopCharacterMovement();
    const originalPathfinding = gameConfig.pathfindingEnabled;
    gameConfig.pathfindingEnabled = false;
    moveCharacter(startX, startY);
    
    // 短暂延迟后，启用寻路并移动到目标点
    setTimeout(() => {
        gameConfig.pathfindingEnabled = originalPathfinding;
        moveCharacter(endX, endY);
    }, 500);
}

/**
 * 初始化地图点击移动
 */
function initMapClickMovement() {
    const gameMap = document.getElementById('game-map');
    
    if (gameMap) {
        gameMap.addEventListener('click', function(event) {
            // 获取点击位置相对于地图的坐标
            const rect = this.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            // 将像素坐标转换为图块坐标
            const tileX = Math.floor(x / gameConfig.tileSize);
            const tileY = Math.floor(y / gameConfig.tileSize);
            
            // 验证坐标有效性并移动角色
            if (tileX >= 0 && tileX < gameConfig.mapWidth && 
                tileY >= 0 && tileY < gameConfig.mapHeight) {
                
                // 更新坐标输入框（如果存在）
                const targetXInput = document.getElementById('targetX');
                const targetYInput = document.getElementById('targetY');
                
                if (targetXInput) targetXInput.value = tileX;
                if (targetYInput) targetYInput.value = tileY;
                
                // 移动角色
                moveCharacter(tileX, tileY);
            }
        });
    }
}

/**
 * 初始化设置面板控件
 */
function initSettingsPanel() {
    // A*寻路开关
    const pathfindingToggle = document.getElementById('toggle-pathfinding');
    if (pathfindingToggle) {
        pathfindingToggle.addEventListener('click', function() {
            const newState = !gameConfig.pathfindingEnabled;
            togglePathfinding(newState);
            this.classList.toggle('active', newState);
        });
    }
    
    // 路径可视化开关
    const pathVisToggle = document.getElementById('toggle-path-visualization');
    if (pathVisToggle) {
        pathVisToggle.addEventListener('click', function() {
            const newState = !gameConfig.showPath;
            togglePathVisualization(newState);
            this.classList.toggle('active', newState);
        });
    }
    
    // 动画速度滑块
    const speedSlider = document.getElementById('animation-speed');
    const speedValue = document.getElementById('speed-value');
    if (speedSlider && speedValue) {
        speedSlider.addEventListener('input', function() {
            const newSpeed = parseInt(this.value);
            setPathAnimationSpeed(newSpeed);
            speedValue.textContent = `${newSpeed}ms`;
        });
    }
}

/**
 * 初始化状态更新函数
 */
function initStatusUpdates() {
    // 扩展moveCharacterToPosition函数以更新状态显示
    if (typeof window.moveCharacterToPosition === 'function') {
        const originalMoveCharacterToPosition = window.moveCharacterToPosition;
        window.moveCharacterToPosition = function(x, y) {
            const result = originalMoveCharacterToPosition(x, y);
            updateAllStatus();
            return result;
        };
    }
    
    // 扩展setCharacterAction函数以更新状态显示
    if (typeof window.setCharacterAction === 'function') {
        const originalSetCharacterAction = window.setCharacterAction;
        window.setCharacterAction = function(action) {
            const result = originalSetCharacterAction(action);
            updateCharacterStatus();
            return result;
        };
    }
    
    // 初始更新一次状态
    setTimeout(updateAllStatus, 500);
    
    // 定期更新路径状态
    setInterval(updatePathStats, 100);
}

/**
 * 更新所有状态显示
 */
function updateAllStatus() {
    updateCharacterStatus();
    updatePathStats();
}

/**
 * 更新角色状态显示
 */
function updateCharacterStatus() {
    const statusElement = document.getElementById('characterStatus');
    if (!statusElement) return;
    
    const tileType = window.getTileTypeName ? 
        window.getTileTypeName(characterState.x, characterState.y) : "未知";
    
    const action = characterState.action || '空闲';
    statusElement.textContent = `当前状态: X:${characterState.x}, Y:${characterState.y}, 图块:${tileType}, Action: ${action}`;
}

/**
 * 更新寻路信息显示
 */
function updatePathStats() {
    const pathStats = document.getElementById('path-stats');
    if (!pathStats) return;
    
    if (characterState.isMoving && characterState.currentPath) {
        const pathLength = characterState.currentPath.length;
        const currentIndex = characterState.pathIndex;
        const progress = Math.floor((currentIndex / (pathLength - 1)) * 100);
        
        pathStats.textContent = `路径信息: 从(${characterState.currentPath[0].x},${characterState.currentPath[0].y})到(${characterState.targetX},${characterState.targetY}) - 进度: ${progress}% - 总步数: ${pathLength}`;
    } else if (characterState.currentPath) {
        pathStats.textContent = `路径信息: 路径已完成 - 总步数: ${characterState.currentPath.length}`;
    } else {
        pathStats.textContent = '路径信息: 尚未生成路径';
    }
}

/**
 * 显示错误消息
 * @param {string} message - 错误消息
 */
function showErrorMessage(message) {
    alert(message);
    
    // 可选：使用更好的错误消息显示方式
    console.error(message);
}

// 导出函数（如果在模块环境中使用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initUIController,
        updateCharacterStatus,
        updatePathStats
    };
}