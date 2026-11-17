{pkgs ? import <nixpkgs> {}}: let
  node-tool = name:
    pkgs.writeShellScriptBin name ''
      set -eu

      root=$(env -u GIT_DIR -u GIT_WORK_TREE git rev-parse --show-toplevel 2>/dev/null) || {
        echo "${name}: not inside a git worktree" >&2
        exit 1
      }

      bin="$root/node_modules/.bin/${name}"

      if [ ! -e "$bin" ]; then
        echo "${name}: missing binary at $bin" >&2
        exit 1
      fi

      if [ ! -x "$bin" ]; then
        echo "${name}: not an executable at $bin" >&2
        exit 1
      fi

      exec "$bin" "$@"
    '';
in
  pkgs.mkShell {
    packages = with pkgs; [
      pnpm
      (node-tool "astro-ls")
      (node-tool "svelteserver")
    ];
  }
