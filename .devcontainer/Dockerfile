FROM node:22-trixie

# Install sudo, x11-apps and configure node user to use it without password.
RUN apt-get update && \
    apt-get install -y sudo x11-apps && \
    echo "node ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/node && \
    chmod 0440 /etc/sudoers.d/node && \
    rm -rf /var/lib/apt/lists/*

# Switch to node user first.
USER node

# Configure npm to install global packages in user directory and install Claude Code.
# This ensures Claude runs with proper user permissions and can access ~/.claude credentials.
RUN mkdir -p ~/.npm-global && \
    npm config set prefix ~/.npm-global && \
    npm install -g @anthropic-ai/claude-code

# Add npm global bin to PATH.
ENV PATH="/home/node/.npm-global/bin:$PATH"
