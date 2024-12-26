FROM node:lts-alpine

RUN apk add --no-cache ffmpeg webp git bash && \
    git clone https://github.com/Nignanfatao/OVL-Md /ovl_bot

WORKDIR /ovl_bot

COPY package.json package-lock.json ./
RUN npm install --production

COPY . .

EXPOSE 8000

CMD ["npm", "run", "Ovl"]
