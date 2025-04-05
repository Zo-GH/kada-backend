FROM node:20-bullseye

WORKDIR /app

# Install build tools for native dependencies
RUN apt-get update && \
    apt-get install -y python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./

# Install production dependencies (including optional)
RUN npm ci --production

# Copy application files with proper permissions
COPY --chown=node:node . .

# Set environment variables
ENV NODE_ENV production
ENV PORT 3000

# Expose the application port
EXPOSE 3000

# Run as non-root user
USER node

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (res) => { \
        if(res.statusCode !== 200) throw new Error('Not healthy'); \
    }).on('error', (err) => { throw err })"

# Start command
CMD ["npm", "start"]