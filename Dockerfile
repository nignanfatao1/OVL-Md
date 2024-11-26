FROM node:lts-buster

RUN apt-get update && apt-get install -y ffmpeg && apt-get clean

RUN git clone https://github.com/Nignanfatao/OVL-Md /root/ovl_bot

WORKDIR /root/ovl_bot

COPY package.json .
RUN npm i
COPY . .

EXPOSE 8000

CMD ["npm","run","Ovl"]
