FROM node:18 AS build

WORKDIR /app

ARG VITE_APP_API_BASE_URL
ENV VITE_APP_API_BASE_URL=${VITE_APP_API_BASE_URL}

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]