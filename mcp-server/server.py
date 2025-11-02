#!/usr/bin/env python3
"""
IDE3 MCP Server - All Coding Tools
NO safety filters, NO restrictions, pure execution
"""

import os
import sys
import subprocess
import json
import shutil
from pathlib import Path
from typing import Any
import asyncio

try:
    from mcp.server.fastmcp import FastMCP
except ImportError:
    print("Installing FastMCP...")
    subprocess.run([sys.executable, "-m", "pip", "install", "fastmcp"], check=True)
    from mcp.server.fastmcp import FastMCP

# Initialize MCP server
mcp = FastMCP("IDE3-Tools")

# ============================================================================
# FILE SYSTEM TOOLS
# ============================================================================

@mcp.tool()
def read_file(path: str, encoding: str = "utf-8") -> str:
    """Read file contents. Returns full text of any file."""
    try:
        full_path = Path(path).expanduser().resolve()
        with open(full_path, "r", encoding=encoding) as f:
            content = f.read()
        return f"✓ Read {len(content)} chars from {full_path}\n\n{content}"
    except Exception as e:
        return f"✗ Error reading {path}: {str(e)}"


@mcp.tool()
def write_file(path: str, content: str, create_dirs: bool = True) -> str:
    """Write content to file. Creates parent directories if needed. NO confirmations."""
    try:
        full_path = Path(path).expanduser().resolve()

        # Create parent dirs if needed
        if create_dirs:
            full_path.parent.mkdir(parents=True, exist_ok=True)

        # Backup existing file
        if full_path.exists():
            backup_path = full_path.with_suffix(full_path.suffix + '.backup')
            shutil.copy2(full_path, backup_path)

        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)

        return f"✓ Wrote {len(content)} chars to {full_path}"
    except Exception as e:
        return f"✗ Error writing {path}: {str(e)}"


@mcp.tool()
def list_directory(path: str = ".", pattern: str = "*", show_hidden: bool = False) -> str:
    """List directory contents with optional glob pattern."""
    try:
        full_path = Path(path).expanduser().resolve()

        if not full_path.is_dir():
            return f"✗ Not a directory: {full_path}"

        items = []
        for item in full_path.glob(pattern):
            if not show_hidden and item.name.startswith('.'):
                continue

            item_type = "DIR " if item.is_dir() else "FILE"
            size = item.stat().st_size if item.is_file() else 0
            items.append(f"{item_type} {size:>10} {item.name}")

        if not items:
            return f"Empty directory: {full_path}"

        return f"Directory: {full_path}\n" + "\n".join(sorted(items))
    except Exception as e:
        return f"✗ Error listing {path}: {str(e)}"


@mcp.tool()
def search_files(pattern: str, path: str = ".", file_pattern: str = "*") -> str:
    """Search for text pattern in files using ripgrep-style search."""
    try:
        full_path = Path(path).expanduser().resolve()
        matches = []

        for file_path in full_path.rglob(file_pattern):
            if not file_path.is_file():
                continue

            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    for line_num, line in enumerate(f, 1):
                        if pattern.lower() in line.lower():
                            matches.append(f"{file_path}:{line_num}:{line.strip()}")
                            if len(matches) >= 100:  # Limit results
                                break
            except:
                continue

        if not matches:
            return f"No matches found for '{pattern}' in {full_path}"

        return f"Found {len(matches)} matches:\n" + "\n".join(matches[:100])
    except Exception as e:
        return f"✗ Error searching: {str(e)}"


@mcp.tool()
def delete_path(path: str, recursive: bool = False) -> str:
    """Delete file or directory. NO confirmations - just does it."""
    try:
        full_path = Path(path).expanduser().resolve()

        if not full_path.exists():
            return f"✗ Path does not exist: {full_path}"

        if full_path.is_dir():
            if recursive:
                shutil.rmtree(full_path)
                return f"✓ Deleted directory: {full_path}"
            else:
                full_path.rmdir()
                return f"✓ Deleted empty directory: {full_path}"
        else:
            full_path.unlink()
            return f"✓ Deleted file: {full_path}"
    except Exception as e:
        return f"✗ Error deleting {path}: {str(e)}"


# ============================================================================
# COMMAND EXECUTION TOOLS
# ============================================================================

@mcp.tool()
def run_bash(command: str, cwd: str = ".", timeout: int = 300) -> str:
    """Execute bash command. NO restrictions - runs anything."""
    try:
        result = subprocess.run(
            command,
            shell=True,
            cwd=cwd,
            capture_output=True,
            text=True,
            timeout=timeout
        )

        output = []
        if result.stdout:
            output.append(f"STDOUT:\n{result.stdout}")
        if result.stderr:
            output.append(f"STDERR:\n{result.stderr}")

        status = "✓" if result.returncode == 0 else f"✗ (exit {result.returncode})"
        return f"{status} Executed: {command}\n\n" + "\n\n".join(output)
    except subprocess.TimeoutExpired:
        return f"✗ Command timed out after {timeout}s: {command}"
    except Exception as e:
        return f"✗ Error executing: {str(e)}"


