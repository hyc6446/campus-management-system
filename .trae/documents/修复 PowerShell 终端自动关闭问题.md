## 问题分析

PowerShell 终端显示 "Active code page: 65001" 后自动关闭，可能的原因：

1. **执行策略过于严格**：阻止了 PowerShell 命令执行
2. **配置文件损坏**：`$PROFILE` 文件存在语法错误
3. **终端启动命令冲突**：Trae-CN 终端配置的启动命令有问题
4. **环境变量问题**：PowerShell 相关环境变量配置错误
5. **权限问题**：用户权限不足

## 修复方案

### 步骤 1：检查并修改 PowerShell 执行策略

1. **以管理员身份运行命令提示符**
2. **执行命令**：
   ```cmd
   powershell -ExecutionPolicy Bypass -Command "Set-ExecutionPolicy RemoteSigned -Scope CurrentUser"
   ```
3. **验证执行策略**：
   ```cmd
   powershell -ExecutionPolicy Bypass -Command "Get-ExecutionPolicy"
   ```

### 步骤 2：修复或重建 PowerShell 配置文件

1. **检查配置文件是否存在**：
   ```cmd
   powershell -ExecutionPolicy Bypass -Command "Test-Path $PROFILE"
   ```

2. **备份并重建配置文件**：
   ```cmd
   powershell -ExecutionPolicy Bypass -Command "if (Test-Path $PROFILE) { Rename-Item $PROFILE $PROFILE.bak }"
   powershell -ExecutionPolicy Bypass -Command "New-Item -ItemType File -Path $PROFILE -Force"
   ```

### 步骤 3：修改 Trae-CN 终端配置

更新 `.vscode/settings.json` 文件，简化终端启动命令：

```json
{
  "typescript.tsdk": "node_modules\\typescript\\lib",
  "prisma.pinToPrisma6": true,
  "terminal.integrated.encoding": "utf8",
  "terminal.integrated.defaultProfile.windows": "PowerShell",
  "terminal.integrated.profiles.windows": {
    "PowerShell": {
      "source": "PowerShell",
      "args": [
        "-ExecutionPolicy",
        "Bypass"
      ]
    }
  }
}
```

### 步骤 4：验证修复效果

1. **重启 Trae-CN 编辑器**
2. **打开新终端**：`Ctrl + ``
3. **测试基本命令**：
   ```powershell
   echo "PowerShell is working"
   Get-ExecutionPolicy
   ```

### 步骤 5：备选方案 - 使用 cmd 终端

如果 PowerShell 问题无法解决，临时使用 cmd 终端：

```json
{
  "terminal.integrated.defaultProfile.windows": "Command Prompt",
  "terminal.integrated.profiles.windows": {
    "Command Prompt": {
      "source": "Command Prompt",
      "args": ["/k", "chcp 65001"]
    }
  }
}
```

## 预期效果

修复后，PowerShell 终端应该能够正常启动并保持打开状态，不再出现自动关闭的问题。用户可以正常执行 npm 命令、git 命令等开发操作。