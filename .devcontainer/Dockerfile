FROM node:22-trixie

# Switch to node user first
USER node

# Configure npm to install global packages in user directory and install Claude Code.
# This ensures Claude runs with proper user permissions and can access ~/.claude credentials.
RUN mkdir -p ~/.npm-global && \
    npm config set prefix ~/.npm-global && \
    npm install -g @anthropic-ai/claude-code

# Add npm global bin to PATH
ENV PATH="/home/node/.npm-global/bin:$PATH"
