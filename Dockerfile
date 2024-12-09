FROM node:lts-buster
RUN apt-get update && \
    apt-get install -y ffmpeg webp git && \
    apt-get upgrade -y && \
    rm -rf /var/lib/apt/lists/*
RUN git clone https://github.com/Nignanfatao/OVL-Md /root/ovl_bot
WORKDIR /root/ovl_bot
COPY package.json .
RUN npm i
COPY . .
EXPOSE 8000
CMD ["npm","run","Ovl"]
