FROM node:16.20.1-bookworm
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
RUN apt-get update && apt-get -y install sudo
RUN adduser --disabled-password --gecos '' docker
RUN adduser docker sudo
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers
USER docker
RUN sudo apt-get update && sudo apt-get -y upgrade
RUN sudo apt-get install -y build-essential libssl-dev libffi-dev software-properties-common
RUN sudo apt-get install -y python3-dev python3-pip
USER 0
# RUN curl -o /usr/bin/solc -fL https://github.com/ethereum/solidity/releases/download/v0.8.4/solc-static-linux && chmod u+x /usr/bin/solc
RUN curl -o /usr/bin/solc -fL https://github.com/ethereum/solidity/releases/download/v0.8.4/solc-static-linux
RUN chmod 777 /usr/bin/solc
USER node
# RUN pip3 install --break-system-packages solc-select
# RUN /home/node/.local/bin/solc-select install 0.8.4
# RUN /home/node/.local/bin/solc-select use 0.8.4
RUN npm i
RUN npm i express
RUN export PATH=$PATH:/home/node/.local/bin
# RUN source ~/.bashrc
SHELL ["/bin/bash", "-c", "source ~/.bashrc"]
COPY --chown=node:node . .
EXPOSE 3001 8545
# USER 0
CMD [ "npm", "run", "dev" ]
