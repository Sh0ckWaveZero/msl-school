# Dockerfile for Production

# Use a specific Bun version for reproducibility
FROM oven/bun:latest AS base

# Set the working directory
WORKDIR /usr/src/app

# Copy application dependency manifests
COPY package.json bun.lockb ./

# Install dependencies using --frozen-lockfile for consistency
RUN bun install --frozen-lockfile --production

# Copy the rest of the application code
COPY . .

# Build the application
# Assuming your build script is `bun run build`
# and it outputs to a `dist` folder or similar
# Adjust if your build process is different
RUN bun run build

# --- Release Stage ---
FROM oven/bun:latest-alpine AS release

# Set the working directory
WORKDIR /usr/src/app

# Copy built artifacts from the base stage
# Adjust the source path if your build output is different
COPY --from=base /usr/src/app/dist ./dist
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY --from=base /usr/src/app/package.json ./package.json
COPY --from=base /usr/src/app/bun.lockb ./bun.lockb

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application in production mode
# Assuming your production start script is `bun run start`
# or the output of your build is directly executable by bun
# Adjust if your start command is different
# For example, if your build outputs to `dist/index.js`:
# CMD ["bun", "dist/index.js"]
CMD ["bun", "run", "start"]
