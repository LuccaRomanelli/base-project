# Dev container with Playwright browsers pre-installed + development tools
FROM mcr.microsoft.com/playwright:v1.52.0-noble

ARG USERNAME=dev
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# System dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    wget \
    git \
    ca-certificates \
    gnupg \
    sudo \
    locales \
    procps \
    file \
    ruby \
    iputils-ping \
    jq \
    docker.io \
    && rm -rf /var/lib/apt/lists/*

# Locale
RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && locale-gen
ENV LANG=en_US.UTF-8 LANGUAGE=en_US:en LC_ALL=en_US.UTF-8

# Create non-root user
RUN (groupadd --gid $USER_GID $USERNAME 2>/dev/null || true) \
    && (useradd --uid $USER_UID --gid $USER_GID -m $USERNAME -s /bin/bash 2>/dev/null || true) \
    && echo "$USERNAME ALL=(root) NOPASSWD:ALL" > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

USER $USERNAME
WORKDIR /home/$USERNAME

# Homebrew
ENV HOMEBREW_PREFIX=/home/linuxbrew/.linuxbrew \
    HOMEBREW_CELLAR=/home/linuxbrew/.linuxbrew/Cellar \
    HOMEBREW_REPOSITORY=/home/linuxbrew/.linuxbrew/Homebrew
RUN /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" \
    && echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> ~/.bashrc
ENV PATH="${HOMEBREW_PREFIX}/bin:${HOMEBREW_PREFIX}/sbin:${PATH}"

# mise (runtime manager)
RUN brew install mise \
    && echo 'eval "$(mise activate bash)"' >> ~/.bashrc

# CLI tools
RUN brew install \
    ripgrep fzf fd yazi tmux stow neovim \
    zoxide eza lsof starship lazygit gh openssh

# Node.js via mise
ENV MISE_DATA_DIR=/home/$USERNAME/.local/share/mise
ENV PATH="${MISE_DATA_DIR}/shims:${PATH}"
RUN mise use --global node@24

# Claude Code CLI
RUN curl -fsSL https://claude.ai/install.sh | bash
ENV PATH="/home/$USERNAME/.claude/local/bin:${PATH}"

# zsh + oh-my-zsh
RUN brew install zsh \
    && sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended \
    && echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> ~/.zshrc \
    && echo 'eval "$(mise activate zsh)"' >> ~/.zshrc

# zsh plugins
RUN git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions \
    && git clone https://github.com/zsh-users/zsh-syntax-highlighting ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

# TPM (Tmux Plugin Manager)
RUN git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm

# Default shell
RUN sudo chsh -s /home/linuxbrew/.linuxbrew/bin/zsh $USERNAME
ENV SHELL=/home/linuxbrew/.linuxbrew/bin/zsh

# Directories
RUN mkdir -p ~/.config
RUN sudo mkdir -p /workspaces && sudo chown $USERNAME:$USERNAME /workspaces
WORKDIR /workspaces

CMD ["/home/linuxbrew/.linuxbrew/bin/zsh"]
