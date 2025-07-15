# Proxy Agent CLI

一个简单的跨平台命令行工具，可以快速启动一个已启用代理的、隔离的终端会话。

当您临时需要为某些命令（如 `gemini`、`npm`、`curl`）使用代理，但又不想影响系统的全局代理设置时，这个工具非常有用。

## 特性

- **一键启动**: 只需一个命令 (`agent start`) 即可开启一个配置好代理的新终端。
- **环境隔离**: 代理设置仅在新的终端会话中生效，关闭窗口后即失效，不会污染您当前的或其他任何终端的环境。
- **跨平台**: 支持 Windows 和 macOS。
- **简单易用**: 命令清晰，操作直观。

## 安装

1.  **全局安装**:
    在项目根目录下，运行以下命令来将 `agent` 命令安装到您的系统中，使其可以在任何地方使用。
    ```bash
    npm i @yoloseeyou/proxy-agent
    ```
    _注意：在 macOS 或 Linux 上，您可能需要添加 `sudo` 前缀: `sudo npm install -g .`_

## 使用方法

### 主要流程

这是最推荐和最简单的使用方式。

**第一步：设置您的代理服务器地址**

这个地址只需要设置一次，工具会将其保存在您的用户主目录下的一个配置文件中 (`~/.proxy-agent.json`)。

```bash
agent set http://127.0.0.1:7890
```

_请将 `http://127.0.0.1:7890` 替换为您自己的代理地址。_

**第二步：启动一个带代理的终端**

运行以下命令：

```bash
agent start
```

这会立即弹出一个**新的终端窗口**。在这个新窗口中，`http_proxy` 和 `https_proxy` 环境变量已经为您自动设置好了。您可以在此窗口中直接运行任何需要代理的命令。

### 其他命令

**查看当前状态**

检查当前保存的代理地址是什么。

```bash
agent status
```

---

## 高级用法

如果您不想启动一个新窗口，而是想在**当前**的终端会话中应用代理，可以使用 `on` 和 `off` 命令。

**请注意：** 由于程序无法直接修改其父级 Shell 的环境，您需要使用特定的语法来执行 `agent` 命令的输出。

**在当前会话中启用代理:**

- **Windows (CMD):**
  ```cmd
  FOR /f "tokens=*" %i IN ('agent on') DO %i
  ```
- **Windows (PowerShell):**
  ```powershell
  agent on | Invoke-Expression
  ```
- **macOS / Linux (bash, zsh):**
  ```bash
  eval $(agent on)
  ```

**在当前会話中禁用代理:**

- **Windows (CMD):**
  ```cmd
  FOR /f "tokens=*" %i IN ('agent off') DO %i
  ```
- **Windows (PowerShell):**
  ```powershell
  agent off | Invoke-Expression
  ```
- **macOS / Linux (bash, zsh):**
  ```bash
  eval $(agent off)
  ```

## 许可证

[MIT](LICENSE)
