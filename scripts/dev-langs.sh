#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -i :$port > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to kill process on port
kill_port() {
    local port=$1
    if check_port $port; then
        echo -e "${YELLOW}Killing process on port $port${NC}"
        kill $(lsof -t -i:$port) 2>/dev/null
        sleep 1
    fi
}

# Function to wait for port to be available
wait_for_port() {
    local port=$1
    local timeout=30
    local count=0

    echo -e "${YELLOW}Waiting for port $port to be available...${NC}"
    
    while check_port $port; do
        sleep 1
        count=$((count + 1))
        if [ $count -ge $timeout ]; then
            echo -e "${RED}Timeout waiting for port $port to be available${NC}"
            exit 1
        fi
    done
}

# Clean up function
cleanup() {
    echo -e "\n${YELLOW}Cleaning up...${NC}"
    kill_port 3000
    kill_port 3001
    exit 0
}

# Set up trap for cleanup
trap cleanup SIGINT SIGTERM

# Print header
echo -e "${GREEN}=== QFast Development Server ===${NC}"
echo -e "${GREEN}Starting development servers for multiple languages${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}\n"

# Kill existing processes
kill_port 3000
kill_port 3001

# Wait for ports to be available
wait_for_port 3000
wait_for_port 3001

# Start Czech version (port 3000)
echo -e "${GREEN}Starting Czech version on port 3000${NC}"
PORT=3000 NUXT_LOCALE=cs npm run dev &
CS_PID=$!

# Wait a bit before starting English version
sleep 2

# Start English version (port 3001)
echo -e "${GREEN}Starting English version on port 3001${NC}"
PORT=3001 NUXT_LOCALE=en npm run dev &
EN_PID=$!

# Print access information
echo -e "\n${GREEN}=== Development Servers Started ===${NC}"
echo -e "Czech version: ${YELLOW}http://localhost:3000${NC}"
echo -e "English version: ${YELLOW}http://localhost:3001${NC}"
echo -e "\n${YELLOW}Language switcher is available in the bottom-right corner${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}\n"

# Monitor both processes
wait $CS_PID $EN_PID 