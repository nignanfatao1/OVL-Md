FROM node:lts-buster

RUN git clone https://github.com/Nignanfatao/OVL-Md /root/ovl_bot

WORKDIR /root/ovl_bot

COPY package.json .
RUN npm i
RUN npm install --legacy-peer-deps
COPY . .

EXPOSE 8000

CMD ["npm","run","Ovl"]
