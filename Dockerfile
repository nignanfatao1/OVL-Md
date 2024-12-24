FROM node:lts-alpine

RUN  apk add --no-cache git && \
    git clone https://github.com/Nignanfatao1/OVL-Md /root/ovl_bot

WORKDIR /root/ovl_bot

COPY package.json .
RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "run", "Ovl"]

