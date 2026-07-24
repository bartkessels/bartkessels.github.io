FROM node:trixie
ENV PNPM_HOME="/usr/local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# -------------------------
# System tools
# -------------------------
RUN apt update && apt install -y unzip zip git curl vim zsh sudo
RUN rm -rf /var/lib/apt/lists/*

# -------------------------
# Create non-root user
# -------------------------
ARG USERNAME=vscode
ARG USER_UID=1011

RUN groupadd --gid $USER_UID $USERNAME
RUN useradd --uid $USER_UID --gid $USER_UID -m -s /usr/bin/zsh $USERNAME
RUN echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/$USERNAME
RUN chmod 0440 /etc/sudoers.d/$USERNAME

RUN mkdir /workspace
RUN chown -R $USERNAME:$USERNAME /workspace

# -------------------------
# Setup pnpm
# -------------------------
RUN npm install -g pnpm
RUN pnpm config set global-bin-dir $PNPM_HOME

# -------------------------
# Setup Playwright
# -------------------------
WORKDIR /workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install

RUN pnpm exec playwright install chromium firefox webkit --with-deps

# -------------------------
# Setup Oh-my-zsh
# -------------------------
USER $USERNAME
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
RUN git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ~/.oh-my-zsh/custom/themes/powerlevel10k

RUN sed -i \
    -e 's/ZSH_THEME="robbyrussell"/ZSH_THEME="powerlevel10k\/powerlevel10k"/' \
    -e 's/plugins=(.*)/plugins=(git pnpm)/' \
    ~/.zshrc