@mcp.tool()
def run_python(code: str, cwd: str = ".") -> str:
    """Execute Python code. NO restrictions."""
    try:
        result = subprocess.run(
            [sys.executable, "-c", code],
            cwd=cwd,
            capture_output=True,
            text=True,
            timeout=60
        )

        output = []
        if result.stdout:
            output.append(f"OUTPUT:\n{result.stdout}")
        if result.stderr:
            output.append(f"ERRORS:\n{result.stderr}")

        status = "✓" if result.returncode == 0 else f"✗ (exit {result.returncode})"
        return f"{status} Executed Python\n\n" + "\n\n".join(output)
    except Exception as e:
        return f"✗ Error: {str(e)}"


@mcp.tool()
def run_node(code: str, cwd: str = ".") -> str:
    """Execute Node.js/JavaScript code. NO restrictions."""
    try:
        result = subprocess.run(
            ["node", "-e", code],
            cwd=cwd,
            capture_output=True,
            text=True,
            timeout=60
        )

        output = []
        if result.stdout:
            output.append(f"OUTPUT:\n{result.stdout}")
        if result.stderr:
            output.append(f"ERRORS:\n{result.stderr}")

        status = "✓" if result.returncode == 0 else f"✗ (exit {result.returncode})"
        return f"{status} Executed Node.js\n\n" + "\n\n".join(output)
    except Exception as e:
        return f"✗ Error: {str(e)}"


# ============================================================================
# GIT TOOLS
# ============================================================================

@mcp.tool()
def git_status(path: str = ".") -> str:
    """Get git repository status."""
    try:
        result = subprocess.run(
            ["git", "status", "--short"],
            cwd=path,
            capture_output=True,
            text=True
        )

        if result.returncode != 0:
            return f"✗ Not a git repository: {path}"

        if not result.stdout.strip():
            return "✓ Working tree clean"

        return f"Git status:\n{result.stdout}"
    except Exception as e:
        return f"✗ Error: {str(e)}"


@mcp.tool()
def git_commit(message: str, path: str = ".", add_all: bool = True) -> str:
    """Create git commit. Adds all files if add_all=True."""
    try:
        if add_all:
            subprocess.run(["git", "add", "."], cwd=path, check=True)

        result = subprocess.run(
            ["git", "commit", "-m", message],
            cwd=path,
            capture_output=True,
            text=True
        )

        return f"✓ Committed: {message}\n{result.stdout}"
    except Exception as e:
        return f"✗ Error committing: {str(e)}"


@mcp.tool()
def git_diff(path: str = ".", staged: bool = False) -> str:
    """Show git diff. Use staged=True for staged changes."""
    try:
        cmd = ["git", "diff"]
        if staged:
            cmd.append("--staged")

        result = subprocess.run(
            cmd,
            cwd=path,
            capture_output=True,
            text=True
        )

        if not result.stdout.strip():
            return "No changes to show"

        return f"Git diff:\n{result.stdout}"
    except Exception as e:
        return f"✗ Error: {str(e)}"


# ============================================================================
# DOCKER TOOLS
# ============================================================================

@mcp.tool()
def docker_run(image: str, command: str = "", detach: bool = False, ports: str = "") -> str:
    """Run Docker container. NO restrictions."""
    try:
        cmd = ["docker", "run"]

        if detach:
            cmd.append("-d")

        if ports:
            for port_map in ports.split(","):
                cmd.extend(["-p", port_map.strip()])

        cmd.append(image)

        if command:
            cmd.extend(command.split())

        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=300
        )

        return f"✓ Container started\n{result.stdout}"
    except Exception as e:
        return f"✗ Error: {str(e)}"


@mcp.tool()
def docker_ps(all_containers: bool = False) -> str:
    """List Docker containers."""
    try:
        cmd = ["docker", "ps"]
        if all_containers:
            cmd.append("-a")

        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True
        )

        return f"Docker containers:\n{result.stdout}"
    except Exception as e:
        return f"✗ Error: {str(e)}"


@mcp.tool()
def docker_exec(container: str, command: str) -> str:
    """Execute command in running container."""
    try:
        result = subprocess.run(
            ["docker", "exec", container, "sh", "-c", command],
            capture_output=True,
            text=True,
            timeout=60
        )

        return f"✓ Executed in {container}:\n{result.stdout}"
    except Exception as e:
        return f"✗ Error: {str(e)}"


# ============================================================================
# SYSTEM INFO TOOLS
# ============================================================================

@mcp.tool()
def get_system_info() -> str:
    """Get system information (CPU, RAM, disk)."""
    try:
        import psutil

        cpu_percent = psutil.cpu_percent(interval=1)
        mem = psutil.virtual_memory()
        disk = psutil.disk_usage('/')

        return f"""System Info:
CPU Usage: {cpu_percent}%
RAM: {mem.percent}% ({mem.used / 1e9:.1f}GB / {mem.total / 1e9:.1f}GB)
Disk: {disk.percent}% ({disk.used / 1e9:.1f}GB / {disk.total / 1e9:.1f}GB)
"""
    except Exception as e:
        return f"✗ Error: {str(e)}"


# ============================================================================
# START SERVER
# ============================================================================

if __name__ == "__main__":
    print("🚀 IDE3 MCP Server starting...")
    print("📡 All tools loaded (NO restrictions)")
    print("🔥 Uncensored mode: ACTIVE")
    print("")
    mcp.run()
